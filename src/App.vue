<template>
  <div id="app">
    <crystal-upload mode="development" access-id="SMART_PATH"></crystal-upload>
  </div>
</template>

<script>
import CrystalUpload from './components/crystal-upload'
export default {
  name: 'app',
  components: {
    CrystalUpload
  },
  data () {
    return {
      
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
