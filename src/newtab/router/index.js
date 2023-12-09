
import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/newtab/views/home/home.vue'

const routes = [
    { path: '/', component: Home, exact: true },
    // 匹配 #/，指向Entry页面

]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router
