import Vue from 'vue'
import Router from 'vue-router'
import Add from './views/Add.vue'
import Search from './views/Search.vue'
import Login from './views/Login.vue'
import  {getAuth,onAuthStateChanged} from 'firebase/auth'

Vue.use(Router)

export default new Router({
    mode: "history",
    routes: [
        {path: "/",component: Login},
        {
            path: "/home",
            component: Add,
            beforeEnter(to, from, next){
                const auth = getAuth()
                onAuthStateChanged(auth, (user) => {
                    if (user) { //idTokenがあれば、そのまま
                        next()
                    } else { //なければ"login"に飛ばす
                        next("/")
                    }
                })
            }
        },
        {
            path: "/home/search",
            component: Search,
            beforeEnter(to, from, next){
                const auth = getAuth()
                onAuthStateChanged(auth, (user) => {
                    if (user) { //idTokenがあれば、そのまま
                        next()
                    } else { //なければ"login"に飛ばす
                        next("/")
                    }
                })
            }
        }
    ]
})