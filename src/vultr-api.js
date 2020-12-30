const fetch = require('node-fetch');

const apiKey = process.env.VULTR_API_KEY;
const baseUrl = 'https://api.vultr.com/v2';
// TODO ssh key should be in env
const sshKeyId = 'cc87f5c3-9b0c-4924-bebf-ed8ea42e579e';
// High compute VM at $6 per month
const planKey = 'vc2-1c-1gb';
// TODO region should come from config
const regionKey = 'dfw';
// Ubuntu 18.04 x64
const osId = 270;

const getInstances = async () => {
    const response = await fetch(`${baseUrl}/instances`, {
        headers: {
            Authorization: `Bearer ${apiKey}`
        }
    });
    const data = await response.json();
    return data.instances;
};

const getInstance = async (instanceId) => {
    const response = await fetch(`${baseUrl}/instances/${instanceId}`, {
        headers: {
            Authorization: `Bearer ${apiKey}`
        }
    });
    const data = await response.json();
    return data.instance;
};

const deleteInstance = async (instanceId) => {
    const response = await fetch(`${baseUrl}/instances/${instanceId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${apiKey}`
        }
    });
    await response.json();
};

const createInstance = async () => {
    const response = await fetch(`${baseUrl}/instances`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            region: regionKey,
            plan: planKey,
            os_id: osId,
            sshkey_id: [sshKeyId],
            activation_email: true,
            // hostname: '',
            label: `to4-server ${Date.now()}`,
            tag: 'to4'
        })
    });
    const data = await response.json();
    return data;
};

const getPlans = async () => {
    const response = await fetch(`${baseUrl}/plans`, {
        headers: {
            Authorization: `Bearer ${apiKey}`
        }
    });
    const data = await response.json();
    return data.plans;
};

const getRegions = async () => {
    const response = await fetch(`${baseUrl}/regions`, {
        headers: {
            Authorization: `Bearer ${apiKey}`
        }
    });
    const data = await response.json();
    return data.regions;
};

const getOs = async () => {
    const response = await fetch(`${baseUrl}/os`, {
        headers: {
            Authorization: `Bearer ${apiKey}`
        }
    });
    const data = await response.json();
    return data.os;
};

const getSshKeys = async () => {
    const response = await fetch(`${baseUrl}/ssh-keys`, {
        headers: {
            Authorization: `Bearer ${apiKey}`
        }
    });
    const data = await response.json();
    return data.ssh_keys;
};

module.exports = {
    getInstances,
    getInstance,
    deleteInstance,
    createInstance,
    getPlans,
    getRegions,
    getOs,
    getSshKeys
};
