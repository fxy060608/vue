<template>
  <recycle-list for="(item, i) in inputs">
    <cell-slot :key="i">
      <formula :start="item.start"></formula>
    </cell-slot>
  </recycle-list>
</template>

<script>
  // require('./formula.vue')
  const N = 3
  module.exports = {
    data () {
      return {
        inputs: Array.from({ length: N }).map((_, i) => ({
          start: i + 1
        }))
      }
    }
  }
</script>
