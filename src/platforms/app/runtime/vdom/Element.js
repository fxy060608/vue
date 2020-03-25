import Node from './Node'
import {
  linkParent,
  nextElement,
  previousElement,
  insertIndex,
  moveIndex,
  removeIndex
} from './operation'

import {
  uniqueId,
} from './utils'

const DEFAULT_TAG_NAME = 'view'


export default class Element extends Node {
  constructor(type = DEFAULT_TAG_NAME) {
    super()

    this.nodeType = 1
    this.nodeId = uniqueId()
    this.ref = this.nodeId
    this.type = type
    this.attr = {}
    this.events = {}
    this.children = []
    this.pureChildren = []
  }

  setAttribute(key, value) {
    if (key === 'cid') {
      this.cid = value
    } else if (key === 'nid') {
      this.nid = value
    }
  }

  dispatchEvent(name, target) {
    const handlers = this.events[name]
    if (!handlers) {
      return
    }
    handlers.forEach(handler => {
      handler(target)
    })
  }

  addEventListener(name, handler) {
    if (this.cid === '' || this.nid === '') {
      return console.error(`cid=${this.cid},nid=${this.nid} addEventListener(${name}) not found`)
    }
    (this.events[name] || (this.events[name] = [])).push(handler)
    this._$vd.addElement(this)
  }

  removeEventListener(name, handler) {
    if (this.cid === '' || this.nid === '') {
      return console.error(`cid=${this.cid},nid=${this.nid} removeEventListener(${name}) not found`)
    }
    let isRemoved = false
    if (this.events[name]) {
      const handlerIndex = this.events[name].indexOf(handler)
      if (handlerIndex !== -1) {
        this.events[name].splice(handlerIndex, 1)
        isRemoved = true
      }
    }
    if (!isRemoved) {
      console.error(`cid=${this.cid},nid=${this.nid} removeEventListener(${name}) handler not found`)
    }

    Object.keys(this.events).every(eventType => this.events[eventType].length === 0) &&
      this._$vd.removeElement(this)
  }

  appendChild(node) {
    if (node.parentNode && node.parentNode !== this) {
      return
    }
    if (!node.parentNode) {
      // if (process.env.NODE_ENV !== 'production') {
      //   console.log(`[appendChild](${this.docId},${node.type},${node.ref}) ` +
      //     `Append <${node.type}> to <${this.type}> (${this.ref}).`)
      // }
      linkParent(node, this)
      insertIndex(node, this.children, this.children.length, true)
      if (node.nodeType === 1) {
        insertIndex(node, this.pureChildren, this.pureChildren.length)
      }
    } else {
      // if (process.env.NODE_ENV !== 'production') {
      //   console.log(`[appendChild](${this.docId},${node.type},${node.ref}) ` +
      //     `Move <${node.type}> to ${this.children.length} of <${this.type}> (${this.ref}).`)
      // }
      moveIndex(node, this.children, this.children.length, true)
      if (node.nodeType === 1) {
        moveIndex(node, this.pureChildren, this.pureChildren.length)
      }
    }
  }

  insertBefore(node, before) {
    if (node.parentNode && node.parentNode !== this) {
      return
    }
    if (node === before || (node.nextSibling && node.nextSibling === before)) {
      return
    }
    if (!node.parentNode) {
      // if (process.env.NODE_ENV !== 'production') {
      //   console.log(`[insertBefore](${this.docId},${node.type},${node.ref}) ` +
      //     `Insert <${node.type}> to <${this.type}> (${this.ref}), before (${before.ref}).`)
      // }
      linkParent(node, this)
      insertIndex(node, this.children, this.children.indexOf(before), true)
      if (node.nodeType === 1) {
        const pureBefore = nextElement(before)
        insertIndex(
          node,
          this.pureChildren,
          pureBefore ?
          this.pureChildren.indexOf(pureBefore) :
          this.pureChildren.length
        )
      }
    } else {
      moveIndex(node, this.children, this.children.indexOf(before), true)
      if (node.nodeType === 1) {
        const pureBefore = nextElement(before)
        moveIndex(
          node,
          this.pureChildren,
          pureBefore ?
          this.pureChildren.indexOf(pureBefore) :
          this.pureChildren.length
        )
      }
    }
  }

  insertAfter(node, after) {
    if (node.parentNode && node.parentNode !== this) {
      return
    }
    if (node === after || (node.previousSibling && node.previousSibling === after)) {
      return
    }
    if (!node.parentNode) {
      // if (process.env.NODE_ENV !== 'production') {
      //   console.log(`[insertAfter](${this.docId},${node.type},${node.ref}) ` +
      //     `Insert <${node.type}> to <${this.type}> (${this.ref}), after (${after.ref}).`)
      // }
      linkParent(node, this)
      insertIndex(node, this.children, this.children.indexOf(after) + 1, true)
      if (node.nodeType === 1) {
        insertIndex(
          node,
          this.pureChildren,
          this.pureChildren.indexOf(previousElement(after)) + 1
        )
      }
    } else {
      moveIndex(node, this.children, this.children.indexOf(after) + 1, true)
      if (node.nodeType === 1) {
        moveIndex(
          node,
          this.pureChildren,
          this.pureChildren.indexOf(previousElement(after)) + 1
        )
      }
    }
  }

  removeChild(node, preserved) {
    if (node.parentNode) {
      removeIndex(node, this.children, true)
      if (node.nodeType === 1) {
        // if (process.env.NODE_ENV !== 'production') {
        //   console.log(`[removeChild](${this.docId},${node.type},${node.ref}) ` +
        //     `Remove <${node.type}> from <${this.type}> (${this.ref}).`)
        // }
        removeIndex(node, this.pureChildren)
      }
    }
    if (!preserved) {
      node.destroy()
    }
  }

  clear() {
    this.children.forEach(node => {
      node.destroy()
    })
    this.children.length = 0
    this.pureChildren.length = 0
  }


  toString() {
    return '<' + this.type +
      ' attr=' + JSON.stringify(this.attr) +
      ' style=' + JSON.stringify(this.toStyle()) + '>' +
      this.pureChildren.map((child) => child.toString()).join('') +
      '</' + this.type + '>'
  }
}
