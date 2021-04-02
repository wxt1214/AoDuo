<template>
  <div class="page-header-index-wide">
    <a-card :loading="loading" :bordered="false" :body-style="{padding: '0'}">
      <div class="salesCard">
        <a-tabs default-active-key="1" size="large" :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}">
          <a-tab-pane loading="true" tab="户外活动" key="1">
            <a-row>
              <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                <div :style="{ padding: '0 0 32px 32px' }">
                  <h4 :style="{ marginBottom: '20px' }">户外活动申请数总览</h4>
                  <v-chart
                    height="254"
                    :data="bar1Data"
                    :forceFit="true"
                    :padding="['auto', 'auto', '40', '50']"
                  >
                    <v-tooltip/>
                    <v-axis/>
                    <v-bar color="户外活动申请数" position="x*户外活动申请数"/>
                  </v-chart>
                </div>
              </a-col>
              <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <rank-list title="用户类型数量总览" :list="list1Data"/>
              </a-col>
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>

    <div class="antd-pro-pages-dashboard-analysis-twoColLayout" :class="isDesktop() ? 'desktop' : ''">
      <a-row :gutter="24" type="flex" :style="{ marginTop: '24px' }">
        <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card :loading="loading" :bordered="false" title="主要数据显示" :style="{ height: '100%' }">
            <a-row style="margin-top: 75px" type="flex" justify="space-around">
              <a-col :sm="24" :md={offset:2,span:6} :style="{fontSize:'25px'}">
                <number-info :total="actingActivityCount" :sub-total="activitySub">
                  <span slot="subtitle" style="margin-left: -15px">
                    <span>户外活动</span>
                    <a-tooltip title="正在进行的户外活动数量" slot="action">
                      <a-icon type="info-circle-o" :style="{ marginLeft: '8px' }"/>
                    </a-tooltip>
                  </span>
                </number-info>
              </a-col>
              <a-col sm="24" :md={offset:2,span:6} :style="{ fontSize:'25px'}">
                <number-info :total="toDayNewUser" :sub-total="userSub">
                  <span slot="subtitle" style="margin-left: -15px">
                    <span>新增用户</span>
                    <a-tooltip title="今日新注册用户数" slot="action">
                      <a-icon type="info-circle-o" :style="{ marginLeft: '8px' }"/>
                    </a-tooltip>
                  </span>
                </number-info>
              </a-col>
            </a-row>
            <a-row style="margin-top: 100px" type="flex" justify="space-around">
              <a-col :sm="24" :md={offset:2,span:6} :style="{fontSize:'25px'}">
                <number-info :total="allOutdoorActivityCount" :sub-total="allActivitySub">
                  <span slot="subtitle" style="margin-left: -15px">
                    <span>活动总数</span>
                    <a-tooltip title="户外活动总数" slot="action">
                      <a-icon type="info-circle-o" :style="{ marginLeft: '8px' }"/>
                    </a-tooltip>
                  </span>
                </number-info>
              </a-col>
              <a-col :sm="24" :md={offset:2,span:6} :style="{ fontSize:'25px'}">
                <number-info :total="allUserCount" :sub-total="allUserSub">
                  <span slot="subtitle" style="margin-left: -15px">
                    <span>用户总数</span>
                    <a-tooltip title="平台用户总数" slot="action">
                      <a-icon type="info-circle-o" :style="{ marginLeft: '8px' }"/>
                    </a-tooltip>
                  </span>
                </number-info>
              </a-col>
            </a-row>
          </a-card>
        </a-col>
        <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card class="antd-pro-pages-dashboard-analysis-salesCard" :loading="loading" :bordered="false"
                  title="活动类别占比" :style="{ height: '100%' }">
            <div>
              <!-- style="width: calc(100% - 240px);" -->
              <div>
                <v-chart :force-fit="true" :height="405" :data="pie1Data" :scale="pieScale">
                  <v-tooltip :showTitle="false" dataKey="item*percent"/>
                  <v-axis/>
                  <v-legend dataKey="item"/>
                  <v-pie position="percent" color="item" :vStyle="pieStyle"/>
                  <v-coord type="theta" :radius="0.75" :innerRadius="0.6"/>
                </v-chart>
              </div>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import {
  ChartCard,
  MiniArea,
  MiniBar,
  MiniProgress,
  RankList,
  Bar,
  Trend,
  NumberInfo,
  MiniSmoothArea
} from '@/components'
import {mixinDevice} from '@/utils/mixin'
import {getActivityList} from "@/api/AD/activity";
import {getUserList, getAddNewUser} from "@/api/AD/user";
import Vue from "vue"


const DataSet = require('@antv/data-set')


