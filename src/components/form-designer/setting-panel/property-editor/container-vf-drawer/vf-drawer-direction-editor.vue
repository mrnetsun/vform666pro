<template>
  <el-form-item :label="i18nt('designer.setting.drawDirection')">
    <el-radio-group v-model="optionModel.direction" class="radio-group-custom">
      <el-radio-button label="rtl"><el-icon><Back /></el-icon></el-radio-button>
      <el-radio-button label="ltr"><el-icon><Right /></el-icon></el-radio-button>
      <el-radio-button label="ttb"><el-icon><Bottom /></el-icon></el-radio-button>
      <el-radio-button label="btt"><el-icon><Top /></el-icon></el-radio-button>
    </el-radio-group>
  </el-form-item>
</template>

<script>
  import i18n from "@/utils/i18n"
  import { Bottom, Top, Back, Right } from '@element-plus/icons-vue'

  export default {
    name: "vf-drawer-direction-editor",
    mixins: [i18n],
    components: {
      Back, Right, Bottom, Top
    },
    props: {
      designer: Object,
      selectedWidget: Object,
      optionModel: Object,
    },
    computed: {
      //
    }
  }
</script>

<style lang="scss" scoped>
  .radio-group-custom {
    :deep(.el-radio-button__inner) {
      padding-left: 12px;
      padding-right: 12px;
    }
  }
</style>
