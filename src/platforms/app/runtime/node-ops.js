import Comment from './vdom/Comment'
import Element from './vdom/Element'

export function createElement(tagName) {
  return new Element(tagName)
}

export function createElementNS(namespace, tagName) {
  return new Element(namespace + ':' + tagName)
}

export function createTextNode() {
  return new Element('text')
}

export function createComment(text) {
  return new Comment(text)
}

export function insertBefore(node, target, before) {
  node.insertBefore(target, before)
}

export function removeChild(node, child) {
  node.removeChild(child)
}

export function appendChild(node, child) {
  node.appendChild(child)
}

export function parentNode(node) {
  return node.parentNode
}

export function nextSibling(node) {
  return node.nextSibling
}

export function tagName(node) {
  return node.type
}

export function setTextContent() {}

export function setStyleScope() {}
