import Vue from 'vue'
import App from './App.vue'
//bootstrap
import 'bootstrap/dist/css/bootstrap.css' 
import 'bootstrap-vue/dist/bootstrap-vue.css'
//fontawesome
import  {library}  from '@fortawesome/fontawesome-svg-core'
import { faStickyNote } from "@fortawesome/free-solid-svg-icons"
import { faPen } from "@fortawesome/free-solid-svg-icons"
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons"
import  {FontAwesomeIcon}  from '@fortawesome/vue-fontawesome'
//modal
import VModal from 'vue-js-modal'
//router
import router from './router'
//firebase
import { initializeApp } from 'firebase/app'
import { getFirestore } from "firebase/firestore"
//datepicker
import Datepicker from 'vuejs-datepicker'


library.add(faStickyNote)
library.add(faPen)
library.add(faTrashAlt)

Vue.component('FontAwesomeIcon', FontAwesomeIcon)
Vue.component('Datepicker', Datepicker)
Vue.use(VModal)

Vue.config.productionTip = false

//initializeApp

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
