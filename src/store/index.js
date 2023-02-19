import { reactive, readonly } from "vue";
import { login } from "../api";
//数据仓库
const state = reactive({
  //用户信息
  user: null,
  //加载状态
  loading: false,
});
//只读数据
const stateRead = readonly(state);
export default function () {
  //登录
  const loginUser = async (form) => {
    state.loading = true;
    state.user = await login(form);
    if (state.user) {
      sessionStorage.setItem("token", state.user.token);
    }
    state.loading = false;
  };
  //退出
  const layout = () => {
    state.user = null;
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("redirect");
  };
  return {
    state: stateRead,
    loginUser,
    layout,
  };
}
