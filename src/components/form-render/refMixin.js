export default {
  methods: {
    initRefList() {
      if ((this.subFormRowIndex === -1) || (this.subFormRowIndex === undefined)) {  //容器组件未被嵌套于多行子表单之内
        if ((this.refList !== null) && !!this.widget.options.name) {
          this.refList[this.widget.options.name] = this
        }
      } else {  //容器组件被嵌套于多行子表单之内
        if ((this.refList !== null) && !!this.widget.options.name) {
          this.refList[this.widget.options.name + '@row' + this.subFormRowId] = this
        }
      }
    },

    getWidgetRef(widgetName, showError) {
      let foundRef = this.refList[widgetName]
      if (!foundRef && !!showError) {
        this.$message.error(this.i18nt('render.hint.refNotFound') + widgetName)
      }
      return foundRef
    },

    getFormRef() { /* 获取VFrom引用，必须在VForm组件created之后方可调用 */
      return this.refList['v_form_ref']
    },

    getComponentByContainer(con) {
      if (con.type === 'grid') {  //grid-item跟VueGridLayout全局注册组件重名，故特殊处理！！
        return 'vf-grid-item'
      }

      return con.type + '-item'
    },

  }
}
