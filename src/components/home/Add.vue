<template>
  <div>
    <breadcrumb :breadcrumbTitleArray="['商品管理', '添加商品']" />
    <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon> </el-alert>
      <el-steps align-center :active="+activeIndex" finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-position="top"
        label-width="100px"
      >
        <el-tabs
          tab-position="left"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="{
                  expandTrigger: 'hover',
                  label: 'cat_name',
                  value: 'cat_id',
                  children: 'children'
                }"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id"
              ><el-checkbox-group v-model="addForm.checkedOptions">
                <el-checkbox border :label="item" v-for="(item, i) in item.attr_vals" :key="i">
                  {{ item }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"> </el-input
            ></el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload list-type="picture" :action="uploadURL">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4"> </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import Breadcrumb from '../content/Breadcrumb.vue'
import { goodsAddFormRulesMixin } from '../../common/mixin'
export default {
  name: 'Add',
  components: { Breadcrumb },
  mixins: [goodsAddFormRulesMixin],
  data() {
    return {
      addForm: {
        goods_name: '',
        godds_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: [],
        checkedOptions: []
      },
      activeIndex: '0',
      cateList: [],
      manyTableData: [],
      onlyTableData: [],
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload'
    }
  },
  created() {
    this.getCateList()
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$api.axios.get('/categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败！')
      }
      this.cateList = res.data
    },
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    beforeTabLeave(_, oldActiveName) {
      // if (
      //   (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) ||
      //   this.addForm.goods_name === ''
      // ) {
      //   this.$message.error('请先选择商品分类！ 或 填写商品名称')
      //   return false
      // }
    },
    async tabClicked() {
      if (this.activeIndex === '1') {
        const { data: res } = await this.$api.axios.get(`categories/${this.cateId}/attributes`, {
          params: { sel: 'many' }
        })
        if (res.meta.status !== 200) {
          return this.$message.error('获取动态列表失败！')
        }
        res.data.forEach(
          item => (item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(','))
        )
        this.manyTableData = res.data
      }
      if (this.activeIndex === '2') {
        const { data: res } = await this.$api.axios.get(`categories/${this.cateId}/attributes`, {
          params: { sel: 'only' }
        })
        if (res.meta.status !== 200) {
          return this.$message.error('获取静态列表失败！')
        }
        console.log(res.data)
        this.onlyTableData = res.data
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-steps {
  margin: 15px 0;
}
</style>
