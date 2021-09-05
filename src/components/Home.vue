<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/manager.jpg" alt="" />
        <span>电商后台管理系统{{ isCollapse }}</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '61px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu unique-opened router background-color="#333744" :collapse="isCollapse" text-color="#fff" active-text-color="#409eff" :collapse-transition="false" :default-active="activePage">
          <el-submenu :index="menu.id + ''" v-for="menu in menuList" :key="menu.id">
            <template slot="title">
              <i :class="iconsObj[menu.id]"></i>
              <span slot="title">{{ menu.authName }}</span>
            </template>
            <el-menu-item :index="'/' + sunItem.path" v-for="sunItem in menu.children" :key="sunItem.id">{{ sunItem.authName }}</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main><router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'home',
  data() {
    return {
      menuList: [],
      iconsObj: {
        // 一级菜单的icon图标
        147: 'el-icon-magic-stick',
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false,
      welcome: {
        authName: '欢迎光临',
        id: 147,
        order: 1,
        path: '/welcome',
        children: [
          {
            authName: 'Welcome',
            id: 124,
            order: 1,
            path: 'welcome',
            children: []
          }
        ]
      }
    }
  },
  computed: {
    activePage() {
      return this.$route.path
    }
  },
  created() {
    this.getMenuList()
    console.log(this.$route)
  },
  methods: {
    logout() {
      sessionStorage.removeItem('token')
      this.$router.push('login')
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    async getMenuList() {
      const { data: res } = await this.$api.getMenuListApi()
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      res.data.unshift(this.welcome)
      this.menuList = res.data
      console.log('menus:  ', res)
    }
  }
}
</script>

<style lang="scss" scoped>
.home-container {
  height: 100%;
}
.el-main {
  background-color: #eaedf1;
}
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
  }
  img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }
}
span {
  margin-left: 15px;
}
.el-menu-item {
  text-align: center;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  text-align: center;
  line-height: 24px;
  color: #fff;
  letter-spacing: 0.2em;
  cursor: pointer;
}
.el-menu {
  .el-icon-magic-stick {
    width: 16px !important;
    height: 16px;
    margin-right: 0px;
    &::before {
      position: relative;
      top: -1px;
      left: -1px;
    }
  }
}
</style>
