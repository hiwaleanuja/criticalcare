<template>
    <v-app>
        <Header :key="$route.fullPath"/>
        <v-content>
            <router-view/>
        </v-content>
        <Footer/>
    </v-app>
</template>

<script>
    import {Header, Footer} from '@/components/Layouts'
    export default {
        name: 'App',
        components: {
            'Header': Header,
            'Footer': Footer,
        },
        data: () => ({
            drawer: true,
            items: [
                { title: 'Home', icon: 'mdi-home-city' },
                { title: 'My Account', icon: 'mdi-account' },
                { title: 'Users', icon: 'mdi-account-group-outline' },
            ],
            mini: true,
        }),
    };
</script>
