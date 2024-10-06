> [<img src="https://img.shields.io/badge/Telegram-%40Me-orange">](https://t.me/roddyfred)

# Use Node.Js 18 or later

## Functionality

| Functional                            | Supported |
| ------------------------------------- | :-------: |
| Auto playing game                     |    ✅     |
| Auto claiming/starting mining         |    ✅     |
| Claiming task                         |    ✅     |
| Multithreading                        |    ✅     |
| Caching session data                  |    ✅     |
| Using a session/query_id              |    ✅     |
| Binding a proxy to a session/query_id |    ✅     |
| Random sleep time between clicks      |    ✅     |

### [How to add query id](https://github.com/Freddywhest/RockyRabbitBot/blob/main/AddQueryId.md)

## [Settings](https://github.com/FreddyWhest/WontonBot/blob/main/.env-example)

| Settings                       | Description                                                                |
| ------------------------------ | -------------------------------------------------------------------------- |
| **API_ID / API_HASH**          | Platform data from which to launch a Telegram session (stock - Android)    |
| **ENABLE_MINE**                | Whether the bot should mine and claim mine rewards (True / False)          |
| **AUTO_PLAY_GAME**             | Whether the bot should play ticket games (True / False)                    |
| **AUTO_CLAIM_TASKS**           | Whether the bot claim tasks (True / False)                                 |
| **SLEEP_BETWEEN_REQUESTS**     | Delay between taps in seconds (eg. [200, 700])                             |
| **DELAY_BETWEEN_STARTING_BOT** | Delay between starting in seconds (eg. [20, 30])                           |
| **DELAY_BETWEEN_GAME**         | Delay between playing games in seconds (eg. [20, 30])                      |
| **DELAY_BETWEEN_TASKS**        | Delay between tasks in seconds (eg. [20, 30])                              |
| **USE_PROXY_FROM_JS_FILE**     | Whether to use proxy from the `bot/config/proxies.js` file (True / False)  |
| **USE_PROXY_FROM_TXT_FILE**    | Whether to use proxy from the `bot/config/proxies.txt` file (True / False) |

## Installation

You can download [**Repository**](https://github.com/FreddyWhest/WontonBot) by cloning it to your system and installing the necessary dependencies:

```shell
~ >>> git clone https://github.com/FreddyWhest/WontonBot.git
~ >>> cd WontonBot

#Linux and MocOS
~/WontonBot >>> chmod +x check_node.sh
~/WontonBot >>> ./check_node.sh

OR

~/WontonBot >>> npm install
~/WontonBot >>> cp .env-example .env
~/WontonBot >>> nano .env # Here you must specify your API_ID and API_HASH , the rest is taken by default
~/WontonBot >>> node index.js

#Windows
1. Double click on INSTALL.bat in WontonBot directory to install the dependencies
2. Double click on START.bat in WontonBot directory to start the bot

OR

~/WontonBot >>> npm install
~/WontonBot >>> cp .env-example .env
~/WontonBot >>> # Specify your API_ID and API_HASH, the rest is taken by default
~/WontonBot >>> node index.js
```

Also for quick launch you can use arguments, for example:

```shell
~/WontonBot >>> node index.js --action=1

OR

~/WontonBot >>> node index.js --action=2 #session

OR

~/WontonBot >>> node index.js --action=3 #query_id

#1 - Create session
#2 - Run clicker
```
