import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {},
    totalBalance: 0
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setTotalBalance(state, balance) {
      state.totalBalance = balance;
    }
  },
  actions: {}
});
