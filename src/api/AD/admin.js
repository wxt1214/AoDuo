import {axios} from "@/utils/request";
import {commonApi, extendUrl, api, adminApi} from "@/api/AD/index";

/**
 * 获得管理员的详细
 * @param p
 */
export function getAdminDetail(p) {
  return axios({
    ...extendUrl(adminApi.Admin_Get_AdminDetail, p)
  })
}

/**
 * 搜索管理员账户
 * @param p{
 *   username
 *   type
 * }
 * @returns {AxiosPromise}
 */
export function searchAdminDetail(p) {
  return axios({
    ...adminApi.Admin_Search_Admin,
    data: p
  })
}


/**
 * 获取管理员账户列表
 * @returns {AxiosPromise}
 */
export function getAdminList() {
  return axios({
    ...adminApi.Admin_GetAdminList
  })
}

/**
 * 禁用某个管理员账户
 * @param p
 * @returns {*}
 */
export function banAdminAccount(p) {
  return axios({
    ...extendUrl(adminApi.Admin_Ban_AdminUser, p)
  })
}


/**
 * 创建管理员账户
 * @param p{
 *    username
      email
      password
      type{
      总管理员 1
      副管理员 2
      活动审核员 3
      组管理员 4
      }
 * }
 * @returns {AxiosPromise}
 */
export function addNewAdminAccount(p) {
  return axios({
    ...adminApi.Admin_Add_AdminUser,
    data: p
  })
}