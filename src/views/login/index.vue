<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区 -->
      <div class="avatar_box">
        <img src="../../assets/logo.png" alt="avatar" />
      </div>
      <!-- 登录表单 -->
      <div class="login_form">
        <el-form
          :model="loginForm"
          status-icon
          :rules="rules"
          ref="loginFormRef"
        >
          <el-form-item
            label="账号"
            prop="username"
            class="item"
            label-width="60px"
          >
            <el-input v-model="loginForm.username" class="input"
              ><template #prefix>
                <el-icon class="el-input__icon" :size="16">
                  <User />
                </el-icon> </template
            ></el-input>
          </el-form-item>
          <el-form-item
            label="密码"
            prop="password"
            class="item"
            label-width="60px"
          >
            <el-input
              v-model="loginForm.password"
              class="input"
              type="password"
            >
              <template #prefix>
                <el-icon class="el-input__icon" :size="16"
                  ><GoodsFilled
                /></el-icon> </template
            ></el-input>
          </el-form-item>
          <el-form-item class="item">
            <div class="btns">
              <el-button type="primary" @click="login" :loading="loading"
                >登录</el-button
              >
              <el-button type="info" @click="resetLoginForm">重置</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, inject, ref } from "vue";
import { User, GoodsFilled } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
export default {
  setup() {
    //数据
    const store = inject("store");
    //路由对象
    const router = useRouter();
    //登录数据
    const loginForm = reactive({
      username: "",
      password: "",
    });
    //表单对象
    const loginFormRef = ref(null);
    //验证规则
    const rules = {
      username: [
        { required: true, message: "用户名不能为空", trigger: "blur" },
        {
          min: 2,
          max: 10,
          message: "长度在 2 到 10 个字符",
          trigger: "blur",
        },
      ],
      password: [
        { required: true, message: "请输入用户密码", trigger: "blur" },
        {
          min: 6,
          max: 18,
          message: "长度在 6 到 18 个字符",
          trigger: "blur",
        },
      ],
    };
    //登录函数
    const login = async () => {
      await store.loginUser(loginForm);
      if (store.state.user) {
        const redirect = sessionStorage.getItem("redirect") || "/";
        router.replace(redirect);
        ElMessage({
          message: "登录成功",
          type: "success",
          duration: 1000,
        });
      } else {
        ElMessage({
          message: "用户名或密码错误",
          type: "error",
          duration: 1000,
        });
        loginForm.username = loginForm.password = "";
      }
    };
    //重置函数
    const resetLoginForm = () => {
      loginForm.username = loginForm.password = "";
    };
    return {
      login,
      loginForm,
      resetLoginForm,
      User,
      GoodsFilled,
      loading: store.state.loading,
      rules,
      loginFormRef,
    };
  },
};
</script>

<style lang="less" scoped>
/* // lang="less" 支持less格式
// scoped vue的指令，只在当前组件生效 */
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 360px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;

  .avatar_box {
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.login_form {
  position: absolute;
  bottom: 60px;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  .item {
    width: 410px;
    margin: 0 auto;
    margin-bottom: 22px;
    .input {
      width: 350px;
      height: 40px;
      &::placeholder {
        padding: 0 15px 0 30px;
      }
    }
  }
}
.btns {
  margin: 0 auto;
  button {
    width: 70px;
    height: 40px;
  }
}
.info {
  font-size: 13px;
  margin: 10px 15px;
}
</style>