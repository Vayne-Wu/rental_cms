<template>
  <div>
    <el-container>
      <el-header>
        <div class="div_top">
          <span v-if="$route.query.id">房源详情</span>
          <span v-else>添加房源</span>
          <div>
            <el-button type="primary" plain @click="Listingsubmission">保 存</el-button>
            <el-button
              v-show="$route.query.id && form.rentalStatus !== 1 && form.auditStatus !== 1"
              @click="RentalState($route.query.id,form.rentalStatus)"
            >
              <span v-show="form.rentalStatus === 2">下架</span>
              <span v-show="form.rentalStatus === 3">上架</span>
            </el-button>
            <el-button v-show="form.auditStatus === 1" type="warning" plain @click="toExamined">去审核</el-button>
            <el-button v-show="$route.query.id" type="danger" plain @click="remove">删除</el-button>
            <delete-tip ref="tip" @delete-current="deleteHousing" />
          </div>
        </div>
      </el-header>
      <el-main style="background-color: rgb(244, 244, 245);">
        <goods-shelves v-if="showShelf" :id="Number($route.query.id)" :rental-status="Number(form.rentalStatus)" :show-shelf="showShelf" @close="close" @handle-success="handleSuccess" />
        <house-list ref="houseList" :form="form" />
      </el-main>
    </el-container>
  </div>
</template>

<script>
import {
  addListingsubmission,
  deleteHousesInfo,
  selectHousesInfo,
  updateHousesInfo,
  multipleUpload
} from '@/api/resources'
import goodsShelves from '@/components/Popup/GoodsShelves'
import DeleteTip from '@/components/Popup/DeleteTip'
import houseList from './components/houseList'
export default {
  name: 'AddHousing',
  components: {
    goodsShelves,
    houseList,
    DeleteTip
  },
  data() {
    return {
      form: {
        type: 1,
        renovation: 1,
        // spaceType: 1,
        pedestal: '',
        floor: '',
        roomOrientation: '',
        managementExpense: '',
        airconditionerType: null,
        airconditionerBilling: '',
        airconditionerInformation: '',
        pattern: '',
        description: '',
        capacity: null,
        deposit: null,
        pay: null,
        floorHeight: '',
        patternDescription: '',
        landscapeDescription: '',
        businessCircles: '',
        decorationCustomization: '',
        networkBroadband: '',
        leaseFiling: '',
        officeFurniture: '',
        cleaning: '',
        regionalAllocation: '',
        extensive: '',
        picture: [],
        fileList: [],
        managerRoomDescription: {
          extensive: '',
          room_orientation: '',
          window: ''
        }, // 经理室
        officeDescription: {
          extensive: '',
          room_orientation: '',
          window: ''
        }, // 办公室
        openRoomDescription: {
          extensive: '',
          room_orientation: '',
          window: ''
        }, // 开放间
        toiletDescription: {
          extensive: '',
          room_orientation: '',
          window: ''
        }, // 卫生间
        balconyDescription: {
          extensive: '',
          room_orientation: '',
          window: ''
        } // 阳台
      },
      showShelf: false,
      isUpload: false
    }
  },
  created() {
    // 默认加载的函数
    this.changeselect()
  },
  methods: {
    Listingsubmission() {
      this.$refs['houseList'].$refs['form'].validate(async valid => {
        if (valid) {
          if (this.form.fileList && this.form.fileList.length > 0) {
            const file = await this.upload()
            file.pictureUrl.forEach(item => {
              if (this.form.picture.indexOf(item) < 0) {
                this.form.picture.push(item.fileUrl)
              }
            })
            this.form.fileList = []
          }
          const fn = this.form.hasOwnProperty('id') ? updateHousesInfo : addListingsubmission
          const res = await fn(this.form)
          if (res.code === 20000) {
            this.$router.push({
              path: '/house'
            })
          } else {
            this.$message({
              message: res.message,
              duration: 1500
            })
          }
        }
      })
    },
    upload() {
      return new Promise((resolve, reject) => {
        const formData = new FormData()
        this.form.fileList.forEach(file => {
          if (file.raw) {
            formData.append('file', file.raw, file.raw.name)
            this.isUpload = true
          }
        })
        if (this.isUpload) {
          multipleUpload(formData).then(res => {
            resolve(res.data)
          })
        }
      })
    },
    async changeselect() {
      this.form.fileList = []
      // 获取房源信息
      if (this.$route.query.id) {
        const loc = await selectHousesInfo({ id: this.$route.query.id })
        loc.data.description = loc.data.descriptions
        this.form = loc.data
        this.form.picture = this.form.pictureList
        if (this.form.rentalStatus === 3 && this.form.auditStatus !== 1) {
          this.form.pictureList = []
          this.form.pictureList.push({ url: this.form.leasedPicture })
        } else {
          this.form.pictureList = this.form.pictureList.map(item => {
            return { url: item }
          })
        }
        this.form.managerRoomDescription = loc.data.managerRoomDescriptions
        this.form.officeDescription = loc.data.officeDescriptions
        this.form.openRoomDescription = loc.data.openRoomDescriptions
        this.form.toiletDescription = loc.data.toiletDescriptions
        this.form.balconyDescription = loc.data.balconyDescriptions
      } else {
        this.form.buildingId = this.$route.query.buildingId
        this.form.pedestal = this.$route.query.pedestal
        this.form.officeBuildingName = this.$route.query.officeBuildingName
      }
    },
    remove() {
      this.$refs['tip'].openDeleteForm()
    },
    toExamined() {
      this.$router.push({
        name: 'HouseList'
      })
    },
    async deleteHousing() {
      const loc = await deleteHousesInfo({ id: this.$route.query.id })
      if (loc.code === 20000) {
        this.$router.push({
          path: '/house'
        })
      }
    },
    RentalState() {
      this.showShelf = true
    },
    close() {
      this.showShelf = false
    },
    handleSuccess() {
      this.showShelf = false
      this.changeselect()
    }
  }
}
</script>

<style lang="scss" scoped>
.div_top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  height: 100%;
}
.houdiv > .el-form-item {
  float: left;
  margin-right: 10px;
}
</style>
