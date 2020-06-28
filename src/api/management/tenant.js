import request from '@/utils/request'
/**
 * 工业类型
*/
export function getIndustryList(params) {
  return request({
    url: '/industryClassification/list',
    method: 'get',
    params
  })
}
/**
 * 租客列表
*/
export function postTenantList(data) {
  return request({
    url: '/tenant/selectTenantList',
    method: 'post',
    data
  })
}
/**
 * 租客详情
*/
export function getTenantInfo(params) {
  return request({
    url: '/tenant/selectTenantInfo',
    method: 'get',
    params
  })
}
/**
 * 编辑租客信息
*/
export function updateTenant(data) {
  return request({
    url: '/tenant/updateTenant',
    method: 'post',
    data
  })
}
// 租客列表导出
export function getExportTenant(params) {
  return request({
    url: '/excel/exportTenant',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
