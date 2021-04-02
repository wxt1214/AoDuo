import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import notification from 'ant-design-vue/es/notification'
import {VueAxios} from './axios'
import {ACCESS_TOKEN} from '@/store/mutation-types'
import {setCookie} from "@/utils/helper";


// 创建 axios 实例
const service = axios.create({
  // baseURL: process.env.VUE_APP_API_BASE_URL, // api base_url
  timeout: 6000, // 请求超时时间,
  withCredentials: true
})


const err = (error) => {
  if (error.response) {
    const data = error.response.data
    const token = Vue.ls.get(ACCESS_TOKEN)
    if (error.response.status === 403) {
      notification.error({
        message: '403 Error',
        description: data.errMsg
      })
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      notification.error({
        message: '401 Error',
        description: data.errMsg
      })
      if (token) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
      }
    }
  }
  return Promise.reject(error)
}

// request interceptor
service.interceptors.request.use(config => {
  const token = Vue.ls.get("ACCESS_TOKEN")
  const key = Vue.ls.get("ACCESS_KEY")
  if (token && key) {
    config.headers['Access-Token'] = token
    config.headers['Access-Key'] = key
  }
  return config
}, err)

// response interceptor
service.interceptors.response.use((response) => {
  return response.data
}, err)

const installer = {
  vm: {},
  install(Vue) {
    Vue.use(VueAxios, service)
  }
}

export {
  installer as VueAxios,
  service as axios
}
