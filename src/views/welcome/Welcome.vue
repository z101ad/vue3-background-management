<template>
  <div class="welcome">
    <!-- 挂载元素 -->
    <div class="echarts" style="width: 1000px; height: 600px"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { onMounted } from "vue";
export default {
  setup() {
    onMounted(() => {
      const myChart = echarts.init(document.querySelector(".echarts"));
      const options = {
        legend: {},
        tooltip: {
          trigger: "axis",
          showContent: false,
        },
        dataset: {
          source: [
            ["product", "2017", "2018", "2019", "2020", "2021", "2022"],
            ["Matcha Latte", 41.1, 30.4, 65.1, 53.3, 83.8, 98.7],
            ["Milk Tea", 86.5, 92.1, 85.7, 83.1, 73.4, 55.1],
            ["Cheese Cocoa", 24.1, 67.2, 79.5, 86.4, 65.2, 82.5],
            ["Walnut Brownie", 55.2, 67.1, 69.2, 72.4, 53.9, 39.1],
          ],
        },
        xAxis: { type: "category" },
        yAxis: { gridIndex: 0 },
        grid: { top: "55%" },
        series: [
          { type: "line", smooth: true, seriesLayoutBy: "row" },
          { type: "line", smooth: true, seriesLayoutBy: "row" },
          { type: "line", smooth: true, seriesLayoutBy: "row" },
          { type: "line", smooth: true, seriesLayoutBy: "row" },
          {
            type: "pie",
            id: "pie",
            radius: "30%",
            center: ["50%", "25%"],
            label: {
              formatter: "{b}: {@2017} ({d}%)",
            },
            encode: {
              itemName: "product",
              value: "2017",
              tooltip: "2017",
            },
          },
        ],
      };
      myChart.on("updateAxisPointer", function (event) {
        var xAxisInfo = event.axesInfo[0];
        if (xAxisInfo) {
          var dimension = xAxisInfo.value + 1;
          myChart.setOption({
            series: {
              id: "pie",
              label: {
                formatter: "{b}: {@[" + dimension + "]} ({d}%)",
              },
              encode: {
                value: dimension,
                tooltip: dimension,
              },
            },
          });
        }
      });
      // 数据合并
      //  const result = _.merge(res.data, this.options)
      // 5.展示数据
      myChart.setOption(options);
    });
  },
};
</script>
