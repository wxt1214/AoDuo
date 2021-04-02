<template>
  <div>
    <a-card style="margin-top: 0px;margin-bottom: 0px">
      <div>
        <span>
          状态筛选:
        </span>
        <a-checkable-tag style="margin: 5px" v-model="statusTags[0]" @change="handleStatusChange(0)">
          等待审核
        </a-checkable-tag>
        <a-checkable-tag style="margin: 5px" v-model="statusTags[1]" @change="handleStatusChange(1)">
          已通过
        </a-checkable-tag>
        <a-checkable-tag style="margin: 5px" v-model="statusTags[2]" @change="handleStatusChange(2)">
          已驳回
        </a-checkable-tag>
      </div>
    </a-card>
    <a-card :bordered="false">
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
         <a @click="confirmCheck(record.id)">审核</a>
      </span>
      </a-table>
    </a-card>
    <a-drawer
      title="领队申请表单详情"
      height="100%"
      placement="top"
      :visible="visible"
      :body-style="{ paddingBottom: '80px' }"
      @close="onClose"
    >
      <a-form :form="form">
        <a-form-item v-bind="formItemLayout" label="关联用户">
          <a-input
            v-decorator="[
                  'name',
                  {
                    initialValue:(currentLeader.related_user?currentLeader.related_user.nickname:'')||'无'
                  },
        ]" readOnly
          />
        </a-form-item>

        <a-form-item v-bind="formItemLayout" label="注册日期">
          <a-input
            v-decorator="[
                'create_time',
                {
                  initialValue:currentLeader.create_time||'无'
                },
              ]"
            readOnly
          />
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="表单申请描述">
          <a-textarea
            v-decorator="[
                'description',
                {
                  initialValue:currentLeader.description||'无'
                },
              ]"
            style="height: 50px"
            readOnly
          />

        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="表单状态">
          <a-tag :color="handleStatusTag(currentLeader.status).color">
            {{ handleStatusTag(currentLeader.status).text }}
          </a-tag>
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
          关闭
        </a-button>
        <a-button type="primary" @click="confirmCheck(currentLeader.id)">
          审核
        </a-button>
      </div>
    </a-drawer>
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
import HeadInfo from '@/components/tools/HeadInfo'
import {getLeaderApplyList, getLeaderDetail, checkList} from "@/api/AD/leader";

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
          title: '关联用户',
          dataIndex: 'related_user.nickname'
        },
        {
          title: '表单状态',
          dataIndex: 'status',
          scopedSlots: {customRender: 'status'},
        },
        {
          title: '提交时间',
          dataIndex: 'create_time',
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
      currentLeader: {},
      visibleReject: false,
      rejectInfo: "",
      checkId: "",
      statusTags: [false, false, false],
      currentStatus: ""
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, {name: 'change'});
  },
  created() {
    this.getLeaderListData()
  },
  methods: {
    /**
     * 获取用户列表
     * @param params
     * @returns {Promise<void>}
     */
    getLeaderListData() {
      return getLeaderApplyList()
        .then(res => {
          this.data = res.form_list;
        })
    },
    /**
     * 不同的角色有不同的tag
     * @param tx
     */
    handleStatusTag(tx) {
      let color;
      let text;
      switch (tx) {
        case "1":
          color = "pink"
          text = "待审核"
          break;
        case "2":
          color = "green"
          text = "已通过"
          break;
        case "3":
          color = "purple"
          text = "已驳回"
          break;
      }
      return {
        color,
        text,
      }
    },

    /**
     * 处理状态改变
     */
    handleStatusChange(status) {
      if (this.currentStatus === status) {
        this.getLeaderListData()
        return
      } else {
        this.currentStatus = status;
        for (let i = 0; i < 3; i++) {
          if (i === status)
            continue;
          this.statusTags[i] = false
        }
      }
      getLeaderApplyList(this.currentStatus + 1)
        .then(res => {
          this.data = res.form_list;
        })
    },
    /**
     * 展现修改modal
     */
    showModal(id) {
      getLeaderDetail(id).then(res => {
        if (res.status) {
          this.currentLeader = res.form;
          this.visible = true
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
      this.currentLeader = {}
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
        title: '审核',
        content: h => <div style="color:red;">是否通过此领队申请表单?</div>,
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
      checkList({
        id: id,
        approve: true
      }).then(res => {
        if (res.status) {
          this.getLeaderListData()
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
      checkList({
        id: this.checkId,
        approve: false,
        reject_information: this.rejectInfo
      }).then(res => {
        if (res.status) {
          this.getLeaderListData()
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
    }
  }
}
</script>
