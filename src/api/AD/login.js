import {api, commonApi, adminApi} from './index'
import {axios} from '@/utils/request'
import {setCookie} from "@/utils/helper";
import Vue from "vue";

/**
 * 登录
 * @param data
 * @returns {AxiosPromise}
 */
export function login(data) {
  return axios({
    ...commonApi.Login,
    data
  })
}

/**
 * 退出登录
 */
export function logout() {
  return new Promise(() => {
    setCookie(name, "", -1)
    Vue.ls.remove("*")
  })
}

