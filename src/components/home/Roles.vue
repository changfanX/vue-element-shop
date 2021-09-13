<template>
  <div class="roles">
    <breadcrumb :breadcrumbTitleArray="['权限管理', '角色列表']" />
    <el-card>
      <el-row>
        <el-button type="primary" @click="addDialogVisible = true">
          添加角色
        </el-button>
      </el-row>
      <el-row>
        <el-table :data="rolesList" border stripe>
          <el-table-column type="expand">
            <template v-slot="{ row }">
              <el-row v-for="item1 in row.children" :key="item1.id">
                <el-col :span="5">
                  <el-tag closable @close="removeRightById(row, item1.id)">{{
                    item1.authName
                  }}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="19">
                  <el-row v-for="item2 in item1.children" :key="item2.id">
                    <el-col :span="6">
                      <el-tag type="success" closable @close="removeRightById(row, item2.id)">
                        {{ item2.authName }}
                      </el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="18">
                      <el-tag
                        type="warning"
                        v-for="item2 in item2.children"
                        :key="item2.id"
                        closable
                        @close="removeRightById(row, item2.id)"
                      >
                        {{ item2.authName }}
                      </el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column type="index" label="#"> </el-table-column>
          <el-table-column prop="roleName" label="角色名称"> </el-table-column>
          <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
          <el-table-column label="操作">
            <template v-slot="{ row }">
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(row)"
                >编辑</el-button
              >
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="roleDelete(row.id)"
                >删除</el-button
              >
              <el-button
                size="mini"
                type="warning"
                icon="el-icon-search"
                @click="showSetRightDialog(row)"
                >分配权限</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-card>
    <!-- dialog -->
    <el-dialog title="添加角色" :visible.sync="addDialogVisible">
      <el-form :model="addRolesForm" :rules="addFormRules" ref="addRolesForm" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addRolesUser">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改角色" :visible.sync="editDialogvisible" width="30%">
      <el-form :model="editRolesForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRolesForm.roleName"> </el-input>
        </el-form-item>
        <el-form-item v-model="editRolesForm.roleDesc" label="角色描述" prop="roleDesc">
          <el-input v-model="editRolesForm.roleDesc"> </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogvisible = false">
          取消
        </el-button>
        <el-button type="primary">
          确定
        </el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogVisibleClosed"
    >
      <el-tree
        :data="rightsList"
        show-checkbox
        :default-checked-keys="defKeys"
        :props="{ children: 'children', label: 'authName' }"
        node-key="id"
        default-expand-all
        ref="treeRef"
        check-on-click-node
      >
      </el-tree>
      <span slot="footer">
        <el-button @click="setRightDialogVisible = false">取消</el-button>
        <el-button @click="allotRights" type="primary">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { rolesFormRulesMixin } from '../../common/mixin'
import Breadcrumb from '../content/Breadcrumb.vue'
export default {
  name: 'Roles',
  components: { Breadcrumb },
  mixins: [rolesFormRulesMixin],
  data() {
    return {
      addDialogVisible: false,
      editDialogvisible: false,
      setRightDialogVisible: false,
      rolesList: [],
      addRolesForm: {},
      editRolesForm: {},
      rightsList: [],
      defKeys: [],
      rolesId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$api.axios.get('/roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.rolesList = res.data
    },
    showEditDialog(info) {
      this.editRolesForm = info
      this.editDialogvisible = true
    },
    addRolesUser() {
      this.$refs.addRolesForm.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$api.axios.post('/roles', this.addRolesForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加角色失败！')
        }
        this.$message.success('添加角色成功！')
        this.getRolesList()
        this.addDialogVisible = false
      })
    },
    async roleDelete(id) {
      const comfirmRusult = await this.$confirm('此操作将永久删除该角色，是否继续？', '删除角色', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (comfirmRusult !== 'confirm') {
        return this.$message.info('已取消该删除操作')
      }
      const { data: res } = await this.$api.axios.delete('/roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('该用户删除失败')
      }
      this.$message.success('该用户已经删除')
      this.getRolesList()
    },
    async showSetRightDialog(roles) {
      this.rolesId = roles.id
      const { data: res } = await this.$api.axios.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败')
      }
      this.rightsList = res.data
      this.getLeafKeys(roles, this.defKeys)
      this.setRightDialogVisible = true
    },
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    setRightDialogVisibleClosed() {
      this.defKeys = []
    },
    async allotRights() {
      const { treeRef } = this.$refs
      const keys = [...treeRef.getCheckedKeys(), ...treeRef.getHalfCheckedKeys()]
      const idStr = keys.join(',')
      const { data: res } = await this.$api.axios.post(`roles/${this.rolesId}/rights`, {
        rids: idStr
      })
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功！')
      this.getRolesList()
      this.setRightDialogVisible = false
    },
    async removeRightById(roles, id) {
      const confirmResult = await this.$confirm('此操作将永久删除该文件，是否继续？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除!')
      }
      const { data: res } = await this.$api.axios.delete(`roles/${roles.id}/rights/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败!')
      }
      roles.children = res.data
    }
  }
}
</script>

<style lang="scss" scoped>
.el-table {
  margin-top: 15px;
}
.dialog-footer .el-button {
  letter-spacing: 2px;
}
</style>
