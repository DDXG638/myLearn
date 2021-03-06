import Vue from 'vue'
import Router from 'vue-router'
import Task from './views/Task'

Vue.use(Router)

export default new Router({
  base: '/task',
  routes: [
    {
      path: '/',
      name: 'task',
      component: Task
    },
    {
      path: '/sign',
      name: 'sign',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "sign" */ './views/Sign.vue')
    },
    {
      path: '/attr',
      name: 'attr',
      component: () => import(/* webpackChunkName: "attr" */ './views/attrs.vue')
    }
  ]
})
