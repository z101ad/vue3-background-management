<template>
  <div class="roles">
    <!-- 面包屑 -->
    <Breadcrumb currentName="角色列表" prevName="权限管理" />
    <el-card class="box-card" style="width: 100%">
      <!-- 头部 -->
      <div class="header">
        <el-button type="primary" size="large" @click="dialogVisible = true"
          >添加角色</el-button
        >
      </div>
      <!-- 主体内容 -->
      <div class="main">
        <!-- 表格 -->
        <el-table
          :data="tableData"
          stripe
          border
          row-key="id"
          :expand-row-keys="expands"
          @expand-change="toggleRowExpansion"
        >
          <el-table-column type="expand">
            <template #default="props">
              <!-- 展开行 -->
              <div class="right">
                <!-- 一级权限 -->
                <el-row v-for="item in props.row.children" :key="item.id">
                  <el-col :span="5" :class="item.children ? 'vcenter' : ''"
                    ><el-tag
                      size="large"
                      closable
                      @close="removeRight(item.id)"
                      >{{ item.authName }}</el-tag
                    ></el-col
                  >
                  <el-col :span="19">
                    <!-- 二级权限 -->
                    <el-row v-for="item1 in item.children" :key="item1.id">
                      <el-col :span="6" :class="item.children ? 'vcenter' : ''"
                        ><el-tag
                          size="large"
                          closable
                          type="success"
                          @close="removeRight(item1.id)"
                          >{{ item1.authName }}</el-tag
                        ></el-col
                      >
                      <el-col :span="18">
                        <!-- 三级权限 -->
                        <el-tag
                          size="large"
                          closable
                          type="warning"
                          v-for="item2 in item1.children"
                          :key="item2.id"
                          @close="removeRight(item2.id)"
                          >{{ item2.authName }}</el-tag
                        >
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </div>
            </template>
          </el-table-column>
          <el-table-column type="index" label="索引" width="55" />
          <el-table-column prop="roleName" label="角色名称" />
          <el-table-column prop="roleDesc" label="角色描述" />
          <el-table-column label="操作">
            <template #default="scope">
              <el-button
                type="primary"
                @click="editDialog(scope.row)"
                size="small"
                ><el-icon class="el-icon--left"><Edit /></el-icon
                >编辑</el-button
              >
              <el-button
                type="danger"
                @click="delRole(scope.row.id)"
                size="small"
                ><el-icon class="el-icon--left"><Delete /></el-icon
                >删除</el-button
              >
              <el-button
                type="warning"
                @click="rightsHandle(scope.row)"
                size="small"
                ><el-icon class="el-icon--left"><Setting /></el-icon
                >分配权限</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 添加角色对话框 -->
        <el-dialog v-model="dialogVisible" title="添加角色" width="50%" center>
          <el-form
            :model="form"
            label-width="100px"
            ref="ruleFormRef"
            :rules="rules"
          >
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="form.roleName" placeholder="请输入角色名称" />
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc">
              <el-input v-model="form.roleDesc" placeholder="请输入角色描述" />
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button type="info" @click="dialogVisible = false">
                取消
              </el-button>
              <el-button @click="addRole" type="primary">确定</el-button>
            </span>
          </template>
        </el-dialog>
        <!-- 编辑角色对话框 -->
        <el-dialog
          v-model="editDialogVisible"
          title="编辑角色"
          width="50%"
          center
        >
          <el-form
            :model="editForm"
            label-width="100px"
            ref="editRuleFormRef"
            :rules="rules"
          >
            <el-form-item label="角色名称" prop="roleName">
              <el-input
                v-model="editForm.roleName"
                placeholder="请输入角色名称"
              />
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc">
              <el-input
                v-model="editForm.roleDesc"
                placeholder="请输入角色描述"
              />
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button type="info" @click="editDialogVisible = false">
                取消
              </el-button>
              <el-button @click="editRole" type="primary">确定</el-button>
            </span>
          </template>
        </el-dialog>
        <!-- 分配权限对话框 -->
        <el-dialog
          v-model="rightsDialogVisible"
          title="分配权限"
          width="50%"
          center
        >
          <el-tree
            :data="rights"
            :props="treeProps"
            show-checkbox
            default-expand-all
            node-key="id"
            :default-checked-keys="rightsForm"
            ref="treeRef"
          />
          <template #footer>
            <span class="dialog-footer">
              <el-button type="info" @click="clearRights"> 取消 </el-button>
              <el-button @click="assignRights" type="primary">确定</el-button>
            </span>
          </template>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import Breadcrumb from "../../components/Breadcrumb.vue";
