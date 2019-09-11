<template recyclable>
  <div>
    <text>{{number}}</text>
  </div>
</template>

<script>
  module.exports = {
    data () {
      return { number: 0 }
    },
    beforeCreate () {
      this.$emit('lifecycle', `${this._uid}#beforeCreate ${this.number}`)
    },
    created () {
      this.$emit('lifecycle', `${this._uid}#created ${this.number}`)
      this.number++
    },
    beforeMount () {
      this.$emit('lifecycle', `${this._uid}#beforeMount ${this.number}`)
      this.number++
    },
    mounted () {
      this.$emit('lifecycle', `${this._uid}#mounted ${this.number}`)
      this.number++
    },
    beforeUpdate () {
      this.$emit('lifecycle', `${this._uid}#beforeUpdate ${this.number}`)
    },
    updated () {
      this.$emit('lifecycle', `${this._uid}#updated ${this.number}`)
    },
    beforeDestroy () {
      this.$emit('lifecycle', `${this._uid}#beforeDestroy ${this.number}`)
    },
    destroyed () {
      this.$emit('lifecycle', `${this._uid}#destroyed ${this.number}`)
    }
  }
</script>
