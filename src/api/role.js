import http from "@/utils/request";

export function getRoutes() {}

/**
 * 查询角色列表
 * @param {} params
 * @returns
 */
export async function getRoles(params) {
  return await http.get("/api/role/list", params);
}

/**
 * 添加角色
 * @param {*} data
 * @returns
 */
export async function addRole(data) {
  return await http.post("/api/role/add", data);
}

/**
 * 修改角色
 * @param {*} data
 */
export async function updateRole(data) {
  return await http.put("/api/role/update", data);
}
/**
 * 检查角色是否被使用
 * @param {} params
 * @returns
 */
export async function checkRole(params) {
  return await http.getRestApi("/api/role/check", params);
}

/**
 * 删除角色
 * @param {*} params
 * @returns
 */
export async function deleteRole(params) {
  return await http.delete("/api/role/delete", params);
}

/**
* 查询分配权限树列表
* @returns
*/
export async function getAssignTree(params){
  return await http.get("/api/role/getAssignPermissionTree",params);
  }
