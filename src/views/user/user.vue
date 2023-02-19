<template>
  <div class="user">
    <!-- 面包屑 -->
    <Breadcrumb currentName="用户列表" prevName="用户管理"/>
    <!-- 主体内容 -->
    <el-card class="box-card" style="width: 100%">
      <div class="header">
        <Search :params="userParams" @search="searchHandle" />
        <el-button type="primary" size="large" @click="dialogVisible = true"
          >添加用户</el-button
        >
      </div>
      <div class="main">
        <!-- 表格 -->
        <el-table :data="tableData.users" stripe border>
          <el-table-column
            type="index"
            :index="(userParams.pagenum - 1) * userParams.pagesize + 1"
            label="#"
          />
          <el-table-column prop="username" label="姓名" />
          <el-table-column prop="email" label="邮箱" />
          <el-table-column prop="mobile" label="手机" />
          <el-table-column prop="role_name" label="角色" />
          <el-table-column prop="mg_state" label="状态">
            <template #default="scope">
              <el-switch
                v-model="scope.row.mg_state"
                @change="changeState(scope.row)"
              ></el-switch>
            </template>
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
                @click="delUser(scope.row.id)"
              />
              <el-tooltip
                class="box-item"
                effect="dark"
                content="分配角色"
                placement="top"
              >
                <el-button
                  type="warning"
                  :icon="Setting"
                  circle
                  @click="roleHandle(scope.row)"
                />
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <Pagination :params="userParams" @paramsChange="paramsChange" />
      </div>
      <!-- 添加用户对话框 -->
      <el-dialog
        v-model="dialogVisible"
        title="添加用户"
        width="50%"
        center
        @close="handleClose"
      >
        <el-form
          :model="form"
          label-width="100px"
          ref="ruleFormRef"
          :rules="rules"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" placeholder="请输入密码" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" placeholder="请输入邮箱" />
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="form.mobile" placeholder="请输入手机号码" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button type="info" @click="dialogVisible = false">
              取消
            </el-button>
            <el-button @click="addUser" type="primary">确定</el-button>
          </span>
        </template>
      </el-dialog>

      <!-- 编辑用户对话框 -->
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
          ref="editRuleFormRef"
          :rules="editRules"
        >
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="editForm.username"
              placeholder="请输入用户名"
              disabled
            />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email" placeholder="请输入邮箱" />
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editForm.mobile" placeholder="请输入手机号码" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button type="info" @click="editDialogVisible = false">
              取消
            </el-button>
            <el-button @click="editUser" type="primary">保存</el-button>
          </span>
        </template>
      </el-dialog>

      <!-- 分配权限对话框 -->
      <el-dialog
        v-model="rolesDialogVisible"
        title="分配角色"
        width="50%"
        center
      >
        <el-form :model="roleUserForm" label-width="100px">
          <el-form-item label="当前用户" prop="username">
            <span>{{ roleUserForm.username }}</span>
          </el-form-item>
          <el-form-item label="当前角色" prop="role_name">
            <span>{{ roleUserForm.role_name }}</span>
          </el-form-item>
          <el-form-item label="分配角色">
            <el-select
              v-model="value"
              class="m-2"
              placeholder="请选择角色"
              size="large"
            >
              <el-option
                v-for="item in roleForm"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button type="info" @click="rolesDialogVisible = false">
              取消
            </el-button>
            <el-button @click="putRole" type="primary">确定</el-button>
          </span>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import Breadcrumb from "../../components/Breadcrumb.vue";
