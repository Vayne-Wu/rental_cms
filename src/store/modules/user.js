import { login, logout, getMenus, getInfo } from '@/api/user'
// 导入获取角色的接口
import { getRoleList } from '@/api/role'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { getUserId, setUserId, removeUserId } from '@/utils/auth'
import { getAccountId, setAccountId, removeAccountId } from '@/utils/auth'
import { getNickName, setNickName, removeNickName } from '@/utils/auth'
import { resetRouter } from '@/router'
import { Notification } from 'element-ui'

const state = {
  token: getToken(), // token
  accountId: getAccountId(), // 用户名
  nickName: getNickName(), // 昵称
  avatar: '', // 头像
  userId: getUserId(), // 用户id
  roles: [], // 用户角色列表
  menus: [] // 权限菜单
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ACCOUNT: (state, accountId) => {
    state.accountId = accountId
  },
  SET_NIKENAME: (state, nickName) => {
    state.nickName = nickName
  },
  SET_USERID: (state, userId) => {
    state.userId = userId
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_MENUS: (state, menus) => {
    state.menus = menus
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { accountId, passWord } = userInfo
    return new Promise((resolve, reject) => {
      login({ accountId: accountId.trim(), passWord: passWord })
        .then(response => {
          if (response.code === 20000) {
            const { data } = response
            const { token, userId, nickName } = data
            commit('SET_USERID', userId)
            commit('SET_TOKEN', token)
            commit('SET_ACCOUNT', accountId)
            commit('SET_NIKENAME', nickName)
            setToken(token)
            setUserId(userId)
            setAccountId(accountId)
            setNickName(nickName)
            resolve()
          } else {
            Notification.error({
              title: response.message,
              duration: 1500
            })
            resolve()
          }
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.userId)
        .then(response => {
          const { data } = response
          if (!data) {
            // Verification failed, please Login again.
            reject('无效token，请重新登录')
          }
          const { accountId, nickName } = data
          commit('SET_ACCOUNT', accountId)
          commit('SET_NIKENAME', nickName)
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // get rolelist 获取角色列表
  getRoles({ commit }, data) {
    // const { pageNum, pageSize, rol} = data
    return new Promise((resolve, reject) => {
      getRoleList(data)
        .then(response => {
          const { data } = response

          if (!data) {
            // Verification failed, please Login again.
            reject('无效token，请重新登录')
          }

          const { list } = data

          commit('SET_ROLES', list)

          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // getMenus 获取用户菜单信息
  getMenus({ commit, state }) {
    return new Promise((resolve, reject) => {
      getMenus(state.userId)
        .then(response => {
          const { data } = response

          // if (!roles || roles.length <= 0) {
          //   reject('getInfo: roles must be a non-null array!')
          // }

          const { menus } = data
          if (menus === []) {
            // Verification failed, please Login again.
            reject('菜单为空，请为该用户分配权限')
            // return false
          }
          commit('SET_MENUS', menus[0].children)
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // user logout 退出登录
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.userId)
        .then(() => {
          // clear token
          commit('SET_TOKEN', '')
          // clear menus
          commit('SET_MENUS', [])
          removeToken()
          removeUserId()
          removeAccountId()
          removeNickName()
          resetRouter()
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  },

  resetUserId({ commit }) {
    return new Promise(resolve => {
      commit('SET_USERID', '')
      removeUserId()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
