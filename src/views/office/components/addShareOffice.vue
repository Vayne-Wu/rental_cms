<template>
  <div>
    <el-dialog v-if="shareForm" title="新增共享办公" :visible.sync="showShareOffice" :before-close="cancle" width="700px">
      <el-form :model="shareForm" class="dialogform">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="所在商圈：">
              <el-select
                v-model="shareForm.parkId"
                value-key="entryName"
                style="width: 100%"
                :disabled="true"
              >
                <el-option
                  v-for="item in businessList"
                  :key="item.id"
                  :label="item.entryName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="共享办公名称">
              <el-input v-model="shareForm.sharedOfficeName" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="共享办公分类">
              <el-select v-model="shareForm.sharedOfficeType" placeholder="请选择" style="width: 100%">
                <el-option
                  v-for="item in typeopen"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4">
            <el-form-item label="栋座">
              <el-input v-model="shareForm.pedestal" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="楼层">
              <el-input v-model="shareForm.floor" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="空间Logo">
              <br>
              <el-upload
                :action="uploadUrl"
                list-type="picture-card"
                class="upload"
              >
                <i class="el-icon-plus" />
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <div>
          <h3>
            补充信息
            <span style="font-size: 12px">(选填)</span>
          </h3>
        </div>
        <el-row>
          <el-col :span="24">
            <el-form-item label="标签">
              <el-select
                v-model="shareForm.label"
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
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="项目介绍">
              <el-input
                v-model="shareForm.projectIntroduction"
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 8}"
                placeholder="请输入内容"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="照片：">
              <br>
              <el-upload
                :action="uploadUrl"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
              >
                <i class="el-icon-plus" />
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt>
              </el-dialog>
            </el-form-item>
          </el-col>
        </el-row>
        <div>
          <h3>
            扩展信息
            <span style="font-size: 12px">(选填)</span>
          </h3>
        </div>
        <el-form-item label="公共空间：">
          <br>
          <el-checkbox-group v-model="shareForm.publicSpace">
            <el-checkbox-button
              v-for="city in publicspace"
              :key="city.id"
              :label="city.id"
            >{{ city.servicesName }}</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="基础服务：">
          <br>
          <el-checkbox-group v-model="shareForm.basicServices">
            <el-checkbox-button
              v-for="city in Basicservices"
              :key="city.id"
              :label="city.id"
              size="mini"
            >{{ city.servicesName }}</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="企业服务：">
          <br>
          <el-checkbox-group v-model="shareForm.enterpriseServices">
            <el-checkbox-button
              v-for="city in Enterpriseservices"
              :key="city.id"
              :label="city.id"
            >{{ city.servicesName }}</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancle">取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { selectindustrialPark, selectessential } from '@/api/business/office'
export default {
  name: 'AddShareOffice',
  props: {
    showShareOffice: {
      type: Boolean,
      default: false
    },
    shareForm: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      businessList: [],
      publicspace: [],
      Basicservices: [],
      Enterpriseservices: [],
      optionsto: [],
      dialogVisible: false,
      dialogImageUrl: null,
      typeopen: [
        { value: '1', label: '众创空间' },
        { value: '2', label: '商务中心' },
        { value: '3', label: '联合办公' },
        { value: '4', label: '孵化器' }
      ]
    }
  },
  computed: {
    uploadUrl() {
      return process.env.VUE_APP_BASE_API + '/picture/pictureUpload'
    }
  },
  created() {
    this.selectessential()
    this.changeSelect()
  },
  methods: {
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    cancle() {
      this.$emit('close-share')
    },
    selectessential() {
      selectessential().then(res => {
        if (res.code === 20000) {
          this.publicspace = res.data.getPublicSpace
          this.Basicservices = res.data.getBasicServices
          this.Enterpriseservices = res.data.getEnterpriseServices
          this.optionsto = res.data.getlabel
        }
      })
    },
    changeSelect() {
      selectindustrialPark({ projectName: '' }).then(res => {
        if (res.code === 20000) {
          this.businessList = res.data
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dialogform .el-form-item{
  margin-bottom: 15px;
}
.el-checkbox-button .el-checkbox-button__inner{
  border-radius: 5px!important;
  border-left: 1px solid #DCDFE6;
}
.el-checkbox-button, .el-checkbox-button__inner{
  margin: 5px;
  border: 1px solid rgba(0,0,0,.1);
}
.upload {
  >>>.el-upload--picture-card {
    width: 80px;
    height: 80px;
    line-height: 90px;
  }
}
</style>
