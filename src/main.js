import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import VeeValidate from 'vee-validate'
import Alert from "@/components/Shared/Alert";
import firebase from 'firebase/app'
require('firebase/auth');
import './fb'

Vue.use(VeeValidate);
Vue.config.productionTip = false;
Vue.component('app-alert', Alert);

let app;
firebase.auth().onAuthStateChanged(user => {
    if(!app){
        app = new Vue({
            router,
            store,
            vuetify,
            created(){
                if(user){
                    // TODO: This does not execute unless the page is explicitly reloaded, Need to shift this during Login and Registration
                    this.$store.dispatch('loadLoggedInUser', user.uid).then();
                    this.$store.dispatch('loadPatients').then();
                } else {
                    this.$router.push('/login')
                }
            },
            render: h => h(App),
        }).$mount('#app')
    }
});


