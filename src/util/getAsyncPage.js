import { defineAsyncComponent } from "vue";
export default function (path) {
  //异步加载页面
  return defineAsyncComponent({
    loader: function () {
      const comp = import(`@/views/${path}/index.vue`);
      return comp;
    },
  });
}
