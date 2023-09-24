import Vue from 'vue'
import Router from 'vue-router'
import {Home, PatientProfile, Patients, Planner, Login, Register, Supplements, Profile, Admin, Unsubscribed} from '@/views'
import ApacheForm from "@/components/Scratches/ApacheForm";
import firebase from 'firebase/app'
import store from './store'
require('firebase/auth');

Vue.use(Router);

let router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    linkActiveClass: "active",
    linkExactActiveClass: "exact-active",
    routes: [
        {
            path: '/admin',
            name: 'admin',
            component: Admin,
            meta:{
                requiresAuth: true,
                requiresAdmin: true
            }
        },
        {
            path: '/subscribe',
            name: 'unsubscribed',
            component: Unsubscribed,
            meta:{
                requiresAuth: true,
            }
        },
        {
            path: '/',
            name: 'home',
            component: Home,
            meta:{
                requiresAuth: true,
                requiresPremium: true,
            }
        },
        {
            path: '/login',
            name: 'login',
            component: Login,
            meta:{
                requiresGuest: true
            }
        },
        {
            path: '/register',
            name: 'register',
            component: Register,
            meta:{
                requiresGuest: true
            }
        },
        {
            path: '/profile',
            name: 'profile',
            component: Profile,
            meta:{
                requiresAuth: true,
            }
        },
        {
            path: '/test',
            name: 'test',
            component: ApacheForm
        },
        {
            path: '/patients',
            name: 'patients',
            component: Patients,
            meta:{
                requiresAuth: true,
                requiresPremium: true,
            }
        },
        {
            path: '/additives',
            name: 'additives',
            component: Supplements,
            meta:{
                requiresAuth: true,
                requiresPremium: true,
            }
        },
        {
            path: '/patients/:id',
            name: 'patient-profile',
            props: true,
            component: PatientProfile,
            meta:{
                requiresAuth: true,
                requiresPremium: true,
            }
        },
        {
            path: '/patients/:id/create-planner/:plannerId',
            name: 'planner',
            props: true,
            component: Planner,
            meta:{
                requiresAuth: true,
                requiresPremium: true,
            }
        },
    ]
});

//Navigation Guards

router.beforeEach((to, from, next) => {
   //Check For requiredAuth Guard
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const requiresGuest = to.matched.some(record => record.meta.requiresGuest);
    const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);
    const requiresPremium = to.matched.some(record => record.meta.requiresPremium);
    const currentUser = firebase.auth().currentUser;

    if(requiresAuth){
       //Check If not Logged in
       if(!currentUser){
           //Goto login page
           next({
               path: '/login',
               query:{
                   redirect: to.fullPath
               }
           });
       } else {
           const loggedInUser = store.getters.loggedInUser;
           if(requiresAdmin){
               if(loggedInUser.isAdmin){
                   next();
               }
           } else {
               if(requiresPremium){
                   if(loggedInUser.isSubscribed){
                       next();
                   } else {
                       next('/subscribe');
                   }
               } else {
                   next();
               }
           }
       }
    } else if(requiresGuest){
       //Check If Logged in
       if(currentUser){
           //Goto login page
           next({
               path: '/',
               query:{
                   redirect: to.fullPath
               }
           });
       } else {
           //Proceed to route
           next();
       }
    } else {
       //Proceed to route
       next();
    }
});


export default router;