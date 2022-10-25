import Clipboard from 'clipboard'
import axios from 'axios'

export function isNull(value) {
  return (value === null) || (value === undefined);
}

export function isNotNull(value) {
  return (value !== null) && (value !== undefined);
}

export function isEmptyStr(str) {
  //return (str === undefined) || (!str) || (!/[^\s]/.test(str));
  return (str === undefined) || (!str && (str !== 0) && (str !== '0')) || (!/[^\s]/.test(str));
}

export const generateId = function() {
  return Math.floor(Math.random() * 100000 + Math.random() * 20000 + Math.random() * 5000);
};

export const deepClone = function (origin) {
  if (origin === undefined) {
    return undefined
  }

  return JSON.parse(JSON.stringify(origin))
}

export const overwriteObj = function(obj1, obj2) {  /* 浅拷贝对象属性，obj2覆盖obj1 */
  // for (let prop in obj2) {
  //   if (obj2.hasOwnProperty(prop)) {
  //     obj1[prop] = obj2[prop]
  //   }
  // }

  Object.keys(obj2).forEach(prop => {
    obj1[prop] = obj2[prop]
  })
}

export const addWindowResizeHandler = function (handler) {
  let oldHandler = window.onresize
  if (typeof window.onresize != 'function') {
    window.onresize = handler
  } else {
    window.onresize = function () {
      oldHandler()
      handler()
    }
  }
}

const createStyleSheet = function() {
  let head = document.head || document.getElementsByTagName('head')[0];
  let style = document.createElement('style');
  style.type = 'text/css';
  head.appendChild(style);
  return style.sheet;
}

export const insertCustomCssToHead = function (cssCode, formId = '') {
  let head = document.getElementsByTagName('head')[0]
  let oldStyle = document.getElementById('vform-custom-css')
  if (!!oldStyle) {
    head.removeChild(oldStyle)  //先清除后插入！！
  }
  if (!!formId) {
    oldStyle = document.getElementById('vform-custom-css' + '-' + formId)
    !!oldStyle && head.removeChild(oldStyle)  //先清除后插入！！
  }

  let newStyle = document.createElement('style')
  newStyle.type = 'text/css'
  newStyle.rel = 'stylesheet'
  newStyle.id = !!formId ? 'vform-custom-css' + '-' + formId : 'vform-custom-css'
  try {
    newStyle.appendChild(document.createTextNode(cssCode))
  } catch(ex) {
    newStyle.styleSheet.cssText = cssCode
  }

  head.appendChild(newStyle)
}

export const insertGlobalFunctionsToHtml = function (functionsCode, formId = '') {
  let bodyEle = document.getElementsByTagName('body')[0]
  let oldScriptEle = document.getElementById('v_form_global_functions')
  !!oldScriptEle && bodyEle.removeChild(oldScriptEle)  //先清除后插入！！
  if (!!formId) {
    oldScriptEle = document.getElementById('v_form_global_functions' + '-' + formId)
    !!oldScriptEle && bodyEle.removeChild(oldScriptEle)  //先清除后插入！！
  }

  let newScriptEle = document.createElement('script')
  newScriptEle.id = !!formId ? 'v_form_global_functions' + '-' + formId : 'v_form_global_functions'
  newScriptEle.type = 'text/javascript'
  newScriptEle.innerHTML = functionsCode
  bodyEle.appendChild(newScriptEle)
}

export const optionExists = function(optionsObj, optionName) {
  if (!optionsObj) {
    return false
  }

  return Object.keys(optionsObj).indexOf(optionName) > -1
}

export const loadRemoteScript = function(srcPath, callback) {  /*加载远程js，加载成功后执行回调函数*/
  let sid = encodeURIComponent(srcPath)
  let oldScriptEle = document.getElementById(sid)

  if (!oldScriptEle) {
    let s = document.createElement('script')
    s.src = srcPath
    s.id = sid
    document.body.appendChild(s)

    s.onload = s.onreadystatechange = function (_, isAbort) { /* 借鉴自ace.js */
      if (isAbort || !s.readyState || s.readyState === "loaded" || s.readyState === "complete") {
        s = s.onload = s.onreadystatechange = null
        if (!isAbort) {
          callback()
        }
      }
    }
  }
}

