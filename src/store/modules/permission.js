import { asyncRoutes, constantRoutes } from '@/router/index.js'

// 判断当前用户是否拥有对应的菜单
// function hasMenu(menus, route) {
//   if (route.meta && route.meta.title) {
//     return menus.some(menu => menu.menuName === route.meta.title)
//   } else {
//     return false
//   }
// }

// 过滤动态路由数据
export function filterAsyncRoutes(menus, routes) {
  const res = []
  routes.forEach(route => {
    menus.forEach(menu => {
      //  && !res.indexOf(route)
      if (route.meta && menu.menuName === route.meta.title) {
        if (menu.children && menu.children.length > 0) {
          route.children = filterAsyncRoutes(menu.children, route.children)
        }
        res.push(route)
      }
    })
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, menus) {
    return new Promise(resolve => {
      const accessedRoutes = filterAsyncRoutes(menus, asyncRoutes)

      accessedRoutes[accessedRoutes.length] = asyncRoutes[asyncRoutes.length - 1]

      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

// 设置

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
