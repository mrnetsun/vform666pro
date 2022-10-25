<template>
  <container-item-wrapper :widget="widget">

    <div :key="widget.id" class="sub-form-container"
         v-show="!widget.options.hidden">
      <el-row class="header-row">
        <div class="action-header-column">
          <span class="action-label">{{i18nt('render.hint.subFormAction')}}</span>
          <el-button v-if="!isReadMode" :disabled="actionDisabled || insertDisabled"
                     round type="primary" size="small" class="action-button"
                     @click="addSubFormRow" :title="i18nt('render.hint.subFormAddActionHint')">
            {{i18nt('render.hint.subFormAddAction')}}<i class="el-icon-plus el-icon-right"></i></el-button>
        </div>
      </el-row>
      <div v-for="(subFormRowId, sfrIdx) in rowIdData" class="sub-form-row" :key="subFormRowId">
        <div v-if="leftActionColumn" class="sub-form-action-column hide-label">
          <div class="action-button-column">
            <el-button :disabled="actionDisabled || insertDisabled"
                       circle type="" icon="el-icon-circle-plus-outline" @click="insertSubFormRow(sfrIdx)"
                       v-show="!isReadMode" :title="i18nt('render.hint.insertSubFormRow')"></el-button>
            <el-button :disabled="actionDisabled || deleteDisabled"
                       circle type="" icon="el-icon-delete" @click="deleteSubFormRow(sfrIdx)"
                       v-show="!isReadMode" :title="i18nt('render.hint.deleteSubFormRow')"></el-button>
            <span v-if="widget.options.showRowNumber" class="row-number-span">#{{sfrIdx+1}}</span>
          </div>
        </div>
        <div v-if="!leftActionColumn && widget.options.showRowNumber" class="row-no-column">
          <span v-if="widget.options.showRowNumber" class="row-number-span">#{{sfrIdx+1}}</span>
        </div>
        <div class="grid-sub-form-data-row">
          <template v-for="(subWidget, swIdx) in widget.widgetList" :key="widgetSchemaData[sfrIdx][swIdx].id">
            <component :is="getComponentByContainer(subWidget)" :widget="widgetSchemaData[sfrIdx][swIdx]"
                       :parent-list="widget.widgetList"
                       :index-of-parent-list="swIdx" :parent-widget="widget"
                       :sub-form-row-id="subFormRowId" :sub-form-row-index="sfrIdx" :sub-form-col-index="swIdx">
              <!-- 子表单暂不支持插槽！！！ -->
            </component>
          </template>
        </div>
        <div v-if="!leftActionColumn" class="sub-form-action-column hide-label">
          <div class="action-button-column">
            <el-button :disabled="actionDisabled || insertDisabled"
                       circle type="" icon="el-icon-circle-plus-outline" @click="insertSubFormRow(sfrIdx)"
                       v-show="!isReadMode" :title="i18nt('render.hint.insertSubFormRow')"></el-button>
            <el-button :disabled="actionDisabled || deleteDisabled"
                       circle type="" icon="el-icon-delete" @click="deleteSubFormRow(sfrIdx)"
                       v-show="!isReadMode" :title="i18nt('render.hint.deleteSubFormRow')"></el-button>
          </div>
        </div>
      </div>
    </div>

  </container-item-wrapper>
</template>

