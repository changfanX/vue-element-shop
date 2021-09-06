<template>
  <div>
    <Breadcrumb :breadcrumbTitleArray="['用户管理', '用户列表']" />
    <div class="el-table--card">
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="query" clearable
            ><el-button
              slot="append"
              icon="el-icon-search"
              @click="queryInfo.query = query"
            ></el-button
          ></el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">用户添加</el-button>
        </el-col>
      </el-row>
      <el-table :data="userData.userList" stripe style="width: 100%" border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="userStateChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template v-slot="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRoles(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page.sync="queryInfo.pagenum"
        :page-size.sync="queryInfo.pagesize"
        :page-sizes="[5, 10, 15]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="userData.total"
      >
      </el-pagination>
    </div>
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" @close="addDislogClosed">
      <el-form label-width="70px" ref="addFormRef" :model="addFormData" :rules="addFormRules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addFormData.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addFormData.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addFormData.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addFormData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">登 录</el-button>
      </div>
    </el-dialog>
    <!-- 修改用户信息对话框 -->
    <el-dialog title="修改用户" @close="aditClosed" :visible.sync="editDialogVisble" width="50%">
      <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisble = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRolesDialogVisible"
      @close="setRolesDialogClosed"
      width="50%"
    >
      <div>
        <p>当前的用户 : {{ userInfo.username }}</p>
        <p>当前的角色 : {{ userInfo.role_name }}</p>
        <p>
          分配新角色:
          <el-select v-model="selectRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRolesInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { userAddFormRulesMixin } from '../../common/mixin'
import Breadcrumb from '../content/Breadcrumb.vue'
export default {
  name: 'Users',
  mixins: [userAddFormRulesMixin],
  components: {
    Breadcrumb
  },
  data() {
    return {
      query: '',
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      userData: {
        userList: [],
        total: 0
      },
      addDialogVisible: false,
      addFormData: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editDialogVisble: false,
      editForm: {},
      setRolesDialogVisible: false,
      // 需要被分配角色的用户信息
      userInfo: {},
      // 分配角色列表
      rolesList: [],
      // 保存已经选中的角色id值
      selectRoleId: ''
    }
  },
  watch: {
    queryInfo: {
      handler() {
        this.getUserList()
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$api.getUserListApi(this.queryInfo)
      if (res.meta.status !== 200) return this.$message.error('获取用户列表失败')
      this.$message.success('获取用户列表成功')
      this.userData.userList = res.data.users
      this.userData.total = res.data.total
    },
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$api.addUserApi(this.addFormData)
        if (res.meta.status !== 201) {
          return this.$message.error('用户添加失败了~')
        }
        this.addDialogVisible = false
        this.getUserList()
        return this.$message.success('用户添加成功了~')
      })
    },
    async userStateChange(userInfo) {
      const { data: res } = await this.$api.userStateChangeApi(userInfo)
      if (res.meta.status !== 200) {
        userInfo.ms_state = !userInfo.mg_state
        return this.$message.error('更新用户状态失败了')
      }
      return this.$message.success('更新用户成功了')
    },
    addDislogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    aditClosed() {
      this.$refs.editFormRef.resetFields()
    },
    showEditDialog(id) {
      this.editForm = this.userData.userList.find(item => {
        return item.id === id
      })
      this.editDialogVisble = true
    },
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$api.editUserInfoApi(this.editForm)
        if (res.meta.status !== 200) {
          this.$message.error('更新用户信息失败')
        }
        this.editDialogVisble = false
        this.getUserList()
        this.$message.success('更新用户信息成功')
      })
    },
    async removeUserById(id) {
      const confirmRusult = await this.$confirm(
        '此操作将永久删除该文件，是否继续？',
        '永久删除该用户',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmRusult !== 'confirm') {
        return this.$message.info('已经取消了删除')
      }
      const { data: res } = await this.$api.removeUserByIdApi(id)
      if (res.meta.status !== 200) {
        console.log(res)
        return this.$message.error(res.meta.msg)
      }
      this.$message.success('删除成功')
      this.getUserList()
    },
    async setRoles(userInfo) {
      this.userInfo = userInfo
      const { data: res } = await this.$api.setRolesApi()
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败!')
      }
      this.rolesList = res.data
      this.setRolesDialogVisible = true
    },
    async saveRolesInfo() {
      if (!this.selectRoleId) {
        return this.$message.error('请选择要分配的角色!')
      }
      const { data: res } = await this.$api.saveRolesInfoApi(this.userInfo.id, this.selectRoleId)
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('更新角色失败!')
      }
      this.$message.success('更新角色成功!')
      this.getUserList()
      this.setRolesDialogVisible = false
    },
    setRolesDialogClosed() {
      this.selectRoleId = ''
      this.userInfo = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.el-table--card {
  background-color: #ffffff;
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 3px;
}
.el-table {
  margin-top: 15px;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
.el-pagination {
  margin-top: 15px;
}
</style>
