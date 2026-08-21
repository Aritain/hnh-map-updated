<template>
  <v-btn class="short-btn" width="100%" @click="$emit('input', !value)">
    <v-icon left small :color="value ? 'success' : 'grey'">
      {{ value ? 'mdi-circle' : 'mdi-circle-outline' }}
    </v-icon>
    {{ label }}
  </v-btn>
</template>

<script>
export default {
  name: "ToggleButton",
  props: {
    value: {type: Boolean, required: true},
    label: {type: String, required: true},
  },
}
</script>