export default {
  name: 'Analysis',
  mixins: [mixinDevice],
  components: {
    ChartCard,
    MiniArea,
    MiniBar,
    MiniProgress,
    RankList,
    Bar,
    Trend,
    NumberInfo,
    MiniSmoothArea
  },
  data() {
    return {
      loading: true,
      //
      pieScale: [{
        dataKey: 'percent',
        min: 0,
        formatter: '.0%'
      }],
      pieStyle: {
        stroke: '#fff',
        lineWidth: 1
      },
      //数据
      bar1Data: [],
      list1Data: [],
      pie1Data: [],
      activityTypeSourceData: [],
      actingActivityCount: 0,
      activitySub: 0,
      toDayNewUser: 0,
      userSub: 0,
      allOutdoorActivityCount: 0,
      allActivitySub: 0,
      allUserCount: 0,
      allUserSub: 0
    }
  },
  created() {
    this.getChartsData()
  },
  methods: {
    // 获得活动申请数据
    getChartsData() {
      getActivityList().then(res => {
        this.allOutdoorActivityCount = res.all_activity.length;
        this.handleActivityData(res.all_activity)
        getUserList().then(res => {
          this.allUserCount = res.all_user.length
          this.handleUserData(res.all_user)
        })
        getAddNewUser().then(res => {
          if (res.status) {
            this.todayAddUserCount = res.number
          }
        })
      })
    },
    // 处理获得申请数据
    handleActivityData(data) {
      let da = []
      let types = []
      let ids = []
      let monthsCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      data.forEach(i => {
        //活动日期
        let mo = moment(i.create_time).month();
        monthsCount[mo]++;
        da.push({
          x: `${mo + 1}月`,
        })
        // 类型
        types.push({
          ...i.activity_type,
          count: 0
        })
        ids.push(i.activity_type.id)
        //  正在进行的活动数
        if (i.status === "5")
          this.actingActivityCount++;
      })
      // 类型
      types.forEach(item => {
        for (let i = 0; i < ids.length; i++) {
          if (ids[i] === item.id) {
            item.count++;
          }
        }
      })
      types.forEach(item => {
        this.activityTypeSourceData.push({
          item: item.name,
          count: item.count
        })
      })
      const dv = new DataSet.View().source(this.activityTypeSourceData)

      dv.transform({
        type: 'percent',
        field: 'count',
        dimension: 'item',
        as: 'percent'
      })
      da.sort((ob1, ob2) => {
        if (ob1.x > ob2.x)
          return 1
        else if (ob1.x < ob2.x)
          return -1
        else
          return 0
      })
      da.forEach(item => {
        let i = this.handleFilterData(item)
        if (i) {
          this.bar1Data[i][`户外活动申请数`]++;
        } else {
          this.bar1Data.push({
            x: item.x,
            "户外活动申请数": 1
          })
        }
      })


      this.pie1Data = dv.rows

      //  数据持久化  进行活动的数量对比
      if (!Vue.ls.get("actingActivityCount")) {
        Vue.ls.set("actingActivityCount", this.actingActivityCount)
      }
      if (this.actingActivityCount !== Vue.ls.get("actingActivityCount")) {
        this.activitySub = this.actingActivityCount - Vue.ls.get("actingActivityCount")
        Vue.ls.set("actingActivityCount", this.actingActivityCount)
      }
      //  数据持久化  进行新增用户的数量对比
      if (!Vue.ls.get("todayAddUserCount")) {
        Vue.ls.set("todayAddUserCount", this.todayAddUserCount)
      }
      if (this.todayAddUserCount !== Vue.ls.get("todayAddUserCount")) {
        this.userSub = this.todayAddUserCount - Vue.ls.get("todayAddUserCount")
        Vue.ls.set("todayAddUserCount", this.todayAddUserCount)
      }
      //  数据持久化  进行用户总数对比
      if (!Vue.ls.get("allOutdoorActivityCount")) {
        Vue.ls.set("allOutdoorActivityCount", this.allOutdoorActivityCount)
      }
      if (this.allOutdoorActivityCount !== Vue.ls.get("allOutdoorActivityCount")) {
        this.allActivitySub = this.allOutdoorActivityCount - Vue.ls.get("allOutdoorActivityCount")
        Vue.ls.set("allOutdoorActivityCount", this.allOutdoorActivityCount)
      }
      //  数据持久化  进行新增用户的数量对比
      if (!Vue.ls.get("allUserCount")) {
        Vue.ls.set("allUserCount", this.allUserCount)
      }
      if (this.allUserCount !== Vue.ls.get("allUserCount")) {
        this.allUserSub = this.allUserCount - Vue.ls.get("allUserCount")
        Vue.ls.set("allUserCount", this.allUserCount)
      }
    },
    //处理月份
    handleFilterData(item) {
      for (let i = 0; i < this.bar1Data.length; i++) {
        if (item.x === this.bar1Data[i].x)
          return i;
      }
      return false
    },
    //处理用户数据
    handleUserData(data) {
      let da = []
      let name = ["普通用户(未验证邮箱)", "普通用户(已验证邮箱)", "认证领队", "黑名单用户"]
      let roles = [0, 0, 0, 0]
      data.forEach(item => {
        switch (item.user_role) {
          case "5":
            roles[0]++;
            break;
          case "4":
            roles[1]++;
            break;
          case "99":
            roles[2]++;
            break;
          case "6":
            roles[3]++;
            break;
        }
      })
      for (let i = 0; i < 4; i++) {
        da.push({
          name: name[i],
          total: roles[i]
        })
      }
      da.sort((ob1, obj2) => {
        if (ob1.total < obj2.total)
          return 1
        else if (ob1.total > obj2.total)
          return -1
        else
          return 0
      })
      this.list1Data = da
      //取消加载状态
      this.loading = false
    },
  }
}
</script>

<style lang="less" scoped>
.extra-wrapper {
  line-height: 55px;
  padding-right: 24px;

  .extra-item {
    display: inline-block;
    margin-right: 24px;

    a {
      margin-left: 24px;
    }
  }
}

.antd-pro-pages-dashboard-analysis-twoColLayout {
  position: relative;
  display: flex;
  display: block;
  flex-flow: row wrap;
}

.antd-pro-pages-dashboard-analysis-salesCard {
  height: calc(100% - 24px);

  /deep/ .ant-card-head {
    position: relative;
  }
}

.dashboard-analysis-iconGroup {
  i {
    margin-left: 16px;
    color: rgba(0, 0, 0, .45);
    cursor: pointer;
    transition: color .32s;
    color: black;
  }
}

.analysis-salesTypeRadio {
  position: absolute;
  right: 54px;
  bottom: 12px;
}
</style>
