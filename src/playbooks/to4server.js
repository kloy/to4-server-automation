const path = require("path");
const fs = require("fs-extra");
const { mkdirp, checkIfFileExists } = require("./ubuntu-fs");

const INSTALL_PATH = "/home/to4adm/TO4Server";

async function installTo4(ssh) {
    // Install the TO4Server
    console.log("installing TO4 Server");
    // Make sure TO4Server dir exists
    await mkdirp(ssh, INSTALL_PATH);
    let result = await ssh.execCommand(
        `wget -q http://to4-dl.united-gameserver.de/packages/alpha/TOServer.sh -O - | bash`,
        {
            cwd: INSTALL_PATH,
        }
    );
    console.log("STDOUT: " + result.stdout);
    console.log("STDERR: " + result.stderr);
    // Clear out default ini since we will need to copy one with our values applied
    result = await ssh.execCommand(`rm ${INSTALL_PATH}/TO4cfg.ini`);
    console.log("STDOUT: " + result.stdout);
    console.log("STDERR: " + result.stderr);
}

function buildIni(serverName, adminPassword) {
    console.log("Building ini");
    const contents = fs.readFileSync(
        path.resolve(__dirname, "../templates/TO4cfg.ini.tpl"),
        "utf8"
    );
    const contentsWithValues = contents
        .replace("{{to4_server_name}}", serverName)
        .replace("{{to4_server_admin_password}}", adminPassword);
    const dest = path.resolve(__dirname, "../../build/TO4cfg.ini");
    fs.writeFileSync(dest, contentsWithValues, "utf8");
    return dest;
}

async function sendIni(ssh, iniPath) {
    console.log("Sending ini");
    const destination = `${INSTALL_PATH}/TO4cfg.ini`;
    await ssh.putFile(iniPath, destination);
    console.log("Ini copied");
}

const doesTo4Exist = async (ssh) =>
    await checkIfFileExists(ssh, `${INSTALL_PATH}/TOServer.sh`);

async function setupSystemdService(ssh) {
    const destination = "/etc/systemd/system/to4.service";
    const exists = await checkIfFileExists(ssh, destination);
    if (exists) {
        console.log("Service already exists");
        return;
    }

    console.log("Installing To4 service");
    const servicePath = path.resolve(__dirname, "../templates/to4.service");
    await ssh.putFile(servicePath, destination);
    const result = await ssh.execCommand(`systemctl enable to4.service`);
    console.log("STDOUT: " + result.stdout);
    console.log("STDERR: " + result.stderr);
    console.log("Installed To4 service");
}

async function install({
    ssh,
    serverName = "TO4 Server",
    adminPassword = "to4admin",
}) {
    if (await doesTo4Exist(ssh)) {
        console.log("TO4 server already exists");
    } else {
        await installTo4(ssh);
        const iniPath = buildIni(serverName, adminPassword);
        await sendIni(ssh, iniPath);
    }
}

module.exports = {
    install,
    setupSystemdService,
};
