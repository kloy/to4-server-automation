const path = require("path");
const fs = require("fs-extra");
const { promisify } = require("util");
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
    return contentsWithValues;
}

async function sendIni(scpClient, content) {
    console.log("Sending ini");
    const destination = `${INSTALL_PATH}/TO4cfg.ini`;

    const scp = promisify(scpClient.write.bind(scpClient));
    await scp({
        destination,
        content: Buffer.from(content, 'utf8'),
    });
    console.log("Ini copied");
}

const doesTo4Exist = async (ssh) =>
    await checkIfFileExists(ssh, `${INSTALL_PATH}/TOServer.sh`);

async function install({
    ssh,
    scpClient,
    serverName = "TO4 Server",
    adminPassword = "to4admin",
}) {
    if (await doesTo4Exist(ssh)) {
        console.log("TO4 server already exists");
    } else {
        await installTo4(ssh);
        const iniContent = buildIni(serverName, adminPassword);
        await sendIni(scpClient, iniContent);
    }
}

module.exports = {
    install,
};
