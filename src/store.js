import Vue from 'vue'
import Vuex from 'vuex'
import api from './api/client'

Vue.use(Vuex)

const defaultState = {
  user: {},
  totalBalance: 0,
  distribution: {},
  portfolio: '',
  supportedExchanges: [
    {
      label: 'Binance',
      icon:
        'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@f3661dbd785a91bd2fc1da34750ce1dce2ac771b/svg/color/bnb.svg'
    }
  ]
}

export default new Vuex.Store({
  state: defaultState,
  mutations: {
    setUser (state, user) {
      state.user = user
      state.portfolio = user ? user.portfolio.packs[0] : ''
    },
    setTotalBalance (state, balance) {
      state.totalBalance = balance
    },
    setDistribution (state, distribution) {
      state.distribution = distribution || {}

      const exchanges = state.user.exchanges.map(x => x.label)

      let totalAmount = 0
      exchanges.forEach(exchange => {
        if (distribution[exchange]) totalAmount += distribution[exchange].value
      })
      state.totalBalance = totalAmount
    },
    setPortfolio (state, portfolio) {
      state.portfolio = portfolio
    },
    setExchanges (state, exchanges) {
      state.user.exchanges = exchanges
    }
  },
  actions: {
    addExchange: async function (ctx, { userId, exchange }) {
      return api.exchange
        .add(userId, exchange)
        .then(result => {
          ctx.commit('setExchanges', result.data)
          return ctx.dispatch('refreshPortfolio', userId)
        })
        .catch(err => {
          console.log(exchange)
          let victim = ctx.state.user.exchanges.find(
            ex => ex.label === exchange.label
          )
          console.log(victim)
        })
    },
    editExchange: async function (ctx, { userId, exchange }) {
      return api.exchange
        .edit(userId, exchange)
        .then(result => {
          ctx.commit('setExchanges', result.data)
          return ctx.dispatch('refreshPortfolio', userId)
        })
    },
    deleteExchange: async function (ctx, { userId, exchange }) {
      return api.exchange.delete(userId, exchange).then(result => {
        ctx.commit('setExchanges', result.data)
        return ctx.dispatch('refreshPortfolio', userId)
      })
    },
    refreshPortfolio: async function (ctx, userId) {
      return api.portfolio(userId).then(distribution => {
        return ctx.commit('setDistribution', distribution.data)
      })
    }
  }
})
