import http from "@/utils/request";

export default {
  /**
   * 查询部门列表
   * @param params
   * @returns
   */
  async getDepartmentList(params) {
    return await http.get("/api/department/list", params);
  },

  /**
   * 获取所属部门列表
   * @returns
   */
  async getParentTreeList() {
    return await http.get("/api/department/parent/list");
  },

  /**
   * 新增部门
   * @param params
   * @returns
   */
  async addDept(params) {
    return await http.post("/api/department/add", params);
  },

  /**
   * 编辑部门
   * @param params
   * @returns
   */
  async updateDept(params) {
    return await http.put("/api/department/update", params);
  },
};
