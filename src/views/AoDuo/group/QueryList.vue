<template>
  <a-card :bordered="false">
    <component @onEdit="handleEdit" @onGoBack="handleGoBack" :record="record" :is="currentComponet"></component>
  </a-card>
</template>

<script>

import ATextarea from 'ant-design-vue/es/input/TextArea'
import AInput from 'ant-design-vue/es/input/Input'
// 动态切换组件
import List from '@/views/AoDuo/group/table/List'

export default {

  name: 'TableListWrapper',
  components: {
    AInput,
    ATextarea,
    List,
  },
  data() {
    return {
      description: '总管理员对管理员进行基本信息管理',
      currentComponet: 'List',
      record: ''
    }
  },

  methods: {
    handleEdit(record) {
      this.record = record || ''
      this.currentComponet = 'Edit'
      console.log(record)
    },
    handleGoBack() {
      this.record = ''
      this.currentComponet = 'List'
    }
  },
  watch: {
    '$route.path'() {
      this.record = ''
      this.currentComponet = 'List'
    }
  }
}
</script>
