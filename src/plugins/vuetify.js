import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.use(Vuetify);

export default new Vuetify({
    icons: {
        iconfont: 'mdi',
    },
    theme: {
        themes: {
            light: {
                primary: '#292961',
                secondary: '#e24329',
                accent: '#9c27b0',
                error: '#ff2634',
                warning: '#ffc107',
                info: '#1662ff',
                success: '#4caf50'


            },
        },
    },
});
