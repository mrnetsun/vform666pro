import {
  buildActiveTabs,
  buildDefaultValueListFn,
  buildFieldOptionsFn,
  buildRulesListFn, buildUploadDataFn
} from "@/utils/vue2js-generator";
import {sfcTraverseFieldWidgets} from "@/utils/sfc-util";

export function buildSubFormMethods(widgetList) {
  let template = ``;
  let widget = widgetList.find(
      (x) => x.type === "sub-form" || x.type === "grid-sub-form"
  );
  if (widget) {
    template = `
    methods.addSubFormRow=(widgetId)=>{
    state.formData[widgetId].push({})
   };

   methods.insertSubFormRow=(widgetId,sfrIdx)=>{
    state.formData[widgetId].splice(sfrIdx,0,{})
   };

   methods.deleteSubFormRow=(widgetId,sfrIdx)=>{
    state.formData[widgetId].splice(sfrIdx,1)
   };
   `;
  }

  return template;
}

export function buildDataTableMethods(widgetList) {
  let template = ``;
  let widget = widgetList.find((x) => x.type === "data-table");
  if (widget) {
    template = `
    methods.formatterValue=(row, column, cellValue)=> {
      if (!cellValue) {
        return ''
      }

      let date=cellValue;      
      let v=cellValue;
      let y,m,d,res,length

      if(!!column.formatS) {
        switch(column.formatS) {
          case 'd1':
              if (new Date(Date.parse(date.replace(/-/g, "/"))) === "Invalid Date") {
                return date;
              }
              date = new Date(Date.parse(date.replace(/-/g, "/"))); //转换成Date
              y = date.getFullYear();
              m = date.getMonth() + 1;
              m = m < 10 ? '0' + m : m;
              d = date.getDate();
              d = d < 10 ? ('0' + d) : d;
              return y + '-' + m + '-' + d;
          case 'd2':
            if (new Date(Date.parse(date.replace(/-/g, "/"))) === "Invalid Date") {
              return date;
            }
            date = new Date(Date.parse(date.replace(/-/g, "/"))); //转换成Date
            y = date.getFullYear();
            m = date.getMonth() + 1;
            m = m < 10 ? '0' + m : m;
            d = date.getDate();
            d = d < 10 ? ('0' + d) : d;
            return y + '/' + m + '/' + d;
          case 'd3':
            if (new Date(Date.parse(date.replace(/-/g, "/"))) === "Invalid Date") {
              return date;
            }
            date = new Date(Date.parse(date.replace(/-/g, "/"))); //转换成Date
            y = date.getFullYear();
            m = date.getMonth() + 1;
            m = m < 10 ? '0' + m : m;
            d = date.getDate();
            d = d < 10 ? ('0' + d) : d;
            return y + '年' + m + '月' + d +'日';
          case 'd4':
            if (new Date(Date.parse(date.replace(/-/g, "/"))) === "Invalid Date"){
              return date;
            }
            date = new Date(Date.parse(date.replace(/-/g, "/"))); //转换成Date
            return date.toLocaleString()
          case 'd5':
            if (new Date(Date.parse(date.replace(/-/g, "/"))) === "Invalid Date") {
              return date;
            }
            date = new Date(Date.parse(date.replace(/-/g, "/"))); //转换成Data();
            return date.toLocaleString('chinese', { hour12: false })
          case 'n1':
            if (typeof(v) != "number") {
              return v;
            }
          
            length = v.toString().split(".")[1].length;
            switch(length){
              case 0:
                  v = v.toFixed(0)
                  break;
              case 1:
                  v = v.toFixed(1)
                  break;
              case 2:
                  v = v.toFixed(2)
                  break;
              case 3:
                  v = v.toFixed(3)
                  break;
              case 4:
                  v = v.toFixed(4)
                  break;
              case 5:
                  v = v.toFixed(5)
                  break;
              default:
                  v = v.toFixed(6)
            }
            res = v.toString().replace(/\d+/, function(n){ // 先提取整数部分
              return n.replace(/(\d)(?=(\d{3})+$)/g,function($1){
                return $1+",";
                });
              })
            return res;
          case 'n2':
            if (typeof(v) != "number") {
              return v;
            }
          
            length = v.toString().split(".")[1].length;
            switch(length){
              case 0:
              case 1:
              case 2:
                  v = v.toFixed(2)
                  break;
              case 3:
                  v = v.toFixed(3)
                  break;
              case 4:
                  v = v.toFixed(4)
                  break;
              case 5:
                  v = v.toFixed(5)
                  break;
              default:
                  v = v.toFixed(6)
            }
          
            res = v.toString().replace(/\d+/, function(n){ // 先提取整数部分
              return n.replace(/(\d)(?=(\d{3})+$)/g,function($1){
                return $1+",";
                });
              })
            return res;
          case 'n3':
            if (typeof(v) != "number") {
              return v;
            }
          
            v = v.toFixed(6)
            res = v.toString().replace(/\d+/, function(n){ // 先提取整数部分
              return n.replace(/(\d)(?=(\d{3})+$)/g,function($1){
                return $1+",";
                });
              })
            return res;
          case 'n4':
            if (typeof(v) != "number") {
              return v;
            }
          
            v = v.toFixed(3)
            res = v.toString().replace(/\d+/, function(n){ // 先提取整数部分
              return n.replace(/(\d)(?=(\d{3})+$)/g,function($1){
                return $1+",";
                });
              })
            return res;
          case 'n5':
            if (typeof(v) != "number") {
              return v;
            }
          
            v = v.toFixed(2)
            res = v.toString().replace(/\d+/, function(n){ // 先提取整数部分
              return n.replace(/(\d)(?=(\d{3})+$)/g,function($1){
                return $1+",";
                });
              })
            return res;
          case 'n6':
            if (typeof(v) != "number") {
              return v;
            }
          
            v = v.toFixed(0)
            res = v.toString().replace(/\d+/, function(n){ // 先提取整数部分
              return n.replace(/(\d)(?=(\d{3})+$)/g,function($1){
                return $1+",";
                });
              })
            return res;
          case 'n7':
            if (typeof(v) != "number") {
              return v;
            }
          
            length = v.toString().split(".")[1].length;
            v = v*100
            switch(length){
              case 0:
              case 1:
              case 2:
                  v = v.toFixed(2)
                  break;
              case 3:
                  v = v.toFixed(3)
                  break;
              default:
                  v = v.toFixed(4)
            }
          
            res = v.toString().replace(/\d+/, function(n){ // 先提取整数部分
              return n.replace(/(\d)(?=(\d{3})+$)/g,function($1){
                return $1+",";
                });
              })
            return res+'%';
        }
      }
      return cellValue;
    }
   `;
  }

  return template;
}

