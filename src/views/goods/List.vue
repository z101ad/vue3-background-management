<template>
  <div class="list">
    <!-- 面包屑 -->
    <Breadcrumb currentName="商品列表" prevName="商品管理" />
    <el-card class="box-card" style="width: 100%">
      <!-- 头部 -->
      <div class="header">
        <Search :params="goodParams" @search="getData" />
        <el-button type="primary" size="large" @click="gotoAddPage"
          >添加商品</el-button
        >
      </div>
      <!-- 主体内容 -->
      <div class="main">
        <!-- 表格 -->
        <el-table :data="tableData.goods" stripe border>
          <el-table-column
            type="index"
            :index="(goodParams.pagenum - 1) * goodParams.pagesize + 1"
            label="#"
          />
          <el-table-column prop="goods_name" label="商品名称" />
          <el-table-column prop="goods_price" label="商品价格(元)" />
          <el-table-column prop="goods_weight" label="商品重量" />
          <el-table-column prop="goods_number" label="商品数量" />
          <el-table-column prop="add_time" label="创建时间">
            <template #default="scope">{{
              formatDate(scope.row.add_time)
            }}</template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button
                type="primary"
                :icon="Edit"
                circle
                @click="editDialog(scope.row)"
              />
              <el-button
                type="danger"
                :icon="Delete"
                circle
                @click="delGood(scope.row.goods_id)"
              />
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <Pagination :params="goodParams" @paramsChange="getData" />
        <!-- 编辑商品对话框 -->
        <el-dialog
          v-model="editDialogVisible"
          title="编辑用户"
          width="50%"
          center
          @close="editHandleClose"
        >
          <el-form
            :model="editForm"
            label-width="100px"
            ref="editFormRef"
            :rules="rules"
          >
            <el-form-item label="商品名称" prop="goods_name">
              <el-input
                v-model="editForm.goods_name"
                placeholder="请输入商品名称"
              />
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input
                v-model="editForm.goods_price"
                placeholder="请输入商品价格"
              />
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input
                v-model="editForm.goods_weight"
                placeholder="请输入商品重量"
              />
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input
                v-model="editForm.goods_number"
                placeholder="请输入商品数量"
              />
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button type="info" @click="editDialogVisible = false">
                取消
              </el-button>
              <el-button @click="editGood" type="primary">保存</el-button>
            </span>
          </template>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script>
import { onMounted, ref, watch } from "vue";
import Breadcrumb from "../../components/Breadcrumb.vue";
import Search from "../../components/Search.vue";
import Pagination from "../../components/Pagination.vue";
import { Edit, Delete } from "@element-plus/icons-vue";
import { getGoods, putGood, deleteGood } from "../../api";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import formatDate from "../../util/formatDate";
export default {
  components: {
    Breadcrumb,
    Search,
    Pagination,
  },
  setup() {
    //请求商品列表参数
    const goodParams = ref({ total: 0, query: "", pagenum: 1, pagesize: 10 });
    //商品列表数据
    const tableData = ref([]);
    //获取所有商品
    const getData = async () => {
      tableData.value = await getGoods(goodParams.value);
      goodParams.value.total = tableData.value.total;
    };
    //监听total变化
    watch(
      () => goodParams.value.total,
      () => {
        //删除搜索关键字后，重新返回第一页
        goodParams.value.pagenum = 1;
      }
    );
    onMounted(async () => {
      await getData();
    });
    //获取路由对象
    const router = useRouter();
    //跳转添加商品页面
    const gotoAddPage = () => {
      router.push("/goods/add");
    };
    //编辑表单数据
    const editForm = ref({
      goods_name: "",
      goods_price: "",
      goods_weight: "",
      goods_number: "",
    });
    //编辑表单规则
    const rules = {
      goods_name: [
        {
          required: true,
          message: "请输入商品名称",
          trigger: "blur",
        },
      ],
      goods_price: [
        {
          required: true,
          message: "请输入商品价格",
          trigger: "blur",
        },
      ],
      goods_weight: [
        {
          required: true,
          message: "请输入商品重量",
          trigger: "blur",
        },
      ],
      goods_number: [
        {
          required: true,
          message: "请输入商品数量",
          trigger: "blur",
        },
      ],
    };
    //编辑表单对象
    const editFormRef = ref(null);
    //编辑表单标识
    const editDialogVisible = ref(false);
    //打开编辑页面
    const editDialog = (row) => {
      editForm.value = row;
      editDialogVisible.value = true;
    };
    //保存编辑
    const editGood = () => {
      editFormRef.value.validate(async (val) => {
        if (val) {
          const res = await putGood(editForm.value.goods_id, editForm.value);
          if (res) {
            await getData();
            ElMessage({
              type: "success",
              message: "保存成功",
            });
          } else {
            ElMessage({
              type: "error",
              message: "保存失败",
            });
          }
        }
      });
      editDialogVisible.value = false;
    };

    //删除商品
    const delGood = (id) => {
      //确认消息对话框
      ElMessageBox.confirm(
        "该操作会永久删除数据，确认继续操作吗?",
        "删除商品",
        {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(async () => {
          await deleteGood(id);
          await getData();
          ElMessage({
            type: "success",
            message: "删除成功",
          });
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "取消删除",
          });
        });
    };
    return {
      tableData,
      goodParams,
      getData,
      Edit,
      Delete,
      gotoAddPage,
      editDialog,
      editGood,
      editDialogVisible,
      editFormRef,
      editForm,
      rules,
      delGood,
      formatDate,
    };
  },
};
</script>

<style scoped lang="less">
.el-form {
  .el-input {
    height: 40px;
  }
}
.header {
  display: flex;
}
.main {
  margin-top: 15px;
}

/deep/ .el-scrollbar__wrap {
  height: auto !important;
}
.list {
  width: 100%;
}
</style>