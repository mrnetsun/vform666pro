import {traverseAllWidgets} from "@/utils/util";

export function emptyAttr(attrName, attrValue) {
  if (attrValue)
    return `${attrName}="${attrValue}"`
  else
    return ''
}

export function sfcTraverseSubformWidgets(widgetList, handler) {
  widgetList.forEach(w => {
    handler(w)
  })
}

export function sfcTraverseFieldWidgets(widgetList, handler, parent = null) {
  widgetList.forEach(w => {
    if (w.formItemFlag) {
      handler(w, parent)
    } else if (w.type === 'grid') {
      w.cols.forEach(col => {
        sfcTraverseFieldWidgets(col.widgetList, handler, w)
      })
    } else if (w.type === 'table') {
      w.rows.forEach(row => {
        row.cols.forEach(cell => {
          sfcTraverseFieldWidgets(cell.widgetList, handler, w)
        })
      })
    } else if (w.type === 'tab') {
      w.tabs.forEach(tab => {
        sfcTraverseFieldWidgets(tab.widgetList, handler, w)
      })
    } else if (w.type === 'sub-form' || w.type === 'grid-sub-form') {
      handler(w, parent)
      // sfcTraverseFieldWidgets(w.widgetList, handler, w)
    }  else if (w.type === 'data-table') {
      handler(w, parent)
      // sfcTraverseFieldWidgets(w.widgetList, handler, w)
    } else if (w.category === 'container') {  //自定义容器
      sfcTraverseFieldWidgets(w.widgetList, handler, w)
    }
  })
}

export function sfcTraverseContainerWidgets(widgetList, handler) {
  widgetList.forEach(w => {
    if (w.category === 'container') {
      handler(w)
    }

    if (w.type === 'grid') {
      w.cols.forEach(col => {
        sfcTraverseContainerWidgets(col.widgetList, handler)
      })
    } else if (w.type === 'table') {
      w.rows.forEach(row => {
        row.cols.forEach(cell => {
          sfcTraverseContainerWidgets(cell.widgetList, handler)
        })
      })
    } else if (w.type === 'tab') {
      w.tabs.forEach(tab => {
        sfcTraverseContainerWidgets(tab.widgetList, handler)
      })
    } else if (w.type === 'sub-form' || w.type === 'grid-sub-form') {
      // traverseContainerWidgets(w.widgetList, handler)
      traverseAllWidgets(w.widgetList, handler)
    } else if (w.category === 'container') {  //自定义容器
      sfcTraverseContainerWidgets(w.widgetList, handler)
    }
  })
}

