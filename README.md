# crystal-upload

> crystal upload plugin

## Build Setup

``` bash
# install dependencies
npm install

# in main.js
import CrystalUpload from 'crystal-upload'
Vue.use(CrystalUpload)

# in components
# development for dev   production for prod
<template>
  <crystal-upload mode="development" @getGlobalId="getGlobalId"></crystal-upload>
</template>
# config.js里process.env.ACCESS_ID  系统的标识 SMART_PATH for smartpath ...
# token为当前系统登录获取的token存在本地存储里 
# getGlobalId 方法会获取当前上传的切片的globalId的集合
<script>
  export default {
    name: 'Component',
    created() {
      window.localStorage.setItem('access-id', process.env.ACCESS_ID)
      window.localStorage.setItem('crystal-token', token)
    },
    methods: {
      getGlobalId(val) {
        console.log(val)
      }
    }
  }
</script>



```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).
