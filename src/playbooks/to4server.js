const path = require("path");
const fs = require("fs-extra");
const { promisify } = require("util");
const scpClient = require("scp2");
const { mkdirp, checkIfFileExists } = require("./ubuntu-fs");

const INSTALL_PATH = '/home/to4adm/TO4Server';

async function installTo4(ssh) {
    // Install the TO4Server
    console.log("installing TO4 Server");
    // Make sure TO4Server dir exists
    await mkdirp(ssh, INSTALL_PATH);
    const result = await ssh.execCommand(
        `wget -q http://to4-dl.united-gameserver.de/packages/alpha/TOServer.sh -O - | bash`,
        {
            cwd: INSTALL_PATH,
        }
    );
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
    fs.ensureDirSync(path.resolve(__dirname, "../../build"));
    const builtFilepath = path.resolve(__dirname, "../../build/TO4cfg.ini");
    fs.writeFileSync(builtFilepath, contentsWithValues);
    return builtFilepath;
}

async function copyIni(ssh, instanceIp, iniPath, user, password) {
    console.log("Copying ini");
    const destPath = `${INSTALL_PATH}/TO4cfg.ini`;
    const result = await ssh.execCommand(
        `rm ${destPath}`
    );
    console.log("STDOUT: " + result.stdout);
    console.log("STDERR: " + result.stderr);

    const scp = promisify(scpClient.scp);
    await scp(
        iniPath,
        `${user}:${password}@${instanceIp}:${destPath}`
    );
    console.log("Ini copied");
}

const doesTo4Exist = async (ssh) =>
    await checkIfFileExists(ssh, `${INSTALL_PATH}/TOServer.sh`);

async function install(ssh, { instanceIp, serverName, adminPassword, user, password }) {
    if (await doesTo4Exist(ssh)) {
        console.log("TO4 server already exists");
    } else {
        await installTo4(ssh);
    }

    const iniPath = buildIni(serverName, adminPassword);
    await copyIni(ssh, instanceIp, iniPath, user, password);
}

module.exports = {
    install,
};
