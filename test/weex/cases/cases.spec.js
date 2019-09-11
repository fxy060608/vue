import {
  readFile,
  readObject,
  compileVue,
  compileWithDeps,
  createInstance,
  addTaskHook,
  resetTaskHook,
  getRoot,
  getEvents,
  fireEvent
} from '../helpers'

// Create one-off render test case
function createRenderTestCase (name) {
  const source = readFile(`${name}.vue`)
  const target = readObject(`${name}.vdom.js`)
  return done => {
    compileVue(source).then(code => {
      const id = String(Date.now() * Math.random())
      const instance = createInstance(id, code)
      setTimeout(() => {
        expect(getRoot(instance)).toEqual(target)
        instance.$destroy()
        done()
      }, 50)
    }).catch(done.fail)
  }
}

// Create event test case, will trigger the first bind event
function createEventTestCase (name) {
  const source = readFile(`${name}.vue`)
  const before = readObject(`${name}.before.vdom.js`)
  const after = readObject(`${name}.after.vdom.js`)
  return done => {
    compileVue(source).then(code => {
      const id = String(Date.now() * Math.random())
      const instance = createInstance(id, code)
      setTimeout(() => {
        expect(getRoot(instance)).toEqual(before)
        const event = getEvents(instance)[0]
        fireEvent(instance, event.ref, event.type, {})
        setTimeout(() => {
          expect(getRoot(instance)).toEqual(after)
          instance.$destroy()
          done()
        }, 50)
      }, 50)
    }).catch(done.fail)
  }
}

