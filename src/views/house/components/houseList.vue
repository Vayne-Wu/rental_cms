<template>
  <div class="divform">
    <!-- <tenant-information
      v-if="$route.query.id"
      :information="form.tenant ? form.tenant[0] : {}"
      :rental-status="form.rentalStatus"
    /> -->
    <el-form v-if="form" ref="form" :model="form" :rules="rules" class="form">
      <h4 style="padding: 20px 0;font-size: 20px;">房源信息</h4>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="房源所在：">
            <el-select
              v-model="form.officeBuildingName"
              style="width: 100%"
              :disabled="true"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="房源类型：">
            <el-select v-model="form.type" value-key="label" placeholder="请选择" style="width: 100%;">
              <el-option
                v-for="item in typeList"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <div v-show="form.type === 1">
          <el-col :span="3">
            <el-form-item label="栋座：" prop="pedestal">
              <el-input v-model="form.pedestal" placeholder="请输入栋座" />
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="楼层：" prop="floor">
              <el-input v-model="form.floor" placeholder="楼层">
                <template slot="append">层</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="楼层高度：" prop="floorHeight">
              <el-input
                v-model="form.floorHeight"
                placeholder="请输入楼层高度"
              />
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="房间号：" prop="roomNumber">
              <el-input
                v-model="form.roomNumber"
                placeholder="请输入房间号"
              />
            </el-form-item>
          </el-col>
        </div>
        <div v-show="form.type === 2">
          <el-col :span="6">
            <el-form-item v-show="form.type == 2" label="容纳人数：">
              <el-input
                v-model="form.capacity"
                autocomplete="off"
                placeholder="请输入容纳人数"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="空间类型：" style="width: 200px">
              <el-radio-group v-model="form.spaceType">
                <el-radio-button key="1" label="1" :value="1">独立空间</el-radio-button>
                <el-radio-button key="2" label="2" :value="2">空位</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </div>
      </el-row>
      <el-row :gutter="20">
        <div v-show="form.type === 1">
          <el-col :span="3">
            <el-form-item label="面积：" prop="extensive">
              <el-input v-model="form.extensive" autocomplete="off" placeholder="请输入面积">
                <template slot="append">m²</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="使用率(%)：" prop="utilizationRate">
              <el-input
                v-model="form.utilizationRate"
                autocomplete="off"
                placeholder="请输入使用率"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="租金单价：" prop="rent">
              <el-input v-model="form.rent" placeholder="请输入租金单价">
                <template slot="append">元/m²/月</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="月总租金：" prop="monthRent">
              <el-input v-model="form.monthRent">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col>
        </div>
        <div v-show="form.type === 2">
          <el-col :span="6">
            <el-form-item v-show="form.type == 2" label="办公室编号：">
              <el-input
                v-model="form.roomNumber"
                autocomplete="off"
                placeholder="请输入办公室编号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item v-show="form.type == 2" label="月服务费：">
              <el-input
                v-model="form.monthRent"
                autocomplete="off"
                placeholder="请输入月服务费"
              >
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col>
        </div>
        <el-col :span="3">
          <el-form-item label="隔间：" prop="cubicle">
            <el-input v-model="form.cubicle" autocomplete="off" placeholder="请输入隔间">
              <template slot="append">个</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label="格局描述：">
            <el-select v-model="form.pattern" value-key="label" placeholder="请选择格局">
              <el-option v-for="pattern in patternList" :key="pattern.id" :label="pattern.label" :value="pattern.label" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="40">
        <div v-show="form.type === 1">
          <el-col v-if="form.managerRoomDescription" :span="8" style="display: flex;justify-content: space-between;">
            <el-form-item label="经理室：">
              <br>
              <el-input v-model="form.managerRoomDescription.extensive" style="width: 150px;">
                <template slot="append">m²</template>
              </el-input>
            </el-form-item>
            <el-form-item label="朝向：">
              <el-select v-model="form.managerRoomDescription.room_orientation" style="width: 120px">
                <el-option v-for="orientation in cityOptionsto" :key="orientation" :label="orientation" :value="orientation" />
              </el-select>
            </el-form-item>
            <el-form-item label="是否带窗：">
              <el-select v-model="form.managerRoomDescription.window" style="width: 120px">
                <el-option v-for="window in isWindowList" :key="window" :label="window" :value="window" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="form.officeDescription" :span="8" style="display: flex;justify-content: space-between;">
            <el-form-item label="办公室：">
              <el-input v-model="form.officeDescription.extensive" style="width: 150px;">
                <template slot="append">m²</template>
              </el-input>
            </el-form-item>
            <el-form-item label="朝向：">
              <el-select v-model="form.officeDescription.room_orientation" style="width: 120px">
                <el-option v-for="orientation in cityOptionsto" :key="orientation" :label="orientation" :value="orientation" />
              </el-select>
            </el-form-item>
            <el-form-item label="是否带窗：">
              <el-select v-model="form.officeDescription.window" style="width: 120px">
                <el-option v-for="window in isWindowList" :key="window" :label="window" :value="window" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="form.openRoomDescription" :span="8" style="display: flex;justify-content: space-between;">
            <el-form-item label="开放间：">
              <el-input v-model="form.openRoomDescription.extensive" style="width: 150px;">
                <template slot="append">m²</template>
              </el-input>
            </el-form-item>
            <el-form-item label="朝向：">
              <el-select v-model="form.openRoomDescription.room_orientation" style="width: 120px">
                <el-option v-for="orientation in cityOptionsto" :key="orientation" :label="orientation" :value="orientation" />
              </el-select>
            </el-form-item>
            <el-form-item label="是否带窗：">
              <el-select v-model="form.openRoomDescription.window" style="width: 120px">
                <el-option v-for="window in isWindowList" :key="window" :label="window" :value="window" />
              </el-select>
            </el-form-item>
          </el-col>
        </div>
      </el-row>
      <el-row :gutter="40">
        <div v-show="form.type === 1">
          <el-col v-if="form.balconyDescription" :span="8" style="display: flex;justify-content: space-between;">
            <el-form-item label="阳台：">
              <el-input v-model="form.balconyDescription.extensive" style="width: 150px;">
                <template slot="append">m²</template>
              </el-input>
            </el-form-item>
            <el-form-item label="朝向：">
              <el-select v-model="form.balconyDescription.room_orientation" style="width: 120px">
                <el-option v-for="orientation in cityOptionsto" :key="orientation" :label="orientation" :value="orientation" />
              </el-select>
            </el-form-item>
            <el-form-item label="是否带窗：">
              <el-select v-model="form.balconyDescription.window" style="width: 120px">
                <el-option v-for="window in isWindowList" :key="window" :label="window" :value="window" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="form.toiletDescription" :span="8" style="display: flex;justify-content: space-between;">
            <el-form-item label="卫生间：">
              <br>
              <el-input v-model="form.toiletDescription.extensive" style="width: 150px;">
                <template slot="append">m²</template>
              </el-input>
            </el-form-item>
            <el-form-item label="朝向：">
              <el-select v-model="form.toiletDescription.room_orientation" style="width: 120px">
                <el-option v-for="orientation in cityOptionsto" :key="orientation" :label="orientation" :value="orientation" />
              </el-select>
            </el-form-item>
            <el-form-item label="是否带窗：">
              <el-select v-model="form.toiletDescription.window" style="width: 120px">
                <el-option v-for="window in isWindowList" :key="window" :label="window" :value="window" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="装修：">
              <br>
              <el-radio-group v-model="form.renovation">
                <el-radio-button key="1" :label="1" :value="1">精修</el-radio-button>
                <el-radio-button key="2" :label="2" :value="2">毛坯</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </div>
      </el-row>
      <el-row :gutter="20">
        <!-- <el-col :span="8">
          <el-form-item label="押金：" style="width: 250px">
            <br>
            <span style="margin-right: 10px">押</span>
            <el-input v-model="form.deposit" autocomplete="off" style="width: 80px" />
            <span style="margin: 0 10px">付</span>
            <el-input v-model="form.pay" autocomplete="off" style="width: 80px" />
          </el-form-item>
        </el-col> -->
        <div>
          <el-col :span="16">
            <el-form-item label="房源照片：">
              <br>
              <el-upload
                ref="upload"
                :action="uploadUrl"
                multiple
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
                <img width="100%" :src="dialogImageUrl">
              </el-dialog>
            </el-form-item>
          </el-col>
        </div>
      </el-row>
      <supplementary-information v-show="form.type === 1" :form="form" />
    </el-form>
  </div>
