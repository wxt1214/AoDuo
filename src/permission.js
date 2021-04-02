import Vue from 'vue'
import router from './router'
import store from './store'

import NProgress from 'nprogress' // progress bar
import '@/components/NProgress/nprogress.less' // progress bar custom style
import notification from 'ant-design-vue/es/notification'
import {setDocumentTitle, domTitle} from '@/utils/domUtil'
import Router from "vue-router";
import {asyncRouterMap, constantRouterMap} from "@/config/router.config";

router.$addRoutes = (params) => {
  router.matcher = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    scrollBehavior: () => ({y: 0}),
    routes: constantRouterMap
  }).matcher;
  router.addRoutes(params)
}

NProgress.configure({showSpinner: false}) // NProgress Configuration

const whiteList = ['login'] // no redirect whitelist
const defaultRoutePath = '/index/analysis'

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  to.meta && (typeof to.meta.title !== 'undefined' && setDocumentTitle(`${to.meta.title} - ${domTitle}`))
  if (Vue.ls.get("ACCESS_TOKEN")) {
    /* has token */
    if (to.path === '/user/login') {
      next({path: defaultRoutePath})
      NProgress.done()
    } else {
      if (store.getters.roles.length === 0) {
        store.dispatch('GetInfo')
          .then(res => {
            const timer = setInterval(() => {
              console.log(res.res.role.length);
              if (res.res.role.length) {
                clearInterval(timer)
                store.dispatch('GenerateRoutes', res.res).then(() => {
                  // 根据roles权限生成可访问的路由表
                  // 动态添加可访问路由表
                  router.$addRoutes(store.getters.addRouters)
                  // 请求带有 redirect 重定向时，登录自动重定向到该地址
                  const redirect = decodeURIComponent(from.query.redirect || to.path)
                  if (to.path === redirect) {
                    // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
                    next({...to, replace: true})
                  } else {
                    // 跳转到目的路由
                    next({path: redirect})
                  }
                })
              }
            }, 1000)
          })
          .catch((error) => {
            console.log(error);
            notification.error({
              message: '错误',
              description: '请求用户信息失败，请重试'
            })
            store.dispatch('Logout').then(() => {
              next({path: '/user/login', query: {redirect: to.fullPath}})
            })
          })
      } else {
        next()
      }
      NProgress.done()
    }
  } else {
    if (whiteList.includes(to.name)) {
      // 在免登录白名单，直接进入
      store.dispatch('Logout').then(() => {
        next()
      })
    } else {
      next({path: "/user/login"})
    }
    NProgress.done()
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
