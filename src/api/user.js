import request from '@/utils/request'

// 登录
export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

// 请求用户信息
export function getInfo(userId) {
  return request({
    url: '/user',
    method: 'get',
    params: { userId }
  })
}

// 请求用户信息
export function getMenus(userId) {
  return request({
    url: '/user/menu',
    method: 'get',
    params: { userId }
  })
}

// 退出登录
export function logout(userId) {
  return request({
    url: '/user/logout',
    method: 'post',
    data: { userId }
  })
}

// 添加用户
export function addUser(data) {
  return request({
    url: '/user/insertUser',
    method: 'post',
    data
  })
}

// 编辑用户信息
export function updateUser(data) {
  return request({
    url: '/user/updateUser',
    method: 'post',
    data
  })
}

// 修改密码
export function modifyPassword(data) {
  return request({
    url: '/user/pwd',
    method: 'post',
    data
  })
}

// 管理员修改密码
export function postUpdatePwd(data) {
  return request({
    url: '/user/updatePwd',
    method: 'post',
    data
  })
}

// 删除用户
export function deleteUser(userId) {
  return request({
    url: '/user/del',
    method: 'post',
    data: { userId }
  })
}

// 用户列表
export function getUserList(params) {
  return request({
    url: '/user/list',
    method: 'get',
    params
  })
}

// 修改密码
export function changePwd(data) {
  return request({
    url: '/user/pwd',
    method: 'post',
    data
  })
}

export function allot(userId, careerNameList) {
  return request({
    url: '/user/allot',
    method: 'post',
    data: { userId, careerNameList }
  })
}

export function getCareerNameList(userId) {
  return request({
    url: '/user/bloc',
    method: 'get',
    params: { userId }
  })
}
// 获取角色列表
export function rolelistAll() {
  return request({
    url: '/role/listAll',
    method: 'get'
  })
}
