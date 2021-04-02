<template>
  <div class="logo">
    <router-link :to="{name:'Index'}">
      <LogoSvg style="margin-left:-10px;width: 63px;height: 40px;margin-right: -10px" alt="logo"/>
      <h1 style="
          font-size: 42px;
          color: rgb(67,67,67);
        " v-if="showTitle">{{ title }}</h1>
    </router-link>
  </div>
</template>

<script>
import LogoSvg from '@/assets/logo.svg?inline'

export default {
  name: 'Logo',
  components: {
    LogoSvg
  },
  props: {
    title: {
      type: String,
      default: 'AoDuo',
      required: false
    },
    showTitle: {
      type: Boolean,
      default: true,
      required: false
    }
  }
}
</script>

<style lang="css">
.header {

}
</style>