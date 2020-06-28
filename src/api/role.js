// 角色相关 api 接口
import request from '@/utils/request'

// add role
/**
 *
 * @param {*} data
 */
export function addRole(data) {
  return request({
    url: '/role/insertRole',
    method: 'post',
    data
  })
}

// update role
/**
 *
 * @param {*} data
 */
export function updateRole(data) {
  return request({
    url: '/role/update',
    method: 'post',
    data
  })
}

// delete role
/**
 *
 * @param {*} id
 */
export function deleteRole(roleId) {
  return request({
    url: `/role/del`,
    method: 'delete',
    data: { roleId }
  })
}

//  role list
/**
 *
 * @param {*} data
 */
export function getRoleList(params) {
  return request({
    url: '/role/list',
    method: 'get',
    params
  })
}

//  role detail
/**
 *
 * @param {*} roleId
 */
export function getRoleDetail(roleId) {
  return request({
    url: `/role`,
    method: 'get',
    params: { roleId }
  })
}

// 角色授权
/**
 * roleId 角色id
 * menuIds 菜单id数组 arr
 * @param { roleId, menuIds } data
 */
export function assignRole(data) {
  return request({
    url: '/role/auth',
    method: 'post',
    data
  })
}
