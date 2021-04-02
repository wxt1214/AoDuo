import Vue from 'vue'
import {login} from "@/api/AD/login"
import {getLoginInfo} from "@/api/AD/user";
import {getGroupDetail} from "@/api/AD/group";

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {},
    key: ""
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, {name, welcome}) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_KEY: (state, key) => {
      state.key = key
    }
  },

  actions: {
    // 登录
    Login({commit}, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(res => {
          Vue.ls.set("user", res, 24 * 60 * 60 * 1000)
          Vue.ls.set("ACCESS_KEY", res[`Access-Key`], 24 * 60 * 60 * 1000)
          Vue.ls.set("ACCESS_TOKEN", res[`Access-Token`], 24 * 60 * 60 * 1000)
          commit('SET_TOKEN', res.token)
          commit('SET_KEY', res.key)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户信息
    GetInfo({commit}) {
      let role = []
      return new Promise((resolve, reject) => {
        getLoginInfo().then(res => {
          if (res.status) {
            const {group} = res
            group.forEach(item => {
              getGroupDetail(item.id).then(r => {
                if (r.status)
                  role.push(r.group.group_name)
              })
            })
            commit('SET_ROLES', {role})
          }
          resolve({
            res:
              {
                role
              }
          })
        })
      })
    },

    // 登出
    Logout({commit, state}) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '')
        commit('SET_KEY', '')
        commit('SET_ROLES', [])
        Vue.ls.remove("ACCESS_TOKEN")
        Vue.ls.remove("ACCESS_KEY")
        Vue.ls.remove("user")
        resolve()
      })
    }
  }
}

export default user
