<!--
/**
 * author: vformAdmin
 * email: vdpadmin@163.com
 * website: https://www.vform666.com
 * date: 2021.08.18
 * remark: 如果要分发VForm源码，需在本文件顶部保留此文件头信息！！
 */
-->

<template>
  <el-container class="main-container full-height">
    <el-header class="main-header" v-if="designerConfig.logoHeader !== false">
      <div class="float-left main-title">
        <img src="../../assets/vform-logo.png" @click="openHome">
        <span class="bold">{{ vfProductTitle }}</span></div>
      <div class="float-right external-link" style="margin-top: 10px;">
        <el-button type="text" class="btn btn-danger" @click="applyBuildCode">
          {{ i18nt('application.btnApplyBuilder') }}
        </el-button>
        <el-button type="text" class="btn btn-default" @click="backToForm">
          {{ i18nt('application.btnCancel') }}
        </el-button>
      </div>
    </el-header>

    <el-container>
      <el-aside class="side-panel">
        <widget-panel :designer="designer"/>
      </el-aside>

      <el-container class="center-layout-container">
        <el-header class="toolbar-header">
          <toolbar-panel :designer="designer" :global-dsv="globalDsv" ref="toolbarRef">
            <template v-for="(idx, slotName) in $slots" #[slotName]>
              <slot :name="slotName"></slot>
            </template>
          </toolbar-panel>
        </el-header>
        <el-main class="form-widget-main">
          <el-scrollbar class="container-scroll-bar" :style="{height: scrollerHeight}">
            <v-form-widget :designer="designer" :form-config="designer.formConfig" :global-dsv="globalDsv"
                           ref="formRef">
            </v-form-widget>
          </el-scrollbar>
        </el-main>
      </el-container>

      <el-aside>
        <setting-panel :designer="designer" :selected-widget="designer.selectedWidget" :global-dsv="globalDsv"
                       :form-config="designer.formConfig" @edit-event-handler="testEEH"/>
      </el-aside>
    </el-container>

  </el-container>
</template>

<script>
import WidgetPanel from './widget-panel/index'
import ToolbarPanel from './toolbar-panel/index'
import SettingPanel from './setting-panel/index'
import VFormWidget from './form-widget/index'
import {createDesigner} from "@/components/form-designer/designer"
import {
  addWindowResizeHandler, deepClone, getQueryParam, getAllContainerWidgets,
  getAllFieldWidgets, traverseAllWidgets
} from "@/utils/util"
import {MOCK_CASE_URL, VARIANT_FORM_VERSION} from "@/utils/config"
import i18n, {changeLocale} from "@/utils/i18n"
import axios from 'axios'
import SvgIcon from "@/components/svg-icon/index"

