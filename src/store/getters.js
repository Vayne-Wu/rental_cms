const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  accountId: state => state.user.accountId,
  nickName: state => state.user.nickName,
  userId: state => state.user.userId,
  roles: state => state.user.roles,
  menus: state => state.user.menus,
  permission_routes: state => state.permission.routes,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews
}
export default getters