<script>
  import emitter from '@/utils/emitter'
  import i18n from "../../../utils/i18n"
  import {deepClone, generateId, traverseFieldWidgetsOfContainer} from "@/utils/util"
  import refMixin from "../../../components/form-render/refMixin"
  import ContainerItemWrapper from './container-item-wrapper'
  import containerItemMixin from "./containerItemMixin";
  import FieldComponents from '@/components/form-designer/form-widget/field-widget/index'

  export default {
    name: "grid-sub-form-item",
    componentName: 'ContainerItem',
    mixins: [emitter, i18n, refMixin, containerItemMixin],
    components: {
      ContainerItemWrapper,
      ...FieldComponents,
    },
    props: {
      widget: Object,
    },
    provide() {
      return {
        getSubFormFieldFlag: () => true,
        getSubFormName: () => this.widget.options.name,
      }
    },
    inject: ['refList', 'sfRefList', 'globalModel', 'getReadMode'],
    data() {
      return {
        rowIdData: [],
        widgetSchemaData: [],
        actionDisabled: false,
        insertDisabled: false,  //是否禁止新增、插入记录
        deleteDisabled: false,  //是否禁止删除记录

        fieldWidgetList: [],
      }
    },
    computed: {
      isReadMode() {
        return this.getReadMode()
      },

      leftActionColumn() {
        return (this.widget.options.actionColumnPosition || 'left') === 'left'
      },

    },
    created() {
      this.initRefList()
      this.registerSubFormToRefList()
      this.initRowIdData(true)
      this.initWidgetSchemaData()
      this.initEventHandler()
    },
    mounted() {
      this.extractFieldWidgetList()
      this.handleSubFormFirstRowAdd()  //默认添加首行后，主动触发相关事件！！
    },
    beforeDestroy() {
      this.unregisterFromRefList()
    },
    methods: {
      extractFieldWidgetList() {
        this.fieldWidgetList.splice(0, this.fieldWidgetList.length)
        let fieldListFn = (fw) => {
          this.fieldWidgetList.push(fw)
        }
        traverseFieldWidgetsOfContainer(this.widget, fieldListFn)
      },

      getLabelAlign(widget, subWidget) {
        return subWidget.options.labelAlign || widget.options.labelAlign
      },

      registerSubFormToRefList() {
        if (this.widget.type === 'grid-sub-form') {
          this.sfRefList[this.widget.options.name] = this
        }
      },

      initRowIdData(initFlag) {
        if (this.widget.type === 'grid-sub-form') {
          this.rowIdData.splice(0, this.rowIdData.length)  //清除数组必须用splice，length=0不会响应式更新！！
          let subFormModel = this.formModel[this.widget.options.name]
          if (!!subFormModel && (subFormModel.length > 0)) {
            subFormModel.forEach(() => {
              this.rowIdData.push('id' + generateId())
            })

            if (!!initFlag) {
              //注意：事件触发需延期执行，SumFormDataChange事件处理代码中可能存在尚未创建完成的组件！！
              setTimeout(() => {
                this.handleSubFormRowChange(subFormModel)
              }, 800)
            }
          }
        }
      },

      addToRowIdData() {
        this.rowIdData.push('id' + generateId())
      },

      insertToRowIdData(rowIndex) {
        this.rowIdData.splice(rowIndex, 0, 'id' + generateId())
      },

      deleteFromRowIdData(rowIndex) {
        this.rowIdData.splice(rowIndex, 1)
      },

      getRowIdData() {
        return this.rowIdData
      },

      getWidgetRefOfSubForm(widgetName, rowIndex) {
        let realWidgetName = widgetName + '@row' + this.rowIdData[rowIndex]
        return this.getWidgetRef(realWidgetName)
      },

      initWidgetSchemaData() {  //初始化widgetSchemaData！！！
        if (this.widget.type !== 'grid-sub-form') {
          return
        }

        let rowLength = this.rowIdData.length
        this.widgetSchemaData.splice(0, this.widgetSchemaData.length)  //清除数组必须用splice，length=0不会响应式更新！！
        if (rowLength > 0) {
          for (let i = 0; i < rowLength; i++) {
            let widgetSchemas = []
            this.widget.widgetList.forEach(swItem => {
              widgetSchemas.push( this.cloneSchemaOfWidget(swItem) )
            })
            this.widgetSchemaData.push(widgetSchemas)
          }
        }
      },

      addToWidgetSchemaData(rowIndex) {
        let widgetSchemas = []
        this.widget.widgetList.forEach(swItem => {
          widgetSchemas.push( this.cloneSchemaOfWidget(swItem) )
        })

        if (rowIndex === undefined) {
          this.widgetSchemaData.push(widgetSchemas)
        } else {
          this.widgetSchemaData.splice(rowIndex, 0, widgetSchemas)
        }
      },

      deleteFromWidgetSchemaData(rowIndex) {
        this.widgetSchemaData.splice(rowIndex, 1)
      },

      cloneSchemaOfWidget(widget) {
        let newWidgetSchema = deepClone(widget)
        newWidgetSchema.id = widget.type + generateId()
        return newWidgetSchema
      },

      initEventHandler() {
        if (this.widget.type !== 'grid-sub-form') {
          return
        }

        this.on$('setFormData', (newFormData) => {
          this.initRowIdData(false)
          this.initWidgetSchemaData()

          let subFormData = newFormData[this.widget.options.name] || []
          setTimeout(() => {  //延时触发SubFormRowChange事件, 便于更新计算字段！！
            this.handleSubFormRowChange(subFormData)
          }, 800)
        })
      },

      handleSubFormFirstRowAdd() {
        if (this.widget.type !== 'grid-sub-form') {
          return
        }

        if (!!this.widget.options.showBlankRow && (this.rowIdData.length === 1)) {
          let oldSubFormData = this.formModel[this.widget.options.name] || []

          //确认组件创建成功后触发事件!!
          this.$nextTick(() => {
            this.handleSubFormRowAdd(oldSubFormData, this.rowIdData[0])
            this.handleSubFormRowChange(oldSubFormData)
          })
        }
      },

      addSubFormRow() {
        let newSubFormDataRow = {}
        this.fieldWidgetList.forEach(subFormItem => {
          if (!!subFormItem.formItemFlag) {
            newSubFormDataRow[subFormItem.options.name] = subFormItem.options.defaultValue
          }
        })

        let oldSubFormData = this.formModel[this.widget.options.name] || []
        oldSubFormData.push(newSubFormDataRow)
        this.addToRowIdData()
        this.addToWidgetSchemaData()

        //确认组件创建成功后触发事件!!
        this.$nextTick(() => {
          this.handleSubFormRowAdd(oldSubFormData, this.rowIdData[oldSubFormData.length - 1])
          this.handleSubFormRowChange(oldSubFormData)
        })
      },

      insertSubFormRow(beforeFormRowIndex) {
        let newSubFormDataRow = {}
        this.fieldWidgetList.forEach(subFormItem => {
          if (!!subFormItem.formItemFlag) {
            newSubFormDataRow[subFormItem.options.name] = subFormItem.options.defaultValue
          }
        })

        let oldSubFormData = this.formModel[this.widget.options.name] || []
        oldSubFormData.splice(beforeFormRowIndex, 0, newSubFormDataRow)
        this.insertToRowIdData(beforeFormRowIndex)
        this.addToWidgetSchemaData(beforeFormRowIndex)

        //确认组件创建成功后触发事件!!
        this.$nextTick(() => {
          this.handleSubFormRowInsert(oldSubFormData, this.rowIdData[beforeFormRowIndex])
          this.handleSubFormRowChange(oldSubFormData)
        })
      },

      deleteSubFormRow(formRowIndex) {
        this.$confirm(this.i18nt('render.hint.deleteSubFormRow') + '?', this.i18nt('render.hint.prompt'), {
          confirmButtonText: this.i18nt('render.hint.confirm'),
          cancelButtonText: this.i18nt('render.hint.cancel')
        }).then(() => {
          let oldSubFormData = this.formModel[this.widget.options.name] || []
          let deletedDataRow = deepClone(oldSubFormData[formRowIndex])
          oldSubFormData.splice(formRowIndex, 1)
          this.deleteFromRowIdData(formRowIndex)
          this.deleteFromWidgetSchemaData(formRowIndex)

          //确认组件创建成功后触发事件!!
          this.$nextTick(() => {
            this.handleSubFormRowDelete(oldSubFormData, deletedDataRow)
            this.handleSubFormRowChange(oldSubFormData)
          })
        }).catch(() => {
          //
        })
      },

      handleSubFormRowChange(subFormData) {
        if (!!this.widget.options.onSubFormRowChange) {
          let customFunc = new Function('subFormData', this.widget.options.onSubFormRowChange)
          customFunc.call(this, subFormData)
        }
      },

      handleSubFormRowAdd(subFormData, newRowId) {
        if (!!this.widget.options.onSubFormRowAdd) {
          let customFunc = new Function('subFormData', 'newRowId', this.widget.options.onSubFormRowAdd)
          customFunc.call(this, subFormData, newRowId)
        }
      },

      handleSubFormRowInsert(subFormData, newRowId) {
        if (!!this.widget.options.onSubFormRowInsert) {
          let customFunc = new Function('subFormData', 'newRowId', this.widget.options.onSubFormRowInsert)
          customFunc.call(this, subFormData, newRowId)
        }
      },

      handleSubFormRowDelete(subFormData, deletedDataRow) {
        if (!!this.widget.options.onSubFormRowDelete) {
          let customFunc = new Function('subFormData', 'deletedDataRow', this.widget.options.onSubFormRowDelete)
          customFunc.call(this, subFormData, deletedDataRow)
        }
      },

      setDisabled(flag) {
        if (!!flag) {
          this.disableSubForm()
        } else {
          this.enableSubForm()
        }
      },

      /**
       * 设置单行子表单是否禁止新增、插入记录
       * @param flag
       */
      setInsertDisabled(flag) {
        this.insertDisabled = flag
      },

      /**
       * 设置单行子表单是否禁止删除记录
       * @param flag
       */
      setDeleteDisabled(flag) {
        this.deleteDisabled = flag
      },

    },
  }
