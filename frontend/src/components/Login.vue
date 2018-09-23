<template>
  <div>
    <h1>Login</h1>
    <div class="flex">
    <input ref="input" @keyup.enter="send" /> <button @click="send">Send</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: String
  },
  methods: {
    send() {
      this.$emit('login', this.$refs.input.value);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .flex {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }

</style>