export const genVue3JS = function (formConfig, widgetList) {
  let defaultValueList = []
  let rulesList = []
  let fieldOptions = []
  let uploadData = []
  sfcTraverseFieldWidgets(widgetList, (widget) => {
    buildDefaultValueListFn(formConfig, widgetList, defaultValueList)(widget)
    buildRulesListFn(formConfig, widgetList, rulesList)(widget)
    buildFieldOptionsFn(formConfig, widgetList, fieldOptions)(widget)
    buildUploadDataFn(formConfig, widgetList, uploadData)(widget)
  })

  const activeTabs = buildActiveTabs(formConfig, widgetList)

  const v3JSTemplate =
`  import { defineComponent, toRefs, reactive, getCurrentInstance } from 'vue'
  
  export default defineComponent({
    components: {},
    props: {},
    setup() {
      const state = reactive({
        ${formConfig.modelName}: {
          ${defaultValueList.join('\n')}
        },
        
        ${formConfig.rulesName}: {
          ${rulesList.join('\n')}
        },
        
        ${activeTabs.join('\n')}
        
        ${fieldOptions.join('\n')}
        
        ${uploadData.join('\n')}
      })
    
      const methods = {}
      
      const instance = getCurrentInstance()
      
      const submitForm = () => {
        instance.proxy.$refs['vForm'].validate(valid => {
          if (!valid) return
          
          //TODO: 提交表单
        })
      }
      
      const resetForm = () => {
        instance.proxy.$refs['vForm'].resetFields()
      }
      
      ${buildSubFormMethods(widgetList)}
      ${buildDataTableMethods(widgetList)}
      
      return {
        ...toRefs(state),
        ...methods,
        submitForm,
        resetForm
      }
    }
  })`

  return v3JSTemplate
}

