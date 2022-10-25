<template>
  <el-drawer ref="drawerRef" :title="options.title" v-model="drawerVisible" custom-class="dynamic-drawer" append-to-body destroy-on-close
             :size="options.size" :modal="options.showModal" :direction="options.direction"
             :show-close="options.showClose" :close-on-click-modal="options.closeOnClickModal"
             :close-on-press-escape="options.closeOnPressEscape"
             :before-close="handleBeforeClose" @close="handleCloseEvent" @opened="handleOpenedEvent">
    <VFormRender ref="dFormRef" :form-json="formJson" :form-data="formData"
                 :option-data="optionData" :global-dsv="globalDsv" :parent-form="parentFormRef"
                 :disabled-mode="options.disabledMode" :dynamic-creation="true">
    </VFormRender>
    <template #footer>
      <div style="float: right">
        <el-button v-if="!options.cancelButtonHidden" @click="handleCancelClick">
          {{cancelBtnLabel}}</el-button>
        <el-button v-if="!options.okButtonHidden" type="primary" @click="handleOkClick">
          {{okBtnLabel}}</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script>
  import i18n from "@/utils/i18n"

  export default {
    name: "dynamic-drawer",
    mixins: [i18n],
    props: {
      options: {
        type: Object,
        default: () => ({})
      },
      formJson: {
        type: Object,
      },
      formData: {
        type: Object,
        default: () => ({})
      },
      optionData: { //prop传入的选项数据
        type: Object,
        default: () => ({})
      },
      globalDsv: { // 全局数据源变量
        type: Object,
        default: () => ({})
      },
      parentFormRef: {
        type: Object,
        default: null
      },
      extraData: {
        type: Object,
        default: () => ({})
      },
    },
    data() {
      return {
        drawerVisible: false,
      }
    },
    computed: {
      cancelBtnLabel() {
        return this.options.cancelButtonLabel || this.i18nt('designer.hint.cancel')
      },

      okBtnLabel() {
        return this.options.okButtonLabel || this.i18nt('designer.hint.confirm')
      }

    },
    mounted() {
      //
    },
    beforeDestroy() {
      this.parentFormRef.setChildFormRef(null)
    },
    methods: {
      show() {
        this.drawerVisible = true

        //设置readMode模式
        this.$nextTick(() => {
          if (!!this.options.readMode) {
            this.$refs['dFormRef'].setReadMode(true)
          }

          this.$refs['dFormRef'].setDialogOrDrawerRef(this)
          this.parentFormRef.setChildFormRef(this.$refs['dFormRef'])
        })
      },

      close() {
        if (!!this.options.onDrawerBeforeClose) {
          let customFn = new Function(this.options.onDrawerBeforeClose)
          let closeResult = customFn.call(this)
          if (closeResult === false) {
            return
          }
        }

        this.drawerVisible = false
        this.$refs['drawerRef'].handleClose()
        setTimeout(this.deleteWrapperNode, 150)
      },

      deleteWrapperNode() {
        let wrapperNode = document.getElementById('vf-dynamic-drawer-wrapper')
        if (!!wrapperNode) {
          document.body.removeChild(wrapperNode)
        }
      },

      handleBeforeClose(done) {
        if (!!this.options.onDrawerBeforeClose) {
          let customFn = new Function(this.options.onDrawerBeforeClose)
          let closeResult = customFn.call(this)
          return (closeResult === false) ? closeResult : done()
        }

        return done()
      },

      handleCloseEvent() {
        this.drawerVisible = false
        setTimeout(this.deleteWrapperNode, 150)
      },

      handleOpenedEvent() {
        if (!!this.options.onDrawerOpened) {
          let customFn = new Function(this.options.onDrawerOpened)
          customFn.call(this)
        }
      },

      handleCancelClick() {
        if (!!this.options.onCancelButtonClick) {
          let customFn = new Function(this.options.onCancelButtonClick)
          let clickResult = customFn.call(this)
          if (clickResult === false) {
            return
          }
        }

        this.drawerVisible = false
        setTimeout(this.deleteWrapperNode, 150)
      },

      handleOkClick() {
        if (!!this.options.onOkButtonClick) {
          let customFn = new Function(this.options.onOkButtonClick)
          let clickResult = customFn.call(this)
          if (clickResult === false) {
            return
          }
        }

        this.drawerVisible = false
        setTimeout(this.deleteWrapperNode, 150)
      },

      getParentFormRef() {
        return this.parentFormRef
      },

      getFormRef() {
        return this.$refs['dFormRef']
      },

      getWidgetRef(widgetName, showError = false) {
        return this.$refs['dFormRef'].getWidgetRef(widgetName, showError)
      },

      getExtraData() {
        return this.extraData
      },

    }
  }
</script>

<style lang="scss" scoped>
  .dynamic-drawer {
    :deep(.el-drawer__header) {
      margin-bottom: 10px;
    }

    :deep(.el-drawer__body) {
      padding: 15px;
    }
  }

</style>
