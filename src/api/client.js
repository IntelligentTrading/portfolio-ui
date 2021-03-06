import axios from "axios";
import crypto from "crypto";

const axiosInstance = axios.create({
  timeout: 10000,
  params: {}, // do not remove this, its added to add params later in the config
});
const apiurl = process.env.VUE_APP_PORTFOLIO_API;

const client = {
  register: (email, password) => {
    return axiosInstance.post(`${apiurl}/auth/register`, {
      email: email,
      password: password,
    });
  },
  confirm: signupToken => {
    return axiosInstance.get(`${apiurl}/auth/register/confirm/${signupToken}`);
  },
  login: (email, password) => {
    return axiosInstance.post(`${apiurl}/auth/login`, {
      email: email,
      password: password,
    });
  },
  forgot: email => {
    return axiosInstance.post(`${apiurl}/auth/forgot`, {
      email: email,
    });
  },
  reset: (magicLinkToken, password) => {
    return axiosInstance.put(`${apiurl}/auth/reset/${magicLinkToken}`, {
      newPassword: password,
    });
  },
  user: id => {
    return axiosInstance
      .get(`${apiurl}/users/${id}`, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .catch(err => handleUnauthorized(err));
  },
  portfolio: id => {
    return axiosInstance
      .get(`${apiurl}/users/${id}/portfolio`, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .catch(err => handleUnauthorized(err));
  },
  toggleAutorebalancing: id => {
    return axiosInstance
      .put(`${apiurl}/users/${id}/rebalance/toggle`, null, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .catch(err => handleUnauthorized(err));
  },
  rebalance: id => {
    return axiosInstance
      .put(`${apiurl}/users/${id}/rebalance`, null, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .catch(err => handleUnauthorized(err));
  },
  changePack: (id, label) => {
    return axiosInstance
      .put(
        `${apiurl}/users/${id}/packs/switch`,
        {
          label: label,
        },
        {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        }
      )
      .catch(err => {
        return handleUnauthorized(err);
      });
  },
  setCustomPack: (id, custom) => {
    console.log(custom);
    return axiosInstance
      .put(
        `${apiurl}/users/${id}/packs/custom`,
        {
          allocations: custom,
        },
        {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        }
      )
      .catch(err => {
        return handleUnauthorized(err);
      });
  },
  exchange: {
    add: (id, exchange) => {
      return exchangeOperation(id, exchange, "POST");
    },
    edit: (id, exchange) => {
      return exchangeOperation(id, exchange, "PUT");
    },
    delete: (id, exchange) => {
      return exchangeOperation(id, exchange, "DELETE");
    },
  },
  currencies: () => {
    return axiosInstance
      .get(`${apiurl}/currencies/all`, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .catch(err => handleUnauthorized(err));
  },
  rate: () => {
    return axiosInstance
      .get(`${apiurl}/currencies/rate/BTC_USD`, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .catch(err => handleUnauthorized(err));
  },
};

export default client;

function handleUnauthorized(err) {
  if (err.response && err.response.status === 401) {
    global.vm.$emit("401");
  }
  return Promise.reject(err);
}

function exchangeOperation(id, exchange, method) {
  exchange.credentials.preview =
    exchange.credentials.api_key.slice(0, 2) +
    "***" +
    exchange.credentials.api_key.slice(exchange.credentials.api_key.length - 2);
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

  return axiosInstance({
    method: method,
    url: `${apiurl}/users/${id}/exchanges/`,
    data: exchange,
    headers: { Authorization: "Bearer " + localStorage.getItem("token") },
  }).catch(err => {
    return handleUnauthorized(err);
  });
}
