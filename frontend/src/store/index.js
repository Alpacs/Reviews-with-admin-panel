import { createStore } from 'vuex'

export default createStore({
  getters: {
    allReview(state) {
      return state.data_reviews
    },
    allReviewsToPage(state) {
      return state.data_reviews_to_page
    },
    getFilter(state) {
      return state.filterReview
    },
    getLenghtDataReviews(state) {
      return state.length_data_reviews
    },
    getMessageAuth(state) {
      return state.messageAuth;
    }
  },
  mutations: {
    addDataReview(state, response) {
      state.data_reviews = response;
      state.length_data_reviews = state.data_reviews.length
    },
    consoleLogCnfToken(state, cnfToken) {
      state.messageAuth = cnfToken
    },
    addFilter(state, filters) {
      state.filterReview = filters;
    },
  },
  actions: {
    async getReviews(ctx, req) {
      let resultReview = await fetch('http://localhost:8080/RR/get_review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(req)
      }).then(result => {
        return result.json()
      })
      ctx.commit('addDataReview', resultReview);
    },
    async getConfirmToken(ctx, token) {
      let bodyToken = {
          "token": token
      }
      const userAuth = (await fetch('http://localhost:8080/UR/confirmToken', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json;charset=utf-8'
          },
          body: JSON.stringify(bodyToken)
      }).then(result => {
          return result.json()
      }));
      ctx.commit('consoleLogCnfToken', userAuth)
      return userAuth
    },
    async changeFilter(ctx, filters) {
      ctx.commit('addFilter', filters)
    }
  },
  state: {
    data_reviews: [],
    messageAuth: {
    },
    filterReview: {
      id_food_point: null,
      id_user: null,
      id_city: null
    },
  }
})
