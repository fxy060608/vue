/* @flow */
declare var document: WeexDocument;

import { warn, isObject } from 'core/util/index'

export const RECYCLE_LIST_MARKER = '@inRecycleList'

// Register the component hook to weex native render engine.
// The hook will be triggered by native, not javascript.
export function registerComponentHook (
  componentId: string,
  type: string, // hook type, could be "lifecycle" or "instance"
  hook: string, // hook name
  fn: Function
) {
  if (!document || !document.taskCenter) {
    warn(`Can't find available "document" or "taskCenter".`)
    return
  }
  if (typeof document.taskCenter.registerHook === 'function') {
    return document.taskCenter.registerHook(componentId, type, hook, fn)
  }
  warn(`Failed to register component hook "${type}@${hook}#${componentId}".`)
}

// Updates the state of the component to weex native render engine.
export function updateComponentData (
  componentId: string,
  newData: Object | void,
  callback?: Function
) {
  if (!document || !document.taskCenter) {
    warn(`Can't find available "document" or "taskCenter".`)
    return
  }
  if (typeof document.taskCenter.updateData === 'function') {
    return document.taskCenter.updateData(componentId, newData, callback)
  }
  warn(`Failed to update component data (${componentId}).`)
}

export function updateVirtualRef (vm: Component, refsMap: Object, isRemoval: ?boolean) {
  if (!isObject(refsMap)) return

  if (isRemoval) {
    vm.$refs = {}
  } else {
    const vmRef = vm.$refs || {}
    Object.keys(refsMap).forEach(key => {
      const refs = refsMap[key]
      vmRef[key] = refs.length === 1 ? refs[0] : refs
    })
    vm.$refs = vmRef
  }
}

export function registerListRef (vm: Component, position: number, refsMap: Object, isRemoval: ?boolean) {
  if (!isObject(refsMap)) return

  const vmRef = vm.$refs || {}
  if (isRemoval) {
    Object.keys(refsMap).forEach(key => {
      const refs = refsMap[key]

      if (vmRef[key]) {
        if (refs.length === 1 && Array.isArray(vmRef[key])) {
          delete vmRef[key][position]
        } else {
          delete vmRef[key]
        }
      }
    })
  } else {
    Object.keys(refsMap).forEach(key => {
      const refs = refsMap[key]

      if (refs.length === 1) {
        if (!Array.isArray(vmRef[key])) {
          vmRef[key] = []
        }
        // $flow-disable-line
        vmRef[key][position] = refs[0]
      } else {
        vmRef[key] = refs
      }
    })
    vm.$refs = vmRef
  }
}
