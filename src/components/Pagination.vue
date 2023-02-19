<template>
  <div class="pagination">
    <el-pagination
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[5, 10, 15, 20]"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="params.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
export default {
  props: {
    params: {
      type: Object,
      required: true,
    },
  },
  setup(props,ctx) {
    //单页数量改变
    const handleSizeChange = (val) => {
      props.params.pagesize = val;
      ctx.emit("paramsChange")
    };
    //当前页改变
    const handleCurrentChange = (val) => {
      props.params.pagenum = val;
       ctx.emit("paramsChange")
    };
    return {
      params: props.params,
      handleSizeChange,
      handleCurrentChange,
    };
  },
};
</script>

<style>
</style>