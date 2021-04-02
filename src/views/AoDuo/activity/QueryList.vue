<template>
  <a-card :bordered="false">
    <component @onEdit="handleEdit" @onGoBack="handleGoBack" :record="record" :is="currentComponet"></component>
  </a-card>
</template>

<script>

// 动态切换组件
import List from '@/views/AoDuo/activity/table/List'


export default {
  name: 'TableListWrapper',
  components: {
    List
  },
  data () {
    return {
      description: '对AoDuo移动端提交的活动申请进行管理',
      currentComponet: 'List',
      record: ''
    }
  },
  created () {

  },
  methods: {
    handleEdit (record) {
      this.record = record || ''
      this.currentComponet = 'Edit'
      console.log(record)
    },
    handleGoBack () {
      this.record = ''
      this.currentComponet = 'List'
    }
  },
  watch: {
    '$route.path' () {
      this.record = ''
      this.currentComponet = 'List'
    }
  }
}
</script>
