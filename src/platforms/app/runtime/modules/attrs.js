import {
  isUndef,
  camelize
} from 'shared/util'

function parseDataset(attrs) {
  const dataset = Object.create(null)
  Object.keys(attrs).forEach(name => {
    if (name.indexOf('data-') === 0) {
      dataset[camelize(name.replace('data-', ''))] = JSON.parse(attrs[name])
    }
  })
  return dataset
}

function updateAttrs(oldVnode, vnode) {

  const attrs = vnode.data.attrs

  if (isUndef(attrs)) {
    return
  }

  const id = attrs['_i']
  if (isUndef(id)) {
    return
  }

  const elm = vnode.elm
  elm.dataset = Object.assign(elm.dataset || {}, parseDataset(attrs))
}



export default {
  create: updateAttrs,
  update: updateAttrs
}
