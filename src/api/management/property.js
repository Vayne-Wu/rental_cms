import request from '@/utils/request'
/**
 * 查看楼盘管理列表
*/
export function postBuildingStateList(data) {
  return request({
    url: '/officeBuilding/selectOfficeBuildingStateList',
    method: 'post',
    data
  })
}
/**
 * 审批楼盘状态
*/
export function postBuildingAuditState(data) {
  return request({
    url: '/officeBuilding/updateOfficeBuildingAuditState',
    method: 'post',
    data
  })
}
/**
 * 审批楼盘隐藏状态
*/
export function postBuildingHiddenState(data) {
  return request({
    url: '/officeBuilding/updateOfficeBuildingHiddenState',
    method: 'post',
    data
  })
}
// 盘源导出
export function postDownloadBuilding(data) {
  return request({
    url: '/excel/downloadOfficeBuilding',
    method: 'post',
    data,
    responseType: 'blob'
  })
}
