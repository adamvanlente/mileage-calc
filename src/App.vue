<!-- Wrapper for application -->
<template>
  <div id="app">
    <calculator></calculator>
  </div>
</template>

<!-- Import components -->
<script>
  import Calculator from './components/Calculator'

  export default {
    name: 'app',
    components: {
      Calculator
    }
  }
</script>
