<template>
  <div class="cate">
    <!-- 面包屑 -->
    <Breadcrumb currentName="商品分类" prevName="商品管理" />
    <el-card class="box-card" style="width: 100%">
      <el-button type="primary" size="large" @click="dialogVisible = true"
        >添加分类</el-button
      >
      <!-- 表格 -->
      <vxe-table
        resizable
        border
        ref="xTree"
        :tree-config="treeProps"
        :edit-config="{ trigger: 'click', mode: 'row' }"
        :checkbox-config="{ labelField: 'id' }"
        :data="tableData"
      >
        <vxe-table-column
          type="seq"
          width="180"
          title="序号"
          tree-node
        ></vxe-table-column>
        <vxe-table-column field="cat_name" title="分类名称"></vxe-table-column>
        <vxe-table-column field="cat_deleted" title="是否有效">
          <template v-slot="scope">
            <el-icon
              v-if="scope.row.cat_deleted === false"
              style="color: lightgreen"
            >
              <SuccessFilled />
            </el-icon>
            <el-icon v-else style="color: lightcoral">
              <CircleCloseFilled />
            </el-icon>
          </template>
        </vxe-table-column>
        <vxe-table-column field="cat_level" title="排序">
          <template v-slot="scope">
            <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
            <el-tag v-else-if="scope.row.cat_level === 1" type="success"
              >二级</el-tag
            >
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </vxe-table-column>
        <vxe-table-column title="操作">
          <template v-slot="scope">
            <el-button
              type="primary"
              @click="editDialog(scope.row)"
              size="small"
              ><el-icon class="el-icon--left"><Edit /></el-icon>编辑</el-button
            >
            <el-button
              type="danger"
              @click="delCate(scope.row.cat_id)"
              size="small"
              ><el-icon class="el-icon--left"><Delete /></el-icon
              >删除</el-button
            >
          </template>
        </vxe-table-column>
      </vxe-table>
      <!-- 分页器 -->
      <Pagination :params="cateParams" @paramsChange="getData" />
    </el-card>
    <!-- 添加对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="'添加分类'"
      width="50%"
      center
      @close="handleClose"
    >
      <el-form
        :model="addForm"
        label-width="100px"
        ref="addFormRef"
        :rules="rules"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addForm.cat_name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectForm"
            :options="selectData"
            :props="props"
            placeholder="未选择"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="info" @click="dialogVisible = false">
            取消
          </el-button>
          <el-button @click="addCate" type="primary">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      :title="'编辑分类'"
      width="50%"
      center
    >
      <el-form
        :model="editForm"
        label-width="100px"
        ref="editFormRef"
        :rules="rules"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editForm.cat_name" placeholder="请输入分类名称" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="info" @click="editDialogVisible = false">
            取消
          </el-button>
          <el-button @click="editCate" type="primary">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from "../../components/Breadcrumb.vue";
import Pagination from "../../components/Pagination.vue";
import {
  getGoodsCategory,
  addCategory,
  putCategory,
  deleteCategory,
} from "../../api";
import { onMounted, ref } from "vue";
import { SuccessFilled, CircleCloseFilled } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
export default {
  components: {
    Breadcrumb,
    Pagination,
  },
  setup() {
    //表格数据
    const tableData = ref([]);
    //多级选择器数据
    const selectData = ref([]);
    //获取分类请求参数
    const cateParams = ref({ total: 0, type: 3, pagenum: 1, pagesize: 5 });
    const getData = async () => {
      tableData.value = await getGoodsCategory(cateParams.value);
      cateParams.value.total = tableData.value.total;
      tableData.value = tableData.value.result;
    };
    onMounted(async () => {
      await getData();
      selectData.value = await getGoodsCategory({ type: 2 });
    });
    //多级选择器选择数据
    const selectForm = ref([]);
    //多级选择器配置
    const props = {
      value: "cat_id",
      label: "cat_name",
      expandTrigger: "hover",
      checkStrictly: true,
    };

    //添加对话框表单数据
    const addForm = ref({
      cat_name: "",
      cat_pid: 0,
      cat_level: 0,
    });
    //添加对话框标识
    const dialogVisible = ref(false);
    //添加对话框表单对象
    const addFormRef = ref();
    //表单验证规则
    const rules = {
      cat_name: [
        {
          required: true,
          message: "请输入分类名称",
          trigger: "blur",
        },
      ],
    };
    //添加分类
    const addCate = () => {
      addFormRef.value.validate(async (val) => {
        if (val) {
          if (selectForm.value.length > 0) {
            addForm.value.cat_level = selectForm.value.length;
            addForm.value.cat_pid =
              selectForm.value[selectForm.value.length - 1];
          }
          const res = await addCategory(addForm.value);
          if (res) {
            await getData();
            ElMessage({
              type: "success",
              message: "添加成功",
            });
          } else {
            ElMessage({
              type: "error",
              message: "添加失败",
            });
          }
        }
        dialogVisible.value = false;
      });
    };
    //关闭清空
    const handleClose = () => {
      addForm.value = {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0,
      };
      selectForm.value = [];
    };

    //编辑对话框表单数据
    const editForm = ref({});
    //编辑对话框标识
    const editDialogVisible = ref(false);
    //编辑对话框表单对象
    const editFormRef = ref();
    //打开编辑对话框
    const editDialog = (row) => {
      editDialogVisible.value = true;
      editForm.value = row;
    };
    //保存编辑
    const editCate = () => {
      editFormRef.value.validate(async (val) => {
        if (val) {
          const res = await putCategory(editForm.value.cat_id, {
            cat_name: editForm.value.cat_name,
          });
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
        editDialogVisible.value = false;
      });
    };
    //删除分类
    const delCate = async (id) => {
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
          await deleteCategory(id);
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
    //树形表格配置
    const treeProps = {
      children: "children",
      rowField: "id",
      parentField: "parentId",
      iconOpen: "vxe-icon-square-minus",
      iconClose: "vxe-icon-square-plus",
    };
    return {
      tableData,
      SuccessFilled,
      getData,
      cateParams,
      delCate,
      editDialog,
      CircleCloseFilled,
      dialogVisible,
      treeProps,
      editDialogVisible,
      addCate,
      editCate,
      editFormRef,
      addFormRef,
      addForm,
      selectForm,
      editForm,
      props,
      rules,
      selectData,
      handleClose,
    };
  },
};
</script>

<style scoped lang="less">
.vxe-table {
  margin-top: 20px;
}
.el-card {
  & > .el-button {
    margin-bottom: 15px;
  }
}
/deep/ .el-scrollbar__wrap {
  height: auto !important;
}
.el-form {
  .el-input,
  /deep/ .el-input__inner {
    height: 40px;
  }
}
</style>