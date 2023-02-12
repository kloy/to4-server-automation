const fs = require("fs");
const { NodeSSH } = require("node-ssh");
const { update, install } = require("../playbooks/apt-get");
const { ufw } = require("../playbooks/ufw");
const { createUser } = require("../playbooks/ubuntu-user");
const {
    install: installTo4,
    setupSystemdService,
} = require("../playbooks/to4server");
const {
    install: installTo4reporter,
    setupSystemdService: setupSystemdServiceTo4reporter,
} = require("../playbooks/to4reporter");

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
        username: TO4_USER,
        password: TO4_USER_PASSWORD,
    });
    return to4Ssh;
}

async function main(instanceIp, serverName, adminPassword) {
    const rootSsh = await connectRootSsh(instanceIp);
    await update(rootSsh);
    await ufw(rootSsh);
    await install(rootSsh, ["p7zip-full", "wget"]);
    // Create a non root user (the server will NOT run as root user)
    await createUser(rootSsh, TO4_USER, TO4_USER_PASSWORD, "TO4Server Admin");
    const to4Ssh = await connectTo4admSsh(instanceIp);
    await installTo4({
        ssh: to4Ssh,
        serverName,
        adminPassword,
    });
    await setupSystemdService(rootSsh);

    await installTo4reporter({
        ssh: to4Ssh,
        serverName,
        adminPassword,
    });
    await setupSystemdServiceTo4reporter(rootSsh);

    rootSsh.dispose();
    to4Ssh.dispose();
}

module.exports = main;
