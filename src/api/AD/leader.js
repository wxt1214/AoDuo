import {axios} from "@/utils/request";
import {api, extendUrl, adminApi} from "@/api/AD/index";

/**
 * 获取领队审核列表
 * @param p{
 *    1  等待审核
 *   2  已通过
 *   3  已驳回
 * }
 * @returns {AxiosPromise}
 */
export function getLeaderApplyList(p) {
  if (p) {
    return axios({
      ...adminApi.Admin_Get_UnCheckLeaderList,
      url: "http://47.106.81.45/aoduo_admin/chief/leader/list?status=" + p
    })
  } else {
    return axios({
      ...adminApi.Admin_Get_UnCheckLeaderList
    })
  }

}

/**
 * 获得申请列表的详细信息
 * @param p
 */
export function getLeaderDetail(p) {
  return axios({
    ...extendUrl(adminApi.Get_ApplyLeaderDetail, p)
  })
}

/**
 * 同意或者拒绝领队申请
 * @param p{
 *    approve
      reject_information
 * }
 */
export function checkList(p) {
  return axios({
    ...extendUrl(adminApi.Admin_Check_LeaderList, p.id),
    data: {
      approve: p.approve,
      reject_information: p.reject_information
    }
  })
}