import CrystalUpload from './crystal-upload.vue'
import {
  Button, Input, Popover, Progress
} from 'element-ui'
import { Table } from 'view-design'
import 'element-ui/lib/theme-chalk/index.css';
import 'view-design/dist/styles/iview.css';
import 'babel-polyfill'
const component = {
  install(Vue) {
    Vue.component(
      'CrystalUpload', CrystalUpload
    ),
    Vue.component('i-table', Table),
    Vue.use(Button),
    Vue.use(Input),
    Vue.use(Popover),
    Vue.use(Progress)
  }
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(component)
}

export default component
