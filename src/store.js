import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {},
    totalBalance: 0,
    distribution: [],
    portfolio: "",
    supportedExchanges: [
      {
        label: "Coinbase",
        icon: "https://www.coinbase.com/favicon.ico"
      },
      {
        label: "Binance",
        icon:
          "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@f3661dbd785a91bd2fc1da34750ce1dce2ac771b/svg/color/bnb.svg"
      }
    ]
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
      state.portfolio = user ? user.portfolio.packs[0] : "";
    },
    setTotalBalance(state, balance) {
      state.totalBalance = balance;
    },
    setDistribution(state, distribution) {
      state.distribution = distribution == null ? [] : distribution;

      if (distribution.filter(d => d.data != null).length == 1) {
        state.totalBalance = distribution[0].data.value;
      } else if (distribution.filter(d => d.data != null).length > 1) {
        let totalAmount = distribution
          .filter(d => d.data != null)
          .reduce((total, current) => {
            return total.data.value + current.data.value;
          });
        state.totalBalance = totalAmount;
      } else state.totalBalance = 0;
    },
    setPortfolio(state, portfolio) {
      state.portfolio = portfolio;
    },
    setExchanges(state, exchanges) {
      state.user.exchanges = exchanges;
    }
  },
  actions: {}
});
