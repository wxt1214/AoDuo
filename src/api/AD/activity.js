import {axios} from "@/utils/request";
import {commonApi, extendUrl, api} from "@/api/AD/index";

/**
 * 获得活动列表
 * @returns {AxiosPromise}
 */
export function getActivityList() {
  return axios({
    ...api.Get_ActivityList
  })
}

/**
 * 返回活动类型
 * @returns {AxiosPromise}
 */
export function getActivityTypes() {
  return axios({
    ...api.Get_ActivityType
  })
}

/**
 * 获取活动详细信息
 * @param {*} p
 * @returns
 */
export function getActivityDetail(p) {
  return axios({
    ...extendUrl(api.Get_ActivityDetail, p)
  })
}

/**
 * 审核活动
 * @param p{
 *    approve: 是否通过审核
      reject_information:拒绝信息
 * }
 * @returns {AxiosPromise}
 */
export function checkActivity(p) {
  if (p.approve)
    return axios({
      ...extendUrl(api.Check_ActivityList, p.id),
      data: {
        approve: p.approve,
      }
    })
  else
    return axios({
      ...extendUrl(api.Check_ActivityList, p.id),
      data: {
        approve: p.approve,
        reject_information: p.reject_information || ""
      }
    })
}


/**
 * 删除活动
 * @param p
 * @returns {*}
 */
export function deleteActivity(p) {
  return axios({
    ...extendUrl(api.Del_Activity, p)
  })
}


/**
 * 根据状态搜索获得
 * @param p:{
 *   status: -1 未通过 0 待审核 1 未发布 2 已发布 3 开始报名 4 截止报名 5 进行中 6 已结束
 * }
 * @returns {AxiosPromise}
 */
export function searchActivity(p) {
  return axios({
    ...api.Search_AcitvityListWithStatus,
    data: {
      status: p.toString()
    }
  })
}

/**
 * 管理员修改活动信息
 * @param p
 *   {
	"name": "",
	"activity_type": "",
	"status": "",
	"maximum_number_of_people": "",
	"clock_in_type": "打卡方式有\"1\"和”2“，分别为时间线任务打卡和时间线任务打卡",
	"sign_up_start_time": "日期格式：2021-3-12 12:21:13",
	"sign_up_end_time": "",
	"is_charge": "",
	"is_password": "",
	"join_password": "",
	"is_realtime_locate": "",
	"is_sign_in": ""
}
 * }
 */
export function changeActivityDetail(p, id) {
  return axios({
    ...extendUrl(api.Change_ActivityDetail, id),
    data: p
  })
}

