#!/usr/bin/env node

const commands = require("./src/commands");
const { Command } = require("commander");
const program = new Command();
program.version("0.0.1");

function onSuccess(data = '') {
    console.log('Command completed with success');
    console.log(data);
    process.exit(0);
}

function onFail(error) {
    console.log('Command completed with failure');
    console.error(error);
    process.exit(1);
}

program
    .command("create <server_config>")
    .description("create an instance for the given config")
    .action((serverConfig) => {
        console.log("create command called");
        const config = require(`./servers/${serverConfig}.json`);
        console.table(config);
        commands.createInstance({
            osId: config.osId,
            plan: config.plan,
            region: config.region,
            sshKeyId: config.sshKeyId,
        }).then(onSuccess).catch(onFail);
    });

program
    .command("delete <instance_id>")
    .description("delete instance for given id")
    .action((instanceId) => {
        console.log("delete command called");
        commands.deleteInstance(instanceId).then(onSuccess).catch(onFail);
    });

program
    .command("list")
    .description("list instances")
    .action(() => {
        console.log("list command called");
        commands.listInstances().then(onSuccess).catch(onFail);
    });

program
    .command("provision <instance_ip>")
    .description("provision instance as TO4 server for given ip")
    .action((instanceIp) => {
        console.log("provision command called");
        commands.provisionInstance(instanceIp).then(onSuccess).catch(onFail);
    });

program.parse(process.argv);
