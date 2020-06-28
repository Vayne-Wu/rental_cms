<template>
  <div class="navbar">
    <div style="display: flex;">
      <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
      <breadcrumb />
    </div>
    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <!-- <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar"> -->
          <span class="el-dropdown-link user-name">{{ nickName }}<i class="el-icon-arrow-down el-icon--right" style="font-weight: bold;" /></span>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <!-- <router-link to="/">
            <el-dropdown-item>首页</el-dropdown-item>
          </router-link> -->
          <el-dropdown-item @click.native="personalSetting">
            <div class="el-icon-user common">个人设置</div>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="modifyPassword">
            <div class="el-icon-lock common">修改密码</div>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <div class="el-icon-switch-button common" @click="logout">退出登录</div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <user-dialog ref="user" :user-id="userId" :show-modify="showModify" />
      <modify-pwd ref="modify" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { getUserId } from '@/utils/auth'
import UserDialog from '@/components/User/UserDialog'
import ModifyPwd from '@/components/User/ModifyPwd'
import { getNickName } from '@/utils/auth'
export default {
  components: {
    Breadcrumb,
    Hamburger,
    UserDialog,
    ModifyPwd
  },
  data() {
    return {
      avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      userId: null,
      showModify: false
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    nickName() {
      return getNickName()
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    // 修改密码
    modifyPassword() {
      this.$refs['modify'].editPassword()
    },
    personalSetting() {
      this.showModify = false
      this.userId = Number(getUserId())
      this.$refs['user'].handleEdit()
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  height: 50px;
  overflow: hidden;
  background: #fff;
  box-shadow: inset 0px -6px 4px rgba(0,21,41,.08);
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;
    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }
  .right-menu {
    &:focus {
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }
    .avatar-container {
      margin-right: 30px;
      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
        span.user-name {
          font-weight: 600;
          color: #333;
        }
      }
    }
    .common {
      width: 100%;
      height: 20px;
      line-height: 20px;
    }
  }
}
</style>
