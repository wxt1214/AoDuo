<template>
  <div class="user-wrapper">
    <div class="content-box">
      <a-dropdown>
        <span class="action ant-dropdown-link user-dropdown-menu">
           <a-avatar style="color: #f56a00; backgroundColor: #fde3cf">
              {{ userName }}
          </a-avatar>
        </span>
        <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
          <a-menu-item key="1">
            <a href="http://47.106.81.45/aoduo_admin/data/form/">
              <a-icon type="table"/>
              <span>下载报表</span>
            </a>
          </a-menu-item>
          <a-menu-item key="2">
            <a @click="()=>{
              this.$router.push({path: '/account/settings/base'})
            }">
              <a-icon type="pic-center"/>
              <span>个人中心</span>
            </a>
          </a-menu-item>
          <a-menu-item key="3">
            <a @click="handleLogout">
              <a-icon type="logout"/>
              <span>退出登录</span>
            </a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
  </div>
</template>

<script>
import NoticeIcon from '@/components/NoticeIcon'
import Vue from "vue"
import {mapActions} from 'vuex'

export default {
  name: 'UserMenu',
  components: {
    NoticeIcon
  },
  created() {
    this.userName = Vue.ls.get("user").username
  },
  methods: {
    ...mapActions(['Logout']),
    handleLogout() {
      this.$confirm({
        title: '提示',
        content: '真的要注销登录吗 ?',
        onOk: () => {
          setTimeout(() => {
            this.Logout().then(() => {
              this.$router.push({path: '/user/login'})
            })

          }, 100)
        }
      })
    },
  }
}
</script>
