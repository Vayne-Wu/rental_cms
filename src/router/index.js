import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/houseInfoList',
    component: () => import('@/views/propertyListing/newPage/houseInfoList'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/house',
    children: [{
      path: 'house',
      name: 'House',
      component: () => import('@/views/propertyListing/resources'),
      meta: { title: '物业房源', icon: 'housing' }
    }]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/office',
    children: [{
      path: 'office',
      name: 'office',
      component: () => import('@/views/office/addOffice'),
      meta: { title: '添加写字楼', icon: 'housing' },
      hidden: true
    }]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/housing',
    children: [{
      path: 'housing',
      name: 'housing',
      component: () => import('@/views/house/addhousing'),
      meta: { title: '新增房源', icon: 'housing' },
      hidden: true
    }]
  },
  {
    path: '/demand',
    component: Layout,
    redirect: '/demand/list',
    meta: {
      title: '客户管理',
      icon: 'demand',
      roles: ['admin', 'editor']
    },
    children: [
      {
        path: 'list',
        name: 'ClientList',
        component: () => import('@/views/demand'),
        meta: { title: '客户需求', icon: 'demand' }
      }
    ]
  },
  {
    path: '/tenant',
    component: Layout,
    redirect: '/tenant/list',
    // meta: {
    //   title: '租客管理',
    //   icon: 'tenant',
    //   roles: ['admin', 'editor']
    // },
    children: [
      {
        path: 'list',
        name: 'TenantList',
        component: () => import('@/views/tenantManagement'),
        meta: { title: '租客管理', icon: 'tenant' }
      }
    ]
  },
  {
    path: '/houseList',
    component: Layout,
    redirect: '/house/list',
    children: [
      {
        path: 'list',
        name: 'HouseList',
        component: () => import('@/views/management/housingManagement'),
        meta: { title: '房源管理', icon: 'house' }
      }
    ]
  },
  {
    path: '/propertyList',
    component: Layout,
    redirect: '/property/list',
    children: [
      {
        path: 'list',
        name: 'PropertyList',
        component: () => import('@/views/management/propertyManagement'),
        meta: { title: '盘源管理', icon: 'build' }
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/tenantDetail',
    children: [{
      path: 'tenantDetail',
      name: 'tenantDetail',
      component: () => import('@/views/tenantManagement/tenantDetail'),
      meta: { title: '租客详情', icon: 'tenantDetail' },
      hidden: true
    }]
  },
  {
    path: '/settings',
    component: Layout,
    redirect: '/setting/user',
    meta: {
      title: '设置',
      icon: 'set',
      roles: ['admin', 'editor']
    },
    children: [
      {
        path: 'user',
        name: 'UserList',
        component: () => import('@/views/settings/user'),
        meta: { title: '用户列表', icon: 'user' }
      },
      {
        path: 'role',
        name: 'RoleList',
        component: () => import('@/views/settings/role'),
        meta: { title: '角色列表', icon: 'role' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
