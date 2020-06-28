<template>
  <div>
    <el-container>
      <el-header>
        <div class="header">
          <span>{{ this.$route.query.id ? '编辑写字楼项目' : '添加写字楼项目' }}</span>
          <div>
            <el-button type="primary" @click="save">保 存</el-button>
            <el-button v-show="$route.query.id" slot="reference" type="danger" plain @click="remove">删除</el-button>
            <delete-tip ref="tip" @delete-current="deleteOffice" />
          </div>
        </div>
      </el-header>
      <el-main style="background-color: rgb(244, 244, 245);">
        <officeBuilding ref="office" :form="form" :user-name="userName" @add-share="addShare" />
        <!--  ----------------------------  新增共享办公弹窗-------------------------------------------------->
        <share-office v-if="showShareOffice" :show-share-office="showShareOffice" :share-form="shareForm" @close-share="closeShare" />
        <!--  ----------------------------  新增项目所在弹窗-------------------------------------------------->
        <el-dialog title="新增项目所在" :visible.sync="dialogLocation" width="700px">
          <el-form ref="dataForm" :model="Projectlocationobj">
            <el-form-item label="基础信息">
              <el-input v-model="Projectlocationobj.entryName" autocomplete="off" />
              <div class="regiondiv" style="margin: 10px 0px 10px 0px">
                <el-select v-model="Projectlocationobj.city" placeholder="请选择" style="width: 170px">
                  <el-option
                    key="1"
                    label="深圳"
                    value="1"
                  />
                </el-select>
                <el-cascader
                  v-model="Projectlocationobj.address"
                  :options="address"
                  style="width: 300px"
                />
                <el-select v-model="Projectlocationobj.type" placeholder="请选择" style="width: 170px">
                  <el-option
                    key="1"
                    label="写字楼"
                    value="1"
                  />
                  <el-option
                    key="2"
                    label="产业园"
                    value="2"
                  />
                  <el-option
                    key="3"
                    label="商住"
                    value="3"
                  />
                </el-select>
              </div>
              <el-input v-model="form.name" autocomplete="off" />
            </el-form-item>
            <el-form-item label="项目介绍">
              <el-input
                v-model="Projectlocationobj.information"
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 8}"
                placeholder="请输入内容"
              />
            </el-form-item>
            <el-form-item label="照片：">
              <el-upload
                :action="uploadUrl"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
              >
                <i class="el-icon-plus" />
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
            </el-form-item>
            <!-- <el-form-item label="选择标签">
              <el-select
                v-model="Projectlocationobj.label"
                multiple
                filterable
                allow-create
                default-first-option
                placeholder="请选择文章标签"
                style="width: 100%"
              >
                <el-option
                  v-for="item in optionsto"
                  :key="item.id"
                  :label="item.servicesName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item> -->
            <div>
              <h3>扩展信息<span style="font-size: 12px">(选填)</span></h3>
            </div>
            <div class="extended">
              <el-select v-model="Projectlocationobj.extendedInformation[0].Grade" placeholder="选择等级">
                <el-option
                  key="1"
                  label="深圳"
                  value="1"
                />
              </el-select>
              <el-select v-model="Projectlocationobj.extendedInformation[0].air_conditioner" placeholder="选择空调">
                <el-option
                  key="1"
                  label="深圳"
                  value="1"
                />
              </el-select>
              <el-select v-model="Projectlocationobj.extendedInformation[0].billing_method" placeholder="选择计费方式">
                <el-option
                  key="1"
                  label="深圳"
                  value="1"
                />
              </el-select>
              <el-select v-model="Projectlocationobj.extendedInformation[0].operators" placeholder="选择运营商">
                <el-option
                  key="1"
                  label="深圳"
                  value="1"
                />
              </el-select>
              <el-input v-model="Projectlocationobj.extendedInformation[0].year" placeholder="请输入年份">
                <template slot="append">年</template>
              </el-input>
              <el-input v-model="Projectlocationobj.extendedInformation[0].area" placeholder="请输入面积">
                <template slot="append">m²</template>
              </el-input>
              <el-input v-model="Projectlocationobj.extendedInformation[0].area_rate" placeholder="请输入得房率">
                <template slot="append">%</template>
              </el-input>
              <el-input v-model="Projectlocationobj.extendedInformation[0].storey_height" placeholder="请输入层高">
                <template slot="append">m</template>
              </el-input>
              <el-input v-model="Projectlocationobj.extendedInformation[0].floor_information" placeholder="楼层信息,比如A栋.." />
              <el-input v-model="Projectlocationobj.extendedInformation[0].number_elevators" placeholder="电梯数量" />
              <el-input v-model="Projectlocationobj.extendedInformation[0].estate_management" placeholder="物业公司名称" />
              <el-input v-model="Projectlocationobj.extendedInformation[0].property_management" placeholder="物业费" />
              <el-input v-model="Projectlocationobj.extendedInformation[0].air_conditioning" placeholder="空调信息" />
              <el-input v-model="Projectlocationobj.extendedInformation[0].parking_lot" placeholder="停车场" />
              <el-input v-model="Projectlocationobj.extendedInformation[0].number_parking" placeholder="停车数量" />
              <el-input v-model="Projectlocationobj.extendedInformation[0].parking_rate" placeholder="停车费" />
            </div>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogLocation = false">取 消</el-button>
            <el-button type="primary" @click="submitlocation">确 定</el-button>
          </div>
        </el-dialog>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { addSharedoffice, selectAttractuser, addProjectlocation,
  selectIDSharedoffice,
  updateSharedoffice,
  deleteSharedoffice
} from '@/api/business/office'
import { multipleUpload } from '@/api/resources'
import shareOffice from './components/addShareOffice'
import officeBuilding from './components/officeBuilding'
import DeleteTip from '@/components/Popup/DeleteTip'
export default {
  name: 'AddOffice',
  components: {
    shareOffice,
    officeBuilding,
    DeleteTip
  },
  data() {
    return {
      imageUrl: '',
      showShareOffice: false,
      dialogLocation: false,
      Projectlocationobj: { // 新增项目所在对象
        entryName: '',
        city: '',
        address: '',
        type: '',
        information: '',
        extendedInformation: [{
          year: '',
          Grade: '',
          area: '',
          area_rate: '',
          storey_height: '',
          floor_information: '',
          number_elevators: '',
          estate_management: '',
          property_management: '',
          air_conditioner: '',
          billing_method: '',
          air_conditioning: '',
          operators: '',
          parking_lot: '',
          number_parking: '',
          parking_rate: ''
        }],
        picture: '',
        label: ''
      },
      form: {
        type: null,
        parkId: null,
        officeBuildingName: '',
        alias: '',
        businessStatus: '',
        businessArea: null,
        subtitle: '',
        label: '',
        managementFee: '',
        estateManagement: '',
        propertyClass: '',
        utilizationRate: '',
        mainFloor: '',
        elevator: '',
        address: '',
        developers: '',
        buildingType: '',
        buildingStructure: '',
        extensive: '',
        standardArea: '',
        parkingSpacesNumber: null,
        metroStation: '',
        airConditioner: '',
        operator: '',
        leadingCadre: [],
        shareDescription: [],
        picture: [],
        fileList: [],
        metroList: [
          { line: '', station: '', exit: '', subwayList: [], stationList: [] }
        ]
      },
      shareForm: {},
      address: [{
        value: '罗湖',
        label: '罗湖',
        children: [
          { value: '火车站', label: '火车站' }
        ]
      }],
      userName: [],
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  computed: {
    uploadUrl() {
      return process.env.VUE_APP_BASE_API + '/picture/pictureUpload'
    }
  },
  created() { // 默认加载的函数
    this.changeselect()
  },
  methods: {
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    async changeselect() { // 默认获取用户信息
      this.form.fileList = []
      const user = await selectAttractuser()
      this.userName = user.data
      if (this.$route.query.id) {
        const loc = await selectIDSharedoffice({ id: this.$route.query.id })
        loc.data.businessArea = Number(loc.data.businessArea)
        loc.data.parkId = Number(loc.data.parkId)
        loc.data.type = Number(loc.data.type)
        loc.data.leadingCadre = loc.data.leadingCadres
        loc.data.shareDescription = loc.data.shareDescriptions
        this.form = loc.data
        this.form.picture = this.form.pictureList
        this.form.pictureList = this.form.pictureList.map(item => {
          return { url: item }
        })
      }
    },
    addShare() { // 打开共享办公新增弹窗获取数据
      if (this.form.location !== '') {
        // this.showShareOffice = true
        this.shareForm = {
          parkId: Number(this.form.parkId),
          publicSpace: [],
          basicServices: [],
          enterpriseServices: [],
          label: []
        }
      } else {
        this.$message({
          message: '请先选项目所在地',
          type: 'warning'
        })
      }
    },
    closeShare() {
      this.showShareOffice = false
    },
    async dialogSubmission() { // 保存共享办公
      if (this.shareForm.addoredit !== undefined) {
        this.form.shareDescription[this.shareForm.addoredit] = this.shareForm
      } else {
        this.form.shareDescription.push(this.shareForm)
      }
      this.showShareOffice = false
    },
    save() { // 保存写字楼项目
      this.$refs['office'].$refs['dataForm'].validate(async valid => {
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
          const fn = this.form.hasOwnProperty('id') ? updateSharedoffice : addSharedoffice
          if (this.form.hasOwnProperty('id')) {
            delete this.form.leadingCadres
          }
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
    remove() {
      this.$refs['tip'].openDeleteForm()
    },
    async deleteOffice(id) { // 删除写字楼项目
      const res = await deleteSharedoffice({ id: this.$route.query.id })
      if (res.code === 20000) {
        this.$router.push({
          path: '/house'
        })
      }
    },
    showeditdialog(obj, id) {
      this.showShareOffice = true
      obj.addoredit = id
      this.shareForm = obj
    },
    async addlocation() { // 打开新增项目所在
      this.dialogLocation = true
    },
    async submitlocation() { // 提交新增项目所在
      const res = await addProjectlocation(this.Projectlocationobj)
      if (res.code === 20000) {
        this.dialogLocation = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  height: 100%;
}
.extended .el-input{
  width: 160px;
  margin-bottom: 10px;
}
</style>

