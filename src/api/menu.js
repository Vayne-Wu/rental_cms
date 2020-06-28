import request from '@/utils/request'

// 获取菜单列表
export function getMenus() {
  return request({
    url: '/menu/tree',
    method: 'get'

  })
}

// 添加菜单
export function addMenu(data) {
  return request({
    url: '/menu/add',
    method: 'post',
    data
  })
}

// 编辑菜单
export function updateMenu(data) {
  return request({
    url: '/menu/update',
    method: 'post',
    data
  })
}

// 删除菜单
export function deleteMenu(menuId) {
  return request({
    url: `/menu/del`,
    method: 'post',
    data: { menuId }
  })
}

// 获取菜单详情
export function getMenuInfo(menuId) {
  return request({
    url: `/menu`,
    method: 'get',
    params: { menuId }
  })
}
