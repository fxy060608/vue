const noop = {}

class UniElement {
  constructor(tagName) {
    this.tagName = tagName
    this.cid = ''
    this.nid = ''

    this.events = Object.create(null)
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
      console.error(`cid=${this.cid},nid=${this.nid} dispatchEvent(${name}) not found`)
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
