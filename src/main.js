import { createApp } from "vue";
import App from "./App.vue";
import "./index.css";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import route from "./router";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
// 导入字体图标
import "./assets/fonts/iconfont.css";
//表格树
import VXETable from "vxe-table";
import 'vxe-table/lib/style.css'

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.use(route);
app.use(ElementPlus);
app.use(VXETable);
app.mount("#app");
