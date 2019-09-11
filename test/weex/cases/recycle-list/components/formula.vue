<template recyclable>
  <div>
    <text class="output">f({{x}}, {{y}}) = {{result}}</text>
    <div class="btn-group">
      <text class="btn" @click="x++">x++</text>
      <text class="btn" @click="y++">y++</text>
    </div>
  </div>
</template>

<script>
  const modal = weex.requireModule('modal')
  module.exports = {
    props: ['start'],
    data () {
      return {
        x: parseInt(this.start, 10) || 1,
        y: parseInt(this.start, 10) || 2,
      }
    },
    computed: {
      result () {
        return this.x * this.y
      }
    },
    watch: {
      result () {
        modal.toast({ message: 'result changed: ' + this.result })
      }
    }
  }
</script>

<style scoped>
  .output {
    font-size: 50px;
    font-family: monospace;
    text-align: center;
    color: #41B883;
    margin: 50px;
  }
  .btn-group {
    flex-direction: row;
    justify-content: space-around;
    padding-bottom: 50px;
    border-bottom-width: 1px;
    border-bottom-color: #CCC;
  }
  .btn {
    width: 200px;
    padding: 10px;
    font-size: 50px;
    text-align: center;
    border-width: 2px;
    border-color: #DDD;
    background-color: #F5F5F5;
    color: #888;
  }
</style>
