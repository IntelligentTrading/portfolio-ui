import axios from "axios";

const axiosInstance = axios.create({
  timeout: 10000,
  params: {} // do not remove this, its added to add params later in the config
});
const apiurl = process.env.VUE_APP_PORTFOLIO_API;

export default {
  register: (email, password) => {
    return axiosInstance.post(`${apiurl}/auth/register`, {
      email: email,
      password: password
    });
  },
  login: (email, password) => {
    console.log(apiurl);
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
  portfolio: id => {
    return axiosInstance
      .get(`${apiurl}/users/${id}/portfolio`, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      })
      .catch(err => handleUnauthorized(err));
  }
};

function handleUnauthorized(err) {
  if (err.response.status === 401) {
    global.vm.$emit("401");
  }
}