</template>

<script>
// import tenantInformation from './tenantInformation'
import supplementaryInformation from './supplementaryInformation'
export default {
  name: 'HouseList',
  components: {
    // tenantInformation,
    supplementaryInformation
  },
  props: {
    form: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      cityOptions: ['有装修', '毛坯'],
      cityOptionsto: ['东', '南', '西', '北', '东西', '西南', '西北', '东北'],
      isWindowList: ['是', '否'],
      typeList: [
        { id: 1, label: '标准办公' }
        // { id: 2, label: '筑梦之星（共享办公）' }
      ],
      patternList: [
        { id: 0, label: '全开放式' },
        { id: 1, label: '1+1' },
        { id: 2, label: '1+2' },
        { id: 3, label: '1+3' },
        { id: 4, label: '1+4' },
        { id: 5, label: '1+5' },
        { id: 6, label: '1+6' },
        { id: 7, label: '1+7' },
        { id: 8, label: '1+8' },
        { id: 9, label: '1+9' },
        { id: 10, label: '1+10' }
      ],
      rules: {
        pedestal: [
          { required: true, message: '栋座不能为空' }
        ],
        floor: [
          { required: true, message: '楼层不能为空' }
        ],
        floorHeight: [
          { required: true, message: '楼层高度不能为空' }
        ],
        roomNumber: [
          { required: true, message: '房间号不能为空' }
        ],
        extensive: [
          { required: true, message: '面积不能为空' }
        ],
        utilizationRate: [
          { required: true, message: '使用率不能为空' }
        ],
        cubicle: [
          { required: true, message: '隔间不能为空' }
        ],
        rent: [
          { required: true, message: '租金单价不能为空' }
        ],
        monthRent: [
          { required: true, message: '月总租金不能为空' }
        ]
      }
    }
  },
  computed: {
    uploadUrl() {
      return process.env.VUE_APP_BASE_API + '/picture/pictureUploads'
    }
  },
  methods: {
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
.divform {
  width: 100%;
  background-color: #ffffff;
  .form {
    width: 80%;
    margin: 0 auto;
  }
}
>>>.el-input__inner {
  &::placeholder {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    width: 100px;
  }
}
</style>
