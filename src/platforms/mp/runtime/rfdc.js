/**
 * rfdc v1.4.1
 * David Mark Clements <david.clements@nearform.com>
 * Really Fast Deep Clone
 * [npm](https://www.npmjs.com/package/rfdc) [homePage](https://github.com/davidmarkclements/rfdc.git)
 */

/**
 * @typedef {{proto?: boolean; circles?: boolean; reviver: (key: string, value: any) => any; constructorHandlers?: any[];}} Options
 */

function copyBuffer(cur) {
  if (typeof Buffer !== 'undefined' && cur instanceof Buffer) {
    return Buffer.from(cur)
  }

  const length = cur instanceof DataView ? cur.byteLength : cur.length
  return new cur.constructor(cur.buffer.slice(), cur.byteOffset, length)
}

/**
 *
 * @param {Options} opts
 * @returns {(o: any) => any}
 */
export default function rfdc(opts) {
  opts = opts || {}
  if (opts.circles) return rfdcCircles(opts)

  const constructorHandlers = new Map()
  constructorHandlers.set(Date, (o) => new Date(o))
  constructorHandlers.set(Map, (o, fn) => new Map(cloneArray(Array.from(o), fn)))
  constructorHandlers.set(Set, (o, fn) => new Set(cloneArray(Array.from(o), fn)))
  if (opts.constructorHandlers) {
    opts.constructorHandlers.forEach((handler) => {
      constructorHandlers.set(handler[0], handler[1])
    })
  }

  let handler = null

  return opts.proto ? cloneProto : clone

  function cloneArray(a, fn) {
    const keys = Object.keys(a)
    const a2 = new Array(a.length)
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i]
      const cur = a[k]
      if (typeof cur !== 'object' || cur === null) {
        a2[k] = cur
      } else if (cur.constructor !== Object && (handler = constructorHandlers.get(cur.constructor))) {
        a2[k] = handler(cur, fn)
      } else if (ArrayBuffer.isView(cur)) {
        a2[k] = copyBuffer(cur)
      } else {
        a2[k] = fn(opts.reviver ? opts.reviver(k, cur) : cur)
      }
    }
    return a2
  }

  function clone(o) {
    if (typeof o !== 'object' || o === null) return o
    if (Array.isArray(o)) return cloneArray(o, clone)
    if (o.constructor !== Object && (handler = constructorHandlers.get(o.constructor))) {
      return handler(o, clone)
    }
    const o2 = {}
    for (const k in o) {
      if (Object.hasOwnProperty.call(o, k) === false) continue
      const cur = o[k]
      if (typeof cur !== 'object' || cur === null) {
        o2[k] = cur
      } else if (cur.constructor !== Object && (handler = constructorHandlers.get(cur.constructor))) {
        o2[k] = handler(cur, clone)
      } else if (ArrayBuffer.isView(cur)) {
        o2[k] = copyBuffer(cur)
      } else {
        o2[k] = clone(opts.reviver ? opts.reviver(k, cur) : cur)
      }
    }
    return o2
  }

  function cloneProto(o) {
    if (typeof o !== 'object' || o === null) return o
    if (Array.isArray(o)) return cloneArray(o, cloneProto)
    if (o.constructor !== Object && (handler = constructorHandlers.get(o.constructor))) {
      return handler(o, cloneProto)
    }
    const o2 = {}
    for (const k in o) {
      const cur = o[k]
      if (typeof cur !== 'object' || cur === null) {
        o2[k] = cur
      } else if (cur.constructor !== Object && (handler = constructorHandlers.get(cur.constructor))) {
        o2[k] = handler(cur, cloneProto)
      } else if (ArrayBuffer.isView(cur)) {
        o2[k] = copyBuffer(cur)
      } else {
        o2[k] = cloneProto(opts.reviver ? opts.reviver(k, cur) : cur)
      }
    }
    return o2
  }
}

function rfdcCircles(opts) {
  const refs = []
  const refsNew = []

  const constructorHandlers = new Map()
  constructorHandlers.set(Date, (o) => new Date(o))
  constructorHandlers.set(Map, (o, fn) => new Map(cloneArray(Array.from(o), fn)))
  constructorHandlers.set(Set, (o, fn) => new Set(cloneArray(Array.from(o), fn)))
  if (opts.constructorHandlers) {
    opts.constructorHandlers.forEach((handler) => {
      constructorHandlers.set(handler[0], handler[1])
    })
  }

  let handler = null
  return opts.proto ? cloneProto : clone

  function cloneArray(a, fn) {
    const keys = Object.keys(a)
    const a2 = new Array(a.length)
    refs.push(a)
    refsNew.push(a2)
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i]
      const cur = a[k]
      if (typeof cur !== 'object' || cur === null) {
        a2[k] = cur
      } else if (cur.constructor !== Object && (handler = constructorHandlers.get(cur.constructor))) {
        a2[k] = handler(cur, fn)
      } else if (ArrayBuffer.isView(cur)) {
        a2[k] = copyBuffer(cur)
      } else {
        const index = refs.indexOf(cur)
        if (index !== -1) {
          a2[k] = refsNew[index]
        } else {
          a2[k] = fn(opts.reviver ? opts.reviver(k, cur) : cur)
        }
      }
    }
    refs.pop()
    refsNew.pop()
    return a2
  }

  function clone(o) {
    if (typeof o !== 'object' || o === null) return o
    if (Array.isArray(o)) return cloneArray(o, clone)
    if (o.constructor !== Object && (handler = constructorHandlers.get(o.constructor))) {
      return handler(o, clone)
    }
    const o2 = {}
    refs.push(o)
    refsNew.push(o2)
    for (const k in o) {
      if (Object.hasOwnProperty.call(o, k) === false) continue
      const cur = o[k]
      if (typeof cur !== 'object' || cur === null) {
        o2[k] = cur
      } else if (cur.constructor !== Object && (handler = constructorHandlers.get(cur.constructor))) {
        o2[k] = handler(cur, clone)
      } else if (ArrayBuffer.isView(cur)) {
        o2[k] = copyBuffer(cur)
      } else {
        const i = refs.indexOf(cur)
        if (i !== -1) {
          o2[k] = refsNew[i]
        } else {
          o2[k] = clone(opts.reviver ? opts.reviver(k, cur) : cur)
        }
      }
    }
    refs.pop()
    refsNew.pop()
    return o2
  }

  function cloneProto(o) {
    if (typeof o !== 'object' || o === null) return o
    if (Array.isArray(o)) return cloneArray(o, cloneProto)
    if (o.constructor !== Object && (handler = constructorHandlers.get(o.constructor))) {
      return handler(o, cloneProto)
    }
    const o2 = {}
    refs.push(o)
    refsNew.push(o2)
    for (const k in o) {
      const cur = o[k]
      if (typeof cur !== 'object' || cur === null) {
        o2[k] = cur
      } else if (cur.constructor !== Object && (handler = constructorHandlers.get(cur.constructor))) {
        o2[k] = handler(cur, cloneProto)
      } else if (ArrayBuffer.isView(cur)) {
        o2[k] = copyBuffer(cur)
      } else {
        const i = refs.indexOf(cur)
        if (i !== -1) {
          o2[k] = refsNew[i]
        } else {
          o2[k] = cloneProto(opts.reviver ? opts.reviver(k, cur) : cur)
        }
      }
    }
    refs.pop()
    refsNew.pop()
    return o2
  }
}
