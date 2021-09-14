<template>
  <div>
    <breadcrumb :breadcrumbTitleArray="['商品管理', '商品列表']" />
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            @clear="getGoodsList"
            clearable
            v-model="queryInfo.query"
            @keyup.enter.native="getGoodsList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="$router.push('goods/add')">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- table区域 -->
      <el-row>
        <el-table :data="goodsList" border style="width: 100%">
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="goods_name" label="商品名称"></el-table-column>
          <el-table-column prop="goods_price" label="价格(元)" width="110px"></el-table-column>
          <el-table-column prop="goods_weight" label="商品重量" width="130px"></el-table-column>
          <el-table-column label="创建时间" width="220px">
            <template v-slot="scope">
              {{ scope.row.add_time | dateFormat }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150px">
            <template v-slot="{ row: { goods_id } }">
              <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click="removeById(goods_id)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[7, 11, 15, 19]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import Breadcrumb from '../content/Breadcrumb.vue'
export default {
  name: 'GoodsList',
  components: { Breadcrumb },
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 7
      },
      goodsList: [],
      total: 0
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$api.axios.get('goods', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败！')
      }
      this.$message.success('获取商品列表成功')
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    // todo
    async removeById(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该文件，是否继续？', '删除', {
        confirmButtonText: '确定',
        cancleButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('删除操作已取消!')
      }
      const { data: res } = await this.$api.axios.delete('/goods/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败！')
      }
      this.$message.success('删除成功！')
      this.getGoodsList()
    },
    handleSizeChange(pagesize) {
      this.queryInfo.pagesize = pagesize
      this.getGoodsList()
    },
    handleCurrentChange(pagenum) {
      this.queryInfo.pagenum = pagenum
      this.getGoodsList()
    }
  }
}
</script>

<style lang="scss" scoped>
.el-table {
  margin: 15px 0 0;
}
</style>
