import http from '@/utils/request'

export function getRoutes() {

}

/**
 * 查询角色列表
 * @param {} params
 * @returns
 */
export async function getRoles(params) {

  return await http.get("/api/role/list",params);
}

export function addRole(data) {

}

export function updateRole(id, data) {

}

export function deleteRole(id) {

}
