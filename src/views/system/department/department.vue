<template>
  <el-main>
    <!-- 查询条件 -->
    <el-form ref="searchForm" label-width="80px" :inline="true" size="small">
      <el-form-item>
        <el-input v-model="departmentName" placeholder="请输入部门名称" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search">查询按钮</el-button>
        <el-button icon="el-icon-refresh-right">重置</el-button>
        <el-button type="success" icon="el-icon-plus" @click="openAddWindow()"
          >新增</el-button
        >
      </el-form-item>
    </el-form>

    <!-- 数据表格 -->
    <!--
      data属性：表格数据
      border属性：表格边框
      stripe属性：表格斑马线
      row-key属性：行数据的key，用来优化Table的渲染
      default-expand-all属性：默认展开树形表格数据
      tree-props属性：树形表格配置属性选型
     -->
    <el-table
      :data="tableData"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      stripe=""
      default-expand-all
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <!-- prop属性：填写数据的属性名称 -->
      <!-- label属性：表格表头标题 -->
      <el-table-column prop="departmentName" label="部门名称" />
      <el-table-column prop="parentName" label="所属部门" />
      <el-table-column prop="phone" label="部门电话" />
      <el-table-column prop="address" label="部门地址" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit-outline"
            @click="handleEdit(scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete-solid"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加和修改窗口 -->
    <system-dialog
      :title="deptDialog.title"
      :visible="deptDialog.visible"
      :width="deptDialog.width"
      :height="deptDialog.height"
      @onClose="onClose()"
      @onConfirm="onConfirm()"
    >
      <div slot="content">
        <el-form
          :model="dept"
          ref="deptForm"
          :rules="rules"
          label-width="80px"
          :inline="true"
          size="small"
        >
          <el-form-item label="所属部门" prop="parentName">
            <el-input v-model="dept.parentName"></el-input>
          </el-form-item>
          <el-form-item label="部门名称" prop="departmentName">
            <el-input v-model="dept.departmentName"></el-input>
          </el-form-item>
          <el-form-item label="部门电话">
            <el-input v-model="dept.phone"></el-input>
          </el-form-item>
          <el-form-item label="部门地址">
            <el-input v-model="dept.address"></el-input>
          </el-form-item>
          <el-form-item label="序号">
            <el-input v-model="dept.orderNum"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </system-dialog>
  </el-main>
</template>

<script>
// 导入department脚本文件
import departmentApi from "@/api/department";
// 导入SystemDialog组件
import SystemDialog from "@/components/system/SystemDialog.vue";
import { pid } from "process";

export default {
  name: "department",
  // 注册组件
  components: {
    SystemDialog,
  },
  data() {
    return {
      departmentName: "", // 部门名称
      tableData: [], // 表格数据
      deptDialog: {
        title: "560", // 窗口标题
        visible: false, // 是否显示窗口
        width: 560, // 窗口宽度
        height: 170, // 窗口高度
      },
      dept: {
        id: "", //部门编号
        departmentName: "", //部门名称
        pid: "", //所属部门id
        parentName: "", //所属部门名称

        phone: "", //电话
        address: "", //地址
        orderNum: "", //序号
      },
      // 表单验证规则
      rules: {
        parentName: [
          { required: true, message: "请选择所属部门", trigger: "change" },
        ],
        departmentName: [
          { required: true, message: "请输入部门名称", trigger: "blur" },
        ],
      },
    };
  },
  // 初始化时调用
  created() {
    // 调用查询部门列表
    this.search();
  },
  methods: {
    /**
     * 查询部门列表
     */
    async search() {
      // 发送查询请求
      let res = await departmentApi.getDepartmentList(this.departmentName);
      // 判断是否成功
      if (res.success) {
        this.tableData = res.data;
      }
    },
    /**
     * 打开添加窗口
     */
    openAddWindow() {
      // 设置窗口属性
      this.deptDialog.title = "新增部门";
      this.deptDialog.visible = true;
    },
    /**
     * 窗口关闭事件
     */
    onClose() {
      // 关闭窗口
      this.deptDialog.visible = false;
    },
    /**
     * 窗口确认事件
     */
    onConfirm() {
      // 关闭窗口
      this.deptDialog.visible = false;
    },
  },
};
</script>
<style lang="scss" scoped></style>