export function traverseFieldWidgets(widgetList, handler, parent = null, staticWidgetsIncluded = false) {
  widgetList.map(w => {
    if (w.formItemFlag || ((w.formItemFlag === false) && staticWidgetsIncluded)) {
      handler(w, parent)
    } else if (w.type === 'grid') {
      w.cols.map(col => {
        traverseFieldWidgets(col.widgetList, handler, w, staticWidgetsIncluded)
      })
    } else if (w.type === 'table') {
      w.rows.map(row => {
        row.cols.map(cell => {
          traverseFieldWidgets(cell.widgetList, handler, w, staticWidgetsIncluded)
        })
      })
    } else if (w.type === 'tab') {
      w.tabs.map(tab => {
        traverseFieldWidgets(tab.widgetList, handler, w, staticWidgetsIncluded)
      })
    } else if (w.type === 'sub-form' || w.type === 'grid-sub-form') {
      traverseFieldWidgets(w.widgetList, handler, w, staticWidgetsIncluded)
    } else if (w.category === 'container') {  //自定义容器
      traverseFieldWidgets(w.widgetList, handler, w, staticWidgetsIncluded)
    }
  })
}

export function traverseContainerWidgets(widgetList, handler) {
  widgetList.map(w => {
    if (w.category === 'container') {
      handler(w)
    }

    if (w.type === 'grid') {
      w.cols.map(col => {
        traverseContainerWidgets(col.widgetList, handler)
      })
    } else if (w.type === 'table') {
      w.rows.map(row => {
        row.cols.map(cell => {
          traverseContainerWidgets(cell.widgetList, handler)
        })
      })
    } else if (w.type === 'tab') {
      w.tabs.map(tab => {
        traverseContainerWidgets(tab.widgetList, handler)
      })
    } else if (w.type === 'sub-form' || w.type === 'grid-sub-form') {
      traverseContainerWidgets(w.widgetList, handler)
    } else if (w.category === 'container') {  //自定义容器
      traverseContainerWidgets(w.widgetList, handler)
    }
  })
}

export function traverseAllWidgets(widgetList, handler) {
  widgetList.map(w => {
    handler(w)

    if (w.type === 'grid') {
      w.cols.map(col => {
        handler(col)
        traverseAllWidgets(col.widgetList, handler)
      })
    } else if (w.type === 'table') {
      w.rows.map(row => {
        row.cols.map(cell => {
          handler(cell)
          traverseAllWidgets(cell.widgetList, handler)
        })
      })
    } else if (w.type === 'tab') {
      w.tabs.map(tab => {
        traverseAllWidgets(tab.widgetList, handler)
      })
    } else if (w.type === 'sub-form' || w.type === 'grid-sub-form') {
      traverseAllWidgets(w.widgetList, handler)
    } else if (w.category === 'container') {  //自定义容器
      traverseAllWidgets(w.widgetList, handler)
    }
  })
}

function handleWidgetForTraverse(widget, handler) {
  if (!!widget.category && (widget.category === 'container')) {
    traverseFieldWidgetsOfContainer(widget, handler)
  } else if (widget.formItemFlag) {
    handler(widget)
  }
}

/**
 * 遍历容器内的字段组件
 * @param con
 * @param handler
 */
export function traverseFieldWidgetsOfContainer(con, handler) {
  if (con.type === 'grid') {
    con.cols.forEach(col => {
      col.widgetList.forEach(cw => {
        handleWidgetForTraverse(cw, handler)
      })
    })
  } else if (con.type === 'table') {
    con.rows.forEach(row => {
      row.cols.forEach(cell => {
        cell.widgetList.forEach(cw => {
          handleWidgetForTraverse(cw, handler)
        })
      })
    })
  } else if (con.type === 'tab') {
    con.tabs.forEach(tab => {
      tab.widgetList.forEach(cw => {
        handleWidgetForTraverse(cw, handler)
      })
    })
  } else if (con.type === 'sub-form' || con.type === 'grid-sub-form') {
    con.widgetList.forEach(cw => {
      handleWidgetForTraverse(cw, handler)
    })
  } else if (con.category === 'container') {  //自定义容器
    con.widgetList.forEach(cw => {
      handleWidgetForTraverse(cw, handler)
    })
  }
}

