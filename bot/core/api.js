const app = require("../config/app");
const logger = require("../utils/logger");
var _ = require("lodash");

class ApiRequest {
  constructor(session_name, bot_name) {
    this.bot_name = bot_name;
    this.session_name = session_name;
  }

  async get_user_info(http_client) {
    try {
      const response = await http_client.get(`${app.apiUrl}/api/v1/user`);
      return response?.data;
    } catch (error) {
      if (error?.response?.status >= 500 && error?.response?.status <= 599) {
        logger.error(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Error while getting user info: Server error`
        );
        return null;
      }
      if (error?.response?.data?.message) {
        logger.warning(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | ⚠️ Error while getting user info: ${error?.response?.data?.message}`
        );
      } else {
        logger.error(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Error while getting user info: ${error.message}`
        );
      }

      return null;
    }
  }

  async validate_query_id(http_client, request_data) {
    try {
      const response = await http_client.post(
        `${app.apiUrl}/api/v1/user/auth`,
        JSON.stringify(request_data)
      );
      return response?.data;
    } catch (error) {
      return false;
    }
  }

  async get_mine_info(http_client) {
    try {
      const response = await http_client.get(
        `${app.apiUrl}/api/v1/user/farming-status`
      );
      return response?.data;
    } catch (error) {
      if (error?.response?.status >= 500 && error?.response?.status <= 599) {
        logger.error(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Error while getting mine info: Server error`
        );
        return null;
      }
      if (error?.response?.data?.message) {
        logger.warning(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | ⚠️ Error while getting mine info: ${error?.response?.data?.message}`
        );
      } else {
        logger.error(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Error while getting mine info: ${error.message}`
        );
      }

      return null;
    }
  }

  async first_time_reward(http_client) {
    try {
      const response = await http_client.get(
        `${app.apiUrl}/api/v1/user/claim-gift`
      );
      return response?.data;
    } catch (error) {
      if (error?.response?.status === 403) {
        logger.warning(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | ⚠️ Join Wonton Telegram Channel before first reward can be claimed`
        );
        return null;
      }

      if (error?.response?.status >= 500 && error?.response?.status <= 599) {
        return null;
      }
      if (error?.response?.data?.message) {
        logger.warning(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | ⚠️ Error while claiming first reward: ${error?.response?.data?.message}`
        );
      } else {
        logger.error(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Error while claiming first reward: ${error.message}`
        );
      }

      return null;
    }
  }

  async claim_mine(http_client) {
    try {
      const response = await http_client.get(
        `${app.apiUrl}/api/v1/mining/claim`
      );
      return response?.data;
    } catch (error) {
      if (error?.response?.status >= 500 && error?.response?.status <= 599) {
        logger.error(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Error while getting user info: Server error`
        );
        return null;
      }
      if (error?.response?.data?.message) {
        logger.warning(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | ⚠️ Error while claiming mine: ${error?.response?.data?.message}`
        );
      } else {
        logger.error(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Error while claiming mine: ${error.message}`
        );
      }

      return null;
    }
  }

  async start_mine(http_client) {
    try {
      const response = await http_client.post(
        `${app.apiUrl}/api/v1/user/start-farming`
      );
      return response?.data;
    } catch (error) {
      if (error?.response?.status >= 500 && error?.response?.status <= 599) {
        return null;
      }
      if (error?.response?.data?.message) {
        logger.warning(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | ⚠️ Error while starting farming: ${error?.response?.data?.message}`
        );
      } else {
        logger.error(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Error while starting farming: ${error.message}`
        );
      }

      return null;
    }
  }

  async claim_mine(http_client) {
    try {
      const response = await http_client.post(
        `${app.apiUrl}/api/v1/user/farming-claim`
      );
      return response?.data;
    } catch (error) {
      if (error?.response?.status >= 500 && error?.response?.status <= 599) {
        return null;
      }
      if (error?.response?.data?.message) {
        logger.warning(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | ⚠️ Error while claiming farming: ${error?.response?.data?.message}`
        );
      } else {
        logger.error(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Error while claiming farming: ${error.message}`
        );
      }

      return null;
    }
  }

  async checkin(http_client) {
    try {
      const response = await http_client.get(`${app.apiUrl}/api/v1/checkin`);
      return response?.data;
    } catch (error) {
      if (error?.response?.status >= 500 && error?.response?.status <= 599) {
        return null;
      }
      if (error?.response?.data?.message) {
        logger.warning(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | ⚠️ Error while checking In: ${error?.response?.data?.message}`
        );
      } else {
        logger.error(
          `<ye>[${this.bot_name}]</ye> | ${this.session_name} | Error while checking In: ${error.message}`
        );
      }

      return null;
    }
  }
}

module.exports = ApiRequest;
