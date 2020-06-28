<template>
  <div>
    <el-dialog title="导入房源模板" :visible.sync="showImport" width="30%">
      <errorMsg ref="error" :error-data="errorData" />
      <el-form
        ref="form"
        :model="form"
        label-width="120px"
        style="width: 400px; margin: 0 auto;"
        :rules="rules"
      >
        <el-form-item label="写字楼名称：" prop="buildingId">
          <el-select
            v-model="form.buildingId"
            no-data-text="查找中...请稍后！"
            filterable
            default-first-option
            value-key="buildingName"
            :filter-method="searchBuildingInfo"
            style="width: 100%"
            placeholder="请选择写字楼"
            @change="selectId"
          >
            <el-option
              v-for="item in buildingInfoList"
              :key="item.id"
              :label="item.buildingName"
              :value="item.id"
              :disabled="item.disabled"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="导入房源：" prop="file">
          <el-upload
            ref="upload"
            :action="importUrl"
            accept=".xlsx, .xls"
            :on-change="handleChange"
            :on-remove="handleRemove"
            :auto-upload="false"
            :limit="1"
          >
            <el-button>点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="showImport = false">取消</el-button>
        <el-button @click="confirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { getBuildingInfo } from '@/api/business/office'
import { postUploadHouses, postBuildingNameList } from '@/api/management/house'
import { debounce } from '@/utils/util'
import ErrorMsg from '@/components/Popup/ErrorMsg'
export default {
  name: 'HouseOperation',
  components: {
    ErrorMsg
  },
  data() {
    const valiFile = (rule, value, callback) => {
      if (!this.isUpload) {
        callback((new Error('请上传文件')))
      } else {
        callback()
      }
    }
    return {
      showImport: false,
      isUpload: false,
      buildingName: '',
      errorData: [],
      result: {},
      form: {
        buildingId: ''
      },
      rules: {
        buildingId: [
          { required: true, message: '请选择写字楼名称', trigger: 'change' }
        ],
        file: [
          { required: true, validator: valiFile }
        ]
      },
      buildingInfoList: [
        { id: '禁止', entryName: '请输入写字楼关键字进行搜索', disabled: true }
      ]
    }
  },
  computed: {
    importUrl() {
      return process.env.VUE_APP_BASE_API + '/excel/uploadHouses'
    }
  },
  created() {
    this.changeBuilding()
    this.result = new FormData()
  },
  methods: {
    openDialog() {
      this.showImport = true
      this.form = {
        buildingId: ''
      }
    },
    async changeBuilding() {
      const res = await postBuildingNameList({ buildingName: this.buildingName })
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
    searchBuildingInfo: debounce(function(val) {
      this.buildingName = val
      this.buildingInfoList = []
      this.changeBuilding()
    }, 1000),
    selectId(val) {
      this.result.set('buildingId', this.form.buildingId)
    },
    handleChange(file) {
      this.result.set('file', file.raw)
      this.isUpload = true
    },
    handleRemove(file) {
      this.isUpload = false
    },
    confirm() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          const res = await postUploadHouses(this.result)
          if (res.code === 20000) {
            if (res.data.state === 'success') {
              this.$message({
                message: '上传成功！',
                duration: 1500
              })
              this.$refs['upload'].clearFiles()
              this.$emit('update-house')
              this.showImport = false
            } else {
              this.errorData = res.data.errorMsg
              this.$refs['error'].openErrorForm()
            }
          } else {
            this.$message({
              message: res.message,
              duration: 1500
            })
          }
        }
      })
    }
  }
}
</script>