export default {
  name: "VFormDesigner",
  componentName: "VFormDesigner",
  mixins: [i18n],
  components: {
    SvgIcon,
    WidgetPanel,
    ToolbarPanel,
    SettingPanel,
    VFormWidget,
  },
  props: {
    /* 后端字段列表API */
    fieldListApi: {
      type: Object,
      default: null,
    },

    /* 禁止显示的组件名称数组 */
    bannedWidgets: {
      type: Array,
      default: () => []
    },

    /* 设计器配置参数 */
    designerConfig: {
      type: Object,
      default: () => {
        return {
          languageMenu: false,  //是否显示语言切换菜单
          externalLink: false,  //是否显示GitHub、文档等外部链接
          formTemplates: false,  //是否显示表单模板
          eventCollapse: true,  //是否显示组件事件属性折叠面板
          widgetNameReadonly: false,  //禁止修改组件名称

          clearDesignerButton: true,  //是否显示清空设计器按钮
          previewFormButton: true,  //是否显示预览表单按钮
          importJsonButton: true,  //是否显示导入JSON按钮
          exportJsonButton: true,  //是否显示导出JSON器按钮
          exportCodeButton: false,  //是否显示导出代码按钮
          generateSFCButton: false,  //是否显示生成SFC按钮
          logoHeader: true,  //是否显示Logo头部区域（仅Pro）

          toolbarMaxWidth: 420,  //设计器工具按钮栏最大宽度（单位像素）
          toolbarMinWidth: 300,  //设计器工具按钮栏最小宽度（单位像素）

          productName: '',  //自定义表单设计器名称，对应“VForm Pro”（仅Pro）
          productTitle: '',  //自定义表单设计器标题，对应“表单设计器”（仅Pro）

          presetCssCode: '',  //设计器预设CSS样式代码
          languageName: 'zh-CN',  //界面语言，默认显示中文

          resetFormJson: false,  //是否在设计器初始化时将表单内容重置为空
        }
      }
    },

    /* 全局数据源变量 */
    globalDsv: {
      type: Object,
      default: () => ({})
    },

  },
  data() {
    return {
      vFormVersion: VARIANT_FORM_VERSION,
      curLangName: '',
      curLocale: '',

      vsCodeFlag: false,
      caseName: '',

      docUrl: 'https://www.vform666.com/document3.html',
      gitUrl: 'https://github.com/vform666/variant-form3-vite',
      chatUrl: 'https://www.vform666.com/chat-group.html',
      subScribeUrl: 'https://www.vform666.com/subscribe.html',

      scrollerHeight: 0,

      designer: createDesigner(this),

      fieldList: []
    }
  },
  provide() {
    return {
      serverFieldList: this.fieldList,
      getDesignerConfig: () => this.designerConfig,
      getBannedWidgets: () => this.bannedWidgets,
    }
  },
  computed: {
    vfProductName() {
      return (this.designerConfig && this.designerConfig.productName) || 'VForm Pro'
    },

    vfProductTitle() {
      return (this.designerConfig && this.designerConfig.productTitle) ||
          this.i18nt('application.productTitle')
    }

  },
  created() {
    this.designer.initDesigner(!!this.designerConfig.resetFormJson)
    this.vsCodeFlag = getQueryParam('vscode') == 1
    this.caseName = getQueryParam('case')
  },
  mounted() {
    this.initLocale()

    let logoHeaderHeight = (this.designerConfig.logoHeader !== false) ? 48 : 0
    this.scrollerHeight = window.innerHeight - logoHeaderHeight - 42 + 'px'
    addWindowResizeHandler(() => {
      this.$nextTick(() => {
        this.scrollerHeight = window.innerHeight - logoHeaderHeight - 42 + 'px'
      })
    })

    this.loadCase()
    this.loadFieldListFromServer()

    //added by lucdt
    this.initFromCpt()
  },
  methods: {
    testEEH(eventName, eventParams) {
      console.log('test', eventName)
      console.log('test222222', eventParams)
    },

    showLink(configName) {
      if (this.designerConfig[configName] === undefined) {
        return true
      }

      return !!this.designerConfig[configName]
    },

    openHome() {
      if (!!this.vsCodeFlag) {
        const msgObj = {
          cmd: 'openUrl',
          data: {
            url: 'https://www.vform666.com/'
          }
        }
        window.parent.postMessage(msgObj, '*')
      }
    },

    openUrl(event, url) {
      if (!!this.vsCodeFlag) {
        const msgObj = {
          cmd: 'openUrl',
          data: {
            url
          }
        }
        window.parent.postMessage(msgObj, '*')
      } else {
        let aDom = event.currentTarget
        aDom.href = url
        //window.open(url, '_blank') //直接打开新窗口，会被浏览器拦截
      }
    },

    loadCase() {
      if (!this.caseName) {
        return
      }

      axios.get(MOCK_CASE_URL + this.caseName + '.txt').then(res => {
        if (!!res.data.code) {
          this.$message.error(this.i18nt('designer.hint.sampleLoadedFail'))
          return
        }

        this.setFormJson(res.data)
        this.$message.success(this.i18nt('designer.hint.sampleLoadedSuccess'))
      }).catch(error => {
        this.$message.error(this.i18nt('designer.hint.sampleLoadedFail') + ':' + error)
      })
    },

    initLocale() {
      this.curLocale = localStorage.getItem('v_form_locale') || 'en-US'
      this.curLangName = this.i18nt('application.' + this.curLocale)
      this.changeLanguage(this.curLocale)
    },

    loadFieldListFromServer() {
      if (!this.fieldListApi) {
        return
      }

      let headers = this.fieldListApi.headers || {}
      axios.get(this.fieldListApi.URL, {'headers': headers}).then(res => {
        let labelKey = this.fieldListApi.labelKey || 'label'
        let nameKey = this.fieldListApi.nameKey || 'name'

        this.fieldList.splice(0, this.fieldList.length)  //清空已有
        res.data.forEach(fieldItem => {
          this.fieldList.push({
            label: fieldItem[labelKey],
            name: fieldItem[nameKey]
          })
        })
      }).catch(error => {
        this.$message.error(error)
      })
    },

    handleLanguageChanged(command) {
      this.changeLanguage(command)
      this.curLangName = this.i18nt('application.' + command)
    },

    changeLanguage(langName) {
      changeLocale(langName)
    },

    setFormJson(formJson) {
      let modifiedFlag = false
      if (!!formJson) {
        if (typeof formJson === 'string') {
          modifiedFlag = this.designer.loadFormJson(JSON.parse(formJson))
        } else if (formJson.constructor === Object) {
          modifiedFlag = this.designer.loadFormJson(formJson)
        }

        if (modifiedFlag) {
          this.designer.emitHistoryChange()
        }
      }
    },

    getFormJson() {
      return {
        widgetList: deepClone(this.designer.widgetList),
        formConfig: deepClone(this.designer.formConfig)
      }
    },

    clearDesigner() {
      this.$refs.toolbarRef.clearFormWidget()
    },

    //lucdt
    applyBuildCode() {
      let widgetList = deepClone(this.designer.widgetList)
      let formConfig = deepClone(this.designer.formConfig)
      this.jsonContent = JSON.stringify({widgetList, formConfig}, null, '  ')
      this.jsonRawContent = JSON.stringify({widgetList, formConfig})
      $('#form_json').val(this.jsonRawContent);

      loadFormSetting();
      toastr.options.positionClass = 'toast-bottom-right';
      toastr.success('Applied new form design.')

      $('#botble-cpt-forms-cpt-form').show();
      $('#app').hide();
    },

    backToForm() {
      $('#botble-cpt-forms-cpt-form').show();
      $('#app').hide();
    },

    initFromCpt() {
        try {
            //change language by current location
            let langName = $('#site-locale').val();
            // alert(langName);
            let load_lang = 'en-US';
            switch (langName) {
              case 'ko':
                load_lang = 'ko-KR'
                break;
              case 'zh':
                load_lang = 'zh-CN'
                break;
              case 'en':
              default:
                load_lang = 'en-US'
                break;
            }
            console.log('Change language', load_lang);
            changeLocale(load_lang);

            //reimport form design
            let formJson = $('#form_json').val();

            if (!formJson) {
              formJson = '{\n' +
                  '  "widgetList": [],\n' +
                  '  "formConfig": {\n' +
                  '    "modelName": "formData",\n' +
                  '    "refName": "vForm",\n' +
                  '    "rulesName": "rules",\n' +
                  '    "labelWidth": 80,\n' +
                  '    "labelPosition": "left",\n' +
                  '    "size": "",\n' +
                  '    "labelAlign": "label-left-align",\n' +
                  '    "cssCode": "",\n' +
                  '    "customClass": [],\n' +
                  '    "functions": "",\n' +
                  '    "layoutType": "PC",\n' +
                  '    "jsonVersion": 3,\n' +
                  '    "onFormCreated": "",\n' +
                  '    "onFormMounted": "",\n' +
                  '    "onFormDataChange": "",\n' +
                  '    "dataSources": []\n' +
                  '  }\n' +
                  '}';
          } else {
              this.importTemplate = formJson;
              let importObj = JSON.parse(this.importTemplate)
              //console.log('test import', this.importTemplate)
              if (!importObj || !importObj.formConfig) {
                throw new Error(this.i18nt('designer.hint.invalidJsonFormat'))
              }

              let fJsonVer = importObj.formConfig.jsonVersion
              if (!fJsonVer || (fJsonVer !== 3)) {
                throw new Error(this.i18nt('designer.hint.jsonVersionMismatch'))
              }

              this.designer.loadFormJson(importObj)

              this.showImportJsonDialogFlag = false
              //this.$message.success(this.i18nt('designer.hint.importJsonSuccess'))
              console.log('Import Form Successfully');

              this.designer.emitHistoryChange()

              this.designer.emitEvent('form-json-imported', [])
          }
        } catch (e) {
            console.log(e);
        }
    },
    //end lucdt

    /**
     * 刷新表单设计器
     */
    refreshDesigner() {
      //this.designer.loadFormJson( this.getFormJson() )  //只有第一次调用生效？？

      let fJson = this.getFormJson()
      this.designer.clearDesigner(true)  //不触发历史记录变更
      this.designer.loadFormJson(fJson)
    },

    /**
     * 预览表单
     */
    previewForm() {
      this.$refs.toolbarRef.previewForm()
    },

    /**
     * 导入表单JSON
     */
    importJson() {
      this.$refs.toolbarRef.importJson()
    },

    /**
     * 导出表单JSON
     */
    exportJson() {
      this.$refs.toolbarRef.exportJson()
    },

    /**
     * 导出Vue/HTML代码
     */
    exportCode() {
      this.$refs.toolbarRef.exportCode()
    },

    /**
     * 生成SFC代码
     */
    generateSFC() {
      this.$refs.toolbarRef.generateSFC()
    },

    /**
     * 获取所有字段组件
     * @param widgetList 默认为null，代表取当前表单json组件列表
     * @param staticWidgetsIncluded 是否包含按钮等静态组件，默认不包含
     * @returns {*[]}
     */
    getFieldWidgets(widgetList = null, staticWidgetsIncluded = false) {
      return !!widgetList ? getAllFieldWidgets(widgetList, staticWidgetsIncluded) :
          getAllFieldWidgets(this.designer.widgetList, staticWidgetsIncluded)
    },

    /**
     * 获取所有容器组件
     * @param widgetList 默认为null，代表取当前表单json组件列表
     * @returns {*[]}
     */
    getContainerWidgets(widgetList = null) {
      return !!widgetList ? getAllContainerWidgets(widgetList) : getAllContainerWidgets(this.designer.widgetList)
    },

    /**
     * 升级表单json，以补充最新的组件属性
     * @param formJson
     */
    upgradeFormJson(formJson) {
      if (!formJson.widgetList || !formJson.formConfig) {
        this.$message.error('Invalid form json!')
        return
      }

      traverseAllWidgets(formJson.widgetList, (w) => {
        this.designer.upgradeWidgetConfig(w)
      })
      this.designer.upgradeFormConfig(formJson.formConfig)

      return formJson
    },

    getWidgetRef(widgetName, showError = false) {
      return this.$refs['formRef'].getWidgetRef(widgetName, showError)
    },

    getSelectedWidgetRef() {
      return this.$refs['formRef'].getSelectedWidgetRef()
    },

    /**
     * 添加数据源对象
     * @param dsObj
     */
    addDataSource(dsObj) {
      this.designer.formConfig.dataSources.push(dsObj)
    },

    //TODO: 增加更多方法！！

  }
}
</script>

