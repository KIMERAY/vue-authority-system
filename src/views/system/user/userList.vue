<template>
  <el-container :style="{ height: containerHeight + 'px' }">
    <!-- 左侧部门菜单树 -->
    <el-aside
      style="
        padding: 10px 0px 0px 0px;
        background: #fff;
        border-right: 1px solid #dfe6ec;
      "
      width="220px"
    >
      <el-tree
        style="font-size: 14px"
        ref="leftTree"
        :data="deptList"
        node-key="id"
        :props="defaultProps"
        default-expand-all
        empty-text="暂无数据"
        :show-checkbox="false"
        :highlight-current="true"
        :expand-on-click-node="false"
        @node-click="handleNodeClick"
      >
        <div class="custom-tree-node" slot-scope="{ node, data }">
          <div>
            <span v-if="data.children.length == 0">
              <i class="el-icon-document"></i>
            </span>
            <span v-else @click.stop="changeIcon(data)">
              <svg-icon v-if="data.open" icon-class="add-s" />
              <svg-icon v-else icon-class="sub-s" />
            </span>
            <!-- 名称 -->
            <span style="margin-left: 3px">{{ node.label }}</span>
          </div>
        </div>
      </el-tree>
    </el-aside>

    <!-- 右侧用户数据列表 -->
    <el-main>
      <!-- 查询条件 -->
      <el-form
        :model="searchModel"
        ref="searchForm"
        label-width="80px"
        :inline="true"
        size="small"
      >
        <el-form-item>
          <el-input v-model="searchModel.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="searchModel.realName"
            placeholder="请输入真实姓名"
          />
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchModel.phone" placeholder="请输入电话" />
        </el-form-item>
        <el-form-item>
          <el-button
            icon="el-icon-search"
            type="primary"
            @click="search(departmentId, pageNo, pageSize)"
            >查询</el-button
          >
          <el-button icon="el-icon-delete" @click="resetValue()"
            >重置</el-button
          >
          <el-button
            icon="el-icon-plus"
            size="small"
            type="success"
            @click="openAddWindow()"
            >新增</el-button
          >
        </el-form-item>
      </el-form>

      <!-- 用户表格数据 -->
      <el-table
        :height="tableHeight"
        :data="userList"
        border
        stripe
        style="width: 100%; margin-bottom: 10px"
      >
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="realName" label="姓名"></el-table-column>
        <el-table-column
          prop="departmentName"
          label="所属部门"
        ></el-table-column>
        <el-table-column prop="phone" label="电话"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column align="center" width="290" label="操作">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-edit"
              type="primary"
              size="mini"
              @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              icon="el-icon-delete"
              type="danger"
              size="mini"
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
            <el-button
              icon="el-icon-setting"
              type="primary"
              size="mini"
              @click="assignRole(scope.row)"
              >分配角色</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页工具栏 -->
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNo"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-main>
  </el-container>
</template>

<script>
// 导入department.js脚本文件
import departmentApi from "@/api/department";
// 导入user.js脚本文件
import userApi from "@/api/user";

export default {
  name: "userList",
  data() {
    return {
      containerHeight: 0, //容器高度
      deptList: [], //部门列表
      //树节点属性
      defaultProps: {
        children: "children",
        label: "departmentName",
      },
      searchModel: {
        username: "",
        realName: "",
        phone: "",
        departmentId: "",
        pageNo: 1,
        pageSize: 10,
      },
      tableHeight: 0, //表格高度
      userList: [], //用户列表
      pageNo: 1, //当前页码
      pageSize: 10, //每页显示数量
      total: 0, //总数量
      departmentId: "", //部门编号
    };
  },
  // 初始化时调用
  created() {
    // 调用查询部门列表
    this.getDepartmentList();
    // 调用查询用户信息的犯法
    this.search(this.departmentId);
  },
  mounted() {
    this.$nextTick(() => {
      //容器高度
      this.containerHeight = window.innerHeight - 85;
      //表格高度
      this.tableHeight = window.innerHeight - 220;
    });
  },
  methods: {
    /**
     * 查询部门列表
     */
    async getDepartmentList() {
      // 发送查询请求
      let res = await departmentApi.getDepartmentList();
      // 判断是否成功
      if (res.success) {
        this.deptList = res.data;
      }
    },
    /**
     * 点击树节点加减号时触发
     * @param data
     */
    changeIcon(data) {
      // 修改折叠状态
      data.open = !data.open;
      this.$refs.leftTree.store.nodesMap[data.id].expanded = !data.open;
    },
    /**
     * 树节点点击事件
     * @param data
     */
    handleNodeClike(data) {
      // 将但钱选择的节点ID赋值给departmentId

      this.departmentId = data.id;
      // 查询用户信息
      this.search(this.departmentId);
    },

    /**
     * 查询用户列表
     */
    async search(departmentId, pageNo = 1, pageSize = 10) {
      // 将查询条件交给searchModel对象
      this.searchModel.departmentId = this.departmentId;
      this.searchModel.pageNo = pageNo;
      this.searchModel.pageSize = pageSize;
      // 发送查询请求
      let res = await userApi.getUserList(this.searchModel);
      // 判断是否成功
      if (res.success) {
        // 赋值
        this.userList = res.data.records;
        thisi.total = res.data.total;
      }
    },

    /**
     * 当每页显示数量发生额变化时触发
     */
    handleSizeChange(size) {
      // 赋值给成员变量pageSize
      this.pageSize = size;
      // 查询
      this.search(this.departmentId, this.pageNo, size);
    },
    /**
     * 当当前页码发生变化时触发
     */
    handleCurrentChange(page) {
      // 赋值给成员变量pageSize
      this.pageNo = page;
      // 查询
      this.search(this.departmentId, page, this.pageSize);
    },

    /**
     * 重置数据
     */
    resetValue() {
      this.searchModel.username = "";
      this.searchModel.realName = "";
      this.searchModel.departmentId = "";
      this.searchModel.page = 1;
      this.searchModel.pageSize = 10;
      // 调用方法
      this.search(this.departmentId);
    },
    /**
     * 打开添加窗口
     */
    openAddWindow() {},
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-tree {
  .el-tree-node {
    position: relative;
    padding-left: 10px;
  }
  .el-tree-node__children {
    padding-left: 20px;
  }
  .el-tree-node :last-child:before {
    height: 40px;
  }
  .el-tree > .el-tree-node:before {
    border-left: none;
  }
  .el-tree > .el-tree-node:after {
    border-top: none;
  }
  .el-tree-node:before,
  .el-tree-node:after {
    content: "";
    left: -4px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }
  .tree :first-child .el-tree-node:before {
    border-left: none;
  }
  .el-tree-node:before {
    border-left: 1px dotted #d9d9d9;
    bottom: 0px;
    height: 100%;
    top: -25px;
    width: 1px;
  }
  .el-tree-node:after {
    border-top: 1px dotted #d9d9d9;
    height: 20px;
    top: 14px;
    width: 24px;
  }
  .el-tree-node__expand-icon.is-leaf {
    width: 8px;
  }
  .el-tree-node__content > .el-tree-node__expand-icon {
    display: none;
  }
  .el-tree-node__content {
    line-height: 30px;
    height: 30px;
    padding-left: 10px !important;
  }
}
::v-deep .el-tree > div {
  &::before {
    display: none;
  }
  &::after {
    display: none;
  }
}
</style>
