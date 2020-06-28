<template>
  <div class="container">
    <div class="content">
      <el-container>
        <el-header class="app-header">
          <div>
            <p class="header-title">办公室选址方案</p>
            <p class="header-des">房源由业主录入，GOWORK 生成文档</p>
          </div>
          <a href="#">
            <div class="logo">
              <img class="img" src="https://wpimg.wallstcn.com/69a1c46c-eb1c-4b46-8bd4-e9e686ef5251.png" alt="">
              <p>zufang</p>
            </div>
            <p class="logo-des">AI找最合适的办公室</p>
          </a>
        </el-header>
        <el-container class="middle-content">
          <el-aside width="250px" class="aside">
            <p class="user-name">{{ $route.query.businessPeople }}</p>
            <p>所属物业7032m²</p>
            <p style="margin: 30px 0px;">我帮你精选了1个项目共3套房源，觉得这房源特别适合您的需求，如有兴趣请扫码查看我电话联系我！</p>
          </el-aside>
          <el-main class="main">
            <el-carousel arrow="always" :autoplay="false" indicator-position="none" height="800px" style="width: 100%;">
              <el-carousel-item v-for="(item, index) in shareData" :key="item.id">
                <p class="module-title">推荐房源{{ index + 1 }}</p>
                <el-image
                  style="width: 100%; height: 500px;"
                  :src="item.pictureList[0]"
                  :preview-src-list="item.pictureList"
                />
                <el-card>
                  <div slot="header" class="house-card-bottom">
                    <div class="flex-between">
                      <div>
                        <p class="weight-text">{{ item.extensive }}m²</p>
                        <!-- <p class="weight-text" style="margin-bottom: 10px;">正常可容纳 7 人办公</p> -->
                        <!-- <p class="weight-text">得房率 %</p> -->
                      </div>
                      <div>
                        <p class="weight-text">{{ item.rent }} 元/m² · 月</p>
                        <p class="weight-text">{{ item.monthRent }} 元/月</p>
                      </div>
                      <div>
                        <p class="weight-text" style="width: 170px;">隔间{{ item.cubicle }}个</p>
                      </div>
                    </div>
                  </div>
                  <div class="flex-between">
                    <p class="gray">其他信息：可注册公司、管理费{{ item.officeBuildingResp.managementFee }}元/m²·月、空调</p>
                    <!-- <el-button type="primary">下载PDF</el-button> -->
                  </div>
                </el-card>
              </el-carousel-item>
            </el-carousel>
            <office-info :office-detail="officeBuildingResp" />
            <office-map v-if="officeBuildingResp.id" :office-detail="officeBuildingResp" />
          </el-main>
        </el-container>
        <el-footer>footer</el-footer>
      </el-container>
    </div>
  </div>
</template>

<script>
import { postHousesInfoList } from '@/api/resources'
import officeInfo from './components/officeInfo'
import officeMap from './components/map'
export default {
  name: 'HouseInfoList',
  components: {
    officeInfo,
    officeMap
  },
  data() {
    return {
      officeBuildingResp: {},
      shareData: []
    }
  },
  created() {
    this.postHousesInfoList()
  },
  methods: {
    async postHousesInfoList() {
      const idList = JSON.parse(this.$route.query.idList)
      const businessPeople = this.$route.query.businessPeople
      const mharedby = this.$route.query.mharedby
      const res = await postHousesInfoList({ businessPeople, idList, mharedby })
      this.officeBuildingResp = res.data[0]
      this.shareData = res.data
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  background-image:url('../../../../public/img/photo.jpg');
  background-size: cover;
  min-height: 100vh;
  .content {
    width: 70%;
    margin: 0 auto;
    .app-header {
      margin: 30px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #ffffff;
      .header-title {
        font-size: 24px;
        font-weight: bold;
        line-height: 33px;
        margin-bottom: 2px;
      }
      .logo {
        display: flex;
        align-items: center;
        .img {
          width: 50px;
          height: 30px;
          margin-right: 5px;
        }
      }
      .logo-des {
        font-size: 12px;
        line-height: 17px;
        letter-spacing: 3px;
      }
    }
    .middle-content {
      background: #ffffff;
      height: 100%;
      border-radius: 10px;
      .aside {
        padding: 30px 30px 60px;
        text-align: center;
        font-size: 14px;
        .user-name {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 5px;
        }
      }
      .main {
        // display: flex;
        background-color: #99a9bf;
        width: 100%;
        .module-title {
          font-size: 24px;
          font-weight: bold;
          line-height: 33px;
          margin-bottom: 15px;
        }
        .house-card-bottom {
          padding: 30px 15px;
        }
        .flex-between {
          justify-content: space-between;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          .weight-text {
            font-weight: bold;
            font-size: 20px;
          }
          .gray {
            font-size: 14px;
            color: rgba(17,17,17,.6);
          }
        }
      }
    }
  }
}
</style>
