import Comment from './Comment'
import Element from './Element'
import {
  appendBody,
  setBody
} from './operation'


export default class Document {
  constructor(id, url) {
    this.id = id ? id.toString() : ''
    this.URL = url

    this.createDocumentElement()
  }

  createDocumentElement() {
    if (!this.documentElement) {
      const el = new Element('document')
      el.docId = this.id
      el.ownerDocument = this
      el.role = 'documentElement'
      el.depth = 0
      el.ref = '_documentElement'
      this.documentElement = el

      Object.defineProperty(el, 'appendChild', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: (node) => {
          appendBody(this, node)
        }
      })

      Object.defineProperty(el, 'insertBefore', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: (node, before) => {
          appendBody(this, node, before)
        }
      })
      // if (process.env.NODE_ENV !== 'production') {
      //   console.log(`Create document element (id: "${el.docId}", ref: "${el.ref}")`)
      // }
    }
    return this.documentElement
  }

  createBody(type) {
    if (!this.body) {
      const el = new Element(type)
      setBody(this, el)
      // if (process.env.NODE_ENV !== 'production') {
      //   console.log(`[createBody](${this.id},${el.type},${el.ref}) ` +
      //     `(${JSON.stringify(el.toJSON(true))}).`)
      // }
    }
    return this.body
  }

  createElement(tagName) {
    const el = new Element(tagName)
    // if (process.env.NODE_ENV !== 'production') {
    //   console.log(`[createElement](${this.id},${el.type},${el.ref}) ` +
    //     `(${JSON.stringify(el.toJSON(true))}).`)
    // }
    return el
  }

  createComment(text) {
    return new Comment(text)
  }

  destroy() {
    // if (process.env.NODE_ENV !== 'production') {
    //   console.log(`[destroy](${this.id},document,${this.ref}) ` +
    //     `Destroy document (id: "${this.id}", URL: "${this.URL}")`)
    // }
  }
}
