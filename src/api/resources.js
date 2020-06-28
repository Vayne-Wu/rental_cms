import request from '@/utils/request'

// 查看写字楼列表
export function selectBuildingList(params) {
  return request({
    url: '/officeBuilding/selectOfficeBuildingList',
    method: 'get',
    params
  })
}
// 查询共享办公列表
export function selectSharelist(params) {
  return request({
    url: '/sharedOffice/selectList',
    method: 'get',
    params
  })
}
// 新增房源保存
export function addListingsubmission(data) {
  return request({
    url: '/houses/insertHousesInfo',
    method: 'post',
    data
  })
}
// 获取房源列表
export function selectHousesList(data) {
  return request({
    url: '/houses/selectHousesList',
    method: 'post',
    data
  })
}
// 获取房源详情
export function selectHousesInfo(params) {
  return request({
    url: '/houses/selectHousesInfo',
    method: 'get',
    params
  })
}
// 编辑房源
export function updateHousesInfo(data) {
  return request({
    url: '/houses/updateHousesInfo',
    method: 'post',
    data
  })
}
// 编辑房源
export function deleteHousesInfo(params) {
  return request({
    url: '/houses/deleteHousesInfo',
    method: 'get',
    params
  })
}
// 获取房源echarts数据
export function selectTenantTime(params) {
  return request({
    url: '/houses/selectTenantTime',
    method: 'get',
    params
  })
}
// 获取房源剖型图
export function selectHost(data) {
  return request({
    url: '/houses/selectHost',
    method: 'post',
    data
  })
}
// 房源上下架
export function updateRentalState(data) {
  return request({
    url: '/houses/updateRentalState',
    method: 'post',
    data
  })
}
// 房源列表导出
export function getHousesExcel(params) {
  return request({
    url: '/excel/exportHousesExcel',
    method: 'get',
    params,
    responseType: 'arraybuffer'
  })
}
// 多图片上传
export function multipleUpload(data) {
  return request({
    url: '/picture/pictureUploads',
    method: 'post',
    data
  })
}
// 修改写字楼排列顺序
export function postOfficeBuildingSort(data) {
  return request({
    url: '/officeBuilding/updateOfficeBuildingSort',
    method: 'post',
    data
  })
}
// 查询多个房源详情
export function postHousesInfoList(data) {
  return request({
    url: '/houses/selectHousesInfoList',
    method: 'post',
    data
  })
}
// 查询分享记录
export function postShareRecords(data) {
  return request({
    url: '/houses/selectShareRecords',
    method: 'post',
    data
  })
}
// 新增房源分享记录
export function postInsertShareRecords(data) {
  return request({
    url: '/houses/insertShareRecords',
    method: 'post',
    data
  })
}
