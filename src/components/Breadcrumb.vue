<template>
  <div class="breadcrumb">
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{prevName}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ currentName }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
import { ArrowRight } from "@element-plus/icons-vue";
export default {
  props: {
    prevName:String,
    currentName: String,
  },
  setup(props) {
    return {
      ArrowRight,
      currentName: props.currentName,
    };
  },
};
</script>

<style scoped>
.breadcrumb .el-breadcrumb {
  font-size: 12px;
}
</style>