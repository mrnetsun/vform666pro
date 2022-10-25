import {deepClone, traverseFieldWidgetsOfContainer, traverseWidgetsOfContainer} from "@/utils/util";

export default {
  computed: {
    customClass() {
      return this.widget.options.customClass || ''
    },

    formModel: {
      cache: false,
      get() {
        return this.globalModel.formModel
      }
    },

  },
  mounted() {
    this.callSetHidden()
  },

  methods: {
    cloneWidgetSchema(widget) {
      return deepClone(widget)
      /**
       * 注意：在v-for循环中，必须保证克隆对象与原对象完全一致，修改克隆对象任何属性，
       * 都会触发组件的beforeDestroy事件钩子！！！
       */


      // let newWidgetSchema = deepClone(widget)
      // newWidgetSchema.id = widget.type + generateId()
      // return newWidgetSchema
    },

    unregisterFromRefList() {  //销毁容器组件时注销组件ref
      if ((this.refList !== null) && !!this.widget.options.name) {
        let oldRefName = this.widget.options.name
        delete this.refList[oldRefName]
      }
    },

    /* 主动触发setHidden()方法，以清空被隐藏容器内字段组件的校验规则！！ */
    callSetHidden() {
      if (this.widget.options.hidden === true) {
        this.setHidden(true)
      }
    },

    //--------------------- 以下为组件支持外部调用的API方法 begin ------------------//
    /* 提示：用户可自行扩充这些方法！！！ */

    setHidden(flag) {
      this.widget.options.hidden = flag

      /* 容器被隐藏后，需要同步清除容器内部字段组件的校验规则 */
      let clearRulesFn = (fieldWidget) => {
        let fwName = fieldWidget.options.name
        let fwRef = this.getWidgetRef(fwName)
        if (flag && !!fwRef && !!fwRef.clearFieldRules) {
          fwRef.clearFieldRules()
        }

        if (!flag && !!fwRef && !!fwRef.buildFieldRules) {
          fwRef.buildFieldRules()
        }
      }

      traverseFieldWidgetsOfContainer(this.widget, clearRulesFn)
    },

    /**
     * 禁用或启用容器组件（包含容器内部的所有组件）
     * @param flag
     */
    setDisabled(flag) {
      const fwHandler = (fw) => {
        const fwName = fw.options.name
        const fwRef = this.getWidgetRef(fwName)
        if (!!fwRef && !!fwRef.setDisabled) {
          fwRef.setDisabled(flag)
        }
      }
      const cwHandler = (cw) => {
        const cwName = cw.options.name
        const cwRef = this.getWidgetRef(cwName)
        if (!!cwRef && !!cwRef.setDisabled) {
          cwRef.setDisabled(flag)
        }
      }
      traverseWidgetsOfContainer(this.widget, fwHandler, cwHandler)

      //注意：单行子表单、多行子表单容器的setDisabled方法由单行子表单、多行子表单组件自己实现！！
    },

    activeTab(tabIndex) { //tabIndex从0计数
      if ((tabIndex >= 0) && (tabIndex < this.widget.tabs.length)) {
        this.widget.tabs.forEach((tp, idx) => {
          tp.options.active = idx === tabIndex
          if (idx === tabIndex) {
            this.activeTabName = tp.options.name
          }
        })
      }
    },

    disableTab(tabIndex) {
      if ((tabIndex >= 0) && (tabIndex < this.widget.tabs.length)) {
        this.widget.tabs[tabIndex].options.disabled = true
      }
    },

    enableTab(tabIndex) {
      if ((tabIndex >= 0) && (tabIndex < this.widget.tabs.length)) {
        this.widget.tabs[tabIndex].options.disabled = false
      }
    },

    hideTab(tabIndex) {
      if ((tabIndex >= 0) && (tabIndex < this.widget.tabs.length)) {
        this.widget.tabs[tabIndex].options.hidden = true
      }
    },

    showTab(tabIndex) {
      if ((tabIndex >= 0) && (tabIndex < this.widget.tabs.length)) {
        this.widget.tabs[tabIndex].options.hidden = false
      }
    },

    setWidgetOption(optionName, optionValue) { //通用组件选项修改API
      if (this.widget.options.hasOwnProperty(optionName)) {
        this.widget.options[optionName] = optionValue
      }
    },

    /**
     * 获取子表单的行数
     */
    getSubFormRowCount() {
      return !this.rowIdData ? 0 : this.rowIdData.length
    },

    setGridSubFormRowDisabled(rowId, disabledFlag) {
      const fwHandler = (fw) => {
        const fwName = fw.options.name + '@row' + rowId
        const fwRef = this.getWidgetRef(fwName)
        if (!!fwRef && !!fwRef.setDisabled) {
          fwRef.setDisabled(disabledFlag)
        }
      }
      const cwHandler = (cw) => {
        const cwName = cw.options.name + '@row' + rowId
        const cwRef = this.getWidgetRef(cwName)
        if (!!cwRef && !!cwRef.setDisabled) {
          cwRef.setDisabled(disabledFlag)
        }
      }
      traverseWidgetsOfContainer(this.widget, fwHandler, cwHandler)
    },

    disableSubFormRow(rowIndex) {
      if (this.widget.type === 'sub-form') {
        this.widget.widgetList.forEach(subWidget => {
          let swRefName = subWidget.options.name + '@row' + this.rowIdData[rowIndex]
          let foundSW = this.getWidgetRef(swRefName)
          if (!!foundSW && !!foundSW.setDisabled) {
            foundSW.setDisabled(true)
          }
        })
      } else if (this.widget.type === 'grid-sub-form') {
        this.setGridSubFormRowDisabled(this.rowIdData[rowIndex], true)
      }
    },

    enableSubFormRow(rowIndex) {
      if (this.widget.type === 'sub-form') {
        this.widget.widgetList.forEach(subWidget => {
          let swRefName = subWidget.options.name + '@row' + this.rowIdData[rowIndex]
          let foundSW = this.getWidgetRef(swRefName)
          if (!!foundSW && !!foundSW.setDisabled) {
            foundSW.setDisabled(false)
          }
        })
      } else if (this.widget.type === 'grid-sub-form') {
        this.setGridSubFormRowDisabled(this.rowIdData[rowIndex], false)
      }
    },

    disableSubForm() {
      if (this.rowIdData.length > 0) {
        this.rowIdData.forEach((dataRow, rIdx) => {
          this.disableSubFormRow(rIdx)
        })
      }

      //禁用3个操作按钮
      this.actionDisabled = true
    },

    enableSubForm() {
      if (this.rowIdData.length > 0) {
        this.rowIdData.forEach((dataRow, rIdx) => {
          this.enableSubFormRow(rIdx)
        })
      }

      //启用3个操作按钮
      this.actionDisabled = false
    },

    disableGridSubFormRow(rowIndex) {
      let gsfFWList = []
      let fieldListFn = (fw) => {
        gsfFWList.push(fw)
      }
      traverseFieldWidgetsOfContainer(this.widget, fieldListFn)

      gsfFWList.forEach(fw => {
        let swRefName = fw.options.name + '@row' + this.rowIdData[rowIndex]
        let foundSW = this.getWidgetRef(swRefName)
        if (!!foundSW && !!foundSW.setDisabled) {
          foundSW.setDisabled(true)
        }
      })
    },

    enableGridSubFormRow(rowIndex) {
      let gsfFWList = []
      let fieldListFn = (fw) => {
        gsfFWList.push(fw)
      }
      traverseFieldWidgetsOfContainer(this.widget, fieldListFn)

      gsfFWList.forEach(fw => {
        let swRefName = fw.options.name + '@row' + this.rowIdData[rowIndex]
        let foundSW = this.getWidgetRef(swRefName)
        if (!!foundSW && !!foundSW.setDisabled) {
          foundSW.setDisabled(false)
        }
      })
    },

    disableGridSubForm() {
      if (this.rowIdData.length > 0) {
        this.rowIdData.forEach((dataRow, rIdx) => {
          this.disableGridSubFormRow(rIdx)
        })
      }

      //禁用3个操作按钮
      this.actionDisabled = true
    },

    enableGridSubForm() {
      if (this.rowIdData.length > 0) {
        this.rowIdData.forEach((dataRow, rIdx) => {
          this.enableGridSubFormRow(rIdx)
        })
      }

      //启用3个操作按钮
      this.actionDisabled = false
    },

    resetSubForm() { //重置subForm数据为空
      if (this.widget.type === 'sub-form') {
        let subFormModel = this.formModel[this.widget.options.name]
        if (!!subFormModel) {
          subFormModel.splice(0, subFormModel.length)
          this.rowIdData.splice(0, this.rowIdData.length)
        }

        if (this.widget.options.showBlankRow) {
          this.addSubFormRow()
        }
      }
    },

    getSubFormValues(needValidation = true) {
      if (this.widget.type === 'sub-form') {
        //TODO: 逐行校验子表单！！
        return this.formModel[this.widget.options.name]
      } else {
        this.$message.error(this.i18nt('render.hint.nonSubFormType'))
      }
    },

    // validateField(fieldName) { //逐行校验子表单字段
    //   //TODO:
    // },
    //
    // validateSubForm() { //逐行校验子表单全部字段
    //   //TODO:
    // },

    /**
     * 动态增加自定义css样式
     * @param className
     */
    addCssClass(className) {
      if (!this.widget.options.customClass) {
        this.widget.options.customClass = [className]
      } else {
        this.widget.options.customClass.push(className)
      }
    },

    /**
     * 动态移除自定义css样式
     * @param className
     */
    removeCssClass(className) {
      if (!this.widget.options.customClass) {
        return
      }

      let foundIdx = -1
      this.widget.options.customClass.map((cc, idx) => {
        if (cc === className) {
          foundIdx = idx
        }
      })
      if (foundIdx > -1) {
        this.widget.options.customClass.splice(foundIdx, 1)
      }
    },

    //--------------------- 以上为组件支持外部调用的API方法 end ------------------//

  },

}
