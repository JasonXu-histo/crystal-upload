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
# access-id for 应用Id  eg: SMART_PATH for smart-path应用
<template>
  <crystal-upload mode="development" access-id="id"></crystal-upload>
</template>


```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).
