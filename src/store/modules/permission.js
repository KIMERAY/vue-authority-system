// 导入路由脚本文件中的属性
import { asyncRoutes, constantRoutes } from "@/router";
// 导入获取菜单数据的方法
import { getMenuList } from "@/api/user";

/**
 * Use meta.role to determine if the current user has permission
 * 判断当前登录用户是否拥有该角色下的菜单信息
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some((role) => route.meta.roles.includes(role));
  } else {
    return true;
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * 过滤出所拥有的菜单信息
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = [];

  routes.forEach((route) => {
    const tmp = { ...route };
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles);
      }
      res.push(tmp);
    }
  });

  return res;
}

const state = {
  routes: [],
  addRoutes: [],
};

const mutations = {
  // 将路由信息保存到store中（Vuex）
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes;
    state.routes = constantRoutes.concat(routes);
  },
};

const actions = {
  /**
   * 动态生成路由
   * @returns
   */
  generateRoutes({ commit }, roles) {
    return new Promise((resolve, reject) => {
      // 发送查询菜单数据的请求
      getMenuList()
        .then((res) => {
          console.log(res);
          // 存放对应权限的路由信息
          let accessedRoutes;
          // 判断状态码是否是200，如果是则表示成功
          if (res.code === 200) {
            accessedRoutes = filterAsyncRoutes(res.data, roles);
          }
          // 将路由信息保存到store中
          commit("SET_ROUTES", accessedRoutes);
          resolve(accessedRoutes);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