import Pagination from "../../components/Pagination.vue";
import Search from "../../components/Search.vue";
import { onMounted, reactive, ref } from "vue";
import { Edit, Delete, Setting } from "@element-plus/icons-vue";
import {
  getUsers,
  postUser,
  deleteUser,
  putUser,
  putState,
  putUserRole,
  getRoles,
} from "../../api";
import { ElMessage, ElMessageBox } from "element-plus";
export default {
  components: {
    Breadcrumb,
    Pagination,
    Search,
  },
  setup() {
    //请求用户数据

    //用户列表数据
    const tableData = reactive({
      users: [
        {
          username: "",
          email: "",
          mobile: "",
          mg_state: "",
          role_name: "",
        },
      ],
    });
    //请求用户参数
    const userParams = reactive({
      total: 1,
      query: "",
      pagenum: 1,
      pagesize: 5,
    });
    const getData = async () => {
      tableData.users = await getUsers(userParams);
      userParams.total = tableData.users.total;
      tableData.users = tableData.users.users;
    };
    onMounted(async () => {
      await getData();
    });

    //添加用户表单
    const form = reactive({
      username: "",
      password: "",
      email: "",
      mobile: "",
    });
    //添加用户表单对象
    const ruleFormRef = ref(null);
    //添加用户对话框标识
    const dialogVisible = ref(false);
    //添加用户函数
    const addUser = () => {
      //通过ref的值触发验证
      ruleFormRef.value.validate(async (valid) => {
        if (valid) {
          //触发成功验证表单，调用接口；
          const res = await postUser(form);
          if (res) {
            tableData.users.push(res);
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
      });
    };
    //关闭对话框处理
    const handleClose = () => {
      ruleFormRef.value.resetFields();
    };
    // 自定义邮箱规则
    const checkEmail = (rule, value, callback) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/;
      if (regEmail.test(value)) {
        // 合法邮箱
        return callback();
      }
      callback(new Error("请输入合法邮箱"));
    };
    // 自定义手机号规则
    const checkMobile = (rule, value, callback) => {
      const regMobile = /^1[34578]\d{9}$/;
      if (regMobile.test(value)) {
        return callback();
      }
      // 返回一个错误提示
      callback(new Error("请输入合法的手机号码"));
    };
    //表单验证规则
    const rules = {
      username: [
        { required: true, message: "请输入用户名", trigger: "blur" },
        {
          min: 2,
          max: 10,
          message: "用户名的长度在2～10个字",
          trigger: "blur",
        },
      ],
      password: [
        { required: true, message: "请输入用户密码", trigger: "blur" },
        {
          min: 6,
          max: 18,
          message: "用户密码的长度在6～18个字",
          trigger: "blur",
        },
      ],
      email: [
        { required: true, message: "请输入邮箱", trigger: "blur" },
        { validator: checkEmail, trigger: "blur" },
      ],
      mobile: [
        { required: true, message: "请输入手机号码", trigger: "blur" },
        { validator: checkMobile, trigger: "blur" },
      ],
    };

    //删除用户
    const delUser = (id) => {
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
          await deleteUser(id);
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

    //编辑用户
    //编辑用户表单
    const editForm = ref({
      username: "",
      email: "",
      mobile: "",
    });
    //添加用户表单对象
    const editRuleFormRef = ref(null);
    //添加用户对话框标识
    const editDialogVisible = ref(false);
    //打开编辑对话框
    const editDialog = (row) => {
      editDialogVisible.value = true;
      editForm.value = row;
    };
    //编辑用户函数
    const editUser = () => {
      //通过ref的值触发验证
      editRuleFormRef.value.validate(async (valid) => {
        if (valid) {
          //触发成功验证表单，调用接口；
          const res = await putUser(editForm.value.id, editForm.value);
          if (res) {
            const index = tableData.users.findIndex(
              (item) => item.id === res.id
            );
            tableData.users[index] = {
              ...tableData.users[index],
              mobile: res.mobile,
              email: res.email,
            };
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
    //关闭对话框处理
    const editHandleClose = () => {
      editRuleFormRef.value.resetFields();
    };
    //编辑表单验证规则
    const editRules = {
      username: [
        { required: true, message: "请输入用户名", trigger: "blur" },
        {
          min: 2,
          max: 10,
          message: "用户名的长度在2～10个字",
          trigger: "blur",
        },
      ],
      email: [
        { required: true, message: "请输入邮箱", trigger: "blur" },
        { validator: checkEmail, trigger: "blur" },
      ],
      mobile: [
        { required: true, message: "请输入手机号码", trigger: "blur" },
        { validator: checkMobile, trigger: "blur" },
      ],
    };

    //搜索用户
    //搜索事件
    const searchHandle = async () => {
      await getData();
    };

    //修改用户状态
    const changeState = async (row) => {
      const res = await putState(row.id, row.mg_state);
      if (res) {
        tableData.users.forEach((user) => {
          if (user.id === row.id) user.mg_state = row.mg_state;
        });
        ElMessage({
          type: "success",
          message: "修改成功",
        });
      } else {
        ElMessage({
          type: "error",
          message: "修改失败",
        });
      }
    };

    //分配权限
    //分配权限对话框标识
    const rolesDialogVisible = ref(false);
    //分配权限角色列表
    const roleForm = ref([]);
    //当前用户信息
    const roleUserForm = ref(null);
    //选择器绑定
    const value = ref("");
    //获取角色列表
    onMounted(async () => {
      roleForm.value = await getRoles();
      roleForm.value = roleForm.value.map((item) => {
        return { value: item.id, label: item.roleName };
      });
    });
    //打开分配权限对话框
    const roleHandle = (row) => {
      rolesDialogVisible.value = true;
      roleUserForm.value = row;
    };
    //确认分配权限
    const putRole = async () => {
      const res = await putUserRole(roleUserForm.value.id, value.value);
      if (res) {
        await getData();
        ElMessage({
          type: "success",
          message: "分配成功",
        });
      } else {
        ElMessage({
          type: "error",
          message: "分配失败",
        });
      }
      value.value = "";
      rolesDialogVisible.value = false;
    };

    //分页器
    //数量或当前页改变触发
    const paramsChange = async () => {
      await getData();
    };
    return {
      dialogVisible,
      form,
      handleClose,
      rules,
      addUser,
      ruleFormRef,
      Search,
      tableData,
      Edit,
      Delete,
      Setting,
      changeState,
      userParams,
      delUser,
      editRuleFormRef,
      editDialogVisible,
      editUser,
      editHandleClose,
      editRules,
      editForm,
      editDialog,
      searchHandle,
      rolesDialogVisible,
      roleForm,
      roleUserForm,
      roleHandle,
      value,
      putRole,
      paramsChange,
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

/deep/ .el-scrollbar__wrap {
  height: auto !important;
}
.user {
  width: 100%;
}
.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

.box-card {
  width: 480px;
}
</style>