import {
  getRoles,
  postRole,
  putRole,
  deleteRole,
  getRights,
  postRight,
  deleteRight,
} from "../../api";
import { ElMessage, ElMessageBox } from "element-plus";
export default {
  components: {
    Breadcrumb,
  },
  setup() {
    //添加角色对话框标识
    const dialogVisible = ref(false);
    //列表数据
    const tableData = ref([]);
    onMounted(async () => {
      tableData.value = await getRoles();
    });
    //添加角色表单数据
    const form = ref({ roleName: "", roleDesc: "" });
    //表单对象
    const ruleFormRef = ref(null);
    //表单校验规则
    const rules = {
      roleName: [
        { required: true, message: "请输入角色名称", trigger: "blur" },
      ],
      roleDesc: [
        { required: true, message: "请输入角色描述", trigger: "blur" },
      ],
    };

    //添加角色
    const addRole = () => {
      ruleFormRef.value.validate(async (valid) => {
        if (valid) {
          // 通过验证;
          const res = await postRole(form.value);
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
          dialogVisible.value = false;
        }
        form.value = { roleName: "", roleDesc: "" };
      });
    };

    //编辑角色
    //编辑角色对话框标识
    const editDialogVisible = ref(false);
    //编辑角色表单数据
    const editForm = ref({ roleName: "", roleDesc: "" });
    //表单对象
    const editRuleFormRef = ref(null);
    //打开编辑对话框
    const editDialog = (row) => {
      editDialogVisible.value = true;
      editForm.value = row;
    };
    //确认修改
    const editRole = () => {
      editRuleFormRef.value.validate(async (valid) => {
        if (valid) {
          // 通过验证;
          const res = await putRole(editForm.value.id, editForm.value);
          if (res) {
            tableData.value = await getRoles();
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
          editDialogVisible.value = false;
        }
      });
    };

    //删除角色
    const delRole = (id) => {
      //确认消息对话框
      ElMessageBox.confirm(
        "该操作会永久删除数据，确认继续操作吗?",
        "删除用户",
        {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(async () => {
          await deleteRole(id);
          tableData.value = await getRoles();
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

    //所有权限数据
    const rights = ref([]);
    onMounted(async () => {
      rights.value = await getRights("tree");
    });
    //树形组件的对象
    const treeRef = ref();
    //默认选中表单数据
    const rightsForm = ref([]);
    //分配权限对话框标识
    const rightsDialogVisible = ref(false);
    //角色id
    let userId;
    //打开分配权限对话框
    const rightsHandle = (row) => {
      userId = row.id;
      rightsDialogVisible.value = true;
      rightsForm.value = getKeys(row.children);
      try {
        treeRef.value.setCheckedNodes(rightsForm.value);
      } catch (e) {
        console.log("vue3获取ref问题", e);
      }
    };
    //控件绑定对象
    const treeProps = {
      label: "authName",
      children: "children",
    };
    //获取选中的key值
    const getKeys = (arr, result = [], level = 0) => {
      arr.forEach((item) => {
        if (level === 2) {
          result.push(item.id);
        }
        if (item.children) {
          getKeys(item.children, result, level + 1);
        }
      });
      return result;
    };
    //清空上次权限表单
    const clearRights = () => {
      rightsDialogVisible.value = false;
      rightsForm.value = [];
    };
    //确认分配权限
    const assignRights = async () => {
      //所有半选或全选的id
      const keys = [
        ...treeRef.value.getCheckedKeys(),
        ...treeRef.value.getHalfCheckedKeys(),
      ];
      const rids = keys.join(",");
      await postRight(userId, { rids });
      tableData.value = await getRoles();
      ElMessage({
        type: "success",
        message: "授权成功",
      });
      rightsDialogVisible.value = false;
      rightsForm.value = [];
    };
    //默认展开
    const expands = ref([]);
    //只展开一个展开行
    const toggleRowExpansion = (row, expandedRows) => {
      // 点击先清空数组 全部合起来
      expands.value = [];
      if (expandedRows.length > 0) {
        // ture 代表之前是合起状态 现在要展开起来
        expands.value.push(String(row.id));
      } else {
        // false 代表要合起来，
        expands.value = [];
      }
    };
    //删除权限
    const removeRight = async (id) => {
      //确认消息对话框
      ElMessageBox.confirm(
        "该操作会永久删除数据，确认继续操作吗?",
        "删除权限",
        {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(async () => {
          const res = await deleteRight(expands.value[0], id);
          tableData.value.forEach((item) => {
            if (item.id === +expands.value[0]) {
              item.children = res;
            }
          });
          ElMessage({
            type: "success",
            message: "删除成功",
          });
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
      dialogVisible,
      tableData,
      form,
      ruleFormRef,
      rules,
      addRole,
      editDialog,
      editRuleFormRef,
      editDialogVisible,
      editRole,
      editForm,
      delRole,
      rightsDialogVisible,
      assignRights,
      rightsHandle,
      rightsForm,
      rights,
      treeProps,
      clearRights,
      treeRef,
      expands,
      toggleRowExpansion,
      removeRight,
    };
  },
};
</script>

<style scoped lang="less">
.main {
  margin-top: 15px;
  .el-form {
    .el-input {
      height: 40px;
    }
  }
  .el-table {
    .right {
      padding: 20px 60px;
      .el-row {
        .vcenter {
          display: flex;
          align-items: center;
          .el-tag::after {
            content: "\e620";
            position: absolute;
            font-family: "iconfont";
            font-size: 12px;
            transform: translateY(-50%) scale(0.6);
            right: -20px;
            color: #606266;
            top: 50%;
          }
        }
        .el-tag {
          position: relative;
          margin: 7px;
        }
      }
    }
  }
}
/deep/ .el-scrollbar__wrap {
  height: auto !important;
}
</style>