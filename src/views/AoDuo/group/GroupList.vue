<template>
  <a-card :bordered="false">
    <a-row style="margin-bottom: 12px">
      <a-col offset="22">
        <a-button type="primary" @click="handleAddNewGroup">新建</a-button>
      </a-col>
    </a-row>
    <a-table
      :rowKey="(record)=>record.id"
      :columns="columns"
      :data-source="data"
    >
      <div
        slot="expandedRowRender"
        slot-scope="record"
        style="margin: 0">
        <a-row
          :style="{ marginBottom: '12px' }">
          <a-col :span="8">
            <a-col :span="3">
              <span>权限:</span>
            </a-col>
            <a-col :span="5">
              <a-tag :style="{ marginBottom: '12px' }" color="cyan" v-for="(auth, index) in record.auth" :key="index">
                {{ auth.name }}
              </a-tag>
            </a-col>
          </a-col>
          <a-col :span="16">
            <a-col :span="3">
              <span>管理员:</span>
            </a-col>
            <a-col :span="13">
              <a-tag :style="{ marginBottom: '12px' }" color="green" v-for="(auth, index) in record.group_admin"
                     :key="index"
                     @click="handleGotoAdmin">
                {{ auth.username }}
              </a-tag>
            </a-col>
          </a-col>
        </a-row>
      </div>
      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical"/>
          <a-popconfirm
            title="是否要删除此管理组"
            ok-text="确定"
            cancel-text="取消"
            @confirm="handleDeleteGroup(record.id)"
          >
            <a>删除</a>
        </a-popconfirm>

      </span>
    </a-table>
    <a-modal
      title="组信息管理"
      style="top: 20px;"
      :width="720"
      v-model="visible"
      @ok="handleOk"
    >
      <a-form :form="form">
        <a-divider>基本信息</a-divider>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="唯一识别码"
        >
          <a-input
            placeholder="唯一识别码"
            readOnly
            v-decorator="[
              'id',{
              initialValue:currentGroup.id||''
            }
            ]"
          />
        </a-form-item>


        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="创建时间"
        >
          <a-input
            v-decorator="[
              'create_time',{
                initialValue:(currentGroup.group?currentGroup.group.create_time:'')||''
              }
            ]"
            readOnly
            style="width: 100%"
          />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="组名称"
          readOnly
        >
          <a-input
            v-decorator="[
              'group_name',{
                initialValue:(currentGroup.group?currentGroup.group.group_name:'')||''
              }
            ]"
            style="width: 100%"
            readOnly
          />
        </a-form-item>

        <a-divider>拥有权限</a-divider>
        <template>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="权限"
          >
            <a-select
              mode="multiple"
              style="width: 100%"
              v-decorator="[
              'auth',{
                initialValue:currentGroup.group?handleAuthList(currentGroup.auth):''
              }
            ]"
            >
              <a-select-option v-for="(item) in authList" :value="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </template>
        <a-divider>所属管理员</a-divider>
        <template>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="管理员"
          >
            <a-select
              mode="multiple"
              style="width: 100%"
              v-decorator="[
              'admin',{
                initialValue:currentGroup.group?handleAdminList(currentGroup.group_admin):''
              }
            ]"
            >
              <a-select-option v-for="(item) in adminList" :value="item.id">
                {{ item.username }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </template>
      </a-form>
    </a-modal>
    <a-modal
      title="新加组"
      style="top: 20px;"
      :width="720"
      v-model="addVisible"
      @ok="handleAddOk"
    >
      <a-form :form="form">
        <a-divider>基本信息</a-divider>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="组名称"
          readOnly
        >
          <a-input
            v-decorator="[
              'group_name',{ rules: [{ required: true, message: '请输入组名称'}],}
            ]"
            style="width: 100%"
            allowClear
            placeholder="请输入组名称"
          />
        </a-form-item>

        <a-divider>拥有权限</a-divider>
        <template>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="权限"
          >
            <a-select
              mode="multiple"
              style="width: 100%"
              v-decorator="['auth']"
            >
              <a-select-option v-for="(item) in authList" :value="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </template>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script>
import {STable} from '@/components'
import {getGroupList, getGroupDetail, deleteGroup, addNewGroup, changeGroup} from "@/api/AD/group";
import {getAllAuthList} from "@/api/AD/auth";
import {getAdminList} from "@/api/AD/admin";

