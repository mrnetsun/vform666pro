<template>
  <container-item-wrapper :widget="widget">

    <div :key="widget.id" class="tab-container"
         v-show="!widget.options.hidden">
      <el-tabs v-model="activeTabName" :type="widget.displayType" :ref="widget.id" :class="[customClass]"
               @tab-click="handleTabClick">
        <el-tab-pane v-for="(tab, index) in visibleTabs" :key="index" :label="tab.options.label"
                     :disabled="tab.options.disabled" :name="tab.options.name">
          <template v-for="(subWidget, swIdx) in tab.widgetList">
            <template v-if="'container' === subWidget.category">
              <component :is="getComponentByContainer(subWidget)" :widget="subWidget" :key="swIdx" :parent-list="tab.widgetList"
                         :index-of-parent-list="swIdx" :parent-widget="widget"
                         :sub-form-row-id="subFormRowId" :sub-form-row-index="subFormRowIndex" :sub-form-col-index="subFormColIndex">
                <!-- 递归传递插槽！！！ -->
                <template v-for="slot in Object.keys($slots)" v-slot:[slot]="scope">
                  <slot :name="slot" v-bind="scope"/>
                </template>
              </component>
            </template>
            <template v-else>
              <component :is="subWidget.type + '-widget'" :field="subWidget" :key="swIdx" :parent-list="tab.widgetList"
                         :index-of-parent-list="swIdx" :parent-widget="widget"
                         :sub-form-row-id="subFormRowId" :sub-form-row-index="subFormRowIndex" :sub-form-col-index="subFormColIndex">
                <!-- 递归传递插槽！！！ -->
                <template v-for="slot in Object.keys($slots)" v-slot:[slot]="scope">
                  <slot :name="slot" v-bind="scope"/>
                </template>
              </component>
            </template>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>

  </container-item-wrapper>
</template>

<script>
  import emitter from '@/utils/emitter'
  import i18n from "../../../utils/i18n"
  import refMixin from "../../../components/form-render/refMixin"
  import ContainerItemWrapper from './container-item-wrapper'
  import containerItemMixin from "./containerItemMixin";
  import FieldComponents from '@/components/form-designer/form-widget/field-widget/index'

  export default {
    name: "tab-item",
    componentName: 'ContainerItem',
    mixins: [emitter, i18n, refMixin, containerItemMixin],
    components: {
      ContainerItemWrapper,
      ...FieldComponents,
    },
    props: {
      widget: Object,

      subFormRowIndex: { /* 子表单组件行索引，从0开始计数 */
        type: Number,
        default: -1
      },
      subFormColIndex: { /* 子表单组件列索引，从0开始计数 */
        type: Number,
        default: -1
      },
      subFormRowId: { /* 子表单组件行Id，唯一id且不可变 */
        type: String,
        default: ''
      },
    },
    inject: ['refList', 'sfRefList', 'globalModel'],
    data() {
      return {
        activeTabName: '',
      }
    },
    computed: {
      visibleTabs() {
        return this.widget.tabs.filter(tp => {
          return !tp.options.hidden
        })
      },

    },
    created() {
      this.initRefList()
    },
    mounted() {
      this.initActiveTab()
    },
    beforeUnmount() {
      this.unregisterFromRefList()
    },
    methods: {
      initActiveTab() {
        if ((this.widget.type === 'tab') && (this.widget.tabs.length > 0)) {
          let activePanes = this.widget.tabs.filter((tp) => {
            return tp.options.active === true
          })
          if (activePanes.length > 0) {
            this.activeTabName = activePanes[0].options.name
          } else {
            this.activeTabName = this.widget.tabs[0].options.name
          }
        }
      },

      handleTabClick(tab) {
        if (!!this.widget.options.onTabClick) {
          let customFn = new Function('tab', this.widget.options.onTabClick)
          customFn.call(this, tab)
        }
      }

    },
  }
</script>

<style lang="scss" scoped>


</style>
