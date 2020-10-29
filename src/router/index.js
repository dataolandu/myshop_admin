import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/Login'
import Home from '@/components/home/Home'
import Users from '@/components/users/Users'
import Rights from '@/components/rights/Rights'
import Roles from '@/components/roles/Roles'

Vue.use(Router)

const router = new Router({
  //定制路由规则
  routes: [
    {
      path: '/Home', 
      component: Home, 
      children: [{path: 'Users', component: Users},{path: '/Rights', component: Rights},{path: '/Roles', component: Roles}]
    },
    { path: '/Login', component: Login }
  ],

})
//导航守卫
router.beforeEach((to, from, next) => {

  if (to.path === '/login') {
    next();
  } else {
    const token = localStorage.getItem('token');
    if (token) {
      next();
    } else {
      next('/login');
    }
  }
})
export default router;