<template>
  <div class="params">
    <!-- 面包屑 -->
    <Breadcrumb currentName="分类参数" prevName="商品管理" />
    <el-card class="box-card" style="width: 100%">
      <!-- 提示标题 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
        :closable="false"
      />
      <!-- 选择商品分类 -->
      <div class="btn">
        <div class="title">选择商品分类：</div>
        <el-cascader
          v-model="selectParam"
          :options="cates"
          :props="props"
          @change="handleChange"
          placeholder="未选择"
        />
      </div>
      <!-- 标签页 -->
      <el-tabs v-model="active" class="demo-tabs" @tab-change="changeTab">
        <el-tab-pane label="动态参数" name="动态参数"></el-tab-pane>
        <el-tab-pane label="静态属性" name="静态属性"></el-tab-pane>
      </el-tabs>
      <!-- 内容 -->
      <div class="content">
        <!-- 添加参数 -->
        <el-button
          type="primary"
          size="small"
          @click="dialogVisible = true"
          :disabled="selectParam.length === 0"
          >{{ active === "动态参数" ? "添加参数" : "添加属性" }}</el-button
        >
        <!-- 表格 -->
        <el-table
          :data="tableData"
          stripe
          border
          row-key="attr_id"
          :expand-row-keys="expands"
          @expand-change="toggleRowExpansion"
        >
          <el-table-column type="expand">
            <template #default="props">
              <!-- 展开行 -->
              <template v-if="props.row.attr_vals !== ''">
                <el-tag
                  v-for="(item, i) in props.row.attr_vals.split(',')"
                  :key="i"
                  size="large"
                  closable
                  @close="removeTag(item, props.row)"
                  >{{ item }}</el-tag
                >
              </template>
              <el-input
                v-if="inputVisible"
                ref="inputRef"
                v-model="input"
                class="ml-1 w-20 new-tag"
                size="large"
                @keyup.enter="handleInputConfirm(props.row)"
                @blur="handleInputConfirm"
              />
              <el-button v-else class="button-new-tag ml-1" @click="showInput">
                + New Tag
              </el-button>
            </template>
          </el-table-column>
          <el-table-column type="index" label="#" />
          <el-table-column prop="attr_name" label="参数名称" />
          <el-table-column label="操作">
            <template #default="scope">
              <el-button type="primary" @click="editDialog(scope.row)"
                ><el-icon class="el-icon--left"><Edit /></el-icon
                >编辑</el-button
              >
              <el-button type="danger" @click="delParam(scope.row.attr_id)"
                ><el-icon class="el-icon--left"><Delete /></el-icon
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <!-- 添加对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="'添加' + active"
      width="50%"
      center
      @close="handleClose"
    >
      <el-form
        :model="paramsForm"
        label-width="100px"
        ref="paramFormRef"
        :rules="rules"
      >
        <el-form-item :label="active" prop="attr_name">
          <el-input
            v-model="paramsForm.attr_name"
            :placeholder="'请输入' + active"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="info" @click="dialogVisible = false">
            取消
          </el-button>
          <el-button @click="addParam" type="primary">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      :title="'编辑' + active"
      width="50%"
      center
      @close="editHandleClose"
    >
      <el-form
        :model="editParamsForm"
        label-width="100px"
        ref="editParamFormRef"
        :rules="rules"
      >
        <el-form-item :label="active" prop="attr_name">
          <el-input
            v-model="editParamsForm.attr_name"
            :placeholder="'请输入' + active"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="info" @click="editDialogVisible = false">
            取消
          </el-button>
          <el-button @click="editParam" type="primary">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from "../../components/Breadcrumb.vue";
