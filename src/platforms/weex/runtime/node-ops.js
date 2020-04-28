/* @flow */
declare var document: WeexDocument;

import TextNode from 'weex/runtime/text-node'

export const namespaceMap = {}

export function createElement (tagName: string): WeexElement {
  return document.createElement(tagName)
}

export function createElementNS (namespace: string, tagName: string): WeexElement {
  return document.createElement(namespace + ':' + tagName)
}

export function createTextNode (text: string) {
  return new TextNode(text)
}

export function createComment (text: string) {
  return document.createComment(text)
}

export function insertBefore (
  node: WeexElement,
  target: WeexElement,
  before: WeexElement
) {
  if (target.nodeType === 3) {
    const TEXT_TAG_NAME = document.__$compiler__ === 'weex' ? 'text' : 'u-text'
    if (node.type === TEXT_TAG_NAME) {
      node.setAttr('value', target.text)
      target.parentNode = node
    } else {
      const text = createElement(TEXT_TAG_NAME)
      text.setAttr('value', target.text)
      node.insertBefore(text, before)
    }
    return
  }
  node.insertBefore(target, before)
}

export function removeChild (node: WeexElement, child: WeexElement) {
  if (child.nodeType === 3) {
    node.setAttr('value', '')
    return
  }
  node.removeChild(child)
}

export function appendChild (node: WeexElement, child: WeexElement) {
  if (child.nodeType === 3) {
    const TEXT_TAG_NAME = document.__$compiler__ === 'weex' ? 'text' : 'u-text'
    if (node.type === TEXT_TAG_NAME) {
      node.setAttr('value', child.text)
      child.parentNode = node
    } else {
      const text = createElement(TEXT_TAG_NAME)
      text.setAttr('value', child.text)
      node.appendChild(text)
    }
    return
  }

  node.appendChild(child)
}

export function parentNode (node: WeexElement): WeexElement | void {
  return node.parentNode
}

export function nextSibling (node: WeexElement): WeexElement | void {
  return node.nextSibling
}

export function tagName (node: WeexElement): string {
  return node.type
}

export function setTextContent (node: WeexElement, text: string) {
  if (node.parentNode) {
    node.parentNode.setAttr('value', text)
  }
}

export function setAttribute (node: WeexElement, key: string, val: any) {
  node.setAttr(key, val)
}

export function setStyleScope (node: WeexElement, scopeId: string) {
  node.setAttr('@styleScope', scopeId)
}
