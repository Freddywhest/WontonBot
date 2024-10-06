const { default: axios } = require("axios");
const logger = require("../utils/logger");
const headers = require("./header");
const { HttpsProxyAgent } = require("https-proxy-agent");
const settings = require("../config/config");
const user_agents = require("../config/userAgents");
const fs = require("fs");
const sleep = require("../utils/sleep");
const ApiRequest = require("./api");
var _ = require("lodash");
const path = require("path");
const _isArray = require("../utils/_isArray");
const Fetchers = require("../utils/fetchers");
const moment = require("moment");
const { GP, ST } = require("../utils/helper");
const app = require("../config/app");

class NonSessionTapper {
  constructor(query_id, query_name) {
    this.bot_name = "wonton";
    this.session_name = query_name;
    this.query_id = query_id;
    this.session_user_agents = this.#load_session_data();
    this.headers = { ...headers, "user-agent": this.#get_user_agent() };
    this.api = new ApiRequest(this.session_name, this.bot_name);
  }

  #load_session_data() {
    try {
      const filePath = path.join(process.cwd(), "session_user_agents.json");
      const data = fs.readFileSync(filePath, "utf8");
      return JSON.parse(data);
    } catch (error) {
      if (error.code === "ENOENT") {
        return {};
      } else {
        throw error;
      }
    }
  }

