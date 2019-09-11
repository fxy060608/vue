<template>
  <recycle-list for="(num, i) in lists" @loadmore="fetch">
    <cell-slot class="center">
      <div class="center panel">
        <text class="text">{{num}}</text>
      </div>
    </cell-slot>
  </recycle-list>
</template>

<script>
  const LOADMORE_COUNT = 4
  module.exports = {
    data () {
      return {
        lists: [1, 2, 3, 4, 5]
      }
    },
    methods: {
      fetch (event) {
        this.$nextTick(() => {
          const length = this.lists.length
          for (let i = length; i < length + LOADMORE_COUNT; ++i) {
            this.lists.push(i + 1)
          }
        })
      }
    }
  }
</script>

<style scoped>
  .center {
    justify-content: center;
    align-items: center;
  }
  .panel {
    width: 650px;
    height: 300px;
    margin: 30px;
    background-color: rgba(162, 217, 192, 0.6);
  }
  .text {
    font-size: 100px;
    text-align: center;
    color: #41B883;
  }
</style>
