<template>
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
        <el-input v-model="searchModel.roleName" placeholder="请输入角色名称" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search">查询</el-button>
        <el-button icon="el-icon-refresh-right">重置</el-button>
        <el-button type="success" icon="el-icon-plus">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 数据表格 -->
    <el-table
      :data="roleList"
      :height="tableHeight"
      border
      stripe
      style="width: 100%; margin-bottom: 10px"
    >
      <el-table-column
        prop="id"
        label="角色编号"
        width="100"
        align="center"
      ></el-table-column>
      <el-table-column prop="roleCode" label="角色编码"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="remark" label="角色备注"></el-table-column>
      <el-table-column label="操作" align="center" width="290">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-edit"
            type="primary"
            size="small"
            @click="handleEdit(scope.row)"
            >编辑
          </el-button>
          <el-button
            icon="el-icon-delete"
            type="danger"
            size="small"
            @click="handleDelete(scope.row)"
            >删除
          </el-button>
          <el-button
            icon="el-icon-setting"
            type="primary"
            size="small"
            @click="assignRole(scope.row)"
            >分配权限
          </el-button>
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
</template>

<script>
// 导入role.js的方法
import { getRoles } from "@/api/role";
export default {
  name: "roleList",
  data() {
    return {
      // 查询条件
      searchModel: {
        roleName: "",
      },
      tableHeight: 0, //表格高度
      roleList: [], //角色列表
      pageNo: 1, //当前页码
      total: 0, //数据总数量
    };
  },
  created() {
    // 调用查询角色列表的方法
    this.search();
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 220;
    });
  },
  methods: {
    async search() {
      // 发生查询请求
      let res = await getRoles(this.searchModel);
      // 判断是否成功
      if (res.success) {
        console.log(res);
        // 赋值
        this.roleList = res.data.records;
        this.total = res.data.total;
      }
    },
    /**
     * 当每页显示数量发生变化时触发
     */
    handleSizeChange(size) {},
    /**
     * 当页码发生变化时触发
     */
    handleCurrentChange(page) {},
    /**
     * 编辑角色
     */
    handleEdit(row) {},
    /**
     * 删除角色
     */
    handleDelete(row) {},
    /**
     * 分配权限
     */
    assignRole(row) {},
  },
};
</script>
<style lang="scss" scoped></style>
