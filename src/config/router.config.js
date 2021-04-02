// eslint-disable-next-line
import {UserLayout, BasicLayout, RouteView, BlankLayout, PageView} from '@/layouts'
import {bxAnaalyse} from '@/core/icons'

export const asyncRouterMap = [
  {
    path: '/',
    name: 'Index',
    component: BasicLayout,
    meta: {title: '首页'},
    redirect: '/index',
    children: [
      //首页
      {
        path: '/index',
        name: 'Home',
        redirect: '/index/analysis',
        component: RouteView,
        meta: {title: '首页', keepAlive: true, icon: "area-chart"},
        children: [
          {
            path: '/index/analysis',
            name: 'Analysis',
            component: () => import('@/views/AoDuo/index/Analysis'),
            meta: {title: '数据分析', keepAlive: false}
          },
        ]
      },
      // forms
      {
        path: '/activity',
        redirect: '/activity/activity-list',
        name: "Activity",
        component: PageView,
        meta: {title: '活动管理', icon: 'form', permission: ['Manage', "Leader_Manage", "Activity_Manage"]},
        children: [
          {
            path: '/activity/activity-list',
            name: 'ActivityList',
            component: () => import('@/views/AoDuo/activity/QueryList'),
            meta: {title: '户外活动管理', keepAlive: true, permission: ['Manage', "Activity_Manage"]}
          },
          {
            path: '/activity/leader-list',
            name: 'LeaderList',
            component: () => import('@/views/AoDuo/activity/LeaderList'),
            meta: {title: '领队申请管理', keepAlive: true, permission: ['Manage', "Leader_Manage"]}
          }
        ]
      },
      // list
      {
        path: '/users',
        name: 'User',
        component: PageView,
        redirect: '/users/admin-list',
        meta: {title: '用户管理', icon: 'user', permission: ['Manage', "User_Mange"]},
        children: [
          {
            path: '/users/user-list',
            name: 'UserList',
            component: () => import('@/views/AoDuo/user/QueryList'),
            meta: {title: '用户列表', keepAlive: true, permission: ['Manage', "User_Mange"]}
          }
        ]
      },
      // profile
      {
        path: '/group',
        name: 'UserGroup',
        component: PageView,
        redirect: '/group/group-list',
        meta: {title: '管理员组管理', icon: 'usergroup-add', permission: ['Manage', "Group_Manage", "Admin_Manage"]},
        children: [

          {
            path: '/group/group-list',
            name: 'GroupList',
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/AoDuo/group/GroupList'),
            meta: {title: '组列表', keepAlive: true, permission: ['Manage', "Group_Manage"]}
          },
          {
            path: '/group/admin-list',
            name: 'AdminList',
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/AoDuo/group/QueryList'),
            meta: {title: '管理员列表', keepAlive: true, permission: ['Manage', "Admin_Manage"]}
          },
        ]
      },
      {
        path: '/account/settings',
        name: 'settings',
        component: () => import('@/views/AoDuo/account/settings/Index'),
        meta: {title: '个人中心', icon: 'pic-center', keepAlive: true},
        redirect: '/account/settings/base',
        hideChildrenInMenu: true,
        children: [
          {
            path: '/account/settings/base',
            name: 'BaseSettings',
            component: () => import('@/views/AoDuo/account/settings/BaseSetting'),
            meta: {title: '基本信息', hidden: true}
          },
        ]
      }
    ]
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]
/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      }
    ]
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }

]
