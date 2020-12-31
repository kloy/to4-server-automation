async function mkdirp(ssh, dir) {
    console.log("Create dir with mkdir -p");
    const result = await ssh.execCommand(`mkdir -p ${dir}`);
    console.log("STDOUT: " + result.stdout);
    console.log("STDERR: " + result.stderr);    
}

async function checkIfFileExists(ssh, filepath) {
    console.log(`Checking if filepath exists ${filepath}`);
    const result = await ssh.execCommand(
        `test -f ${filepath} && echo "1" || echo "0"`
    );
    console.log("STDOUT: " + result.stdout);
    console.log("STDERR: " + result.stderr);
    return !!Number(result.stdout.trim());
}

module.exports = {
    mkdirp,
    checkIfFileExists,
};
