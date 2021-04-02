import {axios} from "@/utils/request";
import {api, extendUrl, adminApi} from "@/api/AD/index";

/**
 * 获取组列表
 * @returns {AxiosPromise}
 */
export function getGroupList() {
  return axios({
    ...adminApi.Admin_Get_GroupList
  })
}

/**
 * 获取管理组的详细信息
 * @param p
 * @returns {*}
 */
export function getGroupDetail(p) {
  return axios({
    ...extendUrl(adminApi.Admin_Get_GroupDetail, p)
  })
}

/**
 * 删除组
 * @param p
 * @returns {*}
 */
export function deleteGroup(p) {
  return axios({
    ...extendUrl(adminApi.Admin_Del_Group, p)
  })
}

/**
 * 更改组信息
 * @param p{
      addAuth	新增的权限id列表
      delAuth	  删除的权限id列表
      addAdmin	新增的管理员id列表
      delAdmin  删除的管理员id列表
 * }
 * @returns {*}
 */
export function changeGroup(p) {
  return axios({
    ...extendUrl(adminApi.Admin_Change_GroupDetail, p.id),
    data: {
      addAuth: p.addAuth,
      delAuth: p.delAuth,
      addAdmin: p.addAdmin,
      delAdmin: p.delAdmin,
    }
  })
}

/**
 * 新增用户组
 * @param p{
 *      group_name
        authID    权限id数组
 * }
 * @returns {AxiosPromise}
 */
export function addNewGroup(p){
  return axios({
    ...adminApi.Admin_Add_Group,
    data:p
  })
}