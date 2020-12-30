const fs = require("fs");
const { NodeSSH } = require("node-ssh");

const to4Password = process.env.TO4_ADMIN_PASSWORD;
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
    return !!Number(result.stdout);
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
        `test -d ~/TO4Server && echo "1" || echo "0"`
    );
    console.log("STDOUT: " + result.stdout);
    console.log("STDERR: " + result.stderr);
    return !!Number(result);
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

async function main(instanceIp) {
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
    to4Ssh.dispose();
}

module.exports = main;