import {
  getGoodsCategory,
  postParam,
  getGoodParams,
  putParam,
  deleteParam,
} from "../../api";
import { ref, onMounted, computed, watch, nextTick } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
export default {
  components: {
    Breadcrumb,
  },
  setup() {
    //选择的分类
    const selectParam = ref([]);
    //所有商品分类
    const cates = ref([]);
    //获取所有商品分类
    onMounted(async () => {
      cates.value = await getGoodsCategory();
    });
    //多级选择框的配置
    const props = {
      value: "cat_id",
      label: "cat_name",
      expandTrigger: "hover",
    };
    //参数类型
    const type = computed(() => {
      return active.value === "动态参数" ? "many" : "only";
    });
    //多级选择框改变
    const handleChange = async () => {
      tableData.value = await getGoodParams(selectParam.value[2], type.value);
    };
    //标签页标识
    const active = ref("动态参数");
    //标签页改变
    const changeTab = async () => {
      if (active.value === "动态参数" && selectParam.value.length === 3) {
        tableData.value = await getGoodParams(selectParam.value[2], type.value);
      } else if (
        active.value === "静态属性" &&
        selectParam.value.length === 3
      ) {
        tableData.value = await getGoodParams(selectParam.value[2], type.value);
      }
    };
    //表格数据
    const tableData = ref([]);
    //添加参数对话框
    const dialogVisible = ref(false);
    //添加参数表单
    const paramsForm = ref({ attr_name: "", attr_sel: type.value });
    watch(type, () => {
      paramsForm.value.attr_sel = type.value;
    });
    //添加表单对象
    const paramFormRef = ref();
    //表单验证规则
    const rules = {
      attr_name: [
        {
          required: true,
          message: "请输入内容",
          trigger: "blur",
        },
      ],
    };
    //添加参数
    const addParam = () => {
      paramFormRef.value.validate(async (val) => {
        if (val) {
          const res = await postParam(selectParam.value[2], paramsForm.value);
          if (res) {
            tableData.value.push(res);
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
    //关闭前清空内容
    const handleClose = () => {
      paramsForm.value = { attr_name: "", attr_sel: type.value };
    };

    //编辑参数对话框
    const editDialogVisible = ref(false);
    //编辑参数表单
    const editParamsForm = ref({ attr_name: "", attr_sel: type.value });
    //编辑表单对象
    const editParamFormRef = ref();
    //打开对话框
    const editDialog = (row) => {
      editDialogVisible.value = true;
      editParamsForm.value = row;
    };

    //确定保存
    const editParam = () => {
      editParamFormRef.value.validate(async (val) => {
        if (val) {
          const res = await putParam(
            selectParam.value[2],
            editParamsForm.value.attr_id,
            editParamsForm.value
          );
          if (res) {
            tableData.value = await getGoodParams(
              selectParam.value[2],
              type.value
            );
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
    //关闭时清空
    const editHandleClose = () => {
      editParamsForm.value = ref({ attr_name: "", attr_sel: type.value });
    };

    //删除参数
    const delParam = (id) => {
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
          await deleteParam(selectParam.value[2], id);
          tableData.value = await getGoodParams(
            selectParam.value[2],
            type.value
          );
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

    //删除标签
    const removeTag = async (item, row) => {
      row.attr_vals = row.attr_vals
        .split(",")
        .filter((it) => it !== item)
        .join(",");
      const res = await putParam(selectParam.value[2], row.attr_id, row);
      if (res) {
        tableData.value = await getGoodParams(selectParam.value[2], type.value);
        ElMessage({
          type: "success",
          message: "删除成功",
        });
      } else {
        ElMessage({
          type: "error",
          message: "删除失败",
        });
      }
    };

    //新建标签内容
    const input = ref("");
    //输入框标识
    const inputVisible = ref(false);
    //输入框对象
    const inputRef = ref();
    //编辑标签内容
    const showInput = () => {
      inputVisible.value = true;
      nextTick(() => {
        inputRef.value.focus();
      });
    };
    //添加标签内容
    const handleInputConfirm = async (row) => {
      if (input.value.trim()) {
        row.attr_vals
          ? (row.attr_vals += "," + input.value.trim())
          : (row.attr_vals += input.value.trim());

        const res = await putParam(selectParam.value[2], row.attr_id, row);
        if (res) {
          tableData.value = await getGoodParams(
            selectParam.value[2],
            type.value
          );
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
      inputVisible.value = false;
      input.value = "";
    };

    //默认展开
    const expands = ref([]);
    //只展开一个展开行
    const toggleRowExpansion = (row, expandedRows) => {
      // 点击先清空数组 全部合起来
      expands.value = [];
      console.log(row, expandedRows);
      if (expandedRows.length > 0) {
        // ture 代表之前是合起状态 现在要展开起来
        expands.value.push(String(row.attr_id));
      } else {
        // false 代表要合起来，
        expands.value = [];
      }
    };
    return {
      selectParam,
      cates,
      props,
      handleChange,
      changeTab,
      active,
      dialogVisible,
      paramsForm,
      paramFormRef,
      addParam,
      tableData,
      editDialog,
      rules,
      handleClose,
      editDialogVisible,
      editParamsForm,
      editParamFormRef,
      editParam,
      editHandleClose,
      delParam,
      removeTag,
      input,
      showInput,
      handleInputConfirm,
      inputVisible,
      inputRef,
      toggleRowExpansion,
      expands,
    };
  },
};
</script>

<style scoped lang="less">
.btn {
  display: flex;
  align-items: center;
  margin: 15px 0;
  .title {
    margin-right: 10px;
  }
  /deep/ .el-input__inner {
    height: 40px;
  }
}
.el-form {
  .el-input {
    height: 40px;
  }
}
.el-tag {
  margin-right: 10px;
  margin-bottom: 10px;
}
.el-table {
  .new-tag {
    width: 100px;
  }
}

/deep/ .el-scrollbar__wrap {
  height: auto !important;
}
</style>