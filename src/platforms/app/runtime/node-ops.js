const noop = {}

class UniElement {
  constructor(tagName) {
    this.tagName = tagName
    this.attrs = Object.create(null)
  }
  setAttribute(key, value) {
    this.attrs[key] = value
  }
  addEventListener(name, handler) {
    const {
      cid,
      nid
    } = this.attrs
    if (!cid || !nid) {
      return console.error(`cid=${cid},nid=${nid} addEventListener(${name}) not found`)
    }
    this._$vd.addEvent(cid, nid, name, handler)
  }
  removeEventListener(name, handler) {
    const {
      cid,
      nid
    } = this.attrs
    if (!cid || !nid) {
      return console.error(`cid=${cid},nid=${nid} removeEventListener(${name}) not found`)
    }
    this._$vd.removeEvent(cid, nid, name, handler)
  }
}

export function createElement(tagName) {
  return new UniElement(tagName)
}

export function createElementNS(namespace, tagName) {
  return new UniElement(tagName)
}

export function createTextNode() {
  return noop
}

export function createComment() {
  return noop
}

export function insertBefore() {

}

export function removeChild() {

}

export function appendChild() {

}

export function parentNode() {
  return noop
}

export function nextSibling() {
  return noop
}

export function tagName() {
  return 'view'
}

export function setTextContent() {}

export function setStyleScope() {}
