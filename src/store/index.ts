import { createStore, Commit } from 'vuex';
import api from '../api'; // Importe o cliente Axios

interface State {
  auth_token: string | null;
}

const store = createStore({
  state: {
    auth_token: localStorage.getItem('auth_token') || null,
    user: {
      id: null,
      name: null,
      email: null,
    },
  },
  mutations: {
    setUserInfo(state, data) {
      state.user = data.data.user;
      state.auth_token = data.headers.authorization;
      localStorage.setItem('auth_token', data.headers.authorization);
    },
    setUserInfoFromToken(state, data) {
      state.user = data.data.user;
      state.auth_token = localStorage.getItem('auth_token');
    },
    resetUserInfo(state) {
      state.user = {
        id: null,
        name: null,
        email: null,
      };
      state.auth_token = null;
      localStorage.removeItem('auth_token');
    },
    setToken(state: State, auth_token: string) {
      state.auth_token = auth_token;
      localStorage.setItem('auth_token', auth_token);
    },
    clearToken(state: State) {
      state.auth_token = null;
      localStorage.removeItem('auth_token');
    },
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