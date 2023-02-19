<template>
  <div class="order">
    <!-- 面包屑 -->
    <Breadcrumb currentName="订单列表" prevName="订单管理"/>
    <el-card class="box-card" style="width: 100%">
      <!-- 搜索框 -->
      <Search :params="getParams" @search="getData" />
      <!-- 表格 -->
      <el-table :data="tableData" stripe border>
        <el-table-column
          type="index"
          :index="(getParams.pagenum - 1) * getParams.pagesize + 1"
          label="#"
        />
        <el-table-column prop="order_number" label="订单编号" />
        <el-table-column prop="order_price" label="订单价格" />
        <el-table-column prop="pay_status" label="是否付款">
          <template #default="scope">
            <el-tag
              class="ml-2"
              type="danger"
              v-if="scope.row.pay_status === '0'"
              >未付款</el-tag
            >
            <el-tag class="ml-2" type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" />
        <el-table-column prop="create_time" label="下单时间">
          <template #default="scope">{{
            formatDate(scope.row.create_time)
          }}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              type="primary"
              @click="editDialog(scope.row)"
              size="small"
              ><el-icon class="el-icon--left"><Edit /></el-icon
            ></el-button>
            <el-button type="success" @click="getLocation" size="small"
              ><el-icon class="el-icon--left"><Location /></el-icon
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <Pagination :params="getParams" @paramsChange="getData" />
    </el-card>
    <!-- 编辑对话框 -->
    <el-dialog v-model="editDialogVisible" :title="'修改地址'" width="50%">
      <el-form
        :model="editForm"
        label-width="100px"
        ref="editFormRef"
        :rules="rules"
      >
        <el-form-item label="省市区/县">
          <el-cascader
            v-model="editForm.address"
            :options="cityData"
            :props="{ expandTrigger: 'hover' }"
            placeholder="请选择"
          />
        </el-form-item>
        <el-form-item label="详细地址" prop="consignee_addr">
          <el-input
            v-model="editForm.consignee_addr"
            placeholder="请输入详细地址"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="info" @click="editDialogVisible = false">
            取消
          </el-button>
          <el-button @click="editOrder" type="primary">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 查看订单对话框 -->
    <el-dialog v-model="orderDialogVisible" :title="'查看物流信息'" width="50%">
      <!-- 时间线 -->
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
          >{{ activity.context }}</el-timeline-item
        >
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import Search from "../../components/Search.vue";
import Pagination from "../../components/Pagination.vue";
import { onMounted, ref } from "vue";
import { getOrders } from "../../api";
import formatDate from "../../util/formatDate";
import cityData from "./citydata.js";
import { ElMessage } from "element-plus";
import { kuaidi } from "./demo.js";
import Breadcrumb from "../../components/Breadcrumb.vue";
export default {
  components: {
    Search,
    Pagination,
    Breadcrumb
  },
  setup() {
    //请求参数
    const getParams = ref({ total: 0, query: "", pagenum: 1, pagesize: 5 });
    //表格数据
    const tableData = ref([]);
    //订单数据
    const progressInfo = ref([]);
    const getData = async () => {
      tableData.value = await getOrders(getParams.value);
      getParams.value.total = tableData.value.total;
      tableData.value = tableData.value.goods;
    };
    onMounted(async () => {
      await getData();
    });
    //修改对话框标识
    const editDialogVisible = ref(false);
    //修改地址对话框表单
    const editForm = ref({ consignee_addr: "", address: [] });
    //表单对象
    const editFormRef = ref();
    //表单验证规则
    const rules = {
      consignee_addr: [
        {
          required: true,
          message: "请输入详细地址",
          trigger: "blur",
        },
      ],
      address: [
        {
          required: true,
          message: "请输入省/市",
          trigger: "blur",
        },
      ],
    };
    //打开修改对话框
    const editDialog = () => {
      editDialogVisible.value = true;
    };
    //保存修改
    const editOrder = () => {
      editFormRef.value.validate((val) => {
        if (val) {
          editDialogVisible.value = false;
          ElMessage({
            type: "success",
            message: "修改成功",
          });
        }
      });
    };

    //订单详情标识
    const orderDialogVisible = ref(false);
    //打开修改对话框
    const getLocation = () => {
      orderDialogVisible.value = true;
      progressInfo.value = kuaidi.data;
    };

    return {
      getParams,
      getData,
      tableData,
      formatDate,
      editDialog,
      editDialogVisible,
      editOrder,
      editFormRef,
      editForm,
      cityData,
      getLocation,
      orderDialogVisible,
      progressInfo,
      rules,
    };
  },
};
</script>

<style scoped lang="less">
.el-table {
  margin-top: 15px;
  /deep/ .el-scrollbar__wrap {
    height: auto !important;
  }
}
</style>