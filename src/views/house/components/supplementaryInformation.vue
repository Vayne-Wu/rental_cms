<template>
  <div style="margin-top: 100px;">
    <h4>补充信息</h4>
    <el-row :gutter="20">
      <el-col :span="10">
        <el-form-item label="户型朝向：" style="width: 517px;">
          <br>
          <el-radio-group v-model="form.roomOrientation">
            <el-radio-button
              v-for="city in cityOptionsto"
              :key="city"
              :label="city"
              :value="city"
            >{{ city }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item label="景观描述：">
          <el-input
            v-model="form.landscapeDescription"
            placeholder="请输入景观描述"
          />
        </el-form-item>
      </el-col>
      <!-- <el-col :span="5">
        <el-form-item label="空调计费：">
          <el-select
            v-model="form.airconditionerBilling"
            value-key="label"
            placeholder="请选择"
            style="width: 100%;"
          >
            <el-option
              v-for="billing in billingList"
              :key="billing.id"
              :label="billing.label"
              :value="billing.label"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="5">
        <el-form-item label="空调信息：">
          <el-input
            v-model="form.airconditionerInformation"
            autocomplete="off"
            placeholder="请输入空调信息"
          />
        </el-form-item>
      </el-col> -->
    </el-row>
    <el-row :gutter="40">
      <el-col :span="8" style="display: flex;justify-content: space-between;">
        <el-form-item label="工商注册：">
          <el-select v-model="form.businessCircles" value-key="label" placeholder="请选择工商注册">
            <el-option v-for="circle in businessList" :key="circle.id" :label="circle.label" :value="circle.label" />
          </el-select>
        </el-form-item>
        <el-form-item label="装修定制：">
          <el-select v-model="form.decorationCustomization" value-key="label" placeholder="请选择装修定制">
            <el-option v-for="decoration in decorationList" :key="decoration.id" :label="decoration.label" :value="decoration.label" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8" style="display: flex;justify-content: space-between;">
        <el-form-item label="网络宽带：">
          <el-select v-model="form.networkBroadband" value-key="label" placeholder="请选择网络宽带">
            <el-option v-for="network in networkList" :key="network.id" :label="network.label" :value="network.label" />
          </el-select>
        </el-form-item>
        <el-form-item label="租赁备案：">
          <el-select v-model="form.leaseFiling" value-key="label" placeholder="请选择租赁备案">
            <el-option v-for="lease in leaseList" :key="lease.id" :label="lease.label" :value="lease.label" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8" style="display: flex;justify-content: space-between;">
        <el-form-item label="办公家具：">
          <el-select v-model="form.officeFurniture" value-key="label" placeholder="请选择办公家具">
            <el-option v-for="furniture in furnitureList" :key="furniture.id" :label="furniture.label" :value="furniture.label" />
          </el-select>
        </el-form-item>
        <el-form-item label="清洁保洁：">
          <el-select v-model="form.cleaning" value-key="label" placeholder="请选择清洁保洁">
            <el-option v-for="clean in cleanList" :key="clean.id" :label="clean.label" :value="clean.label" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <!-- <el-col :span="4">
        <el-form-item label="格局：">
          <el-select v-model="form.pattern" value-key="label" placeholder="请选择格局">
            <el-option v-for="pattern in patternList" :key="pattern.id" :label="pattern.label" :value="pattern.label" />
          </el-select>
        </el-form-item>
      </el-col> -->
      <el-col :span="4">
        <el-form-item label="区域配案：">
          <el-input v-model="form.regionalAllocation" />
        </el-form-item>
      </el-col>
      <el-col :span="20">
        <el-form-item label="更多描述：" style="clear:both">
          <el-input v-model="form.description" placeholder="请输入房源描述" />
        </el-form-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'SupplementaryInformation',
  props: {
    form: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      cityOptionsto: ['东', '南', '西', '北', '东西', '西南', '西北', '东北'],
      billingList: [
        { id: 1, label: '按流量计费' },
        { id: 2, label: '按电量计费' },
        { id: 3, label: '包空调费用' }
      ],
      businessList: [
        { id: 1, label: '可注册地址' },
        { id: 2, label: '不可注册地址' }
      ],
      decorationList: [
        { id: 1, label: '可分割' },
        { id: 2, label: '不可分割' }
      ],
      networkList: [
        { id: 1, label: '自有机房' },
        { id: 2, label: '宽带自装' }
      ],
      leaseList: [
        { id: 1, label: '红本' },
        { id: 2, label: '白本' }
      ],
      furnitureList: [
        { id: 1, label: '家私配齐' },
        { id: 2, label: '家私自购' }
      ],
      cleanList: [
        { id: 1, label: '公区保洁' },
        { id: 2, label: '全保洁' }
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
      ]
    }
  }
}
</script>
