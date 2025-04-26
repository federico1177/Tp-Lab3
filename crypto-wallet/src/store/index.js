
import { createStore } from 'vuex'

export default createStore({
  state: {
    userId: ''
  },
  mutations: {
    setUserId(state, id) {
      state.userId = id
    }
  },
  actions: {
    setUserId({ commit }, id) {
      commit('setUserId', id)
    }
  },
  getters: {
    getUserId(state) {
      return state.userId
    }
  }
})
