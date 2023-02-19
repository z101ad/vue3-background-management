<template>
  <div class="add">
    <!-- 面包屑 -->
    <Breadcrumb currentName="添加商品" prevName="商品管理" />
    <el-card class="box-card" style="width: 100%">
      <!-- 标题 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      />
      <!-- 步骤条 -->
      <el-steps :active="active" finish-status="success" align-center>
        <el-step title="基本信息" />
        <el-step title="商品参数" />
        <el-step title="商品属性" />
        <el-step title="商品图片" />
        <el-step title="商品内容" />
        <el-step title="完成" />
      </el-steps>
      <div class="main">
        <!-- 表单 -->
        <el-form :model="addForm" ref="addFormRef" :rules="rules">
          <!-- 标签页 -->
          <el-tabs
            tab-position="left"
            style="height: 200px"
            class="demo-tabs"
            @tab-click="changeTab"
            :before-leave="checkForm"
          >
            <el-tab-pane label="基本信息" name="0">
              <el-form-item label="商品名称" prop="goods_name">
                <el-input
                  width="100%"
                  v-model="addForm.goods_name"
                  placeholder="请输入商品名称"
                />
              </el-form-item>
              <el-form-item label="商品价格" prop="goods_price">
                <el-input
                  v-model="addForm.goods_price"
                  placeholder="请输入商品价格"
                  type="number"
                />
              </el-form-item>
              <el-form-item label="商品数量" prop="goods_number">
                <el-input
                  v-model="addForm.goods_number"
                  placeholder="请输入商品数量"
                  type="number"
                />
              </el-form-item>
              <el-form-item label="商品重量" prop="goods_weight">
                <el-input
                  v-model="addForm.goods_weight"
                  placeholder="请输入商品重量"
                  type="number"
                />
              </el-form-item>
              <el-form-item label="商品分类" prop="goods_cat">
                <el-cascader
                  v-model="addForm.goods_cat"
                  :options="cates"
                  :props="props"
                  @change="handleChange"
                  placeholder="未选择"
                />
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品参数" name="1">
              <!-- 商品参数 -->
              <el-form-item
                v-for="item in goodParams"
                :key="item.attr_id"
                :label="item.attr_name"
              >
                <!-- 复选框组 -->
                <el-checkbox-group
                  v-model="item.attrs"
                  @change="paramsChange($event, item.attr_id)"
                >
                  <el-checkbox
                    :label="cb"
                    v-for="(cb, i) in item.attr_vals.split(',')"
                    :key="i"
                    border
                  ></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品属性" name="2">
              <!-- 商品属性 -->
              <el-form-item
                :label="item.attr_name"
                v-for="item in goodAttrs"
                :key="item.attr_id"
              >
                <el-input v-model="item.attr_vals"></el-input>
              </el-form-item>
            </el-tab-pane>
            <!-- 商品图片 -->
            <el-tab-pane label="商品图片" name="3">
              <el-upload
                v-model:file-list="fileList"
                class="upload-demo"
                :action="uploadURL"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                list-type="picture"
                :headers="headers"
              >
                <el-button type="primary">上传图片</el-button>
                <template #tip>
                  <div class="el-upload__tip">jpg/png 文件最大为500kb</div>
                </template>
              </el-upload>
              <!-- 预览图片对话框 -->
              <el-dialog
                v-model="prevDialogVisible"
                title="图片预览"
                width="50%"
                center
              >
                <el-image :src="prevImageUrl" fit="contain" />
              </el-dialog>
            </el-tab-pane>
            <el-tab-pane label="商品内容" name="4">
              <div style="border: 1px solid #ccc">
                <Toolbar
                  style="border-bottom: 1px solid #ccc"
                  :editor="editorRef"
                  mode="default"
                />
                <Editor
                  style="height: 300px; overflow-y: hidden"
                  v-model="valueHtml"
                  :defaultConfig="editorConfig"
                  mode="default"
                  @onCreated="handleCreated"
                />
              </div>
              <el-button type="primary" size="large" @click="addGood"
                >添加商品</el-button
              >
            </el-tab-pane>
          </el-tabs>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import "@wangeditor/editor/dist/css/style.css"; // 引入 css
