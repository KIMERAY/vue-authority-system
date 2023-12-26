<template>
  <el-main>
    <!-- 新增按钮 -->
    <el-button
      type="success"
      size="small"
      @click="openAddWindow()"
      icon="el-icon-plus"
      >新增</el-button
    >
    <!-- 数据表格 -->
    <el-table
      :data="menuList"
      :height="tableHeight"
      style="width: 100%; margin-top: 20px"
      row-key="id"
      border
      lazy
      :load="load"
      :tree-props="{ children: 'children' }"
    >
      <el-table-column prop="label" label="菜单名称"></el-table-column>
      <el-table-column prop="type" label="菜单类型" align="center">
        <template slot-scope="scope">
          <el-tag size="normal" v-if="scope.row.type === 0">目录</el-tag>
          <el-tag size="normal" type="success" v-else-if="scope.row.type === 1"
            >菜单</el-tag
          >
          <el-tag size="normal" type="warning" v-else>按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="icon" label="菜单图标" align="center">
        <template slot-scope="scope">
          <i :class="scope.row.icon" v-if="scope.row.icon.includes('el-icon')">
          </i>
          <svg-icon v-else :icon-class="scope.row.icon"></svg-icon>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="路由名称"></el-table-column>
      <el-table-column prop="path" label="路由地址名称"></el-table-column>
      <el-table-column prop="url" label="组件路径"></el-table-column>
      <el-table-column label="操作" align="center"></el-table-column>
    </el-table>
    <!-- 新增或修改窗口 -->
    <system-dialog
      :title="menuDialog.title"
      :visible="menuDialog.visible"
      :width="menuDialog.width"
      :height="menuDialog.height"
      @onClose="onClose()"
      @onConfirm="onConfirm()"
    >
      <div slot="content">
        <el-form
          :model="menu"
          ref="menuForm"
          :rules="rules"
          label-width="80px"
          :inline="true"
          size="small"
        >
          <el-col :span="24">
            <el-form-item label="菜单类型" prop="type">
              <el-radio-group v-model="menu.type">
                <el-radio :label="0">目录</el-radio>
                <el-radio :label="1">菜单</el-radio>
                <el-radio :label="2">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-form-item label="所属菜单" size="small" prop="parentName">
            <el-input v-model="menu.parentName" :readonly="true" />
          </el-form-item>
          <el-form-item label="菜单名称" size="small" prop="label">
            <el-input v-model="menu.label" />
          </el-form-item>
          <el-form-item
            label="路由名称"
            size="small"
            prop="name"
            v-if="menu.type == 1"
          >
            <el-input v-model="menu.name" />
          </el-form-item>
          <el-form-item
            label="路由地址"
            size="small"
            prop="path"
            v-if="menu.type != 2"
          >
            <el-input v-model="menu.path" />
          </el-form-item>
          <el-form-item
            label="组件路径"
            size="small"
            prop="url"
            v-if="menu.type == 1"
          >
            <el-input v-model="menu.url" />
          </el-form-item>
          <el-form-item label="权限字段" size="small" prop="code">
            <el-input v-model="menu.code" />
          </el-form-item>
          <el-form-item label="菜单图标" size="small">
            <el-input v-model="menu.icon" />
          </el-form-item>
          <el-form-item label="菜单序号" size="small">
            <el-input v-model="menu.orderNum" />
          </el-form-item>
        </el-form>
      </div>
    </system-dialog>
  </el-main>
</template>

<script>
// 导入menu.js脚本文件
import menuApi from "@/api/menu";

//导入对话框组件
import SystemDialog from "@/components/system/SystemDialog.vue";
export default {
  name: "menuList",
  // 注册组件
  components: {
    SystemDialog,
  },
  data() {
    return {
      menuList: [], //数据列表
      tableHeight: 0, //表格高度
      // 窗口属性
      menuDialog: {
        title: "新增菜单",
        visible: false,
        width: 630,
        height: 270,
      },
      //菜单属性
      menu: {
        id: "",
        type: "",
        parentId: "",
        parentName: "",
        label: "",
        icon: "",
        name: "",
        path: "",
        url: "",
        code: "",
        orderNum: "",
      },
      rules: {
        type: [
          { required: true, trigger: "change", message: "请选择菜单类型" },
        ],
        parentName: [
          { required: true, trigger: "change", message: "请选择所属菜单" },
        ],
        label: [{ required: true, trigger: "blur", message: "请输入菜单名称" }],
        name: [{ required: true, trigger: "blur", message: "请输入路由名称" }],
        path: [{ required: true, trigger: "blur", message: "请输入路由路径" }],
        url: [{ required: true, trigger: "blur", message: "请输入组件路径" }],
        code: [{ required: true, trigger: "blur", message: "请输入权限字段" }],
      },
    };
  },
  // 初始化时调用
  created() {
    // 查询菜单列表
    this.search();
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 180;
    });
  },
  methods: {
    /**
     * 查询菜单列表
     */
    async search() {
      // 发送查询请求
      let res = await menuApi.getMenuList();
      // 判断是否成功
      if (res.success) {
        this.menuList = res.data;
      }
    },
    /**
     * 打开新增窗口
     */
    openAddWindow() {
      // 清空表单数据
      this.$resetForm("menuForm",this.menu)
      // 设置窗口标题
      this.menuDialog.title = "新增菜单";
      // 显示窗口
      this.menuDialog.visible = true;
    },

    /**
     * 关闭取消按钮点击事件
     */
    onClose() {
      // 关闭窗口
      this.menuDialog.visible = false;
    },
    /**
     * 确认按钮点击事件
     */
    onConfirm() {
      // 表单验证
      this.$refs.menuForm.validate((valid) => {
        if (valid) {
          // 关闭窗口
          this.menuDialog.visible = false;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped></style>
