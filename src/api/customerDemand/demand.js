import request from '@/utils/request'

export function getDemandList(data) {
  return request({
    url: '/customerRecord/selectCustomerRecordListAll',
    method: 'post',
    data
  })
}

export function getDemandInfo(userId) {
  return request({
    url: '/customerRecord/selectCustomerRecordUserLog',
    method: 'get',
    params: { userId }
  })
}
