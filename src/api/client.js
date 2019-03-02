import axios from "axios";
const apiurl = process.env.VUE_APP_PORTFOLIO_API;

export default {
  register: (email, password) => {
    return axios.post(`${apiurl}/auth/register`, {
      email: email,
      password: password
    });
  },
  login: (email, password) => {
    return axios.post(`${apiurl}/auth/login`, {
      email: email,
      password: password
    });
  },
  forgot: email => {
    return axios.post(`${apiurl}/auth/forgot`, {
      email: email
    });
  },
  reset: (magicLinkToken, password) => {
    return axios.put(`${apiurl}/auth/reset/${magicLinkToken}`, {
      newPassword: password
    });
  }
};