import Breadcrumb from "../../components/Breadcrumb.vue";
import { computed, onBeforeUnmount, onMounted, ref, shallowRef } from "vue";
import { getGoodsCategory, getGoodParams, postGood } from "../../api";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
export default {
  components: {
    Breadcrumb,
    Toolbar,
    Editor,
  },
  setup() {
    //步骤标识
    const active = ref(0);

    //添加商品表单
    const addForm = ref({
      goods_name: "",
      goods_price: 0,
      goods_number: 0,
      goods_weight: 0,
      goods_introduce: "",
      goods_cat: [],
      pics: [],
      attrs: [],
    });
    //表单对象
    const addFormRef = ref();
    //表单验证规则
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
      goods_number: [
        {
          required: true,
          message: "请输入商品数量",
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
      goods_cat: [
        {
          required: true,
          message: "请输入商品分类",
          trigger: "blur",
        },
      ],
    };
    //商品分类数据
    const cates = ref([]);
    //获取所有商品分类
    onMounted(async () => {
      cates.value = await getGoodsCategory();
    });
    //多级选择器配置
    const props = {
      value: "cat_id",
      label: "cat_name",
      expandTrigger: "hover",
    };
    //多级选择器改变
    const handleChange = () => {
      goodParams.value = [];
      goodAttrs.value = {};
    };
    //商品参数数据
    const goodParams = ref([]);
    //商品属性数据
    const goodAttrs = ref({});

    //离开标签页检验
    const checkForm = (activeValue, oldValue) => {
      if (active.value === +activeValue) return false;
      return addFormRef.value.validate((val) => {
        if (!val) {
          ElMessage({
            type: "error",
            message: "请填写必要信息",
          });
        }
        return val;
      });
    };
    //标签页改变
    const changeTab = async (e) => {
      active.value = +e.index;
      if (active.value === 1) {
        if (goodParams.value.length > 0) return;
        console.log(1);
        goodParams.value = await getGoodParams(
          addForm.value.goods_cat[2],
          "many"
        );
      } else if (active.value === 2) {
        if (Object.keys(goodAttrs.value).length > 0) return;
        goodAttrs.value = await getGoodParams(
          addForm.value.goods_cat[2],
          "only"
        );
      }
    };

    //多选框组绑定值改变
    const paramsChange = (val, id) => {
      addForm.value.attrs = [
        {
          attr_id: id,
          attr_value: val.join(","),
        },
      ];
    };

    //上传图片数据
    const fileList = ref([]);
    // 图片上传地址
    const uploadURL = "http://127.0.0.1:8888/api/private/v1/upload";
    //上传图片的请求头
    const headers = {
      Authorization: sessionStorage.getItem("token") || "",
    };
    //预览图片对话框标识
    const prevDialogVisible = ref(false);
    //预览图片url
    const prevImageUrl = ref("");
    //预览图片函数
    const handlePreview = (file) => {
      prevDialogVisible.value = true;
      prevImageUrl.value = file.url;
    };
    //删除图片函数
    const handleRemove = (file) => {
      addForm.value.pics = addForm.value.pics.filter(
        (item) => item.id !== file.uid
      );
    };
    //图片上传成功
    const handleSuccess = (res) => {
      const index = fileList.value.length - 1;
      addForm.value.pics.push({
        id: fileList.value[index].uid,
        pic: res.data.tmp_path,
      });
    };

    // 编辑器实例，必须用 shallowRef
    const editorRef = shallowRef();
    // 内容 HTML
    const valueHtml = ref("");
    //富文本编辑器的配置
    const editorConfig = { placeholder: "请输入内容..." };
    //创建富文本编辑器事件
    const handleCreated = (editor) => {
      editorRef.value = editor; // 记录 editor 实例，重要！
    };
    //路由对象
    const router = useRouter();
    //添加商品
    const addGood = async () => {
      const text = editorRef.value.getText();
      const attrs = goodAttrs.value.map((item) => {
        return {
          attr_id: item.attr_id,
          attr_value: item.attr_vals,
        };
      });
      addForm.value.goods_introduce = text;
      addForm.value.attrs = [...addForm.value.attrs, ...attrs];
      addForm.value.goods_cat = addForm.value.goods_cat.join(",");
      const res = await postGood(addForm.value);
      if (res) {
        router.replace("/goods");
        ElMessage({
          type: "success",
          message: "添加商品成功",
        });
      } else {
        ElMessage({
          type: "error",
          message: "添加商品失败",
        });
      }
    };
    // 组件销毁时，也及时销毁编辑器
    onBeforeUnmount(() => {
      const editor = editorRef.value;
      if (editor == null) return;
      editor.destroy();
    });
    return {
      active,
      addForm,
      cates,
      addFormRef,
      rules,
      props,
      handleChange,
      changeTab,
      checkForm,
      goodParams,
      paramsChange,
      goodAttrs,
      fileList,
      uploadURL,
      handlePreview,
      handleRemove,
      prevDialogVisible,
      prevImageUrl,
      headers,
      handleSuccess,
      valueHtml,
      editorConfig,
      handleCreated,
      editorRef,
      addGood,
    };
  },
};
</script>

<style scoped lang="less">
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

.el-tabs--right .el-tabs__content,
.el-tabs--left .el-tabs__content {
  height: 100%;
}
.el-tabs {
  height: auto !important;
}
.el-form {
  .el-form-item {
    display: block;
    /deep/ .el-form-item__label {
      height: 50px;
      padding-bottom: 10px;
    }
  }
  .el-checkbox {
    margin-bottom: 10px;
    margin-right: 10px;
    height: 40px;
  }
  .el-input,
  /deep/ .el-input__inner {
    height: 40px;
  }
  .el-button {
    margin-top: 15px;
  }
}
</style>