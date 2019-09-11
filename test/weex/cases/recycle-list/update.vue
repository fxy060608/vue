<template>
  <recycle-list for="(item, index) in longList">
    <cell-slot>
      <text @click="add">{{index}} {{item.name}}</text>
      <text @click="update">{{index}} {{item.name}}</text>
    </cell-slot>
  </recycle-list>
</template>

<script>
  module.exports = {
    data () {
      return {
        start: 0,
        longList: [
          { name: 'A' },
          { name: 'B' }
        ]
      }
    },
    methods: {
      add () {
        this.start++
        this.longList.push({ name: `Y-${this.start}` })
      },
      update () {
        this.start++
        this.longList[this.longList.length-1].name = `X-${this.start}`
      }
    }
  }
</script>

