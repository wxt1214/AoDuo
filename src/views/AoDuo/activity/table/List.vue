<template>
  <div>
    <a-card :bordered="true" style="margin-bottom: 15px">
      <a-row>
        <a-col :sm="8" :xs="24">
          <head-info title="总活动数" :content='count.allCount' :bordered="true"/>
        </a-col>
        <a-col :sm="8" :xs="24">
          <head-info title="已结束数" :content="count.endCount" :bordered="true"/>
        </a-col>
        <a-col :sm="8" :xs="24">
          <head-info title="待审核数" :content="count.checkCount"/>
        </a-col>
      </a-row>
    </a-card>
    <a-card style="margin-bottom: 15px">
      <div>
        <span>
          状态筛选:
        </span>
        <a-checkable-tag style="margin: 5px" v-model="statusTags[0]" @change="handleStatusChange(0)">
          未通过
        </a-checkable-tag>
        <a-checkable-tag style="margin: 5px" v-model="statusTags[1]" @change="handleStatusChange(1)">
          待审核
        </a-checkable-tag>
        <a-checkable-tag style="margin: 5px" v-model="statusTags[2]" @change="handleStatusChange(2)">
          未发布
        </a-checkable-tag>
        <a-checkable-tag style="margin: 5px" v-model="statusTags[3]" @change="handleStatusChange(3)">
          已发布
        </a-checkable-tag>
        <a-checkable-tag style="margin: 5px" v-model="statusTags[4]" @change="handleStatusChange(4)">
          开始报名
        </a-checkable-tag>
        <a-checkable-tag style="margin: 5px" v-model="statusTags[5]" @change="handleStatusChange(5)">
          截止报名
        </a-checkable-tag>
        <a-checkable-tag style="margin: 5px" v-model="statusTags[6]" @change="handleStatusChange(6)">
          进行中
        </a-checkable-tag>
        <a-checkable-tag style="margin: 5px" v-model="statusTags[7]" @change="handleStatusChange(7)">
          已结束
        </a-checkable-tag>
      </div>
    </a-card>
    <a-card>
      <a-table
        :rowKey="(record)=>record.id"
        :columns="columns"
        :data-source="data"
      >
        <span slot="user" slot-scope="text">
          <a @click="gotoUser()">{{ text }}</a>
        </span>
        <span slot="status" slot-scope="text">
          <a-tag :color="handleStatusTag(text).color">
            {{ handleStatusTag(text).text }}
          </a-tag>
        </span>
        <span slot="action" slot-scope="text, record">
          <a @click="showModal(record.id)">查看</a>
          <a-divider type="vertical"/>
          <a-dropdown>
          <a class="ant-dropdown-link">
            更多 <a-icon type="down"/>
          </a>
          <a-menu slot="overlay">
            <a-menu-item>
              <a @click="showModal(record.id,true)">修改</a>
            </a-menu-item>
            <a-menu-item v-if="record.status==='0'">
              <a @click="confirmCheck(record.id)">审核</a>
            </a-menu-item>
            <a-menu-item>
              <a-popconfirm
                title="是否要删除此活动"
                ok-text="确定"
                cancel-text="取消"
                @confirm="handleDeleteActivity(record.id)"
              >
            <a style="color:red;font-weight:bolder">删除</a>
            </a-popconfirm>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </span>
      </a-table>

      <a-drawer
        title="活动详情"
        :width="720"
        :visible="visible"
        :body-style="{ paddingBottom: '80px' }"
        @close="onClose"
      >
        <template v-if="drawerLoad" style="position: relative;height: 100%;width: 100%">
          <a-spin style="position: absolute;top: 50%;left: 50%;transform: translate(-50%,-50%)" size="large"/>
        </template>
        <template v-else>
          <a-form v-if="!isChange" :form="form">
            <a-form-item v-bind="formItemLayout" label="活动名">
              <a-input
                v-decorator="[
                  'name',
                  {
                    initialValue:currentActivity.name||'无'
                  },
        ]" readOnly
              />
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="活动介绍">
              <a-textarea
                v-decorator="[
                'activity_intro',
                {
                  initialValue:currentActivity.activity_intro||'无'
                },
              ]"
                style="height: 50px"
                readOnly
              />

            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="人数上限">
              <a-input
                v-decorator="[
                'maximum_number_of_people',
                {
                  initialValue:currentActivity.maximum_number_of_people||'无'
                },
              ]"
                readOnly
              />
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="活动状态">
              <a-tag :color="handleStatusTag(currentActivity.status).color">
                {{ handleStatusTag(currentActivity.status).text }}
              </a-tag>
              <a-button @click="confirmCheck(currentActivity.id)" v-if="currentActivity.status==='0'" type="default"
                        size="small">
                去审核
              </a-button>
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="活动类型">
              <a-input
                v-decorator="[
              'activity_type',{
                 initialValue:(currentActivity.activity_type?currentActivity.activity_type.name:'')||'无'
              }
            ]"
                readOnly
              >
              </a-input>
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="打卡方式">
              <a-input
                v-decorator="[
              'clock_in_type',{
                initialValue:(currentActivity.clock_in_type==='1'?'时间线任务打卡':'非时间线任务式打卡')||'无'
              }
            ]"
                readOnly
              >
              </a-input>
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="创建时间">
              <a-input
                v-decorator="[
              'create_time',{
                  initialValue:currentActivity.create_time||'无'
              }
            ]"
                readOnly
              >
              </a-input>
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="最后修改时间">
              <a-input
                v-decorator="[
              'last_mod_time',{
                  initialValue:currentActivity.last_mod_time||'无'
              }
            ]"
                readOnly
              >
              </a-input>
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="发布时间">
              <a-input
                v-decorator="[
              'release_time',{
                initialValue:currentActivity.release_time||'无'
              }
            ]"
                readOnly
              >
              </a-input>
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="报名开始时间">
              <a-input
                v-decorator="[
              'sign_up_start_time',{
                initialValue:currentActivity.sign_up_start_time||'无'
              }
            ]"
                readOnly
              >
              </a-input>
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="报名截止时间">
              <a-input
                v-decorator="[
              'sign_up_end_time',{
                initialValue:currentActivity.sign_up_end_time||'无'
              }
            ]"
                readOnly
              >
              </a-input>
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="活动开始时间">
              <a-input
                v-decorator="[
              'begin_time',{
                initialValue:currentActivity.begin_time||'无'
              }
            ]"
                readOnly
              >
              </a-input>
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="活动结束时间">
              <a-input
                v-decorator="[
              'end_time',{
                initialValue:currentActivity.end_time||'无'
              }
            ]"
                readOnly
              >
              </a-input>
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="发起人">
              <a-input
                v-decorator="[
                'sponsor',{
                 initialValue:(currentActivity.sponsor?currentActivity.sponsor.nickname:'无')||''
                }
              ]"
                readOnly
              >
              </a-input>
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="领队人">
              <a-tag v-if="nameData.leadersName.length===0">
                无
              </a-tag>
              <a-tag v-else color="pink" v-for="(i) in nameData.leadersName.length" :key="i.toString(36) + i">
                {{ nameData.leadersName[i - 1] }}
              </a-tag>
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="参与人">
              <a-tag v-if="nameData.participantsName.length===0">
                无
              </a-tag>
              <a-tag v-else color="red" v-for="(i) in nameData.participantsName.length" :key="i.toString(36) + i">
                {{ nameData.participantsName[i - 1] }}
              </a-tag>
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="组织名">
              <a-input
                v-decorator="[
              'group_name',{
              initialValue:currentActivity.group_name||'无'
              }
            ]"
                readOnly
              >
              </a-input>
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="审核人">
              <a-input
                v-decorator="[
              'checker',{
              initialValue:currentActivity.checker||'无'
              }
            ]"
                readOnly
              >
              </a-input>
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="拒绝信息">
              <a-textarea
                v-decorator="[
              'reject_message',{
              initialValue:currentActivity.reject_message||'无'
              }
            ]"
                style="height: 50px"
                readOnly
              >
              </a-textarea>
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="是否收费">
              <a-input
                v-decorator="[
              'is_charge',{
              initialValue:(currentActivity.is_charge?'是':'否')||'无'
              }
            ]"
                readOnly
              >
              </a-input>
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="是否需要密码">
              <a-input
                v-decorator="[
              'is_password',{
              initialValue:(currentActivity.is_password?'是':'否')||'无'
              }
            ]"
                readOnly
              >
              </a-input>
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="加入密码">
              <a-input
                v-decorator="[
              'join_password',{
              initialValue:currentActivity.join_password||'无'
              }
            ]"
                readOnly
              >
              </a-input>
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="是否实时定位">
              <a-input
                v-decorator="[
              'phis_realtime_locateone',{
              initialValue:(currentActivity.is_realtime_locate?'是':'否')||'无'
              }
            ]"
                readOnly
              >
              </a-input>
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="定位间隔失效分钟">
              <a-input
                v-decorator="[
              'time_interval_minute',{
              initialValue:currentActivity.time_interval_minute||'无'
              }
            ]"
                readOnly
              >
              </a-input>
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="是否打卡签到">
              <a-input
                v-decorator="[
              'is_sign_in',{
              initialValue:(currentActivity.is_sign_in?'是':'否')||'无'
              }
            ]"
                readOnly
              >
              </a-input>
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="是否展示任务内容">
              <a-input
                v-decorator="[
              'is_show_mission',{
              initialValue:(currentActivity.is_show_mission?'是':'否')||'无'
              }
            ]"
                readOnly
              >
              </a-input>
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="任务点">
              <a-tag v-if="nameData.missionName.length===0">
                无
              </a-tag>
              <a-tag v-else color="cyan" v-for="(i) in nameData.missionName.length" :key="i.toString(36) + i">
                {{ nameData.missionName[i - 1] }}
              </a-tag>
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="浏览量">
              <a-input
                v-decorator="[
              'views',{
              initialValue:currentActivity.views||'0'
              }
            ]"
                readOnly
              >
              </a-input>
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="收藏量">
              <a-input
                v-decorator="[
              'star_number',{
              initialValue:currentActivity.star_number||'0'
              }
            ]"
                readOnly
              >
              </a-input>
            </a-form-item>
          </a-form>
          <a-form v-else :form="form">
            <a-form-item v-bind="formItemLayout" label="活动名">
              <a-input
                v-decorator="[
                  'name',
                  {
                    rules: [{ required: true, message: '请输入活动名!' }],
                    initialValue:currentActivity.name||'无'
                  },
                ]"
                placeholder="请输入活动名"
              />
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="活动状态">
              <a-select
                v-decorator="[
                'status',
                {
                  initialValue:currentActivity.status||'无'
                }]
              "
                placeholder="请选择活动状态"
              >
                <a-select-option value="0">
                  待审核
                </a-select-option>
                <a-select-option value="1">
                  未发布
                </a-select-option>
                <a-select-option value="2">
                  已发布
                </a-select-option>
                <a-select-option value="3">
                  开始报名
                </a-select-option>
                <a-select-option value="4">
                  截止报名
                </a-select-option>
                <a-select-option value="5">
                  进行中
                </a-select-option>
                <a-select-option value="6">
                  已结束
                </a-select-option>
                <a-select-option value="-1">
                  未通过
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="活动类型">
              <a-select
                v-decorator="[
                'activity_type',
                {
                  initialValue:currentActivity.activity_type?currentActivity.activity_type.id:-1
                }]
              "
                placeholder="请选择活动类型"
              >
                <a-select-option v-for="(item,index) in activityType" :key="item.id" :value="item.id">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="人数上限">
              <a-input-number
                v-decorator="[
                'maximum_number_of_people',
                {
                  initialValue:currentActivity.maximum_number_of_people||'无'
                },
              ]"
                :min="1"
                placeholder="请输入人数上限"
              />
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="打卡方式">
              <a-select
                v-decorator="[
                'clock_in_type',
                {
                  initialValue:currentActivity.clock_in_type||'无'
                }]
              "
                placeholder="请选择打卡方式"
              >
                <a-select-option value="1">
                  时间线任务打卡
                </a-select-option>
                <a-select-option value="2">
                  非时间线任务打卡
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="报名开始时间">
              <a-date-picker
                :allowClear="false"
                v-model="changeActivity.sign_up_start_time"
                show-time
                valueFormat="YYYY-MM-DD HH:mm:ss"
                @change="timeStartChange"
              />
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="报名截止时间">
              <a-date-picker
                :allowClear="false"
                v-model="changeActivity.sign_up_end_time"
                show-time
                valueFormat="YYYY-MM-DD HH:mm:ss"
                @change="timeEndChange"
              />
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="是否收费">
              <a-switch
                v-model="changeActivity.is_charge"
              >
              </a-switch>
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="是否需要密码">
              <a-switch
                v-model="changeActivity.is_password"
              >
              </a-switch>
            </a-form-item>
            <a-form-item v-if="changeActivity.is_password" v-bind="formItemLayout" label="密码">
              <a-input
                v-decorator="[
              'join_password',
               {
                rules: [{ required: true, message: '请输入密码' }],
              }
            ]"
                placeholder="请输入密码"
              >
              </a-input>
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="是否实时定位">
              <a-switch
                v-model="changeActivity.is_realtime_locate"
              />
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="是否打卡签到">
              <a-switch
                v-model="changeActivity.is_sign_in"
              >
              </a-switch>
            </a-form-item>
          </a-form>
          <div
            :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1,
        }"
          >
            <a-button :style="{ marginRight: '8px' }" @click="onClose">
              {{ isChange ? "取消" : "关闭" }}
            </a-button>
            <a-button v-if="!isChange" type="primary" @click="handleGoToChange">
              修改
            </a-button>
            <a-button v-else type="primary" @click="handleSubmitChange">
              提交
            </a-button>
          </div>
        </template>
      </a-drawer>
    </a-card>
    <a-modal
      title="拒绝活动"
      :visible="visibleReject"
      okText="提交"
      cancelText="取消"
      @ok="()=>{
         this.handleRejectCommit()
      }"
      @cancel="()=>{
         this.visibleReject=false;
         this.rejectInfo=''
      }"
    >
      <a-textarea
        v-model="rejectInfo"
        placeholder="输入拒绝信息"
        :auto-size="{ minRows: 3, maxRows: 10 }"
      />
    </a-modal>
  </div>
