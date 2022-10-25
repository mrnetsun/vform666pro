<template>
  <el-form-item :label="i18nt('designer.setting.okButtonHidden')">
    <el-switch v-model="optionModel.okButtonHidden"></el-switch>
  </el-form-item>
</template>

<script>
  import i18n from "@/utils/i18n"

  export default {
    name: "okButtonHidden-editor",
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
