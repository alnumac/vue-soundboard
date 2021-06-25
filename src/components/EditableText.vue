<template>
  <div
    ref="elEditable"
    class="editable"
    spellcheck="false"
    contenteditable
    @blur="onBlur($event)"
    @keydown="onKeydown($event)"
  >
    {{ modelValue }}
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  components: {
  },
  props: {
    modelValue: {
      type: String,
      required: true
    }
  },
  emits: [
    'update:modelValue'
  ],
  setup(props, context) {
    const elEditable = ref(null)

    function onKeydown(event) {
      if (event.key === "Enter") {
        event.target.blur()
      }
    }

    function onBlur(event) {
      const value = event.target.innerText
      const clean_value = value.replace(/[\n\r]/g, '').trim()
      const html_value = event.target.innerHTML
      if (!clean_value) {
        event.target.innerText = props.modelValue
      } else if (html_value !== props.modelValue) {
        event.target.innerText = clean_value
        context.emit('update:modelValue', clean_value)
      }
    }

    return {
      elEditable,
      onKeydown,
      onBlur
    }
  },
}
</script>

<style scoped>

.editable {
  padding: 0px 0.5rem;
  font-size: 1.25rem;
  line-height: 2rem;
  letter-spacing: .4px;
  font-family: Roboto Mono,monospace;
  font-weight: 500;
  letter-spacing: .0125em;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  
  cursor: pointer;
  background-color: unset;
  border: none;
  color: inherit;
  border-radius: 4px;
  min-width: unset;
  max-width: unset;
  width: unset;
  transition: background-color 280ms cubic-bezier(0.4, 0, 0.2, 1);
}

.editable:hover {
  background-color: hsla(0, 100%, 100%, 6%);
}

.editable:focus {
  background-color: hsla(0, 0%, 0%, 20%);
  border: solid 1px hsla(0, 100%, 100%, 20%);
  cursor: text;
  outline: none;
}
</style>