describe('Usage', () => {
  describe('render', () => {
    it('sample', createRenderTestCase('render/sample'))
    it('class', createRenderTestCase('render/class'))
  })

  describe('event', () => {
    it('click', createEventTestCase('event/click'))
  })

  describe('recycle-list', () => {
    it('text node', createRenderTestCase('recycle-list/text-node'))
    it('attributes', createRenderTestCase('recycle-list/attrs'))
    // it('class name', createRenderTestCase('recycle-list/classname'))
    it('inline style', createRenderTestCase('recycle-list/inline-style'))
    it('v-if', createRenderTestCase('recycle-list/v-if'))
    it('v-else', createRenderTestCase('recycle-list/v-else'))
    it('v-else-if', createRenderTestCase('recycle-list/v-else-if'))
    it('v-for', createRenderTestCase('recycle-list/v-for'))
    it('v-for-iterator', createRenderTestCase('recycle-list/v-for-iterator'))
    it('v-on', createRenderTestCase('recycle-list/v-on'))
    it('v-on-inline', createRenderTestCase('recycle-list/v-on-inline'))
    it('v-once', createRenderTestCase('recycle-list/v-once'))

    it('update recycle-list data', done => {
      const tasks = []
      addTaskHook((_, task) => tasks.push(task))
      const source = readFile(`recycle-list/update.vue`)
      const before = readObject(`recycle-list/update.vdom.js`)
      compileVue(source).then(code => {
        const id = String(Date.now() * Math.random())
        const instance = createInstance(id, code)
        setTimeout(() => {
          expect(getRoot(instance)).toEqual(before)
          tasks.length = 0
          const [add, update] = getEvents(instance)
          fireEvent(instance, add.ref, add.type, {})
          setTimeout(() => {
            expect(tasks.length).toEqual(1)
            expect(tasks[0].method).toEqual('insertRange')
            expect(tasks[0].args).toEqual([2, [{ name: 'Y-1' }]])
            tasks.length = 0
            fireEvent(instance, update.ref, update.type, {})
            fireEvent(instance, add.ref, add.type, {})
            setTimeout(() => {
              expect(tasks.length).toEqual(2)
              expect(tasks[0].method).toEqual('insertRange')
              expect(tasks[0].args).toEqual([3, [{ name: 'Y-3' }]])
              expect(tasks[1].method).toEqual('updateData')
              expect(tasks[1].args).toEqual([2, { name: 'X-2' }])
              instance.$destroy()
              resetTaskHook()
              done()
            }, 50)
          }, 50)
        }, 50)
      }).catch(done.fail)
    })

    it('stateless component', done => {
      compileWithDeps('recycle-list/components/stateless.vue', [{
        name: 'banner',
        path: 'recycle-list/components/banner.vue'
      }]).then(code => {
        const id = String(Date.now() * Math.random())
        const instance = createInstance(id, code)
        setTimeout(() => {
          const target = readObject('recycle-list/components/stateless.vdom.js')
          expect(getRoot(instance)).toEqual(target)
          instance.$destroy()
          done()
        }, 50)
      }).catch(done.fail)
    })

    it('stateless component with props', done => {
      compileWithDeps('recycle-list/components/stateless-with-props.vue', [{
        name: 'poster',
        path: 'recycle-list/components/poster.vue'
      }]).then(code => {
        const id = String(Date.now() * Math.random())
        const instance = createInstance(id, code)
        setTimeout(() => {
          const target = readObject('recycle-list/components/stateless-with-props.vdom.js')
          expect(getRoot(instance)).toEqual(target)
          instance.$destroy()
          done()
        }, 50)
      }).catch(done.fail)
    })

    it('multi stateless components', done => {
      compileWithDeps('recycle-list/components/stateless-multi-components.vue', [{
        name: 'banner',
        path: 'recycle-list/components/banner.vue'
      }, {
        name: 'poster',
        path: 'recycle-list/components/poster.vue'
      }, {
        name: 'footer',
        path: 'recycle-list/components/footer.vue'
      }]).then(code => {
        const id = String(Date.now() * Math.random())
        const instance = createInstance(id, code)
        setTimeout(() => {
          const target = readObject('recycle-list/components/stateless-multi-components.vdom.js')
          expect(getRoot(instance)).toEqual(target)
          instance.$destroy()
          done()
        }, 50)
      }).catch(done.fail)
    })

    it('stateful component', done => {
      const tasks = []
      addTaskHook((_, task) => tasks.push(task))
      compileWithDeps('recycle-list/components/stateful.vue', [{
        name: 'counter',
        path: 'recycle-list/components/counter.vue'
      }]).then(code => {
        const id = String(Date.now() * Math.random())
        const instance = createInstance(id, code)
        setTimeout(() => {
          // check the render results
          const target = readObject('recycle-list/components/stateful.vdom.js')
          expect(getRoot(instance)).toEqual(target)
          tasks.length = 0

          // trigger component hooks
          const res1 = instance.$triggerHook(
            'virtual-component-template-0', // uid of the virtual component template
            'create', // lifecycle hook name

            // arguments for the callback
            [
              'x-1', // componentId of the virtual component
              { start: 3 } // propsData of the virtual component
            ]
          )
          const res2 = instance.$triggerHook(
            'virtual-component-template-0',
            'create',
            ['x-2', { start: 11 }]
          )

          // the state (_data) of the virtual component should be sent to native
          expect(res1).toEqual({ count: 6 })
          expect(res2).toEqual({ count: 22 })

          instance.$triggerHook('x-1', 'attach')
          instance.$triggerHook('x-2', 'attach')
          tasks.length = 0

          // simulate a click event
          // the event will be caught by the virtual component template and
          // should be dispatched to virtual component according to the componentId
          const event = getEvents(instance)[0]
          fireEvent(instance, event.ref, 'click', { componentId: 'x-1' })
          setTimeout(() => {
            expect(tasks.length).toEqual(1)
            expect(tasks[0].method).toEqual('updateComponentData')
            expect(tasks[0].args[0]).toEqual('x-1')
            expect(tasks[0].args[1]).toEqual({ count: 7 })
            instance.$destroy()
            resetTaskHook()
            done()
          })
        }, 50)
      }).catch(done.fail)
    })

    it('watch & computed', done => {
      const tasks = []
      addTaskHook((_, task) => tasks.push(task))
      compileWithDeps('recycle-list/components/watch-computed.vue', [{
        name: 'formula',
        path: 'recycle-list/components/formula.vue'
      }]).then(code => {
        const id = String(Date.now() * Math.random())
        const instance = createInstance(id, code)
        const target = readObject(`recycle-list/components/watch-computed.vdom.js`)
        setTimeout(() => {
          expect(getRoot(instance)).toEqual(target)
          const [btnX, btnY] = getEvents(instance)
          const res1 = instance.$triggerHook(
            'virtual-component-template-0',
            'create',
            ['formula-1', { start: 7 }]
          )
          const res2 = instance.$triggerHook(
            'virtual-component-template-0',
            'create',
            ['formula-2', { start: 9 }]
          )
          expect(res1).toEqual({ x: 7, y: 7, result: 49 })
          expect(res2).toEqual({ x: 9, y: 9, result: 81 })
          instance.$triggerHook('formula-1', 'attach')
          instance.$triggerHook('formula-2', 'attach')
          tasks.length = 0
          fireEvent(instance, btnX.ref, btnX.type, { componentId: 'formula-1' })
          fireEvent(instance, btnY.ref, btnY.type, { componentId: 'formula-2' })
          setTimeout(() => {
            expect(tasks.length).toEqual(4)
            expect(tasks[0].module).toEqual('modal')
            expect(tasks[0].method).toEqual('toast')
            expect(tasks[0].args).toEqual([{ message: 'result changed: 56' }])
            expect(tasks[1].module).toEqual('modal')
            expect(tasks[1].method).toEqual('toast')
            expect(tasks[1].args).toEqual([{ message: 'result changed: 90' }])
            expect(tasks[2].method).toEqual('updateComponentData')
            expect(tasks[2].args[0]).toEqual('formula-1')
            expect(tasks[2].args[1]).toEqual({ x: 8, y: 7, result: 56 })
            expect(tasks[3].method).toEqual('updateComponentData')
            expect(tasks[3].args[0]).toEqual('formula-2')
            expect(tasks[3].args[1]).toEqual({ x: 9, y: 10, result: 90 })
            instance.$destroy()
            resetTaskHook()
            done()
          }, 50)
        }, 50)
      }).catch(done.fail)
    })

    it('component lifecycle', done => {
      global.__lifecycles = []
      compileWithDeps('recycle-list/components/stateful-lifecycle.vue', [{
        name: 'lifecycle',
        path: 'recycle-list/components/lifecycle.vue'
      }]).then(code => {
        const id = String(Date.now() * Math.random())
        const instance = createInstance(id, code)
        setTimeout(() => {
          const target = readObject('recycle-list/components/stateful-lifecycle.vdom.js')
          expect(getRoot(instance)).toEqual(target)
          instance.$triggerHook('virtual-component-template-0', 'create', ['y-1'])
          instance.$triggerHook('y-1', 'attach')
          setTimeout(() => {
            expect(global.__lifecycles).toEqual([
              'beforeCreate undefined',
              'created 0',
              'beforeMount 1',
              'mounted 1',
              'beforeUpdate 2'
              // 'updated 2' // the updated lifecycle can't be simulated in Node.js
            ])
            global.__lifecycles = []
            instance.$triggerHook('y-1', 'detach')
            setTimeout(() => {
              expect(global.__lifecycles).toEqual([
                'beforeDestroy 2',
                'destroyed 2'
              ])
              delete global.__lifecycles
              instance.$destroy()
              done()
            }, 50)
          }, 50)
        }, 50)
      }).catch(done.fail)
    })

    it('emit custom event', done => {
      const tasks = []
      addTaskHook((_, task) => tasks.push(task))
      compileWithDeps('recycle-list/components/custom-event.vue', [{
        name: 'lifecycle-emit',
        path: 'recycle-list/components/lifecycle-emit.vue'
      }]).then(code => {
        const id = String(Date.now() * Math.random())
        const instance = createInstance(id, code)
        const target = readObject(`recycle-list/components/custom-event.vdom.js`)
        setTimeout(() => {
          expect(getRoot(instance)).toEqual(target)
          tasks.length = 0
          const [click] = getEvents(instance)
          instance.$triggerHook('virtual-component-template-0', 'create', ['event-1'])
          instance.$triggerHook('virtual-component-template-0', 'create', ['event-2'])
          instance.$triggerHook('event-1', 'attach')
          instance.$triggerHook('event-2', 'attach')
          expect(tasks.length).toEqual(8)
          expect(tasks[0].module).toEqual('modal')
          expect(tasks[0].method).toEqual('toast')
          expect(tasks[0].args[0]).toEqual({ message: 'event-1#beforeCreate undefined' })
          expect(tasks[1].args[0]).toEqual({ message: 'event-1#created 0' })
          expect(tasks[2].args[0]).toEqual({ message: 'event-2#beforeCreate undefined' })
          expect(tasks[3].args[0]).toEqual({ message: 'event-2#created 0' })
          expect(tasks[4].args[0]).toEqual({ message: 'event-1#beforeMount 1' })
          expect(tasks[5].args[0]).toEqual({ message: 'event-1#mounted 2' })
          expect(tasks[6].args[0]).toEqual({ message: 'event-2#beforeMount 1' })
          expect(tasks[7].args[0]).toEqual({ message: 'event-2#mounted 2' })
          tasks.length = 0
          fireEvent(instance, click.ref, click.type, {}, [1])
          setTimeout(() => {
            // expect(tasks.length).toEqual(1)
            expect(tasks[0].method).toEqual('updateData')
            expect(tasks[0].args).toEqual([1, { visible: false }])
            tasks.length = 0
            instance.$triggerHook('event-2', 'detach')
            setTimeout(() => {
              expect(tasks.length).toEqual(2)
              expect(tasks[0].module).toEqual('modal')
              expect(tasks[0].method).toEqual('toast')
              expect(tasks[0].args[0]).toEqual({ message: 'event-2#beforeDestroy 3' })
              expect(tasks[1].args[0]).toEqual({ message: 'event-2#destroyed 3' })
              instance.$destroy()
              resetTaskHook()
              done()
            }, 50)
          }, 50)
        }, 50)
      }).catch(done.fail)
    })

    it('stateful component with v-model', done => {
      compileWithDeps('recycle-list/components/stateful-v-model.vue', [{
        name: 'editor',
        path: 'recycle-list/components/editor.vue'
      }]).then(code => {
        const id = String(Date.now() * Math.random())
        const instance = createInstance(id, code)
        setTimeout(() => {
          const target = readObject('recycle-list/components/stateful-v-model.vdom.js')
          expect(getRoot(instance)).toEqual(target)
          instance.$destroy()
          done()
        }, 50)
      }).catch(done.fail)
    })

    it('loadmore event', done => {
      const tasks = []
      addTaskHook((_, task) => tasks.push(task))
      const source = readFile(`recycle-list/loadmore.vue`)
      const target = readObject(`recycle-list/loadmore.vdom.js`)
      compileVue(source).then(code => {
        const id = String(Date.now() * Math.random())
        const instance = createInstance(id, code)
        const LOADMORE_COUNT = 4
        setTimeout(() => {
          expect(getRoot(instance)).toEqual(target)
          tasks.length = 0
          const [loadmore] = getEvents(instance)
          fireEvent(instance, loadmore.ref, loadmore.type, {})
          setTimeout(() => {
            expect(tasks.length).toEqual(LOADMORE_COUNT)
            for (let i = 0; i < LOADMORE_COUNT; ++i) {
              expect(tasks[i].method).toEqual('insertRange')
              expect(tasks[i].args).toEqual([5 + i, [6 + i]])
            }
            tasks.length = 0
            fireEvent(instance, loadmore.ref, loadmore.type, {})
            fireEvent(instance, loadmore.ref, loadmore.type, {})
            setTimeout(() => {
              expect(tasks.length).toEqual(LOADMORE_COUNT * 2)
              for (let i = 0; i < LOADMORE_COUNT * 2; ++i) {
                expect(tasks[i].method).toEqual('insertRange')
                expect(tasks[i].args).toEqual([9 + i, [10 + i]])
              }
              instance.$destroy()
              resetTaskHook()
              done()
            }, 50)
          }, 50)
        }, 50)
      }).catch(done.fail)
    })
  })
})
