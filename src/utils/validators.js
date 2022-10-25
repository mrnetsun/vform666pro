import {isEmptyStr, isNull} from "./util";

export const getRegExp = function (validatorName) {
  const commonRegExp = {
    number: '/^[-]?\\d+(\\.\\d+)?$/',
    letter: '/^[A-Za-z]+$/',
    letterAndNumber: '/^[A-Za-z0-9]+$/',
    mobilePhone: '/^(\+|\d)[0-9]{7,16}$/',
    letterStartNumberIncluded: '/^[A-Za-z]+[A-Za-z\\d]*$/',
    noChinese: '/^[^\u4e00-\u9fa5]+$/',
    chinese: '/^[\u4e00-\u9fa5]+$/',
    email: '/^([-_A-Za-z0-9.]+)@([_A-Za-z0-9]+\\.)+[A-Za-z0-9]{2,3}$/',
    url: '/^([hH][tT]{2}[pP]:\\/\\/|[hH][tT]{2}[pP][sS]:\\/\\/)(([A-Za-z0-9-~]+)\\.)+([A-Za-z0-9-~\\/])+$/',
  }

  return commonRegExp[validatorName]
}

const validateFn = function (validatorName, rule, value, callback, defaultErrorMsg) {
  //空值不校验
  if (isNull(value) || (value.length <= 0)) {
    callback()
    return
  }

  const reg = eval(getRegExp(validatorName))

  if (!reg.test(value)) {
    let errTxt = rule.errorMsg || defaultErrorMsg
    callback(new Error(errTxt))
  } else {
    callback()
  }
}

const FormValidators = {

  /* 数字 */
  number(rule, value, callback) {
    validateFn('number', rule, value, callback, '[' + rule.label + '] contains non-numeric characters')
  },

  /* 字母 */
  letter(rule, value, callback) {
    validateFn('letter', rule, value, callback, '[' + rule.label + '] contains non-alphabetic characters')
  },

  /* 字母和数字 */
  letterAndNumber(rule, value, callback) {
    validateFn('letterAndNumber', rule, value, callback, '[' + rule.label + '] enter only letters or numbers')
  },

  /* 手机号码 */
  mobilePhone(rule, value, callback) {
    validateFn('mobilePhone', rule, value, callback, '[' + rule.label + '] wrong phone number format')
  },

  /* 禁止空白字符开头 */
  noBlankStart(rule, value, callback) {
    //暂未实现
  },

  /* 禁止空白字符结尾 */
  noBlankEnd(rule, value, callback) {
    //暂未实现
  },

  /* 字母开头，仅可包含数字 */
  letterStartNumberIncluded(rule, value, callback) {
    validateFn('letterStartNumberIncluded', rule, value, callback, '[' + rule.label + '] must start with a letter, can contain numbers')
  },

  /* 禁止中文输入 */
  noChinese(rule, value, callback) {
    validateFn('noChinese', rule, value, callback, '[' + rule.label + '] Chinese characters cannot be entered')
  },

  /* 必须中文输入 */
  chinese(rule, value, callback) {
    validateFn('chinese', rule, value, callback, '[' + rule.label + '] Only Chinese characters can be entered')
  },

  /* 电子邮箱 */
  email(rule, value, callback) {
    validateFn('email', rule, value, callback, '[' + rule.label + '] Email format is incorrect')
  },

  /* URL网址 */
  url(rule, value, callback) {
    validateFn('url', rule, value, callback, '[' + rule.label + ']URL is wrong format')
  },

  /*测试
  test(rule, value, callback, errorMsg) {
    //空值不校验
    if (isNull(value) || (value.length <= 0)) {
      callback()
      return
    }

    if (value < 100) {
      callback(new Error('[' + rule.label + ']不能小于100'))
    } else {
      callback()
    }
  },
  */

  regExp(rule, value, callback) {
    //空值不校验
    if (isNull(value) || (value.length <= 0)) {
      callback()
      return
    }

    const pattern = eval(rule.regExp)
    if (!pattern.test(value)) {
      let errTxt = rule.errorMsg || '[' + rule.label + ']invalid value'
      callback(new Error(errTxt))
    } else {
      callback()
    }
  },

}

export default FormValidators
