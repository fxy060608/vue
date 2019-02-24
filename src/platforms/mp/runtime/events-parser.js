const capture = '!'
const once = '~'
const passive = '&'

function parseEventType(eventType) {
    const isPassive = eventType.charAt(0) === passive
    eventType = isPassive ? eventType.slice(1) : eventType

    const isOnce = eventType.charAt(0) === once // Prefixed last, checked first
    eventType = isOnce ? eventType.slice(1) : eventType

    const isCapture = eventType.charAt(0) === capture
    eventType = isCapture ? eventType.slice(1) : eventType

    return [eventType, isOnce, isPassive, isCapture]
}

function parse(events, ret) {
    Object.keys(events).forEach(name => {

        const [eventType, isOnce] = parseEventType(name)

        if (!ret[eventType]) {
            ret[eventType] = []
        }

        const handlers = events[name]
        if (isOnce) {
            if (Array.isArray(handlers)) {
                handlers.forEach(handler => {
                    handler.once = true
                })
            } else {
                handlers.once = true
            }
        }

        ret[eventType] = ret[eventType].concat(handlers)
    })
}

export function parseListeners(options) {
    const ret = {}
    if (options.on) {
        parse(options.on, ret)
        delete options.on
    }
    return ret
}

export function parseEvents(options) {
    const ret = {}
    if (options.on) {
        parse(options.on, ret)
    }
    if (options.nativeOn) {
        parse(options.nativeOn, ret)
    }
    return ret
}