</script>

<style lang="scss" scoped>
  .sub-form-container {
    margin-bottom: 8px;
    text-align: left; //IE浏览器强制居左对齐

    :deep(.el-row.header-row) {
      padding: 0;
      display: flex;
    }

    :deep(div.sub-form-row) {
      padding: 0;
      display: flex;
      align-items: center;
      border: 1px solid #e1e2e3;

      .row-number-span {
        margin-left: 16px;
      }
    }
  }

  div.action-header-column {
    display: inline-block;
    //width: 120px;
    width: 100%;
    border: 1px solid #e1e2e3;
    background: #f1f2f3;
    padding: 8px;

    .action-label {
      margin-right: 12px;
    }

    .action-button {
      padding-left: 8px;
      padding-right: 8px;
    }
  }

  div.field-header-column {
    display: inline-block;
    //overflow: hidden;
    //white-space: nowrap;  //文字超出长度不自动换行
    //text-overflow: ellipsis;  //文字超出长度显示省略号
    border: 1px solid #e1e2e3;
    background: #f1f2f3;
    padding: 8px;

    span.custom-label i {
      margin: 0 3px;
    }
  }

  div.field-header-column.is-required:before {
    content: '*';
    color: #F56C6C;
    margin-right: 4px;
  }

  div.label-center-left {
    text-align: left;
  }

  div.label-center-align {
    text-align: center;
  }

  div.label-right-align {
    text-align: right;
  }

  div.sub-form-action-column {
    display: inline-block;
    align-items: center;
    text-align: center;
    width: 120px;
    padding: 8px;

    :deep(.el-form-item) {
      margin-bottom: 0;
    }

  :deep(.el-button) {
      font-size: 18px;
      padding: 0;
      background: #DCDFE6;
      border: 4px solid #DCDFE6;
    }

  }

  div.grid-sub-form-data-row {
    display: inline-block;
    width: 100%;
    border-left: 1px solid #e1e2e3;
    border-right: 1px solid #e1e2e3;
  }

  div.sub-form-action-column.hide-label {
    :deep(.el-form-item__label) {
      display: none;
    }
  }

  div.row-no-column {
    display: flex;
    align-items: center;
    width: 50px;
    border-radius: 10px;
    background: #f1f2f3;
    padding: 5px 0;
    margin: 0 6px;
  }

  div.sub-form-table-column {
    display: inline-block;
    border: 1px solid #e1e2e3;
    padding: 8px;

    :deep(.el-form-item) {
      margin-left: 4px;
      margin-right: 4px;
      margin-bottom: 0;
    }

    :deep(.el-form-item__content) {
      margin-left: 0 !important;
    }
  }

  div.sub-form-table-column.hide-label {
    :deep(.el-form-item__label) {
      display: none;
    }
  }

</style>
