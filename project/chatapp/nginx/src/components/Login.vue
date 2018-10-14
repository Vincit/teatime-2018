<template>
  <div class="container">
    <div class="flex">
    <h1>Moro!</h1>
    <div>
    <label for="login">Nickname</label>
    <input autofocus id="login" ref="input" @keyup.enter="send" />
    </div>
    <button @click="send">Go</button>
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
    flex-direction: column;
  }
  .container {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-top: 20vh;
  }
  label {
    display: block;
    font-size: small;
    font-weight: bold;
    margin-top: 2vh;
  }
  input {
    height: 2rem;
    width: 20rem;
  }

  button {
    width: 5vw;
    align-self: flex-end;
    margin-top: 1vh;
  }

</style>
