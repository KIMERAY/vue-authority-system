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
      <el-table-column prop="type" label="菜单类型"></el-table-column>
      <el-table-column prop="icon" label="菜单图标"></el-table-column>
      <el-table-column prop="name" label="路由名称"></el-table-column>
      <el-table-column prop="path" label="路由地址名称"></el-table-column>
      <el-table-column prop="url" label="组件路径"></el-table-column>
      <el-table-column label="操作"></el-table-column>
    </el-table>
  </el-main>
</template>

<script>
export default {
  name: "menuList",
  data() {
    return {
      menuList: [], //数据列表
      tableHeight: 0, //表格高度
    };
  },
  // 初始化时调用
  created() {

  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 180;
    });
  },
  methods: {
    /**
     * 打开新增窗口
     */
    openAddWindow() {

    },
  },
};
</script>
<style lang="scss" scoped></style>
