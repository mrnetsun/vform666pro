import {
  Edit, Minus, Plus, InfoFilled, Search, CirclePlus, Delete,
  ArrowDown, ArrowUp, Bottom, Top, Back, Right, BottomLeft, TopRight,
} from '@element-plus/icons-vue'

export function registerIcon(app) {
  app.component('el-icon-edit', Edit)
  app.component('el-icon-minus', Minus)
  app.component('el-icon-plus', Plus)
  app.component('el-icon-info', InfoFilled)
  app.component('el-icon-search', Search)
  app.component('el-icon-circle-plus-outline', CirclePlus)
  app.component('el-icon-delete', Delete)
  app.component('el-icon-arrow-down', ArrowDown)
  app.component('el-icon-arrow-up', ArrowUp)
  app.component('el-icon-bottom', Bottom)
  app.component('el-icon-top', Top)
  app.component('el-icon-back', Back)
  app.component('el-icon-right', Right)
  app.component('el-icon-bottom-left', BottomLeft)
  app.component('el-icon-top-right', TopRight)
}
