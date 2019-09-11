/* @flow */

import { arrayMethods } from 'core/observer/array'
import { def, warn, noop } from 'core/util/index'
import { hasOwn, isPlainObject } from 'shared/util'
import { registerListRef } from '../../util/index'

const arrayKeys = Object.getOwnPropertyNames(arrayMethods)

/**
 * Get method from Weex native component.
 */
function getComponentMethod (vm: Component, name: string): Function {
  const element = vm.$el
  if (element && typeof element[name] === 'function') {
    return (...args) => element[name](...args)
  }
  warn(`Can't find component method "${name}" on ${element.type}`)
  return noop
}

/**
 * Intercept mutating array methods and call the corresponding
 * method which provided by Weex native component.
 */
function interceptArrayMethods (vm: Component, array: Array<any>) {
  for (let i = 0, n = arrayKeys.length; i < n; i++) {
    const key = arrayKeys[i]
    def(array, key, function recycleListArrayProxy (...args) {
      const length = this.length

      // update the array and notify changes
      const method = arrayMethods[key]
      if (typeof method === 'function') {
        method.apply(this, args)
      }

      // send mutations to native
      const remove = getComponentMethod(vm, 'removeData')
      const insert = getComponentMethod(vm, 'insertRange')
      const update = getComponentMethod(vm, 'setListData')
      switch (key) {
        case 'push': insert(length, args); break
        case 'pop': remove(length - 1, 1); break
        case 'shift': remove(0, 1); break
        case 'unshift': insert(0, args); break
        case 'splice': {
          const [start, count, ...items] = args
          count > 0 && remove(start, count)
          items.length > 0 && insert(start, items)
        } break
        case 'sort': update(this.slice()); break
        case 'reverse': update(this.slice()); break
      }
    })
  }
}

/**
 * Deep watch the array and convert the operations into
 * Weex native directives.
 */
function watchArray (vm: Component, array: Array<any>) {
  if (!Array.isArray(array)) {
    return
  }
  interceptArrayMethods(vm, array)

  // deep watch all array items
  array.forEach((item) => {
    if (isPlainObject(item) && !hasOwn(item, '[[Watched]]')) {
      def(item, '[[Watched]]', true)
      vm.$watch(
        // visit all keys in item
        () => { for (const k in item) !item[k] },

        // send new item data to native
        () => {
          const update = getComponentMethod(vm, 'updateData')
          update(array.indexOf(item), item)
        },
        { deep: true }
      )
    }
  })
}

export default {
  name: 'recycle-list',
  methods: {
    closest (...args: Array<any>) {
      return this.$el.closest(...args)
    },
    queryElement (...args: Array<any>) {
      return this.$el.queryElement(...args)
    },
    queryElementAll (...args: Array<any>) {
      return this.$el.queryElementAll(...args)
    },
    scrollToElement (...args: Array<any>) {
      return this.$el.scrollToElement(...args)
    },
    resetLoadmore (...args: Array<any>) {
      return this.$el.resetLoadmore(...args)
    }
  },
  render (h: Function) {
    if (this._vnode && this.$options['[[UseCache]]']) {
      def(this.$options, '[[UseCache]]', false)
      return this._vnode
    }

    const parent = this.$options.parent
    const exp = this.$attrs.bindingExpression
    if (parent && exp) {
      // prevent the re-render which caused by the binding list data
      parent.$watch(
        exp,
        () => def(this.$options, '[[UseCache]]', true),
        { deep: true, immediate: true }
      )

      // watch the list data and send operations to native
      watchArray(this, this.$attrs.listData)
      parent.$watch(exp, newList => {
        watchArray(this, newList)
      })
    }

    this._events['_attach_slot'] = (instance: WeexComponentHookInstance) => {
      registerListRef(this.$parent || this, instance.position, instance.refs)
    }
    this._events['_detach_slot'] = (instance: WeexComponentHookInstance) => {
      registerListRef(this.$parent || this, instance.position, instance.refs, true)
    }

    return h('weex:recycle-list', {
      on: this._events
    }, this.$slots.default)
  },
  renderError (h: Function, err: Error) {
    return h('text', {
      style: {
        fontSize: '36px',
        color: '#FF0000'
      },
      value: err.toString()
    })
  }
}
