import request from '@/utils/request'
/**
 * 房源待审核列表
*/
export function postHouseStateList(data) {
  return request({
    url: '/houses/updateHouseStateList',
    method: 'post',
    data
  })
}

/**
 * 审批房源状态
*/
export function postHouseState(data) {
  return request({
    url: '/houses/updateHouseState',
    method: 'post',
    data
  })
}
/**
 * 审批必看房源
*/
export function postMustSeeHouses(data) {
  return request({
    url: '/houses/updateMustSeeHouses',
    method: 'post',
    data
  })
}
// 房源导入
export function postUploadHouses(data) {
  return request({
    url: '/excel/uploadHouses',
    method: 'post',
    data
  })
}
// 房源列表导出
export function postDownloadHouses(data) {
  return request({
    url: '/excel/downloadHouses',
    method: 'post',
    data,
    responseType: 'blob'
  })
}
// 查看写字楼名称
export function postBuildingNameList(params) {
  return request({
    url: '/officeBuilding/selectOfficeBuildingNameList',
    method: 'get',
    params
  })
}
