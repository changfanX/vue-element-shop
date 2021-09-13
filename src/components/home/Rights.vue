<template>
  <div>
    <Breadcrumb :breadcrumbTitleArray="['权限管理', '权限列表']" />
    <el-card>
      <el-table :data="rightsList" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column label="权限等级">
          <template v-slot="{ row: { level } }">
            <el-tag v-if="level === '0'">一级</el-tag>
            <el-tag type="success" v-if="level === '1'">二级</el-tag>
            <el-tag type="warning" v-if="level === '2'">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import Breadcrumb from '../content/Breadcrumb.vue'
export default {
  name: 'Rights',
  components: { Breadcrumb },
  data() {
    return {
      rightsList: []
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    async getRightsList() {
      const { data: res } = await this.$api.axios.get('rights/list')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败')
      }
      this.rightsList = res.data
      console.log(this.rightsList)
    }
  }
}
</script>

<style lang="scss" scoped></style>
