# Purpose

To help with administrating TO4 servers.

## Usage

For help, run `./index.js`.

## Required environment variables

Following environment variables are required...

| Variable | Purpose |
| - | - |
| VULTR_API_KEY | Required for authenticating with Vultr APIs |
| VULTR_PRIVATE_KEY | Required for initial SSH login to new instance |
| TO4_USER_PASSWORD | Required for setting to4adm user password |

## Recommended default values for config

```
{
    // High compute VM at $6 per month
    "planKey": "vc2-1c-1gb",
    // Ubuntu 18.04 x64
    "osId": 270
}
```
