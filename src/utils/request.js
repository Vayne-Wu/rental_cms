import axios from 'axios'
import { MessageBox, Notification, Loading } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
let loading = null
// 内存中正在请求的数量
let loadingNum = 0
function startLoading() {
  if (loadingNum === 0) {
    loading = Loading.service({
      lock: true,
      text: '拼命加载中...',
      background: 'rgba(255,255,255,0.5)'
    })
  }
  // 请求数量加1
  loadingNum++
}
function endLoading() {
  // 请求数量减1
  loadingNum--
  if (loadingNum <= 0) {
    loading.close()
  }
}
// import vue from 'vue'
// axios.defaults.withCredentials = true;
// 初始化一个axios实例

// console.log(process.env.VUE_APP_BASE_API)
const service = axios.create({
  // withCredentials = true,
  // 基地址
  baseURL: process.env.VUE_APP_BASE_API, // 服务器地址
  // baseURL: `http://120.79.53.153:8083`, // 本地测试地址
  timeout: 50000 // request timeout
})
// 添加请求拦截器
service.interceptors.request.use(
  config => {
    startLoading()
    // 在发送请求前做些什么
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    // 对请求错误做些什么
    console.log(error) // for debug
    return Promise.reject(error)
  }
)
// 添加响应拦截器
service.interceptors.response.use(
  response => {
    endLoading()
    const code = response.data.code
    if (code === 90005) {
      MessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/logout')
        location.reload(true)
        return Promise.reject('error')
      })
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    endLoading()
    let code = 0
    try {
      code = error.response.data.code
    } catch (e) {
      if (error.toString().indexOf('Error: timeout') !== -1) {
        Notification.error({
          title: '网络请求超时',
          duration: 5000
        })
        return Promise.reject(error)
      }
    }
    if (code === 404) {
      Notification.error({
        title: '接口请求失败',
        duration: 5000
      })
    }
    return Promise.reject(error)
  }
)
export default service
