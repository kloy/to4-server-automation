async function checkIfUserExists(ssh, user) {
    const result = await ssh.execCommand(`grep -c '^${user}:' /etc/passwd`);
    console.log("STDOUT: " + result.stdout);
    console.log("STDERR: " + result.stderr);
    return !!Number(result.stdout.trim());
}

async function createUser(ssh, user, password, description = "not root user") {
    const exists = await checkIfUserExists(ssh, user);
    if (exists) {
        console.log("User already exists");
    } else {
        console.log(`Creating user ${user}`);
        let result = await ssh.execCommand(
            `useradd -m -s /bin/bash -c "${description}" ${user}`
        );
        console.log("STDOUT: " + result.stdout);
        console.log("STDERR: " + result.stderr);

        console.log(`Setting password for user ${description}`);
        // set password for user
        result = await ssh.execCommand(
            `echo -e "${password}\n${password}" | passwd ${user}`
        );
        console.log("STDOUT: " + result.stdout);
        console.log("STDERR: " + result.stderr);
    }
}

module.exports = {
    checkIfUserExists,
    createUser,
};
