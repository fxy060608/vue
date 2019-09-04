/* @flow */

import {
  getBindingAttr
} from 'compiler/helpers'

function transformNode(el: ASTElement) {
  const list = el.attrsList
  for (let i = list.length - 1; i >= 0; i--) {
    const name = list[i].name
    if (name.indexOf(':change:') === 0 || name.indexOf('v-bind:change:') === 0) {
      const nameArr = name.split(':')
      const wxsProp = nameArr[nameArr.length - 1]
      const wxsPropBinding = getBindingAttr(el, wxsProp, false)
      if (wxsPropBinding) {
        (el.wxsPropBindings || (el.wxsPropBindings = {}))['change:' + wxsProp] = wxsPropBinding
      }
    }
  }
}

function genData(el: ASTElement): string {
  let data = ''
  if (el.wxsPropBindings) {
    data += `wxsProps:${JSON.stringify(el.wxsPropBindings)},`
  }
  return data
}

export default {
  transformNode,
  genData
}