  #get_random_user_agent() {
    const randomIndex = Math.floor(Math.random() * user_agents.length);
    return user_agents[randomIndex];
  }

  #get_user_agent() {
    if (this.session_user_agents[this.session_name]) {
      return this.session_user_agents[this.session_name];
    }

    logger.info(
      `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Generating new user agent...`
    );
    const newUserAgent = this.#get_random_user_agent();
    this.session_user_agents[this.session_name] = newUserAgent;
    this.#save_session_data(this.session_user_agents);
    return newUserAgent;
  }

  #save_session_data(session_user_agents) {
    const filePath = path.join(process.cwd(), "session_user_agents.json");
    fs.writeFileSync(filePath, JSON.stringify(session_user_agents, null, 2));
  }

  #proxy_agent(proxy) {
    try {
      if (!proxy) return null;
      let proxy_url;
      if (!proxy.password && !proxy.username) {
        proxy_url = `${proxy.protocol}://${proxy.ip}:${proxy.port}`;
      } else {
        proxy_url = `${proxy.protocol}://${proxy.username}:${proxy.password}@${proxy.ip}:${proxy.port}`;
      }
      return new HttpsProxyAgent(proxy_url);
    } catch (e) {
      logger.error(
        `<ye>[${this.bot_name}]</ye> | ${
          this.session_name
        } | Proxy agent error: ${e}\nProxy: ${JSON.stringify(proxy, null, 2)}`
      );
      return null;
    }
  }

  async #get_tg_web_data() {
    try {
      return {
        initData: this.query_id,
        inviteCode: "9J4PKGN8",
        newUserPromoteCode: "",
      };
    } catch (error) {
      logger.error(
        `<ye>[${this.bot_name}]</ye> | ${this.session_name} | ❗️Unknown error during Authorization: ${error}`
      );
      throw error;
    } finally {
      await sleep(1);
      logger.info(
        `<ye>[${this.bot_name}]</ye> | ${this.session_name} | 🚀 Starting bot...`
      );
    }
  }

  async run(proxy) {
    let http_client;
    let access_token_created_time = 0;

    let profile_data;
    let checkin_data;
    let once = false;
    let mine_data;

    const fetchers = new Fetchers(this.api, this.session_name, this.bot_name);

    if (
      (settings.USE_PROXY_FROM_TXT_FILE || settings.USE_PROXY_FROM_JS_FILE) &&
      proxy
    ) {
      http_client = axios.create({
        httpsAgent: this.#proxy_agent(proxy),
        headers: this.headers,
        withCredentials: true,
      });
      const proxy_result = await fetchers.check_proxy(http_client, proxy);
      if (!proxy_result) {
        http_client = axios.create({
          headers: this.headers,
          withCredentials: true,
        });
      }
    } else {
      http_client = axios.create({
        headers: this.headers,
        withCredentials: true,
      });
    }
    while (true) {
      try {
        const currentTime = _.floor(Date.now() / 1000);
        if (currentTime - access_token_created_time >= 1_800) {
          const tg_web_data = await this.#get_tg_web_data();

          if (
            _.isNull(tg_web_data) ||
            _.isUndefined(tg_web_data) ||
            !tg_web_data ||
            _.isEmpty(tg_web_data)
          ) {
            continue;
          }

          const access_token_data = await fetchers.get_access_token(
            http_client,
            tg_web_data
          );

          if (_.isEmpty(access_token_data)) {
            logger.error(
              `<ye>[${this.bot_name}]</ye> | ${this.session_name} | ❗️Failed to get access token`
            );
            continue;
          }

          const access_token = access_token_data?.tokens?.accessToken;

          http_client.defaults.headers[
            "authorization"
          ] = `bearer ${access_token}`;

          access_token_created_time = currentTime;

          await sleep(2);
        }

        profile_data = await this.api.get_user_info(http_client);

        if (_.isEmpty(profile_data)) {
          access_token_created_time = 0;
          continue;
        }

        if (once == false) {
          const first_reward = await this.api.first_time_reward(http_client);
          if (!_.isEmpty(first_reward) && first_reward?.verified == true) {
            logger.info(
              `<ye>[${this.bot_name}]</ye> | ${this.session_name} | ✔️ Claimed first time reward successful | Reward Name: <la>${first_reward?.item?.name}</la>`
            );
          }
          once = true;
        }

        checkin_data = await this.api.checkin(http_client);

        if (!_.isEmpty(checkin_data)) {
          if (checkin_data?.newCheckin == true) {
            logger.info(
              `<ye>[${this.bot_name}]</ye> | ${this.session_name} | ✔️ Daily Checkin successful`
            );
          } else {
            logger.info(
              `<ye>[${this.bot_name}]</ye> | ${this.session_name} | ✔️ Checkin skipped. Already checked in`
            );
          }
        }

        logger.info(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Current Balance: <la>${profile_data?.totalEarnedToken}</la> | Total Balance: <la>${profile_data?.totalEarnedToken}</la> | Tickets: <pi>${profile_data?.ticketCount}</pi>`
        );

        await sleep(_.random(2, 5));

        mine_data = await this.api.get_mine_info(http_client);

        if (!_.isNull(mine_data) && settings.ENABLE_MINE == true) {
          if (_.isEmpty(mine_data)) {
            const start_mine = await this.api.start_mine(http_client);
            if (!_.isEmpty(start_mine)) {
              logger.info(
                `<ye>[${this.bot_name}]</ye> | ${
                  this.session_name
                } | ✔️ Mine started successfully | Ends in <la>${moment(
                  start_mine?.finishAt
                ).fromNow()}</la>`
              );
            }
          } else if (
            !_.isEmpty(mine_data) &&
            _.lt(new Date(mine_data?.finishAt).getTime(), _.now())
          ) {
            if (mine_data?.claimed == true) {
              const start_mine = await this.api.start_mine(http_client);
              if (!_.isEmpty(start_mine)) {
                logger.info(
                  `<ye>[${this.bot_name}]</ye> | ${
                    this.session_name
                  } | ✔️ Mine started successfully | Ends in <la>${moment(
                    start_mine?.finishAt
                  ).fromNow()}</la>`
                );
              }
            } else {
              const claim_mine = await this.api.claim_mine(http_client);
              if (!_.isEmpty(claim_mine?.claimed == true)) {
                logger.info(
                  `<ye>[${this.bot_name}]</ye> | ${this.session_name} | ✔️ Mine claimed successfully | Reward <la>${mine_data?.totalAmount}</la>`
                );

                await sleep(_.random(2, 5));
                const start_mine = await this.api.start_mine(http_client);
                if (!_.isEmpty(start_mine)) {
                  logger.info(
                    `<ye>[${this.bot_name}]</ye> | ${
                      this.session_name
                    } | ✔️ Mine started successfully | Ends in <la>${moment(
                      start_mine?.finishAt
                    ).fromNow()}</la>`
                  );
                }
              }
            }
          } else {
            logger.info(
              `<ye>[${this.bot_name}]</ye> | ${
                this.session_name
              } | ✔️ Mine already started | Ends in <la>${moment(
                mine_data?.finishAt
              ).fromNow()}</la>`
            );
          }
        }
        await sleep(_.random(2, 5));

        if (settings.AUTO_PLAY_GAME) {
          const GPM = await GP();
          if (!_.isNull(GPM)) {
            const gp = new GPM(
              http_client,
              _,
              this.session_name,
              this.bot_name,
              logger,
              settings.DELAY_BETWEEN_GAME,
              app
            );
            await gp.play();
          }
          await sleep(_.random(2, 5));
        }

        if (settings.AUTO_CLAIM_TASKS) {
          const STM = await ST();
          if (!_.isNull(STM)) {
            const st = new STM(
              http_client,
              _,
              this.session_name,
              this.bot_name,
              logger,
              settings.DELAY_BETWEEN_TASKS,
              app
            );
            await st.play();
          }
        }

        profile_data = await this.api.get_user_info(http_client);

        if (_.isEmpty(profile_data)) {
          continue;
        }

        logger.info(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Current Balance: <la>${profile_data?.totalEarnedToken}</la> | Total Balance: <la>${profile_data?.totalEarnedToken}</la> | Tickets: <pi>${profile_data?.ticketCount}</pi>`
        );
      } catch (error) {
        console.log(error);

        logger.error(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | ❗️Unknown error: ${error}`
        );
      } finally {
        let ran_sleep;
        if (_isArray(settings.SLEEP_BETWEEN_REQUESTS)) {
          if (
            _.isInteger(settings.SLEEP_BETWEEN_REQUESTS[0]) &&
            _.isInteger(settings.SLEEP_BETWEEN_REQUESTS[1])
          ) {
            ran_sleep = _.random(
              settings.SLEEP_BETWEEN_REQUESTS[0],
              settings.SLEEP_BETWEEN_REQUESTS[1]
            );
          } else {
            ran_sleep = _.random(450, 800);
          }
        } else if (_.isInteger(settings.SLEEP_BETWEEN_REQUESTS)) {
          const ran_add = _.random(20, 50);
          ran_sleep = settings.SLEEP_BETWEEN_REQUESTS + ran_add;
        } else {
          ran_sleep = _.random(450, 800);
        }

        logger.info(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Sleeping for ${ran_sleep} seconds...`
        );
        await sleep(ran_sleep);
      }
    }
  }
}
module.exports = NonSessionTapper;
