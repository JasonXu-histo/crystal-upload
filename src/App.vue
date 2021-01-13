<template>
  <div id="app">
    <crystal-upload mode="development"></crystal-upload>
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
      token: '4b4cd993b99cb72c09cca794fbee0d82'
    }
  },
  created() {
    window.localStorage.setItem('crystal-token', this.token) 
  }
}
</script>

<style lang="scss" scoped>
</style>
