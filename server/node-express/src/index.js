const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

const config = {
  port: process.env.PORT,
  apiKey: process.env.API_KEY,
  apiSecret: process.env.API_SECRET,
};

async function getApiToken() {
  const res = await axios.get("https://api.hive.id/token", {
    auth: {
      username: config.apiKey,
      password: config.apiSecret,
    },
  });

  return res.data.access_token;
}

app
  .use(cors())
  .use(bodyParser.json())
  .post("/checks", async (req, res) => {
    const token = await getApiToken();
    const url = "https://api.hive.id/checks";
    const data = {
      session_id: req.body.sessionId,
    };
    const params = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.post(url, data, params);
    // save check id
    const checkId = response.data.id;

    res.json({
      ok: true,
    });
  })
  .post("/sessions", async (req, res) => {
    const token = await getApiToken();
    const url = "https://api.hive.id/sessions";
    const data = {
      customer_id: req.body.customerId,
      application_key: req.body.applicationKey,
    };
    const params = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.post(url, data, params);
    res.json({
      session_token: response.data.session_token,
    });
  })
  .listen(config.port, async () => {
    console.log(`Example app listening at http://localhost:${config.port}`);
  });
