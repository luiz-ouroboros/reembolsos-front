import { createStore, Commit } from 'vuex';
import api from '../api'; // Importe o cliente Axios

interface State {
  auth_token: string | null;
  user: {
    id: number | null;
    name: string | null;
    email: string | null;
    role: string | null;
  },
  refundRequests: any[];
  suppliers: any[];
  search: string | null;
}

const store = createStore({
  state: {
    auth_token: localStorage.getItem('auth_token') || null,
    user: JSON.parse(localStorage.getItem('user')) || {
      id: null,
      name: null,
      email: null,
    },
    refundRequests: [],
    suppliers: [],
  },
  mutations: {
    setUserInfo(state, data) {
      state.user = data.data.user;
      state.auth_token = data.headers.authorization || data.data.token;
      localStorage.setItem('auth_token', state.auth_token);
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    resetUserInfo(state) {
      state.user = {
        id: null,
        name: null,
        email: null,
      };
      state.auth_token = null;
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    },
    setRefundRequests(state, data) {
      state.refundRequests = data.data;
    },
    setSupplies(state, data) {
      state.suppliers = data.data;
    },
    setTags(state, data) {
      state.tags = data.data;
    },
    setSearch(state, search) {
      state.search = search;
    }
  },
  actions: {
    registerUser({ commit }, payload) {
      return api
        .post('/users', payload)
        .then((response) => {
          commit('setUserInfo', response);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    loginUser({ commit }, payload) {
      commit('resetUserInfo');
      return api
        .post('/users/sign_in', { user: payload })
        .then((response) => {
          commit('setUserInfo', response);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    logoutUser({ commit }) {
      return api
        .delete('users/sign_out')
        .then(() => {
          commit('resetUserInfo');
        })
        .catch((error) => {
          console.error(error);
        });
    },
    createRefundRequest({ dispatch }, payload) {
      return api
        .post('/refund_requests', payload, {headers: { 'Content-Type': 'multipart/form-data' }})
        .then((response) => {
          return dispatch('loadRefundRequests').then(() => {
            console.log('response', response)
            return response;
          })
        })
        .catch((error) => {
          console.error(error);
        });
    },
    loadRefundRequests({ commit }, options = {}) {
      options['search'] = store.state.search

      return api
        .get('/refund_requests', { params: options })
        .then((response) => {
          commit('setRefundRequests', response.data);
          return response;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    updateRefundRequest({ dispatch }, { id, payload }) {
      return api
        .put(`/refund_requests/${id}`, payload)
        .then((response) => {
          console.log('response', response)
          dispatch('loadRefundRequests');
          return response;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    destroyRefundRequest({ dispatch }, id) {
      return api
        .delete(`/refund_requests/${id}`)
        .then((response) => {
          console.log('response', response)
          dispatch('loadRefundRequests');
          return response;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    loadSuppliers({ commit }, options = {}) {
      return api
        .get('/suppliers', options)
        .then((response) => {
          commit('setSupplies', response.data);
          return response;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    createSupplier({ dispatch }, payload) {
      return api
        .post('/suppliers', payload)
        .then((response) => {
          return dispatch('loadSuppliers').then(() => {
            console.log('response', response)
            return response;
          });
        })
        .catch((error) => {
          console.error(error);
        });
    },
    loadTags({ commit }, options = {}) {
      return api
        .get('/tags', options)
        .then((response) => {
          commit('setTags', response.data);
          return response;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    createTag({ dispatch }, payload) {
      return api
        .post('/tags', payload)
        .then((response) => {
          dispatch('loadTags');
          console.log('response', response)
          return response;
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  getters: {
    isAuthenticated(state: State) {
      const loggedOut =
        state.auth_token == null || state.auth_token == JSON.stringify(null);
      return !loggedOut;
    },
  },
});

export default store;