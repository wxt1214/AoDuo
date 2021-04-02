<template>
  <div>
    <a-table
      :rowKey="(record)=>record.id"
      :columns="columns"
      :data-source="data"
    >
      <span slot="role" slot-scope="text">
          <a-tag :color="handleRoleTag(text).color">
            {{ handleRoleTag(text).text }}
          </a-tag>
      </span>
      <span slot="action" slot-scope="text, record">
        <a-popconfirm
          title="是否要禁用此账户"
          ok-text="确定"
          cancel-text="取消"
          @confirm="handleBanAdmin(record.id)"
        >
          <a style="color:red;font-weight:bolder">禁用</a>
        </a-popconfirm>

      </span>
    </a-table>
    <a-modal v-model="visible" title="新建管理员账户" on-ok="handleOk">
      <template slot="footer">
        <a-button key="back" @click="handleCancel">
          取消
        </a-button>
        <a-button key="submit" type="primary" @click="handleOk">
          提交
        </a-button>
      </template>
      <a-form :form="form">
        <a-form-item v-bind="formItemLayout" label="邮箱">
          <a-input
            v-decorator="[
          'email',
          {
            rules: [
              {
                type: 'email',
                message: '输入的不是一个有效的邮箱!',
              },
              {
                required: true,
                message: '请输入邮箱!',
              },
            ],
          },
        ]"
            placeholder="请输入邮箱"
            allowClear
          />
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="账户名称">
          <a-input
            v-decorator="[
            'username',
          {
            rules: [{ required: true, message: '请输入账户名称', whitespace: true }]
          },
        ]"
            placeholder="请输入账户名称"
            allowClear
          />
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="账户类型">
          <a-select
            v-decorator="['type',{
              rules: [{ required: true, message: '请选择类型' }]
            }]"
            allowClear
            placeholder="请选择账户类型"
          >
            <a-select-option value=1>总管理员</a-select-option>
            <a-select-option value=2>副管理员</a-select-option>
            <a-select-option value=3>活动审核员</a-select-option>
            <a-select-option value=4>组管理员</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="密码">
          <a-input-password v-decorator="[
              'password',{
                rules: [{ required: true, message: '请输入密码' }]
              }
            ]" style="width: 100%" allowClear placeholder="请输入密码"/>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import {STable} from '@/components'
import {getAdminList, banAdminAccount, searchAdminDetail, addNewAdminAccount} from "@/api/AD/admin";

export default {
  name: 'TableList',
  components: {
    STable
  },
  data() {
    return {
      // 查询参数
      queryParam: {},
      data: [],
      // 表头
      columns: [
        {
          title: '邮箱',
          dataIndex: 'email'
        },
        {
          title: '用户名',
          dataIndex: 'username'
        },
        {
          title: '类型',
          dataIndex: 'admin_type',
          scopedSlots: {customRender: 'role'},
        },
        {
          title: '注册时间',
          dataIndex: 'register_date',
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: {customRender: 'action'},
        }
      ],
      roleText: {},
      visible: false,
      loading: false,
      //  表单
      formItemLayout: {
        labelCol: {
          span: 4,
          offset: 1
        },
        wrapperCol: {
          span: 16
        },
      },
      currentUser: {}
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, {name: 'change'});
  },
  created() {
    this.getAdminData("")
  },
  methods: {
    /**
     * 获取管理员
     * @param params
     * @returns {Promise<void>}
     */
    getAdminData() {
      return getAdminList()
        .then(res => {
          this.data = res.adminList;
        })
    },
    /**
     * 重置搜索框
     * */
    resetSearchForm() {
      this.queryParam = {}
      this.getAdminData()
    },

    /**
     * 不同的角色有不同的tag
     * @param tx
     */
    handleRoleTag(tx) {
      let color;
      let text;
      switch (tx) {
        case "1":
          color = "pink";
          text = "总管理员"
          break;
        case "2":
          color = "orange";
          text = "副管理员"
          break;
        case "3":
          color = "green";
          text = "活动审核员"
          break;
        case "4":
          color = "red";
          text = "组管理员"
      }
      return {
        color,
        text,
      }
    },
    /**
     * 搜索用户
     */
    handleSearchUser() {
      let query = {
        username: this.queryParam.username ? this.queryParam.username : "",
        type: this.queryParam.type ? parseInt(this.queryParam.type) : ""
      }
      if (!query.username) {
        delete query.username;
      }
      if (!query.type) {
        delete query.type;
      }
      searchAdminDetail(query).then(res => {
        this.data = res.result;
      })
    },
    /**
     * 禁用管理员账户
     * @param id
     */
    handleBanAdmin(id) {
      banAdminAccount(id).then(res => {
        if (res.status)
          this.$message.success('禁用成功!');
        else {
          this.$message.warning(res.errMsg);
        }
        this.getAdminData();
      })
    },

    //modal
    /**
     * 展现修改modal
     */
    showModal() {
      this.visible = true;
    },
    /**
     * 确认修改
     * @param e
     */
    handleOk(e) {
      this.handleChangeUser(e)
    },
    /**
     * 隐藏修改信息modal
     * @param e
     */
    handleCancel(e) {
      this.visible = false;
    },

    //  表单
    /**
     * 增加
     * @param e
     */
    handleChangeUser(e) {
      e.preventDefault();
      this.form.validateFieldsAndScroll((err, values) => {
        addNewAdminAccount(values).then(res => {
          if (res.status)
            this.$message.success('添加成功!');
          else {
            this.$message.warning(res.errMsg);
          }
          this.visible = false
          this.getAdminData();
        })
      });
    }
  }
}
</script>
