import request from '@/utils/request'

// 查询所在商圈
export function selectindustrialPark(params) {
  return request({
    url: '/industrialPark/list',
    method: 'get',
    params
  })
}
// 新增写字楼项目
export function addSharedoffice(data) {
  return request({
    url: '/officeBuilding/insertOfficeBuildingInfo',
    method: 'post',
    data
  })
}
// 查询用户写字楼项目招商
export function selectAttractuser(params) {
  return request({
    url: '/user/listAll',
    method: 'get',
    params
  })
}
// 新增项目所在地
export function addProjectlocation(data) {
  return request({
    url: '/industrialPark/insert',
    method: 'post',
    data
  })
}
// 通过ID查询写字楼项目
export function selectIDSharedoffice(params) {
  return request({
    url: '/officeBuilding/selectOfficeBuildingInfo',
    method: 'get',
    params
  })
}
// 编辑写字楼项目
export function updateSharedoffice(data) {
  return request({
    url: '/officeBuilding/updateOfficeBuildingInfo',
    method: 'post',
    data
  })
}
// 删除写字楼项目
export function deleteSharedoffice(params) {
  return request({
    url: '/officeBuilding/deleteOfficeBuildingInfo',
    method: 'post',
    params
  })
}
// 查询用户写字楼项目招商
export function selectessential(params) {
  return request({
    url: '/extendedInformation/index',
    method: 'get',
    params
  })
}
// 商务区域
export function getBusinessDistrictList(params) {
  return request({
    url: '/businessDistrict/selectBusinessDistrictList',
    method: 'get',
    params
  })
}
// 查询地铁站
export function getMetroStationList(params) {
  return request({
    url: '/metroStation/selectMetroStationList',
    method: 'get',
    params
  })
}
// 查询写字楼详情
export function getBuildingInfo(data) {
  return request({
    url: '/building/selectBuildingList',
    method: 'post',
    data
  })
}
// 写字楼导入
export function postImportBuilding(data) {
  return request({
    url: '/excel/uploadOfficeBilding',
    method: 'post',
    data
  })
}
