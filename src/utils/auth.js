import Cookies from 'js-cookie'

const TokenKey = 'user-token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

const UserIdKey = 'user-id'

export function getUserId() {
  return Cookies.get(UserIdKey)
}

export function setUserId(UserId) {
  return Cookies.set(UserIdKey, UserId)
}

export function removeUserId() {
  return Cookies.remove(UserIdKey)
}

const AccountIdKey = 'accouont-id'

export function getAccountId() {
  return Cookies.get(AccountIdKey)
}

export function setAccountId(AccountId) {
  return Cookies.set(AccountIdKey, AccountId)
}

export function removeAccountId() {
  return Cookies.remove(AccountIdKey)
}

const NickNameKey = 'nick-name'

export function getNickName() {
  return Cookies.get(NickNameKey)
}

export function setNickName(NickName) {
  return Cookies.set(NickNameKey, NickName)
}

export function removeNickName() {
  return Cookies.remove(NickNameKey)
}
