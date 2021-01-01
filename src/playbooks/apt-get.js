async function update(ssh) {
    console.log("Update apt-get");
    const result = await ssh.execCommand("apt-get update");
    console.log("STDOUT: " + result.stdout);
    console.log("STDERR: " + result.stderr);
}

async function install(ssh, packages = []) {
    console.log("Installing dependencies");
    const result = await ssh.execCommand(
        `apt-get -y install ${packages.join(" ")}`
    );
    console.log("STDOUT: " + result.stdout);
    console.log("STDERR: " + result.stderr);
}

module.exports = {
    update,
    install,
};
