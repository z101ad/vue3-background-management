<template>
  <div class="rights">
    <Breadcrumb currentName="权限列表" prevName="权限管理" />
    <el-table :data="tableData" stripe border>
      <el-table-column type="index" label="#" />
      <el-table-column prop="authName" label="权限名称" />
      <el-table-column prop="path" label="路径" />
      <el-table-column prop="level" label="权限等级">
        <template #default="scope">
          <el-tag v-if="scope.row.level === '0'" size="large">一级</el-tag>
          <el-tag
            v-else-if="scope.row.level === '1'"
            type="success"
            size="large"
            >二级</el-tag
          >
          <el-tag v-else type="warning" size="large">三级</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Breadcrumb from "../../components/Breadcrumb.vue";
import { getRights } from "../../api";
import { ref, onMounted } from "vue";
export default {
  components: {
    Breadcrumb,
  },
  setup() {
    //表格数据
    const tableData = ref([]);
    onMounted(async () => {
      tableData.value = await getRights("list");
    });
    return {
      tableData,
    };
  },
};
</script>

<style scoped lang="less">
/deep/ .el-scrollbar__wrap {
  height: auto !important;
}
</style>