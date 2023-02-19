<template>
  <div class="home">
    <!-- 布局 -->
    <el-container>
      <!-- 头部 -->
      <el-header>
        <!-- 标题 -->
        <a class="title" href="/welcome">
          <div class="logo">
            <img src="../../assets/logo.png" alt="logo" />
          </div>
          <div class="name">电商后台管理系统</div>
        </a>
        <!-- 退出按钮 -->
        <el-button type="info" @click="layout">退出</el-button>
      </el-header>
      <el-container>
        <!-- 侧边栏 -->
        <el-aside :width="!isOpen ? '200px' : '64px'">
          <!-- 展开收缩 -->
          <div class="toggle" @click="toggle">|||</div>
          <!-- 菜单栏 -->
          <el-menu
            router
            active-color="#2c6ef2"
            background-color="#333744"
            class="el-menu-vertical-demo"
            unique-opened
            :default-active="active"
            :collapse-transition="false"
            text-color="#fff"
            :collapse="isOpen"
            @select="selectHandle"
          >
            <el-sub-menu
              :index="item.id + ''"
              v-for="item in menus.menu"
              :key="item.id"
            >
              <template #title>
                <i :class="icons[item.id]"></i>
                <span>{{ item.authName }}</span>
              </template>
              <el-menu-item-group v-if="item.children.length > 0">
                <el-menu-item
                  v-for="item1 in item.children"
                  :key="item1.id"
                  :index="'/' + item1.path"
                  ><template #title>
                    <i :class="icons[item1.id]"></i>
                    <span>{{ item1.authName }}</span>
                  </template></el-menu-item
                >
              </el-menu-item-group>
            </el-sub-menu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { Switch, User } from "@element-plus/icons-vue";
import { reactive, onMounted, ref, inject, watch } from "vue";
import { useRouter } from "vue-router";
import { getMenus } from "../../api";
export default {
  setup() {
    //store
    const store = inject("store");
    //路由对象
    const router = useRouter();
    //菜单数据
    let menus = reactive({ menu: [] });
    //图标数据
    const icons = {
      125: "iconfont icon-user",
      103: "iconfont icon-xitongquanxian",
      101: "iconfont icon-shangpin-xianxing",
      102: "iconfont icon-dingdan",
      145: "iconfont icon-shuju01",
      110: "iconfont icon-user-fill",
      111: "iconfont icon-jiaoseliebiao",
      112: "iconfont icon-permissions-list",
      104: "iconfont icon-shangpinliebiao",
      115: "iconfont icon-chanpincanshu",
      121: "iconfont icon-shangpinfenlei",
      107: "iconfont icon-dingdanliebiao",
      146: "iconfont icon-yuanshuju-liebiaoshitu",
    };
    const isOpen = ref(false);
    onMounted(async () => {
      menus.menu = await getMenus();
      selectHandle();
    });
    //展开函数
    const toggle = () => {
      isOpen.value = !isOpen.value;
    };
    //退出函数
    const layout = async () => {
      await store.layout();
      if (!store.state.user) {
        router.replace("/login");
      }
    };
    //菜单激活样式函数
    const active = ref("");
    const selectHandle = () => {
      const path = location.pathname;
      if (path !== "/welcome") {
        active.value = path;
      } else {
        active.value = "";
      }
    };

    return {
      Switch,
      User,
      menus,
      icons,
      isOpen,
      toggle,
      layout,
      selectHandle,
      active,
    };
  },
};
</script>

<style scoped lang="less">
a {
  text-decoration: none;
}
.home {
  width: 100%;
  height: 100%;
  .el-container {
    height: 100%;
    .el-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 60px;
      padding: 0;
      background-color: #373f41;
      .title {
        display: flex;
        align-items: center;
        .logo {
          width: 40px;
          height: 40px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .name {
          font-size: 20px;
          color: #fff;
          margin-left: 15px;
        }
      }
      .el-button {
        width: 70px;
        height: 40px;
        margin-right: 20px;
      }
    }
    .el-aside {
      .toggle {
        width: 100%;
        height: 24px;
        background-color: #4a5064;
        line-height: 24px;
        color: #fff;
        text-align: center;
        font-size: 12px;
        letter-spacing: 0.2em;
      }
      .el-menu {
        height: calc(100% - 24px);
        border: 0;
        /deep/ .el-menu-item-group__title {
          padding: 0;
        }
      }
      i {
        margin-right: 10px;
      }
      .el-menu-item {
        background-color: #333744;
      }
    }
    .el-main {
      background-color: #eaedf1;
    }
  }
}
</style>