<style lang="scss" scoped>
.el-container.main-container {
  background: #fff;

  :deep(aside) { /* 防止aside样式被外部样式覆盖！！ */
    margin: 0;
    padding: 0;
    background: inherit;
  }
}

.el-container.full-height {
  height: 100%;
  overflow-y: hidden;
}

.el-container.center-layout-container {
  min-width: 680px;
  border-left: 2px dotted #EBEEF5;
  border-right: 2px dotted #EBEEF5;
}

.el-header.main-header {
  border-bottom: 2px dotted #EBEEF5;
  height: 48px !important;
  line-height: 48px !important;
  min-width: 800px;
  //background: #f5f7fa;
}

div.main-title {
  font-size: 18px;
  color: #242424;
  display: flex;
  align-items: center;
  justify-items: center;

  img {
    cursor: pointer;
    width: 36px;
    height: 36px;
  }

  span.bold {
    font-size: 20px;
    font-weight: bold;
    margin: 0 6px 0 6px;
  }

  span.version-span {
    font-size: 14px;
    color: #101F1C;
    margin-left: 6px;
  }
}

.float-left {
  float: left;
}

.float-right {
  float: right;
}

.el-dropdown-link {
  margin-right: 12px;
  cursor: pointer;
}

div.external-link {
  display: flex;
  align-items: center;
  justify-content: center;

  a {
    font-size: 13px;
    text-decoration: none;
    margin-right: 10px;
    color: #606266;
  }
}

.el-header.toolbar-header {
  font-size: 14px;
  border-bottom: 1px dotted #CCCCCC;
  height: 42px !important;
  //line-height: 42px !important;
}

.el-aside.side-panel {
  width: 260px !important;
  overflow-y: hidden;
}

.el-main.form-widget-main {
  padding: 0;

  position: relative;
  overflow-x: hidden;
}

.container-scroll-bar {
  :deep(.el-scrollbar__wrap), :deep(.el-scrollbar__view) {
    overflow-x: hidden;
  }
}
</style>
