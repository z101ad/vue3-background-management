<template>
  <div class="report">
    <!-- 面包屑 -->
    <Breadcrumb currentName="数据报表" prevName="数据统计" />
    <el-card class="box-card" style="width: 100%">
      <!-- 图表 -->
      <div class="echarts" style="width: 750px; height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
import Breadcrumb from "../../components/Breadcrumb.vue";
import { getReport } from "../../api";
import { onMounted, ref } from "vue";
import * as echarts from "echarts";
export default {
  components: {
    Breadcrumb,
  },
  setup() {
    //图标数据
    const data = ref({});
    onMounted(async () => {
      //图表对象
      const myChart = echarts.init(document.querySelector(".echarts"));
      data.value = await getReport();
      console.log(data.value);
      const option = {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
            type: "category",
            data: ["2018", "2019", "2020", "2021", "2022"],
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
      };
      //合并数据
      const result = { ...data.value, ...option };
      console.log(result);
      myChart.setOption(result);
    });
  },
};
</script>

<style>
</style>