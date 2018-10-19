<template>
  <div class="flex">
    <div class="chat">
      <ul class="chat-message-area">
        <li :key="index" v-for="(message, index) in messages"> 
          <h5>{{ message.sender }} {{  message.timestamp | formatDate }}</h5>
          <span>{{ message.message }}</span>
            </li>
      </ul>
      <div class="input-area">
        <picker v-show="pickEmojiOpen" @select="addEmoji" :style="{ position: 'absolute', bottom: '2vh', 'z-index': 10 }" />
        <input ref="input" v-model.lazy.trim="inputValue" @keyup.enter="send" /> 
        <span @click="openEmojiPicker" class="open-emoji-picker">💩</span>
        <button :disabled="disableInput" @click="send">Send</button>
      </div>
    </div>
  </div>
</template>

<script>
import parse from 'date-fns/parse'
import format from 'date-fns/format'
import { Picker } from 'emoji-mart-vue'

export default {
  components: {
    Picker
  },
  data() {
    return {
      messages: [],
      disableInput: false,
      pickEmojiOpen: false,
      inputValue: ''
    }
  },
  mounted() {  
    this.listenToChat(msg => this.messages.push(msg));
    this.onWsStateChange(closed => this.disableInput = closed);
    this.$refs.input.focus();
  },
  methods: {
    send() {
      if (this.inputValue) {
        this.sendToChat(this.inputValue)
        this.inputValue = '';
        this.$refs.input.value = '';
      }
    },
    addEmoji(emoji){
      this.inputValue = this.inputValue+emoji.native;
      this.pickEmojiOpen = false;
    },
    openEmojiPicker() {
      this.pickEmojiOpen = true;
    }
  },
  filters: {
    formatDate(value) {
      if (!value) {
        return '';
      }
     return format(parse(value),'HH:mm')
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

  .chat-message-area {
    height: 72vh;
    overflow: hidden;
    margin-bottom: 3vh;
  }
  
  .input-area {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 1vh;
  }

  input {
    width: 60%;
    font-size: 1.5rem
  }

  .chat {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 100%;
    margin-right: 5rem;
  }

  li {
    display: inline-block;
  }


  h5 {
    margin: 0.5rem 0 0 0;
    font-size: 2rem;
  }

  .chat-message-area span {
    font-size: 2rem;
  }

  button {
    margin-left: 1rem;
  }


  .open-emoji-picker {
    margin-left: -25px;
    cursor: pointer;
  }

</style>
