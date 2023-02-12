const path = require("path");
const fs = require("fs-extra");
const { mkdirp, checkIfFileExists } = require("./ubuntu-fs");
const { mkdirp: localMkdirp } = require('mkdirp');

const INSTALL_PATH = "/home/to4adm";

async function installTo4Reporter(ssh) {
    // Install the TO4reporter
    console.log("installing TO4reporter Server");
    let result = await ssh.execCommand(
        `wget -q http://to4-dl.united-gameserver.de/packages/alpha/to4reporter.zip`,
        {
            cwd: INSTALL_PATH,
        }
    );
    console.log("STDOUT: " + result.stdout);
    console.log("STDERR: " + result.stderr);
    
    result = await ssh.execCommand(`unzip $HOME/to4reporter.zip`);
    console.log("STDOUT: " + result.stdout);
    console.log("STDERR: " + result.stderr);

    result = await ssh.execCommand(`chmod +x $HOME/to4reporter`);
    console.log("STDOUT: " + result.stdout);
    console.log("STDERR: " + result.stderr);
}

const doesTo4ReporterExist = async (ssh) =>
    await checkIfFileExists(ssh, `${INSTALL_PATH}/to4reporter`);

async function setupSystemdService(ssh) {
    const destination = "/etc/systemd/system/to4reporter.service";
    const exists = await checkIfFileExists(ssh, destination);
    if (exists) {
        console.log("Service already exists");
        return;
    }

    console.log("Installing To4reporter service");
    const servicePath = path.resolve(__dirname, "../templates/to4reporter.service");
    await ssh.putFile(servicePath, destination);
    let result = await ssh.execCommand(`systemctl enable to4reporter.service`);
    console.log("STDOUT: " + result.stdout);
    console.log("STDERR: " + result.stderr);
    result = await ssh.execCommand(`systemctl start to4reporter.service`);
    console.log("STDOUT: " + result.stdout);
    console.log("STDERR: " + result.stderr);
    console.log("Installed to4reporter service");
}

async function install({ ssh }) {
    if (await doesTo4ReporterExist(ssh)) {
        console.log("TO4Reporter already exists");
    } else {
        await installTo4Reporter(ssh);
    }
}

module.exports = {
    install,
    setupSystemdService,
};