</template>

<script>
import {
  getActivityList,
  getActivityDetail,
  deleteActivity,
  checkActivity,
  searchActivity,
  changeActivityDetail,
  getActivityTypes
} from '@/api/AD/activity'
import {getAdminDetail} from "@/api/AD/admin";
import HeadInfo from '@/components/tools/HeadInfo'
import moment from "moment";
import 'moment/locale/zh-cn';

export default {
  name: 'TableList',
  components: {
    HeadInfo
  },
  data() {
    return {
      data: [],
      // 表头
      columns: [
        {
          title: '名称',
          dataIndex: 'name'
        },
        {
          title: '创建时间',
          dataIndex: 'create_time'
        },
        {
          title: '发起人',
          dataIndex: 'sponsor.nickname',
          scopedSlots: {customRender: 'user'},
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: {customRender: 'status'},
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: {customRender: 'action'},
        }
      ],
      visible: false,
      loading: false,
      //  表单
      formItemLayout: {
        labelCol: {
          span: 8,
          offset: 1
        },
        wrapperCol: {
          span: 8
        },
      },
      currentActivity: {},
      count: {
        allCount: "0",
        endCount: "0",
        checkCount: "0"
      },
      nameData: {
        leadersName: [],
        missionName: [],
        participantsName: []
      },
      visibleReject: false,
      rejectInfo: "",
      checkId: "",
      statusTags: [false, false, false, false, false, false, false, false],
      currentStatus: "",
      isChange: false,
      changeActivity: {
        "name": "",
        "activity_type": {},
        "status": "0",
        "maximum_number_of_people": 1,
        "clock_in_type": 1,
        "sign_up_start_time": moment(new Date(), "YYYY-MM-DD HH:mm:ss"),
        "sign_up_end_time": moment(new Date(), "YYYY-MM-DD HH:mm:ss"),
        "is_charge": false,
        "is_password": false,
        "join_password": "",
        "is_realtime_locate": false,
        "is_sign_in": false
      },
      activityType: [],
      drawerLoad: true
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, {name: 'change'});
  },
  created() {
    this.getActivityData("")
  },
  methods: {
    /**
     * 获取活动列表
     * @param params
     * @returns {Promise<void>}
     */
    getActivityData() {
      this.count.allCount = "0"
      this.count.endCount = "0"
      this.count.checkCount = "0"
      return getActivityList()
        .then(res => {
          let data = res.all_activity;
          data.forEach((item) => {
            item = this.handlerData(item)
          })
          this.data = data;
        })
    },
    /**
     * 处理data
     */
    handlerData(data) {
      let a = parseInt(this.count.allCount)
      let b = parseInt(this.count.endCount)
      let c = parseInt(this.count.checkCount)
      a++;
      if (data.status === "6")
        b++;
      if (data.status === "0")
        c++;
      this.count.allCount = a.toString();
      this.count.endCount = b.toString();
      this.count.checkCount = c.toString();
      return data
    },
    /**
     * 不同的角色有不同的tag
     * @param tx
     */
    handleStatusTag(tx) {
      let color;
      let text;
      switch (tx) {
        case "-1":
          color = "yellow"
          text = "未通过"
          break;
        case "0":
          color = "pink"
          text = "待审核"
          break;
        case "1":
          color = "red";
          text = "未发布"
          break;
        case "2":
          color = "orange";
          text = "已发布"
          break;
        case "3":
          color = "green";
          text = "开始报名"
          break;
        case "4":
          color = "cyan";
          text = "截止报名"
          break;
        case "5":
          color = "blue";
          text = "进行中"
          break;
        case "6":
          color = "purple";
          text = "已结束"
          break;
      }
      return {
        color,
        text,
      }
    },
    /**
     * 展现修改modal
     */
    showModal(id, flag = false) {
      this.visible = true;
      getActivityDetail(id).then(res => {
        if (res.status) {
          this.handleGetAdminDetail(res.activity, flag)
        } else {
          this.$message.warning(res.errMsg);
        }
      })

    },
    /**
     * 隐藏modal
     * @param e
     */
    onClose(e) {
      this.visible = false;
      this.isChange = false;
      this.drawerLoad = true;
      this.currentActivity = {}
    },
    /**
     * 审核
     * @param id
     */
    confirmCheck(id) {
      this.onClose();
      let hca = (p) => this.handleCheckApply(p)
      let hra = (p) => this.handleRejectApply(p)
      this.$confirm({
        title: '审核?',
        content: h => <div style="color:red;">是否通过此户外活动的审核?</div>,
        okText: "通过",
        cancelText: "拒绝",
        onOk() {
          hca(id);
        },
        onCancel() {
          hra(id)
        },
      });
    },
    /**
     * 通过审核
     * @param id
     */
    handleCheckApply(id) {
      checkActivity({
        id: id,
        approve: true
      }).then(res => {
        if (res.status) {
          this.getActivityData()
          this.$message.success('审核成功');
        } else {
          this.$message.warning(res.errMsg);
        }
      })
    },
    /**
     * 拒绝申请
     * @param id
     */
    handleRejectApply(id) {
      this.visibleReject = true;
      this.checkId = id;
    },
    /**
     * 提交拒绝信息
     */
    handleRejectCommit() {
      checkActivity({
        id: this.checkId,
        approve: false,
        reject_information: this.rejectInfo
      }).then(res => {
        if (res.status) {
          this.getActivityData()
          this.$message.success('审核成功');
        } else {
          this.$message.warning(res.errMsg);
        }
        this.visibleReject = false;
      })
    },
    /**
     * 跳转到用户管理页面
     */
    gotoUser() {
      this.$router.push({path: '/users/user-list'})
    },
    /**
     * 删除活动
     * @param id
     */
    handleDeleteActivity(id) {
      deleteActivity(id).then(res => {
        if (res.status) {
          this.getActivityData()
          this.$message.success('删除成功');
        } else {
          this.$message.warning(res.errMsg);
        }
      })
    },
    /**
     * 获得审核人员的详细信息
     * @param p
     * @param flag
     */
    handleGetAdminDetail(p, flag) {
      if (p.checker) {
        getAdminDetail(p.checker).then(res => {
          p.checker = res.admin.username
        })
      } else {
        p.checker = ""
      }
      this.currentActivity = p
      if (flag) {
        this.handleGoToChange(p, flag);
      } else {
        this.handlePersonData(p)
      }


    },
    /**
     * 处理各种人的数组
     * @param data
     */
    handlePersonData(data) {
      //领导人
      let leadersName = [];
      //任务点
      let missionName = []
      //参与者
      let participantsName = []

      data.leader.forEach(item => {
        leadersName.push(item.nickname);
      })
      data.mission.forEach(item => {
        missionName.push(item.name);
      })

      data.participants.forEach(item => {
        participantsName.push(item.nickname);
      })
      this.nameData = {
        leadersName,
        missionName,
        participantsName
      };
      setTimeout(() => {
        this.drawerLoad = false;
      }, 200)
    },
    /**
     * 状态更改
     * @param id
     */
    handleStatusChange(status) {
      if (this.currentStatus === status) {
        this.getActivityData()
        return
      } else {
        this.currentStatus = status;
      }
      for (let i = 0; i < 8; i++) {
        if (i === status)
          continue;
        this.statusTags[i] = false
      }
      searchActivity(status - 1).then(res => {
        this.data = res.activity
      })
    },
    // 更改活动内容
    handleGoToChange(p, flag = false) {
      this.visible = true;
      const cur = flag ? p : this.currentActivity
      this.changeActivity = {
        ...cur,
        sign_up_end_time: moment(cur.sign_up_end_time, "YYYY-MM-DD HH:mm:ss"),
        sign_up_start_time: moment(cur.sign_up_start_time, "YYYY-MM-DD HH:mm:ss")
      }
      getActivityTypes().then(res => {
        this.activityType = res.all_activity_type;
        this.isChange = true;
        setTimeout(() => {
          this.drawerLoad = false;
        }, 200)
      })
    },
    timeStartChange(date) {
      this.changeActivity.sign_up_start_time = date;
    },
    timeEndChange(date) {
      this.changeActivity.sign_up_end_time = date;
    },
    // 提交更改
    handleSubmitChange() {
      this.form.validateFieldsAndScroll((err, values) => {
        let {
          sign_up_start_time,
          sign_up_end_time,
          is_charge,
          is_password,
          is_realtime_locate,
          is_sign_in,
        } = this.changeActivity;
        sign_up_start_time = sign_up_start_time.format("YYYY-MM-DD HH:mm:ss")
        sign_up_end_time = sign_up_end_time.format("YYYY-MM-DD HH:mm:ss")
        changeActivityDetail({
          name: values.name,
          status: values.status,
          maximum_number_of_people: values.maximum_number_of_people,
          clock_in_type: values.clock_in_type,
          sign_up_start_time,
          sign_up_end_time,
          is_charge,
          is_password,
          join_password: values.join_password,
          is_realtime_locate,
          is_sign_in,
          activity_type: values.activity_type
        }, this.currentActivity.id).then(res => {
          this.onClose();
          if (res.status) {
            this.getActivityData()
            this.$message.success('修改成功');
          } else {
            this.$message.warning(res.errMsg);
          }
        })
      })
    }
  }
}
</script>
