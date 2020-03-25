import {
  uniqueId
} from './utils'

export default class Node {
  constructor() {
    this.nodeId = uniqueId()
    this.ref = this.nodeId
    this.children = []
    this.pureChildren = []
    this.parentNode = null
    this.nextSibling = null
    this.previousSibling = null
  }

  destroy() {
    this._$vd && this._$vd.removeElement(this)
    this.children.forEach(child => {
      child.destroy()
    })
  }
}
