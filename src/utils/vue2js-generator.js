import {isNotNull} from "@/utils/util";
import {translate} from "@/utils/i18n";
import FormValidators, {getRegExp} from "@/utils/validators";
import {sfcTraverseContainerWidgets, sfcTraverseFieldWidgets, sfcTraverseSubformWidgets} from "@/utils/sfc-util";

export function buildDefaultValueListFn(formConfig, widgetList, resultList) {
  return function(fieldWidget) {
    const fop = fieldWidget.options
    const fd = fop.defaultValue

    if (
        fieldWidget.type === "sub-form" ||
        fieldWidget.type === "grid-sub-form"
    ) {
      let resultSubList = {};

      //需要把subform的值整理成 subform:{ input:"",input2:""} 格式，其他的值可以直接写到data(){}里
      sfcTraverseSubformWidgets(fieldWidget.widgetList, (result) => {
        resultSubList[result.options.name] = result.options.defaultValue;
      });
      resultList.push(`${fop.name}: [${JSON.stringify(resultSubList)}],`);
    } else if (fieldWidget.type === "data-table") {
      let tableData = {
        tableData: fop.tableData,
        tableColumns: fop.tableColumns,
      };

      resultList.push(`${fop.name}: ${JSON.stringify(tableData)},`);
    } else {
      if (isNotNull(fd)) {
        resultList.push(`${fop.name}: ${JSON.stringify(fd)},`)
      } else {
        resultList.push(`${fop.name}: null,`)
      }
    }
  }
}

export function buildRulesListFn(formConfig, widgetList, resultList) {
  return function(fieldWidget) {
    const fop = fieldWidget.options
    let fieldRules = []

    if (
        fieldWidget.type !== "sub-form" &&
        fieldWidget.type !== "grid-sub-form"
    ) {
      if (!!fop.required) {
        fieldRules.push(`{
          required: true,
          message: '${translate('render.hint.fieldRequired')}',
        }`)
      }

      if (!!fop.validation) {
        let vldName = fop.validation
        if (!!FormValidators[vldName]) {
          fieldRules.push(`{
            pattern: ${eval( getRegExp(vldName) )},
            trigger: ['blur', 'change'],
            message: '${fop.validationHint}'
          }`)
        } else {
          fieldRules.push(`{
            pattern: '${eval(vldName)}',
            trigger: ['blur', 'change'],
            message: '${fop.validationHint}'
          }`)
        }
      }

      //TODO: 自定义校验函数

      fieldRules.length > 0 && resultList.push(`${fop.name}: [${fieldRules.join(',')}],`)
    } else {
      let resultSubList = [];
      fieldWidget.widgetList.forEach((subWidget) => {
        buildRulesListFn(
            formConfig,
            fieldWidget.widgetList,
            resultSubList
        )(subWidget);
      });
      resultList.push(resultSubList);
    }
  }
}

export function buildFieldOptionsFn(formConfig, widgetList, resultList) {
  return function(fieldWidget) {
    const fop = fieldWidget.options
    const ft = fieldWidget.type
    if (
        ft === "radio" ||
        ft === "checkbox" ||
        ft === "select" ||
        ft === "cascader"
    ) {
      resultList.push(
          `${fop.name}Options: ${JSON.stringify(fop.optionItems)},`
      );
    } else if (ft === "sub-form" || ft === "grid-sub-form") {
      let resultSubList = [];
      fieldWidget.widgetList.forEach((subWidget) => {
        buildFieldOptionsFn(
            formConfig,
            fop.widgetList,
            resultSubList
        )(subWidget);
      });
      resultList.push(...resultSubList);
    } else if (ft==='grid') {
      let resultSubList = [];
      fieldWidget.cols.forEach((col) => {
        col.widgetList.forEach((subWidget)=>{
          buildFieldOptionsFn(
              formConfig,
              fop.widgetList,
              resultSubList
          )(subWidget);
        });
      });
      resultList.push(...resultSubList);
    }
  }
}

export function buildUploadDataFn(formConfig, widgetList, resultList) {
  return function(fieldWidget) {
    const fop = fieldWidget.options
    const ft = fieldWidget.type
    if ((ft === 'picture-upload') || (ft === 'file-upload')) {
      resultList.push(`${fop.name}FileList: [],`)
      resultList.push(`${fop.name}UploadHeaders: {},`)
      resultList.push(`${fop.name}UploadData: {},`)
    }
  }
}

export function buildActiveTabs(formConfig, widgetList) {
  let resultList = []
  const handlerFn = function (cw) {
    const cop = cw.options
    const ct = cw.type
    if (ct === 'tab') {
      cw.tabs.length > 0 && resultList.push(`'${cop.name}ActiveTab': '${cw.tabs[0].options.name}',`)
    }
  }
  sfcTraverseContainerWidgets(widgetList, handlerFn)

  return resultList
}

export function buildSubFormMethods(widgetList) {
  let template = ``;
  let widget = widgetList.find(
      (x) => x.type === "sub-form" || x.type === "grid-sub-form"
  );
  if (widget) {
    template = `
   addSubFormRow(widgetId){
    this.formData[widgetId].push({})
   },
   insertSubFormRow(widgetId,sfrIdx){
    this.formData[widgetId].splice(sfrIdx,0,{})
   },
   deleteSubFormRow(widgetId,sfrIdx){
    this.formData[widgetId].splice(sfrIdx,1)
   },
   `;
  }

  return template;
}

export function buildDataTableMethods(widgetList) {
  let template = ``;
  let widget = widgetList.find((x) => x.type === "data-table");
  if (widget) {
    template = `
    formatterValue(row, column, cellValue) {
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
    },
   `;
  }

  return template;
}

export const genVue2JS = function (formConfig, widgetList) {
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

  const v2JSTemplate =
`  export default {
    components: {},
    props: {},
    data() {
      return {
        ${formConfig.modelName}: {
          ${defaultValueList.join('\n')}
        },
        
        ${formConfig.rulesName}: {
          ${rulesList.join('\n')}
        },
        
        ${activeTabs.join('\n')}
        
        ${fieldOptions.join('\n')}
        
        ${uploadData.join('\n')}
      }
    },
    computed: {},
    watch: {},
    created() {
    },
    mounted() {
    },
    methods: {
      ${buildSubFormMethods(widgetList)}
      ${buildDataTableMethods(widgetList)}
      
      submitForm() {
        this.$refs['vForm'].validate(valid => {
          if (!valid) return
          
          //TODO: 提交表单
        })
      },
      
      resetForm() {
        this.$refs['vForm'].resetFields()
      }
    }
  }`

  return v2JSTemplate
}
