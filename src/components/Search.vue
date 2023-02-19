<template>
  <el-input
    v-model="params.query"
    placeholder="请输入内容"
    class="input-with-select"
    clearable
    @clear="searchHandle"
    :style="{ width: width + '%' }"
  >
    <template #append>
      <el-button :icon="Search" @click="searchHandle" />
    </template>
  </el-input>
</template>


<script>
import { Search } from "@element-plus/icons-vue";
export default {
  props: {
    params: {
      type: Object,
      required: true,
    },
    width: {
      type: Number,
      default: 25,
    },
  },
  setup(props, ctx) {
    //搜索函数
    const searchHandle = () => {
      ctx.emit("search");
    };
    return {
      params: props.params,
      searchHandle,
      Search,
      width: props.width,
    };
  },
};
</script>
<style scoped lang="less">
.el-input {
  height: 40px;
  margin-right: 20px;
}
</style>
