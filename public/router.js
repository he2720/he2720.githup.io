import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login'
import Register from './components/Register'
import Home from './components/Home.vue'
import Welcome from './components/Welcome.vue'
import Format from './components/Format.vue'
import Select from './components/Select.vue'
import Mark from './components/Mark.vue'
import Mark1 from './components/Mark1.vue'
import Mark2 from './components/Mark2.vue'
import Mark3 from './components/Mark3.vue'
import Task1 from './components/Task1.vue'
import Task2 from './components/Task2.vue'
import Backstage from './components/Backstage.vue'
import Backend from './components/Backend.vue'
import Endtask from './components/Endtask.vue'

Vue.use(Router)


const router = new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            component: Login
        },
        {
            path: '/register',
            component: Register
        },
        {
            path: '/backstage',
            component: Backstage
        },
        {
            path: '/backend',
            component: Backend
        },
        {
            path: '/endtask',
            component: Endtask
        },
        {
            path: '/home',
            component: Home,
            redirect: '/welcome',
            children: [
                {
                    path: '/welcome',
                    component: Welcome
                },
                {
                    path: '/format',
                    component: Format
                },
                {
                    path: '/select',
                    component: Select
                },
                {
                    path: '/mark',
                    component: Mark
                },
                {
                    path: '/mark1',
                    component: Mark1
                },
                {
                    path: '/mark2',
                    component: Mark2
                },
                {
                    path: '/mark3',
                    component: Mark3
                },
                {
                    path: '/task1',
                    component: Task1
                },
                {
                    path: '/task2',
                    component: Task2
                }
            ]
        },
    ]
})

router.beforeEach((to, from, next) => {
    if (to.path === '/mark') {
        const identity = window.sessionStorage.getItem('identity');
        if (identity == '0') {
            const mark=window.sessionStorage.getItem('mark');
            if(mark==2){
                next({ path: '/mark2' })
            }else{
                next({ path: '/mark1' })
            }
        } else next();
    } else next();

})

export default router