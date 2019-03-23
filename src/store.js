import Vue from 'vue'
import Vuex from 'vuex'
import api from './api/client'

Vue.use(Vuex)

const defaultState = {
  user: {},
  totalBalance: 0,
  distribution: {},
  portfolio: '',
  error: '',
  supportedExchanges: [
    {
      label: 'Binance',
      icon:
        'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@f3661dbd785a91bd2fc1da34750ce1dce2ac771b/svg/color/bnb.svg'
    }
  ]
}

const store = new Vuex.Store({
  state: JSON.parse(JSON.stringify(defaultState)),
  mutations: {
    setUser (state, user) {
      state.user = user
      state.portfolio = user ? user.portfolio.packs[0] : ''
      state.distribution = {}
      state.totalBalance = 0
    },
    setError (state) {
      if (state.user.exchanges.length == 0) state.error = 'Set an exchange!'
      else if (state.user.exchanges.some(x => !x.credentials.valid)) {
        state.error = 'Some of the exchanges might be misconfigured!'
      } else if (state.user.portfolio.packs.length == 0) {
        state.error = 'Set a portfolio strategy!'
      } else state.error = ''
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
      return api.exchange.add(userId, exchange).then(result => {
        ctx.commit('setExchanges', result.data)
        return ctx.dispatch('refreshPortfolio', userId)
      })
    },
    editExchange: async function (ctx, { userId, exchange }) {
      return api.exchange.edit(userId, exchange).then(result => {
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
      console.log('Refreshing portfolio...')
      return api
        .portfolio(userId)
        .then(distribution => {
          return ctx.commit('setDistribution', distribution.data)
        })
        .finally(() => {
          return ctx.commit('setError')
        })
    },
    refreshUser: async function (ctx, userId) {
      console.log('Refreshing user...')
      return api
        .user(userId)
        .then(user => {
          return ctx.commit('setUser', user.data)
        })
        .finally(() => {
          return ctx.commit('setError')
        })
    },
    toggleAutorebalancing: async function (ctx) {
      return api.toggleAutorebalancing(localStorage['userId']).then(user => {
        ctx.state.user.portfolio.autorebalance = user.data.portfolio.autorebalance
      })
    }
  }
})

export default store
