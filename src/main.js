import Vue from 'vue'
import ElementUI from 'element-ui'
import Iview from 'view-design'
import 'element-ui/lib/theme-chalk/index.css';
import 'view-design/dist/styles/iview.css';
import App from './App.vue'
import 'babel-polyfill'
Vue.use(ElementUI)
Vue.use(Iview)
new Vue({
  el: '#app',
  render: h => h(App)
})
