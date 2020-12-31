const fs = require("fs-extra");
const path = require("path");
const { NodeSSH } = require("node-ssh");
const scpClient = require("scp2");
const { promisify } = require("util");

const to4Password = process.env.TO4_USER_PASSWORD;
const privateKey = process.env.VULTR_PRIVATE_KEY;

async function updateAptGet(ssh) {
    console.log("Update apt-get");
    const result = await ssh.execCommand("apt-get update");
    console.log("STDOUT: " + result.stdout);
    console.log("STDERR: " + result.stderr);
}

async function installDependencies(ssh) {
    console.log("Installing dependencies");
    const result = await ssh.execCommand("apt-get -y install p7zip-full wget");
    console.log("STDOUT: " + result.stdout);
    console.log("STDERR: " + result.stderr);
}

async function checkIfUserExists(ssh) {
    const result = await ssh.execCommand("grep -c '^to4adm:' /etc/passwd");
    console.log("STDOUT: " + result.stdout);
    console.log("STDERR: " + result.stderr);
    return !!Number(result.stdout.trim());
}

async function createTo4User(ssh) {
    const exists = await checkIfUserExists(ssh);
    if (exists) {
        console.log("User already exists");
    } else {
        console.log("Creating user for TO4");
        // Create a non root user (the server will NOT run as root user)
        let result = await ssh.execCommand(
            `useradd -m -s /bin/bash -c "TO4Server Admin" to4adm`
        );
        console.log("STDOUT: " + result.stdout);
        console.log("STDERR: " + result.stderr);
        console.log("Setting password for TO4 user");
        // set password for to4adm user
        result = await ssh.execCommand(
            `echo -e "${to4Password}\n${to4Password}" | passwd to4adm`
        );
        console.log("STDOUT: " + result.stdout);
        console.log("STDERR: " + result.stderr);
    }
}

async function ensureTo4Dir(ssh) {
    // Create the TO4Server directory and enter it
    console.log("Change to TO4 dir");
    const result = await ssh.execCommand(`mkdir -p ~/TO4Server`);
    console.log("STDOUT: " + result.stdout);
    console.log("STDERR: " + result.stderr);
}

async function checkIfTo4Exists(ssh) {
    console.log("Checking if TO4 server exists");
    const result = await ssh.execCommand(
        `test -f /home/to4adm/TO4Server/TOServer.sh && echo "1" || echo "0"`
    );
    console.log("STDOUT: " + result.stdout);
    console.log("STDERR: " + result.stderr);
    return !!Number(result.stdout.trim());
}

async function installTo4(ssh) {
    // Install the TO4Server
    const exists = await checkIfTo4Exists(ssh);
    if (exists) {
        console.log("TO4 server already exists");
    } else {
        console.log("installing TO4 Server");
        const result = await ssh.execCommand(
            `wget -q http://to4-dl.united-gameserver.de/packages/alpha/TOServer.sh -O - | bash`,
            {
                cwd: `/home/to4adm/TO4Server`,
            }
        );
        console.log("STDOUT: " + result.stdout);
        console.log("STDERR: " + result.stderr);
    }
}

async function copyIni(instanceIp, serverName, adminPassword, ssh) {
    console.log("Copying ini");
    const result = await ssh.execCommand(
        `rm /home/to4adm/TO4Server/TO4cfg.ini`
    );
    console.log("STDOUT: " + result.stdout);
    console.log("STDERR: " + result.stderr);
    const contents = fs.readFileSync(
        path.resolve(__dirname, "TO4cfg.ini.tpl"),
        "utf8"
    );
    const contentsWithValues = contents
        .replace("{{to4_server_name}}", serverName)
        .replace("{{to4_server_admin_password}}", adminPassword);
    fs.ensureDirSync(path.resolve(__dirname, "../build"));
    const builtFilepath = path.resolve(__dirname, "../build/TO4cfg.ini");
    fs.writeFileSync(builtFilepath, contentsWithValues);
    const configPath = "/home/to4adm/TO4Server/TO4cfg.ini";
    const scp = promisify(scpClient.scp);
    await scp(
        builtFilepath,
        `to4adm:${to4Password}@${instanceIp}:${configPath}`
    );
    console.log("Ini copied");
}

async function main(instanceIp, serverName, adminPassword) {
    console.log("Connecting to SSH for root user");
    const rootSsh = new NodeSSH();
    await rootSsh.connect({
        host: instanceIp,
        username: "root",
        privateKey: fs.readFileSync(privateKey, "utf8"),
    });
    await updateAptGet(rootSsh);
    await installDependencies(rootSsh);
    await createTo4User(rootSsh);
    rootSsh.dispose();
    console.log("Connecting to SSH for to4 user");
    const to4Ssh = new NodeSSH();
    await to4Ssh.connect({
        host: instanceIp,
        username: "to4adm",
        password: to4Password,
    });
    await ensureTo4Dir(to4Ssh);
    await installTo4(to4Ssh);
    await copyIni(instanceIp, serverName, adminPassword, to4Ssh);
    to4Ssh.dispose();
}

module.exports = main;
