import Node from './Node'
import {
  uniqueId
} from './utils'

export default class Comment extends Node {
  constructor(value) {
    super()

    this.nodeType = 8
    this.nodeId = uniqueId()
    this.ref = this.nodeId
    this.type = 'comment'
    this.value = value
    this.children = []
    this.pureChildren = []
  }

  toString() {
    return '<!-- ' + this.value + ' -->'
  }
}
