import { createI18n } from './smart-vue-i18n/index'

import enLocaleElement from "element-plus/lib/locale/lang/en";
import zhLocaleElement from "element-plus/lib/locale/lang/zh-cn";
import koLocaleElement from "element-plus/lib/locale/lang/ko";
//import locale from "element-plus/lib/locale"


import zhLocale from "@/lang/zh-CN";
import zhLocale_render from "@/lang/zh-CN_render";
import zhLocale_extension from "@/lang/zh-CN_extension";

import enLocale from "@/lang/en-US";
import enLocale_render from "@/lang/en-US_render";
import enLocale_extension from "@/lang/en-US_extension";

import koLocale from "@/lang/ko-KR";
import koLocale_render from "@/lang/ko-KR_render";
import koLocale_extension from "@/lang/ko-KR_extension";


const langResources = {
  'en-US': {
    something: {
      //...
    },
    ...enLocaleElement,
    ...enLocale,
    ...enLocale_render,
    ...enLocale_extension
  },
  'ko-KR': {
    something: {
      //...
    },
    ...koLocaleElement,
    ...koLocale,
    ...koLocale_render,
    ...koLocale_extension
  },
  'zh-CN': {
    something: {
      //...
    },
    ...zhLocaleElement,
    ...zhLocale,
    ...zhLocale_render,
    ...zhLocale_extension
  }
}

const i18n = createI18n({
  locale: localStorage.getItem('v_form_locale') || 'en-US',
  messages: langResources
})

export const changeLocale = function(langName) {
  i18n.setLang(langName)
  localStorage.setItem('v_form_locale', langName)
}

export const translate = function(key) {
  return i18n.$st(key)
}

export const installI18n = (app) => {
  //
}

export default {
  methods: {
    i18nt(key) {
      return i18n.$st(key)
    },

    /* 如果key1不存在，则查找key2 */
    i18n2t(key1, key2) {
      return i18n.$st2(key1, key2)
    },

  }
}
