async function ufw(ssh) {
    console.log("Update ufw rules");
    
    let result = await ssh.execCommand("ufw allow 7777");
    console.log("STDOUT: " + result.stdout);
    console.log("STDERR: " + result.stderr);
    console.log("Update ufw rules");
    
    result = await ssh.execCommand("ufw allow 7778");
    console.log("STDOUT: " + result.stdout);
    console.log("STDERR: " + result.stderr);

    result = await ssh.execCommand("ufw allow 27015");
    console.log("STDOUT: " + result.stdout);
    console.log("STDERR: " + result.stderr);
}

module.exports = {
    ufw,
};