function handleContainerTraverse(widget, fieldHandler, containerHandler) {
  if (!!widget.category && (widget.category === 'container')) {
    traverseWidgetsOfContainer(widget, fieldHandler, containerHandler)
  } else if (widget.formItemFlag) {
    fieldHandler(widget)
  }
}

/**
 * 遍历容器内部的字段组件和容器组件
 * @param con
 * @param fieldHandler
 * @param containerHandler
 */
export function traverseWidgetsOfContainer(con, fieldHandler, containerHandler) {
  if (con.type === 'grid') {
    con.cols.forEach(col => {
      col.widgetList.forEach(cw => {
        handleContainerTraverse(cw, fieldHandler, containerHandler)
      })
    })
  } else if (con.type === 'table') {
    con.rows.forEach(row => {
      row.cols.forEach(cell => {
        cell.widgetList.forEach(cw => {
          handleContainerTraverse(cw, fieldHandler, containerHandler)
        })
      })
    })
  } else if (con.type === 'tab') {
    con.tabs.forEach(tab => {
      tab.widgetList.forEach(cw => {
        handleContainerTraverse(cw, fieldHandler, containerHandler)
      })
    })
  } else if (con.type === 'sub-form' || con.type === 'grid-sub-form') {
    con.widgetList.forEach(cw => {
      handleContainerTraverse(cw, fieldHandler, containerHandler)
    })
  } else if (con.category === 'container') {  //自定义容器
    con.widgetList.forEach(cw => {
      handleContainerTraverse(cw, fieldHandler, containerHandler)
    })
  }
}

/**
 * 获取所有字段组件
 * @param widgetList
 * @param staticWidgetsIncluded 是否包含按钮等静态组件，默认不包含
 * @returns {[]}
 */
export function getAllFieldWidgets(widgetList, staticWidgetsIncluded = false) {
  let result = []
  let handlerFn = (w) => {
    result.push({
      type: w.type,
      name: w.options.name,
      field: w
    })
  }
  traverseFieldWidgets(widgetList, handlerFn, null, staticWidgetsIncluded)

  return result
}

/**
 * 获取所有容器组件
 * @param widgetList
 * @returns {[]}
 */
export function getAllContainerWidgets(widgetList) {
  let result = []
  let handlerFn = (w) => {
    result.push({
      type: w.type,
      name: w.options.name,
      container: w
    })
  }
  traverseContainerWidgets(widgetList, handlerFn)

  return result
}

export function getFieldWidgetByName(widgetList, fieldName, staticWidgetsIncluded) {
  let foundWidget = null
  let handlerFn = (widget) => {
    if (widget.options.name === fieldName) {
      foundWidget = widget
    }
  }

  traverseFieldWidgets(widgetList, handlerFn, null, staticWidgetsIncluded)
  return foundWidget
}

export function getContainerWidgetByName(widgetList, containerName) {
  let foundContainer = null
  let handlerFn = (con) => {
    if (con.options.name === containerName) {
      foundContainer = con
    }
  }

  traverseContainerWidgets(widgetList, handlerFn)
  return foundContainer
}

export function getContainerWidgetById(widgetList, containerId) {
  let foundContainer = null
  let handlerFn = (con) => {
    if (con.id === containerId) {
      foundContainer = con
    }
  }

  traverseContainerWidgets(widgetList, handlerFn)
  return foundContainer
}

export function copyToClipboard(content, clickEvent, $message, successMsg, errorMsg) {
  const clipboard = new Clipboard(clickEvent.target, {
    text: () => content
  })

  clipboard.on('success', () => {
    $message.success(successMsg)
    clipboard.destroy()
  })

  clipboard.on('error', () => {
    $message.error(errorMsg)
    clipboard.destroy()
  })

  clipboard.onClick(clickEvent)
}

export function getQueryParam(variable) {
  let query = window.location.search.substring(1);
  let vars = query.split("&")
  for (let i=0; i<vars.length; i++) {
    let pair = vars[i].split("=")
    if(pair[0] == variable) {
      return pair[1]
    }
  }

  return undefined;
}

export function getDefaultFormConfig() {
  return {
    modelName: 'formData',
    refName: 'vForm',
    rulesName: 'rules',
    labelWidth: 80,
    labelPosition: 'left',
    size: '',
    labelAlign: 'label-left-align',
    cssCode: '',
    customClass: '',
    functions: '',  //全局函数
    layoutType: 'PC',
    jsonVersion: 3,
    dataSources: [],  //数据源集合

    onFormCreated: '',
    onFormMounted: '',
    onFormDataChange: '',
  }
}

