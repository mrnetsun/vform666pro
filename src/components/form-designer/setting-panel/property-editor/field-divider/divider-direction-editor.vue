<template>
  <el-form-item :label="i18nt('designer.setting.dividerDirection')">
    <el-select v-model="optionModel.direction">
      <el-option label="horizontal" value="horizontal"></el-option>
      <el-option label="vertical" value="vertical"></el-option>
    </el-select>
  </el-form-item>
</template>

<script>
  import i18n from "@/utils/i18n"

  export default {
    name: "divider-direction-editor",
    mixins: [i18n],
    props: {
      designer: Object,
      selectedWidget: Object,
      optionModel: Object,
    },
  }
</script>

<style scoped>

</style>
