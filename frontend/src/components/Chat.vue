<template>
  <div>
    <h1>Slack simulator</h1>
    <div class="flex">
      <div class="chat">
        <ul>
          <li :key="index" v-for="(message, index) in messages"> {{ message }} </li>
        </ul>
        <div class="input-area">
         <input ref="input" @keyup.enter="send" /> 
         <button :disabled="disableInput" @click="send">Send</button>
        </div>
      </div>
      <div class="users">
        <h2>Users</h2>
        <ul>
          <li :key="index" v-for="(user, index) in users"> {{ user }} </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    user: String
  },
  data() {
    return {
      messages: [],
      users: ['juho'],
      disableInput: false
    }
  },
  mounted() {  
    this.listenToChat(msg => this.messages.push(msg));
    this.onWsStateChange(closed => this.disableInput = closed);
  },
  methods: {
    send() {
      this.sendToChat(this.$refs.input.value)
      this.$refs.input.value = '';
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .flex {
    display: flex;
  }

  ul {
    display: flex;
    justify-content: flex-end;
    flex-direction: column;
    margin: 0;
    text-align: right;
  }
  
  .input-area {
    display: flex;
    justify-content: flex-end;
    margin-top: 2rem;
  }

  button {
    margin-left: 1rem;
  }

  .chat {
    width: 70%;
    display: flex;
    flex-direction: column;
  }
  
  h1 {
    margin-left: 2rem;
  }

  .users {
    width: 25%;
    margin-left: 5%;
    padding: 0 2rem;
  }

  .users h2 {
    margin-top: 0;
  }

  li {
    display: inline-block;
  }

</style>
