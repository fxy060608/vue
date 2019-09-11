<template>
  <recycle-list for="(item, i) in panels">
    <cell-slot>
      <div v-if="item.visible" @click="hide(i)">
        <lifecycle-emit @lifecycle="toast"></lifecycle-emit>
      </div>
    </cell-slot>
  </recycle-list>
</template>

<script>
  // require('./lifecycle-emit.vue')
  const modal = weex.requireModule('modal')
  module.exports = {
    data () {
      const N = 2
      return {
        panels: [
          { visible: true },
          { visible: true }
        ]
      }
    },
    methods: {
      toast (message) {
        modal.toast({ message })
      },
      hide (i) {
        const panel = this.panels[i]
        if (panel) {
          panel.visible = false
        }
      }
    }
  }
</script>

<style scoped>
  .record {
    margin-top: 10px;
    margin-bottom: 50px;
  }
  .message {
    padding-left: 50px;
    color: #666;
    font-size: 36px;
  }
</style>
