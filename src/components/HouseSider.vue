<template>
  <div>
    <div class="div_icon">
      <el-tooltip v-show="!isSort" placement="top" effect="dark" content="排序">
        >
        <i class="el-icon-sort-down" @click="sort" />
      </el-tooltip>
      <el-button v-show="isSort" type="primary" size="mini" @click="comfirmSort">确定</el-button>
      <i
        :class="isCollapse ? 'el-icon-d-arrow-right' : 'el-icon-d-arrow-left'"
        @click="isCollapse = !isCollapse"
      />
    </div>
    <el-aside width="ouat" style="height: calc(100vh - 195px);overflow-x: hidden;">
      <el-menu :default-active="defaultActive" class="el-menu-vertical-demo" :collapse="isCollapse">
        <draggable :style="isCollapse ? 'padding-bottom: 30px;' : 'padding-bottom: 30px;'" :list="sites" :disabled="enabled" ghost-class="ghost" @update="update">
          <el-menu-item
            v-for="site in sites"
            :key="site.id"
            :index="(site.id).toString()"
            class="el-menu-item-dome"
            :title="site.officeBuildingName"
            @click="clickMenuItem(site)"
          >
            <div class="flex-center">
              <div>
                <el-image
                  class="image"
                  :src="site.pictureList[0]"
                  :fit="fitt"
                />
              </div>
              <div class="title_div">
                <div class="location">{{ site.officeBuildingName }}({{ site.alias }})</div>
                <div v-if="site.sumCount" class="block_span">
                  {{ site.vacantCount ? site.vacantCount : 0 }}/{{ site.sumCount }}空置
                </div>
                <div style="line-height: 20px;">
                  <el-tag v-if="site.beOverdueCount" type="danger" size="mini">逾期{{ site.beOverdueCount }}</el-tag>
                  <el-tag v-if="site.expireCount" type="warning" size="mini">到期{{ site.expireCount }}</el-tag>
                </div>
              </div>
              <div style="width: 10%">
                <span class="el-icon-edit" @click.stop="editResou(site.id)" />
              </div>
            </div>
          </el-menu-item>
        </draggable>
        <el-button type="primary" plain class="el-icon-plus" :style="isCollapse ? 'width: 110px;' : 'width: 280px;'" style="height: 50px;position: fixed;bottom: 0;" @click="toOffice">
          {{ isCollapse ? '' : '添加写字楼项目' }}
        </el-button>
      </el-menu>
    </el-aside>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { postOfficeBuildingSort } from '@/api/resources'
export default {
  name: 'HouseSider',
  components: {
    draggable
  },
  props: {
    sites: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      fitt: 'cover',
      enabled: true,
      isCollapse: true,
      dragging: false,
      isSort: false,
      defaultActive: '',
      orderList: [],
      sortList: []
    }
  },
  watch: {
    sites: {
      handler(value) {
        if (value.length > 0) {
          this.defaultActive = (value[0].id).toString()
        }
      }
    }
  },
  methods: {
    sort() {
      this.isSort = true
      this.enabled = false
    },
    comfirmSort() {
      this.isSort = false
      this.enabled = true
      if (this.sortList.length > 0) {
        postOfficeBuildingSort({ sortList: this.sortList }).then(res => {
          if (res.code === 20000) {
            this.$emit('update-list')
          } else {
            this.$message({
              message: res.message,
              duration: 1500
            })
          }
        })
      }
    },
    update(e) {
      this.sites.forEach((item, index) => {
        this.orderList.push({ sort: index + 1 })
      })
      this.sortList = this.sites.map((item, index) => {
        return { id: item.id, ...this.orderList[index] }
      })
    },
    clickMenuItem(site) {
      document.body.style.overflow = 'auto'
      this.$emit('click-menu-item', site)
    },
    editResou(id) {
      this.$emit('edit-resou', id)
    },
    toOffice() {
      this.$router.push({
        path: '/office'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
>>>.el-button {
  padding: 0;
  width: 40px;
  height: 25px;
}
.el-menu--collapse {
  width: 110px;
}
.el-menu-item-dome {
  height: 80px;
}
.div_icon {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
  border: 1px solid rgba(0, 0, 0, .1);
  height: 50px;
  line-height: 50px;
  i {
    cursor: pointer;
  }
}
.flex-center {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .image {
    width: 70px;
    height: 70px;
    margin-top: 5px;
    border-radius: 5px;
    margin-right: 30px;
  }
}
.title_div {
  width: 117px;
  height: 100%;
  .location {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
    width: 90px;
    line-height: 20px;
  }
  .block_span {
    font-size: 12px;
    font-weight: 400;
    line-height: 20px;
    color: rgba(17,17,17,0.4);
  }
  .el-icon-edit {
    margin-left: 115px;
    &:hover {
    color: #409eff;
    }
  }
}
.el-menu-vertical-demo {
  height: 100%;
  position: relative;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 280px;
}
>>>.el-menu-item.is-active {
  background-color: #f1f1f2;
}
</style>
