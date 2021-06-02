<template>
  <div
    class="editable"
    contenteditable
    @blur="onBlur($event)"
    @keydown="onKeydown($event)"
  >
    {{ modelValue }}
  </div>
</template>

<script>
// ref, reactive, toRefs, computed, watch, onMounted, onUpdated, onUnmounted
// import { ref } from 'vue'

export default {
  components: { },
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
      onKeydown,
      onBlur
    }
  },
}
</script>

<style scoped>
.editable {
  margin: 0px 20px;
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
  
  background-color: unset;
  border: none;
  color: inherit;
  cursor: default;
  border-radius: 4px;
  min-width: unset;
  max-width: unset;
  width: unset;
}

.editable:hover {
  background-color: hsl(
    var(--md-color-surface-h),
    var(--md-color-surface-s),
    calc( var(--md-color-surface-l) + 12% )
  );
}

.editable:focus {
  background-color: hsl(
    var(--md-color-surface-h),
    var(--md-color-surface-s),
    calc( var(--md-color-surface-l) + 17% )
  );
  cursor: text;
  outline: none;
}
</style>