export function buildDefaultFormJson() {
  return {
    widgetList: [],
    formConfig: deepClone( getDefaultFormConfig() )
  }
}

export function cloneFormConfigWithoutEventHandler(formConfig) {
  let newFC = deepClone(formConfig)
  newFC.onFormCreated = ''
  newFC.onFormMounted = ''
  newFC.onFormDataChange = ''

  return newFC
}

/**
 * 转译选择项数据
 * @param rawData
 * @param widgetType
 * @param labelKey
 * @param valueKey
 * @returns {[]}
 */
export function translateOptionItems(rawData, widgetType, labelKey, valueKey) {
  if (widgetType === 'cascader') { // 级联选择不转译
    return deepClone(rawData)
  }

  let result = []
  if (!!rawData && (rawData.length > 0)) {
    rawData.forEach(ri => {
      result.push({
        label: ri[labelKey],
        value: ri[valueKey]
      })
    })
  }

  return result
}

/**
 * 组装axios请求配置参数
 * @param arrayObj
 * @param DSV
 * @param VFR
 * @returns {{}}
 */
export function assembleAxiosConfig(arrayObj, DSV, VFR) {
  let result = {}
  if (!arrayObj || (arrayObj.length <= 0)) {
    return result
  }

  arrayObj.map(ai => {
    if (ai.type === 'String') {
      result[ai.name] = String(ai.value)
    } else if (ai.type === 'Number') {
      result[ai.name] = Number(ai.value)
    } else if (ai.type === 'Boolean') {
      if ((ai.value.toLowerCase() === 'false') || (ai.value === '0')) {
        result[ai.name] = false
      } else if ((ai.value.toLowerCase() === 'true') || (ai.value === '1')) {
        result[ai.name] = true
      } else {
        result[ai.name] = null
      }
    } else if (ai.type === 'Variable') {
      result[ai.name] = eval(ai.value)
    }
  })

  /* 加入如下两行日志打印代码，是为了防止编译打包时DSV、VFR参数被剔除！！ begin */
  /* DSV、VFR入参没有在本函数中直接使用到，但在eval表达式中可能被使用到，故需确保DSV、VFR参数始终存在！！ */
  console.log('test DSV: ', DSV)
  console.log('test VFR: ', VFR)
  /* 加入如下两行日志打印代码，是为了防止编译打包时DSV、VFR入参会被剔除！！ end */

  return result
}

function buildRequestConfig(dataSource, DSV, VFR, isSandbox) {
  let config = {}
  if (dataSource.requestURLType === 'String') {
    config.url = dataSource.requestURL
  } else {
    config.url = eval(dataSource.requestURL)
  }
  config.method = dataSource.requestMethod

  config.headers = assembleAxiosConfig(dataSource.headers, DSV, VFR)
  config.params = assembleAxiosConfig(dataSource.params, DSV, VFR)
  config.data = assembleAxiosConfig(dataSource.data, DSV, VFR)

  let chFn = new Function('config', 'isSandbox', 'DSV', 'VFR', dataSource.configHandlerCode)
  return chFn.call(null, config, isSandbox, DSV, VFR)
}

export async function runDataSourceRequest(dataSource, DSV, VFR, isSandbox, $message) {
  try {
    let requestConfig = buildRequestConfig(dataSource, DSV, VFR, isSandbox)
    //console.log('test------', requestConfig)
    let result = await axios.request(requestConfig)
    //let result = await axios.create().request(requestConfig)

    let dhFn = new Function('result', 'isSandbox', 'DSV', 'VFR', dataSource.dataHandlerCode)
    return dhFn.call(null, result, isSandbox, DSV, VFR)
  } catch (err) {
    let ehFn = new Function('error', 'isSandbox', 'DSV', '$message', 'VFR', dataSource.errorHandlerCode)
    ehFn.call(null, err, isSandbox, DSV, $message, VFR)
    console.error(err)
  }
}

export function getDSByName(formConfig, dsName) {
  let resultDS = null
  if (!!dsName && !!formConfig.dataSources) {
    formConfig.dataSources.forEach(ds => {
      if (ds.uniqueName === dsName) {
        resultDS = ds
      }
    })
  }

  return resultDS
}