export default {
  name: 'TableList',
  components: {
    STable,
  },
  data() {
    return {
      description: '总管理员在此操作管理员组，从而控制管理员权限',
      form: this.$form.createForm(this),

      visible: false,

      mdl: {},

      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '唯一识别码',
          dataIndex: 'id'
        },
        {
          title: '组名称',
          dataIndex: 'group_name'
        },
        {
          title: '创建时间',
          dataIndex: 'time'
        },
        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: {customRender: 'action'}
        }
      ],
      data: [],
      labelCol: {
        xs: {span: 24},
        sm: {span: 5}
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16}
      },
      currentGroup: {},
      authList: [],
      adminList: [],
      addAuth: [],
      delAuth: [],
      addAdmin: [],
      delAdmin: [],
      addVisible: false
    }
  },
  created() {
    this.getGroupListData()
    this.getAllAuthData()
    this.getAllAdminData()
  },
  methods: {
    /**
     * 编辑
     * @param record
     */
    handleEdit(record) {
      getGroupDetail(record.id).then(res => {
        if (res.status) {
          this.currentGroup = res;
          this.currentGroup.id = record.id
          this.visible = true
        }
      })
    },
    // 获取组列表
    getGroupListData() {
      getGroupList().then(res => {
        if (res.status) {
          this.handleGetAllGroupDetail(res.group_list)
        }
      })
    },
    //获得全部的权限
    getAllAuthData() {
      getAllAuthList().then(res => {
        this.authList = res.auth
      })
    },
    //获得全部的管理员
    getAllAdminData() {
      getAdminList().then(res => {
        this.adminList = res.adminList
      })
    },
    // 获取组列表的详细信息
    handleGetAllGroupDetail(data) {
      let da = []
      data.forEach(item => {
        getGroupDetail(item.id).then(res => {
          item.time = res.group.create_time
          item.auth = res.auth
          item.group_admin = res.group_admin
          da.push(item)
        })
      })
      this.data = da
    },
    // 跳转到管理员界面
    handleGotoAdmin() {
      this.$router.push({path: '/group/admin-list'})
    },
    // 处理一下权限列表
    handleAuthList(data) {
      let list = []
      data.forEach(item => {
        list.push(item.id)
      })
      return list;
    },
    // 处理一下管理员
    handleAdminList(data) {
      let list = []
      data.forEach(item => {
        list.push(item.id)
      })
      return list;
    },
    //处理修改信息
    handleOk(e) {
      e.preventDefault();
      this.form.validateFieldsAndScroll((err, values) => {
        this.handleCommitData(this.handleAddOrDelAuthAndAdmin(values.id, values.auth, values.admin))
      });
    },
    //  处理匹配 新增/减少 权限和管理员
    handleAddOrDelAuthAndAdmin(id, auth, admin) {
      let lastAuth = this.handleAuthList(this.currentGroup.auth);
      let lastAdmin = this.handleAdminList(this.currentGroup.group_admin);
      let addAuth = []
      let delAuth = []
      let addAdmin = []
      let delAdmin = []
      auth.forEach(item => {
        if (lastAuth.indexOf(item) === -1) {
          addAuth.push(item)
        }
      })
      lastAuth.forEach(item => {
        if (auth.indexOf(item) === -1)
          delAuth.push(item)
      })

      admin.forEach(item => {
        if (lastAdmin.indexOf(item) === -1) {
          addAdmin.push(item)
        }
      })
      lastAdmin.forEach(item => {
        if (admin.indexOf(item) === -1)
          delAdmin.push(item)
      })
      return {
        id,
        addAuth,
        delAuth,
        addAdmin,
        delAdmin
      }
    },
    //  提交修改信息
    handleCommitData(data) {
      changeGroup(data).then(res => {
        if (res.status)
          this.$message.success('修改成功!');
        else {
          this.$message.warning(res.errMsg);
        }
        this.visible = false;
        this.currentGroup = {}
        this.getGroupListData()
      })
    },
    //  删除组
    handleDeleteGroup(p) {
      deleteGroup(p).then(res => {
        if (res.status)
          this.$message.success('删除成功!');
        else {
          this.$message.warning(res.errMsg);
        }
        this.getGroupListData()
      })
    },
    // 添加组
    handleAddNewGroup() {
      this.addVisible = true;
    },
    //添加组
    handleAddOk() {
      this.form.validateFieldsAndScroll((err, values) => {
        addNewGroup({
          group_name: values.group_name,
          authID: values.auth
        }).then(res => {
          if (res.status)
            this.$message.success('添加成功!');
          else {
            this.$message.warning(res.errMsg);
          }
          this.addVisible = false;
          this.getGroupListData()
        })
      });
    }
  },
}
</script>
