import axios from "axios";
import crypto from "crypto";

const axiosInstance = axios.create({
  timeout: 10000,
  params: {} // do not remove this, its added to add params later in the config
});
const apiurl = process.env.VUE_APP_PORTFOLIO_API;

const client = {
  register: (email, password) => {
    return axiosInstance.post(`${apiurl}/auth/register`, {
      email: email,
      password: password
    });
  },
  login: (email, password) => {
    return axiosInstance.post(`${apiurl}/auth/login`, {
      email: email,
      password: password
    });
  },
  forgot: email => {
    return axiosInstance.post(`${apiurl}/auth/forgot`, {
      email: email
    });
  },
  reset: (magicLinkToken, password) => {
    return axiosInstance.put(`${apiurl}/auth/reset/${magicLinkToken}`, {
      newPassword: password
    });
  },
  user: id => {
    return axiosInstance
      .get(`${apiurl}/users/${id}`, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      })
      .catch(err => handleUnauthorized(err));
  },
  portfolio: id => {
    return axiosInstance
      .get(`${apiurl}/users/${id}/portfolio`, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      })
      .catch(err => handleUnauthorized(err));
  },
  changePack: (id, label) => {
    return axiosInstance
      .put(
        `${apiurl}/users/${id}/packs/switch`,
        {
          label: label
        },
        {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") }
        }
      )
      .catch(err => {
        return handleUnauthorized(err);
      });
  },
  testExchangeConnection: exchange => {
    //api to add
    return Promise.resolve({
      success: true,
      message: "Connection test successful"
    });
  },
  addExchange: (id, exchange) => {
    exchange.credentials.preview =
      exchange.credentials.api_key.slice(0, 2) +
      "***" +
      exchange.credentials.api_key.slice(
        exchange.credentials.api_key.length - 2
      );
    exchange.credentials.api_key = crypto
      .publicEncrypt(
        localStorage["pubKey"],
        Buffer.from(exchange.credentials.api_key)
      )
      .toString("base64");
    exchange.credentials.secret = crypto
      .publicEncrypt(
        localStorage["pubKey"],
        Buffer.from(exchange.credentials.secret)
      )
      .toString("base64");

    return axiosInstance
      .post(`${apiurl}/users/${id}/exchanges/`, exchange, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      })
      .catch(err => {
        return handleUnauthorized(err);
      });
  }
};

export default client;

function handleUnauthorized(err) {
  if (err.response.status === 401) {
    global.vm.$emit("401");
  }
  return err;
}
