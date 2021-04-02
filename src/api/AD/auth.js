import {axios} from "@/utils/request";
import {api, extendUrl, adminApi} from "@/api/AD/index";


/**
 * 获取全部的权限列表
 * @returns {AxiosPromise}
 */
export function getAllAuthList(){
  return axios({
    ...adminApi.Admin_Get_AllAuthorize
  })
}