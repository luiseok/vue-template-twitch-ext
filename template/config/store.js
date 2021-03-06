import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

{{#if_eq i18n true}}
import vuexI18n from 'vuex-i18n'
import languages from '../locales'
{{/if_eq}}

Vue.use(Vuex)

const _state = () => ({
  context: {},
  auth: null,
  token: {},
  uid: null,
  {{#if_eq i18n true}}
  lang: null,
  {{/if_eq}}
  message: []
})

const store = new Vuex.Store({
  state: _state(),
  mutations: {
    // #region twitch auth
    setContext(state, context) {
      Vue.set(state, 'context', context)
    },
    setAuth(state, auth) {
      Vue.set(state, 'auth', auth)
      axios.defaults.headers.Authorization = 'Bearer ' + auth.token
    },
    setToken(state, token) {
      Vue.set(state, 'token', token)
    },
    setUid(state, uid) {
      Vue.set(state, 'uid', uid)
    },
    // #endregion
    {{#if_eq i18n true}}
    setLang(state, lang) {
      if(state.lang !== lang) {
        Vue.set(state, 'lang', lang)
        Vue.i18n.set(lang)
        try {
          if(localStorage.getItem('lang') !== lang)
            localStorage.setItem('lang', lang)
        } catch (e) {
          console.error(e)
        }
      }
    },
    {{/if_eq}}
    helloWorld(state) {
      state.message.push('Hello, World!')
    }
  },
  getters: {
  },
  actions: {
    // #region twitch auth
    authorized({ commit, dispatch }, data) {
      commit('setAuth', data)
      dispatch('init')

      try {
        let token = data.token.split('.')[1]
        let decoded = atob(token)
        let parsed = JSON.parse(decoded)
        commit('setToken', parsed)
        commit('setUid', parsed.user_id)
      } catch(e) {
        //
      }
    },
    // #endregion
    init({ commit }) {
      commit('helloWorld')
      {{#if_eq i18n true}}
      const [lang, locale] = (((navigator.userLanguage || navigator.language).replace('-', '_')).toLowerCase()).split('_')
      try {
        const storedLang = localStorage.getItem('lang')
        if(storedLang) {
          commit('setLang', storedLang)
        } else {
          commit('setLang', lang)
        }
      } catch (e) {
        console.error(e)
      }
      {{/if_eq}}
    }
  }
})

{{#if_eq i18n true}}
const lang = languages()
Vue.use(vuexI18n.plugin, store)
Object.keys(lang).forEach(l => Vue.i18n.add(l, lang[l]))
Vue.i18n.fallback('{{ i18nLang }}')
Vue.i18n.set('{{ i18nLang }}')
{{/if_eq}}
export default store
