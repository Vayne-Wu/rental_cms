<template>
  <div class="content_div">
    <el-form ref="dataForm" :model="form" :rules="rules" class="form">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="所在商圈：" prop="parkId">
            <el-select
              v-model="form.parkId"
              no-data-text="查找中...请稍后！"
              filterable
              value-key="entryName"
              :filter-method="searchBusinessDistrictName"
              style="width: 100%"
              :disabled="!!form.id"
            >
              <div :class="projectNamenull ? 'flex-between' : ''">
                <!-- <el-button v-show="projectNamenull" style="padding: 5px;margin-left: 20px;" title="添加项目所在" icon="el-icon-plus" circle @click="addlocation" /> -->
                <el-option
                  v-for="item in businessList"
                  :key="item.id"
                  :label="item.entryName"
                  :value="item.id"
                  :disabled="item.disabled"
                />
              </div>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="商圈地位：" prop="businessStatus">
            <el-input v-model="form.businessStatus" placeholder="请输入商圈地位" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="商务区域：" prop="businessArea">
            <el-select
              v-model="form.businessArea"
              no-data-text="查找中...请稍后！"
              filterable
              default-first-option
              value-key="businessDistrictName"
              :filter-method="searchDistrictList"
              style="width: 100%"
            >
              <el-option
                v-for="item in districtList"
                :key="item.id"
                :label="item.businessDistrictName"
                :value="item.id"
                :disabled="item.disabled"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="写字楼名称：" prop="officeBuildingName">
            <el-select
              v-model="form.officeBuildingName"
              no-data-text="查找中...请稍后！"
              filterable
              default-first-option
              value-key="buildingName"
              :filter-method="searchBuildingInfo"
              style="width: 100%"
              placeholder="请选择写字楼"
              @change="selectBuilding"
            >
              <el-option
                v-for="item in buildingInfoList"
                :key="item.id"
                :label="item.buildingName"
                :value="item"
                :disabled="item.disabled"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="简称：" prop="alias">
            <br>
            <el-input v-model="form.alias" :disabled="true" placeholder="请输入简称" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="详细地址：" prop="address">
            <el-input v-model="form.address" :disabled="true" placeholder="请输入详细地址" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="标签：" prop="label">
            <br>
            <el-input v-model="form.label" placeholder="请输入标签" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="自定义标题：" prop="subtitle">
            <el-input v-model="form.subtitle" placeholder="请输入自定义标题" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="物业管理费：" prop="managementFee">
            <el-input v-model="form.managementFee" placeholder="请输入物业管理费">
              <template slot="append">元/m²/月</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="物业管理：" prop="estateManagement">
            <el-input v-model="form.estateManagement" placeholder="请输入物业管理" />
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label="物业等级：" prop="propertyClass">
            <el-select v-model="form.propertyClass" placeholder="请选择物业等级">
              <el-option v-for="level in levelList" :key="level.id" :label="level.label" :value="level.label" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label="使用率：">
            <el-input v-model="form.utilizationRate">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label="总楼层：" prop="mainFloor">
            <el-input v-model="form.mainFloor">
              <template slot="append">层</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label="客梯数量：" prop="elevator">
            <el-input v-model="form.elevator">
              <template slot="append">部</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="运营方：" prop="operator">
            <el-input v-model="form.operator" placeholder="请输入运营方" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="开发商：" prop="developers">
            <el-input v-model="form.developers" placeholder="请输入开发商" />
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label="建筑类型：" prop="buildingType">
            <el-select v-model="form.buildingType" value-key="lable" placeholder="请选择建筑类型">
              <el-option v-for="building in buildingList" :key="building.id" :label="building.label" :value="building.label" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label="建筑结构：" prop="buildingStructure">
            <el-select v-model="form.buildingStructure" value-key="lable" placeholder="请选择建筑结构">
              <el-option v-for="building in structureList" :key="building.id" :label="building.label" :value="building.label" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label="总建面：" prop="extensive">
            <el-input v-model="form.extensive">
              <template slot="append">m²</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label="标准层建面：" prop="standardArea">
            <el-input v-model="form.standardArea">
              <template slot="append">m²</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="车位数量：" prop="parkingSpacesNumber">
            <el-input v-model="form.parkingSpacesNumber">
              <template slot="append">m²</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="空调系统：" prop="airConditioner">
            <el-select v-model="form.airConditioner" style="width: 100%;" placeholder="请选择空调系统">
              <el-option v-for="air in airList" :key="air.id" :label="air.label" :value="air.label" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="16">
          <el-form-item label="地铁站点：">
            <br>
            <div v-for="(metro, index) in form.metroList" :key="index" class="flex-between" style="margin-bottom: 20px;">
              <el-select v-model="metro.line" value-key="metroLine" style="width: 25%" @change="selectMetroList($event, index)">
                <el-option v-for="line in metro.subwayList" :key="line.id" :label="line.metroLine" :value="line.metroLine" />
              </el-select>
              <el-select v-model="metro.station" value-key="metroStation" style="width: 25%">
                <el-option v-for="line in metro.stationList" :key="line.id" :label="line.metroStation" :value="line.metroStation" />
              </el-select>
              <el-input v-model="metro.exit" style="width: 25%" />
              <div style="width: 10%;">
                <el-button style="padding: 5px;margin-left: 20px;" icon="el-icon-plus" circle @click="addMetro(index)" />
                <el-button v-if="form.metroList.length > 1 && index != 0" style="padding: 5px;margin-left: 20px;" icon="el-icon-minus" circle @click="deleteMetro(index)" />
              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="项目类型：" prop="type">
            <br>
            <el-radio v-model="form.type" :label="1">标准办公</el-radio>
            <el-radio v-model="form.type" :label="2">共享办公</el-radio>
            <el-radio v-model="form.type" :label="3">标准办公+共享办公</el-radio>
            <div v-for="(item,index) in form.shareDescription" :key="index" class="addShare" style="border: 1px solid #409EFF;color: #409EFF;margin-bottom: 10px" @click="showeditdialog(item,index)"><i class="el-icon-edit">{{ item.projectLocation }}</i></div>
            <!-- <div v-show="form.type > 1" class="addShare" @click="addShare"><span class="el-icon-plus">新建共享办公</span></div> -->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="项目招商：">
            <br>
            <el-checkbox-group v-model="form.leadingCadre">
              <el-checkbox v-for="user in userName" :key="user.userId" :label="user.userId" :value="user.userId">{{ user.nickName }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="自定义写字楼外观：">
            <br>
            <el-upload
              ref="upload"
              multiple
              :action="uploadUrl"
              list-type="picture-card"
              :file-list="form.pictureList"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :on-change="handleChange"
              :auto-upload="false"
            >
              <i class="el-icon-plus" />
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { selectindustrialPark, getBusinessDistrictList, getMetroStationList, getBuildingInfo } from '@/api/business/office'
import { debounce } from '@/utils/util'
export default {
  name: 'OfficeBuilding',
  props: {
    form: {
      type: Object,
      default: () => {}
    },
    userName: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      projectName: '',
      businessDistrictName: '',
      buildingName: '',
      cityId: 0,
      dialogImageUrl: null,
      projectNamenull: false,
      dialogVisible: false,
      subwayList: [],
      stationList: [],
      businessList: [
        { id: '禁止', entryName: '请输入所在商圈关键字进行搜索', disabled: true }
      ],
      districtList: [
        { id: '禁止', entryName: '请输入商务区域关键字进行搜索', disabled: true }
      ],
      buildingInfoList: [
        { id: '禁止', entryName: '请输入写字楼关键字进行搜索', disabled: true }
      ],
      levelList: [
        { id: 1, label: '甲级写字楼' },
        { id: 2, label: '厂业园区' },
        { id: 3, label: '旧改' },
        { id: 4, label: '超甲级写字楼' },
        { id: 5, label: '商业综合体' }
      ],
      rules: {
        parkId: [
          { required: true, message: '请输入所在商圈', trigger: 'change' }
        ],
        businessArea: [
          { required: true, message: '请输入商务区域', trigger: 'blur' }
        ],
        businessStatus: [
          { required: true, message: '请输入商圈地位', trigger: 'change' }
        ],
        officeBuildingName: [
          { required: true, message: '请选择写字楼名称', trigger: 'change' }
        ],
        alias: [
          { required: true, message: '请输入简称', trigger: 'blur' }
        ],
        subtitle: [
          { required: true, message: '请输入自定义标题', trigger: 'change' }
        ],
        label: [
          { required: true, message: '请输入标签', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ],
        managementFee: [
          { required: true, message: '请输入物业管理费', trigger: 'blur' }
        ],
        estateManagement: [
          { required: true, message: '请输入物业管理', trigger: 'blur' }
        ],
        propertyClass: [
          { required: true, message: '请选择物业等级', trigger: 'change' }
        ],
        mainFloor: [
          { required: true, message: '请输入总楼层', trigger: 'blur' }
        ],
        elevator: [
          { required: true, message: '请输入客梯数量', trigger: 'blur' }
        ],
        operator: [
          { required: true, message: '请输入运营方', trigger: 'blur' }
        ],
        developers: [
          { required: true, message: '请输入开发商', trigger: 'blur' }
        ],
        buildingType: [
          { required: true, message: '请选择建筑类型', trigger: 'change' }
        ],
        buildingStructure: [
          { required: true, message: '请选择建筑结构', trigger: 'change' }
        ],
        extensive: [
          { required: true, message: '请输入总建面', trigger: 'blur' }
        ],
        standardArea: [
          { required: true, message: '请输入标准层建面', trigger: 'blur' }
        ],
        parkingSpacesNumber: [
          { required: true, message: '请输入车位数量', trigger: 'blur' }
        ],
        airConditioner: [
          { required: true, message: '请选择空调系统', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请选择项目类型', trigger: 'change' }
        ]
      },
      airList: [
        { id: 1, label: 'VAV计时中央空调' },
        { id: 2, label: 'VRV计流量中央空调' },
        { id: 3, label: '独立式中央空调' },
        { id: 4, label: '集中式中央空调' },
        { id: 5, label: '半集中式中央空调' },
        { id: 6, label: '自装空调（壁挂、吸顶、立式）' }
      ],
      buildingList: [
        { id: 1, label: '玻璃幕墙大厦' },
        { id: 2, label: '砖混大厦' },
        { id: 3, label: '玻璃幕墙厂房' },
        { id: 4, label: '砖混厂房' },
        { id: 5, label: '玻璃幕墙商场/裙楼' },
        { id: 6, label: '砖混商场/裙楼' },
        { id: 7, label: '玻璃幕墙公寓/酒店' },
        { id: 8, label: '砖混公寓/酒店' }
      ],
      structureList: [
        { id: 1, label: '中兴筒四面环窗' },
        { id: 2, label: '排楼大厦' },
        { id: 3, label: '筒子楼大厦' },
        { id: 4, label: '厂房/旧改' }
      ]
    }
  },
  computed: {
    uploadUrl() {
      return process.env.VUE_APP_BASE_API + '/picture/pictureUpload'
    }
  },
  created() {
    this.changeSelect()
    this.changeDistrict()
    this.changeBuilding()
    this.changeMetroList(0)
  },
  methods: {
    searchBusinessDistrictName: debounce(function(val) {
      this.projectNamenull = false
      this.projectName = val
      this.businessList = []
      this.changeSelect()
    }, 1000),
    searchDistrictList: debounce(function(val) {
      this.businessDistrictName = val
      this.districtList = []
      this.changeDistrict()
    }, 1000),
    searchBuildingInfo: debounce(function(val) {
      this.buildingName = val
      this.buildingInfoList = []
      this.changeBuilding()
    }, 1000),
    async changeSelect() { // 查询商圈所在
      const res = await selectindustrialPark({ projectName: this.projectName })
      if (res.data.length > 0) {
        this.businessList = res.data
      } else {
        this.projectNamenull = true
        this.businessList = [{
          value: '禁止',
          entryName: '未找到该商圈',
          disabled: true
        }]
      }
    },
    async changeDistrict() { // 查询商务区域
      const res = await getBusinessDistrictList({ businessDistrictName: this.businessDistrictName })
      if (res.data.length > 0) {
        this.districtList = res.data
      } else {
        this.districtList = [{
          value: '禁止',
          entryName: '未找到该商务区域',
          disabled: true
        }]
      }
    },
    // 获取地铁路线
    async changeMetroList(idx) {
      const res = await getMetroStationList({ cityId: this.cityId })
      if (res.data.length > 0) {
        this.$nextTick(() => {
          if (this.cityId) {
            this.form.metroList[idx].stationList = res.data
          } else {
            this.form.metroList[idx].subwayList = res.data
          }
        })
      } else {
        this.districtList = [{
          value: '禁止',
          entryName: '未找到该商务区域',
          disabled: true
        }]
      }
    },
    async changeBuilding() {
      const res = await getBuildingInfo({ buildingName: this.buildingName })
      if (res.data.length > 0) {
        this.buildingInfoList = res.data
      } else {
        this.buildingInfoList = [{
          value: '禁止',
          entryName: '未找到该商务区域',
          disabled: true
        }]
      }
    },
    selectMetroList(val, idx) {
      this.cityId = this.form.metroList[idx].subwayList.find(item => item.metroLine === val).id
      this.changeMetroList(idx)
    },
    selectBuilding(val) {
      this.form.officeBuildingName = val.buildingName
      this.form.alias = val.abbreviation
      this.form.address = val.address
    },
    addMetro(idx) {
      const index = idx + 1
      this.cityId = 0
      this.changeMetroList(index)
      this.form.metroList.push({ line: '', station: '', exit: '', subwayList: [], stationList: [] })
    },
    deleteMetro(idx) {
      this.form.metroList.splice(idx, 1)
    },
    showeditdialog() {},
    addShare() {
      this.$emit('add-share')
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleRemove(file, fileList) {
      fileList = fileList.filter(item => !item.raw)
      this.form.picture = fileList.map((item, index) => {
        return item.url
      })
    },
    handleChange(file, fileList) {
      const existFile = fileList.slice(0, fileList.length - 1).find(f => f.name === file.name)
      if (existFile) {
        this.$message.error('当前文件已经存在!')
        fileList.pop()
      }
      this.form.fileList = fileList
    }
  }
}
</script>

<style lang="scss" scoped>
.content_div{
  background-color: #ffffff;
  .form {
    width: 90%;
    margin: 0 auto;
    .label {
      width: 100px;
    }
  }
}
.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.addShare{
  width: 90%;
  height: 35px;
  margin: 0 auto;
  border: 1px dashed #c0ccda;
  text-align: center;
  line-height: 35px;
  color: #c0ccda;
  cursor: pointer;
  position: relative;
}
</style>
