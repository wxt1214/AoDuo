const IP = (url) => "http://47.106.81.45" + url
const POST = "POST"
const GET = "GET"
const PUT = "PUT"
const PATCH = "PATCH"
const DELETE = "DELETE"

/**
 * 管理员的api
 */
const api = {
//  管理员通过/拒绝活动创建
  Check_ActivityList: {
    url: IP("/aoduo_admin/outdoor/activity/verify/"),
    method: PUT
  },
//  管理员删除活动
  Del_Activity: {
    url: IP("/aoduo_admin/outdoor/activity/"),
    method: DELETE,
  },
  // 管理员获取户外活动详细信息
  Get_ActivityDetail: {
    url: IP("/aoduo_admin/outdoor/activity/"),
    method: GET
  },
  // 管理员获取户外活动列表
  Get_ActivityList: {
    url: IP("/aoduo_admin/outdoor/activity/list/"),
    method: GET
  },
  // 根据状态不同查找活动列表
  Search_AcitvityListWithStatus: {
    url: IP("/aoduo_admin/outdoor/activity/list/filter/"),
    method: POST
  },
  // 管理员修改活动信息
  Change_ActivityDetail: {
    url: IP("/aoduo_admin/outdoor/activity/"),
    method: PUT
  },
  Get_ActivityType: {
    url: IP("/aoduo_admin/outdoor/activity/type/list/true/"),
    method: GET
  }
}

/**
 * 管理员和总管理员的通用API
 * @type {{}}
 */
const commonApi = {
  // 管理员登录
  Login: {
    url: IP('/aoduo_admin/login/'),
    method: POST
  },
  // 管理员登录
  GetInfo: {
    url: IP('/aoduo_admin/login/'),
    method: GET
  },
  //  修改用户信息
  Change_UserDetail: {
    url: IP("/aoduo_admin/user/"),
    method: PUT
  },
  //  获取用户详细信息
  Get_UserDetail: {
    url: IP("/aoduo_admin/user/"),
    method: GET
  },
  //  获取用户列表
  Get_UserList: {
    url: IP("/aoduo_admin/user/list/"),
    method: GET
  },
  //  检查管理员是否登录
  Get_AdminIsLogin: {
    url: IP("/aoduo_admin/login/"),
    method: GET
  },
  //  管理员删除用户
  Del_User: {
    url: IP("/aoduo_admin/user/"),
    method: DELETE
  },
//  管理员根据用户名或者身份搜索消费者用户
  Search_User: {
    url: IP("/aoduo_admin/user/search/"),
    method: POST
  },
  //查看今日新增用户数量
  Get_AddUser: {
    url: IP("/aoduo_admin/data/today/"),
    method: GET
  }
}

/**
 * 总管理员的api
 * @type {{}}
 */
const adminApi = {
  //  总管理员新建管理员账户
  Admin_Add_AdminUser: {
    url: IP("/aoduo_admin/chief/admin/new/"),
    method: POST
  },
  //总管理员搜索管理员账户
  Admin_Search_Admin: {
    url: IP("/aoduo_admin/chief/admin/search/"),
    method: POST
  },

  //  总管理员新建管理员用户组
  Admin_Add_Group: {
    url: IP("/aoduo_admin/chief/group/new/"),
    method: POST
  },
  //  总管理员获取管理组详细信息
  Admin_Get_GroupDetail: {
    url: IP("/aoduo_admin/chief/group/"),
    method: GET
  },
  //  总管理员获取管理组列表
  Admin_Get_GroupList: {
    url: IP("/aoduo_admin/chief/group/list/"),
    method: GET
  },
  // 删除管理组
  Admin_Del_Group: {
    url: IP("/aoduo_admin/chief/group/"),
    method: DELETE
  },
  //  总管理员修改管理组信息
  Admin_Change_GroupDetail: {
    url: IP("/aoduo_admin/chief/group/"),
    method: PUT
  },
  //  总管理员禁用管理员账户
  Admin_Ban_AdminUser: {
    url: IP("/aoduo_admin/chief/admin/"),
    method: DELETE
  },

  //  总管理员通过/拒绝领队表单
  Admin_Check_LeaderList: {
    url: IP("/aoduo_admin/chief/leader/"),
    method: PUT
  },
//  总管理员获取领队认证申请表
  Get_ApplyLeaderDetail: {
    url: IP("/aoduo_admin/chief/leader/"),
    method: GET
  },
  //总管理员获取未审核的领队申请表单列表
  Admin_Get_UnCheckLeaderList: {
    url: IP("/aoduo_admin/chief/leader/list/"),
    method: GET
  },
//  总管理员获取管理员账户的详细信息
  Admin_Get_AdminDetail: {
    url: IP("/aoduo_admin/chief/admin/"),
    method: GET
  },
  // 总管理员获取所有权限对象列表
  Admin_Get_AllAuthorize: {
    url: IP("/aoduo_admin/chief/auth/list/"),
    method: GET
  },
  // 获取全部的管理员
  Admin_GetAdminList: {
    url: IP("/aoduo_admin/chief/admin/list/"),
    method: GET
  }
}
export {api, adminApi, commonApi}

/**
 * 拼接字符串
 * @param urlObject
 * @param params
 * @returns {*&{url: string}}
 */
export function extendUrl(urlObject, params) {
  return {
    ...urlObject,
    url: urlObject.url + params + "/"
  }
}