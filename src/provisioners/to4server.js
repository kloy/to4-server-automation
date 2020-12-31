const fs = require("fs-extra");
const { NodeSSH } = require("node-ssh");
const { update, install } = require('../playbooks/apt-get');
const { createUser } = require('../playbooks/ubuntu-user');
const { install: installTo4 } = require("../playbooks/to4server");

const TO4_USER = 'to4adm';;
const TO4_USER_PASSWORD = process.env.TO4_USER_PASSWORD;
const PRIVATE_KEY = process.env.VULTR_PRIVATE_KEY;

async function connectRootSsh(instanceIp) {
    console.log(`Connecting with SSH to ${instanceIp} for root user with key ${PRIVATE_KEY}`);
    const rootSsh = new NodeSSH();
    await rootSsh.connect({
        host: instanceIp,
        username: "root",
        PRIVATE_KEY: fs.readFileSync(PRIVATE_KEY, "utf8"),
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

async function main(instanceIp, serverName, adminPassword) {
    const rootSsh = await connectRootSsh(instanceIp);
    await update(rootSsh);
    await install(rootSsh, ['p7zip-full, wget']);
    // Create a non root user (the server will NOT run as root user)
    await createUser(rootSsh, TO4_USER, TO4_USER_PASSWORD, "TO4Server Admin");
    rootSsh.dispose();

    const to4Ssh = await connectTo4admSsh(instanceIp);
    await installTo4(to4Ssh, {
        instanceIp, serverName, adminPassword,
    });
    to4Ssh.dispose();

    // const rootSsh2 = await connectRootSsh(instanceIp);
    // await startOnBoot(rootSsh2);
}

module.exports = main;