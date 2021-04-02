import {api, commonApi, adminApi} from './index'
import {axios} from '@/utils/request'
import {extendUrl} from "./index";

/**
 * 获得用户列表
 * 有参数是搜索
 * @param p
 * @returns {AxiosPromise}
 */
export function getUserList(p) {
  if (p)
    return axios({
      ...commonApi.Search_User,
      data: p

    })
  else
    return axios({
      ...commonApi.Get_UserList
    })
}

/**
 * 删除用户
 * @param p
 */
export function deleteUser(p) {
  return axios({
    ...extendUrl(commonApi.Del_User, p)
  })
}

/**
 * 获取用户详细信息
 * @param p
 */
export function getUserDetail(p) {
  return axios({
    ...extendUrl(commonApi.Get_UserDetail, p)
  })
}

/**
 * 改变用户详细信息
 * @param p
 */
export function changeUser(p) {
  return axios({
    ...extendUrl(commonApi.Change_UserDetail, p.id),
    data: p
  })
}

/**
 * 获取登录管理的详细信息
 * @returns {AxiosPromise}
 */
export function getLoginInfo() {
  return axios({
    ...commonApi.GetInfo
  })
}

/**
 * 查看今日新增用户数量
 */
export function getAddNewUser() {
  return axios({
    ...commonApi.Get_AddUser
  })
}
