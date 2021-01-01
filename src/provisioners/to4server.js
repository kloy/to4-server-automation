const fs = require("fs");
const { NodeSSH } = require("node-ssh");
const { Client: ScpClient } = require("scp2");
const { update, install } = require("../playbooks/apt-get");
const { createUser } = require("../playbooks/ubuntu-user");
const { install: installTo4 } = require("../playbooks/to4server");

const TO4_USER = "to4adm";
const TO4_USER_PASSWORD = process.env.TO4_USER_PASSWORD;
const PRIVATE_KEY = process.env.VULTR_PRIVATE_KEY;

async function connectRootSsh(instanceIp) {
    console.log(
        `Connecting with SSH to ${instanceIp} for root user with key ${PRIVATE_KEY}`
    );
    const rootSsh = new NodeSSH();
    await rootSsh.connect({
        host: instanceIp,
        username: "root",
        privateKey: fs.readFileSync(PRIVATE_KEY, "utf8"),
    });
    return rootSsh;
}

async function connectTo4admSsh(instanceIp) {
    console.log("Connecting to SSH for to4 user");
    const to4Ssh = new NodeSSH();
    await to4Ssh.connect({
        host: instanceIp,
        username: "to4adm",
        password: TO4_USER_PASSWORD,
    });
    return to4Ssh;
}

function createTo4admScp(instanceIp) {
    const to4ScpClient = new ScpClient({
        host: instanceIp,
        username: TO4_USER,
        password: TO4_USER_PASSWORD,
    });
    return to4ScpClient;
}


async function main(instanceIp, serverName, adminPassword) {
    const rootSsh = await connectRootSsh(instanceIp);
    await update(rootSsh);
    await install(rootSsh, ["p7zip-full", "wget"]);
    // Create a non root user (the server will NOT run as root user)
    await createUser(rootSsh, TO4_USER, TO4_USER_PASSWORD, "TO4Server Admin");
    rootSsh.dispose();

    const to4Ssh = await connectTo4admSsh(instanceIp);
    const to4ScpClient = createTo4admScp(instanceIp);
    await installTo4({
        ssh: to4Ssh,
        scpClient: to4ScpClient,
        serverName,
        adminPassword,
    });
    to4Ssh.dispose();
}

module.exports = main;
