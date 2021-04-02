<template>
  <div>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="用户昵称">
              <a-input allowClear v-model="queryParam.name" placeholder="输入用户昵称"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="用户身份">
              <a-select allowClear v-model="queryParam.role" placeholder="请选择用户角色" default-value="0">
                <a-select-option value=5>普通用户(未验证邮箱)</a-select-option>
                <a-select-option value=4>普通用户(已验证邮箱)</a-select-option>
                <a-select-option value=99>认证领队</a-select-option>
                <a-select-option value=6>黑名单用户</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="handleSearchUser">查询</a-button>
              <a-button style="margin-left: 8px" @click="resetSearchForm">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

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
        <a @click="showModal(record.id)">修改</a>
        <a-divider type="vertical"/>
        <a-popconfirm
          title="是否要删除此用户"
          ok-text="确定"
          cancel-text="取消"
          @confirm="handleDeleteUser(record.id)"
        >
          <a style="color:red;font-weight:bolder">删除</a>
        </a-popconfirm>

      </span>
    </a-table>
    <a-modal v-model="visible" title="更改用户信息" on-ok="handleOk" destroyOnClose>
      <template slot="footer">
        <a-button key="back" @click="handleCancel">
          返回
        </a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="handleOk">
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
            initialValue:currentUser.email||''
          },
        ]"
            placeholder="请输入邮箱"
            allowClear
          />
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="用户昵称">
          <a-input
            v-decorator="[
            'nickname',
          {
            rules: [{ required: true, message: '请输入你的昵称', whitespace: true }],
            initialValue:currentUser.nickname||''
          },
        ]"
            placeholder="请输入用户昵称"
            allowClear
          />
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="用户身份">
          <a-select
            v-decorator="['role',{
              rules: [{ required: true, message: '请选择用户角色' }],
              initialValue:currentUser.user_role||''
            }]"
            allowClear
            placeholder="请选择用户角色"
          >
            <a-select-option value=5>普通用户(未验证邮箱)</a-select-option>
            <a-select-option value=4>普通用户(已验证邮箱)</a-select-option>
            <a-select-option value=99>认证领队</a-select-option>
            <a-select-option value=6>黑名单用户</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="用户性别">
          <a-select
            v-decorator="['sex',
            {
              initialValue:currentUser.user_sex||''
            }]"
            allowClear
            placeholder="请输入性别"
          >
            <a-select-option value="secrecy">保密</a-select-option>
            <a-select-option value="male">男</a-select-option>
            <a-select-option value="female">女</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="真实姓名">
          <a-input
            v-decorator="[
              'realName',{
              initialValue:currentUser.realName||''
              }
            ]"
            style="width: 100%"
            allowClear
            placeholder="请输入真实姓名"
          >
          </a-input>
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="手机号">
          <a-input
            v-decorator="[
              'phone',{
              initialValue:currentUser.phone_number||''
              }
            ]"
            style="width: 100%"
            allowClear
            placeholder="请输入手机号"
          >
          </a-input>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import {STable} from '@/components'
import {getUserList, deleteUser, getUserDetail, changeUser} from "@/api/AD/user"

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
          title: '昵称',
          dataIndex: 'nickname'
        },
        {
          title: '用户身份',
          dataIndex: 'user_role',
          scopedSlots: {customRender: 'role'},
        },
        {
          title: '真实姓名',
          dataIndex: 'realName',
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
    this.getUserData("")
  },
  methods: {
    /**
     * 获取用户列表
     * @param params
     * @returns {Promise<void>}
     */
    getUserData(params) {
      return getUserList(params ? params : "")
        .then(res => {
          let data = params ? res.result : res.all_user;
          data.forEach(item => {
            item = this.handlerData(item)
          })
          this.data = data;
        })
    },
    /**
     * 重置搜索框
     * */
    resetSearchForm() {
      this.queryParam = {}
      this.getUserData()
    },
    /**
     * 处理data
     */
    handlerData(data) {
      if (!data.realName)
        data.realName = "尚未实名"
      return data
    },
    /**
     * 不同的角色有不同的tag
     * @param tx
     */
    handleRoleTag(tx) {
      let color;
      let text;
      switch (tx) {
        case "99":
          color = "pink";
          text = "认证领队"
          break;
        case "4":
          color = "orange";
          text = "普通用户(已验证邮箱)"
          break;
        case "5":
          color = "green";
          text = "普通用户(未验证邮箱)"
          break;
        case "6":
          color = "red";
          text = "黑名单用户"
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
        name: this.queryParam.name ? this.queryParam.name : "",
        role: this.queryParam.role ? parseInt(this.queryParam.role) : ""
      }
      if (!query.name) {
        delete query.name;
      }
      if (!query.role) {
        delete query.role;
      }
      this.getUserData(query)
    },
    /**
     * 删除用户
     * @param id
     */
    handleDeleteUser(id) {
      deleteUser(id).then(res => {
        if (res.status)
          this.$message.success('删除成功!');
        else {
          this.$message.warning(res.errMsg);
        }
        this.getUserData();
      })
    },

    //modal
    /**
     * 展现修改modal
     */
    showModal(id) {
      getUserDetail(id).then(res => {
        if (res.status) {
          this.currentUser = res.user
          this.visible = true;
        } else {
          this.$message.warning(res.errMsg);
        }
      })
    },
    /**
     * 确认修改
     * @param e
     */
    handleOk(e) {
      this.loading = true;
      this.handleChangeUser(e)
    },
    /**
     * 隐藏修改信息modal
     * @param e
     */
    handleCancel(e) {
      this.loading = false;
      this.visible = false;
      this.currentUser = {
        email: "",
        id: "",
        join_date: "",
        nickname: "",
        phone_number: "",
        realName: "",
        signature: "",
        user_role: "",
        user_sex: ""
      }
      console.log(this.currentUser);
    },

    //  表单
    /**
     * 更改用户
     * @param e
     */
    handleChangeUser(e) {
      e.preventDefault();
      this.form.validateFieldsAndScroll((err, values) => {
        values.id = this.currentUser.id;
        changeUser(values).then(res => {
          if (res.status) {
            this.getUserData()
            this.handleCancel()
            this.$message.success('修改成功');
          }
        })
      });
    }
  }
}
</script>
