<template>
  <div class="container">
    <h1>Moro!</h1>
    <div>
    <label for="login">Who are you?</label>
    <input id="login" ref="input" @keyup.enter="send" /> <button @click="send">Go</button>
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
  .container {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  label {
    display: block;
    font-size: small;
    font-weight: bold;
  }

</style>
