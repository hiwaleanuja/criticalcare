<template>
    <v-app-bar flat :dark="landing.isDark" app :color="landing.headerColor" dense>
        <router-link to="/" exact>
            <v-toolbar-title class="text-uppercase" v-bind:class="landing.titleColor">
                <span class="font-weight-bold">ASTAR</span>
                <span class="font-weight-thin">NUTRITION</span>
            </v-toolbar-title>
        </router-link>

        <v-spacer></v-spacer>
        <div>
            <fragment v-if="!isLoggedIn">
                <v-btn small text>Products</v-btn>

                <v-btn small text>News</v-btn>

                <v-btn small text>About</v-btn>
            </fragment>

            <fragment v-if="isLoggedIn && isSubscribed">
                <v-btn
                        small
                        color="white"
                        light
                        to="/patients"
                        class="ma-4"
                        exact
                        v-if="displaySize"
                        active-class="page_active"
                >
                     Patients <v-icon right>keyboard_arrow_down</v-icon>
                </v-btn>
                <v-btn text icon to="/patients" exact v-else>
                    <v-icon>accessibility_new</v-icon>
                </v-btn>
            </fragment>

            <fragment v-if="isLoggedIn && isAdmin">
                <v-btn
                        small
                        color="white"
                        light
                        to="/admin"
                        class="ma-4"
                        exact
                        v-if="displaySize"
                        active-class="page_active"
                >
                    Users <v-icon right>keyboard_arrow_down</v-icon>
                </v-btn>
                <v-btn text icon to="/users" exact v-else>
                    <v-icon>accessibility_new</v-icon>
                </v-btn>
            </fragment>

            <fragment v-if="isLoggedIn && isSubscribed">
                <v-btn
                        small
                        color="white"
                        light
                        to="/additives"
                        class="mr-6"
                        exact
                        v-if="displaySize"
                        active-class="page_active"
                >
                    Additives
                </v-btn>
                <v-btn text icon to="/additives" exact v-else>
                    <v-icon>enhanced_encryption</v-icon>
                </v-btn>
            </fragment>

        </div>

        <v-menu v-model="menu" v-if="isLoggedIn" :close-on-content-click="false" offset-x offset-y>
            <template v-slot:activator="{ on }">
                <v-avatar size="40" v-on="on">
                    <img src="http://tinygraphs.com/labs/isogrids/hexa16/tinygraphs?theme=heatwave&numcolors=4&size=220&fmt=svg" alt="John">
                </v-avatar>
            </template>

            <v-card max-width="300">
                <v-list>
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title>{{loggedInUser.firstName + " " + loggedInUser.lastName}}</v-list-item-title>
                            <v-list-item-subtitle  class="overline" >
                                <v-chip x-small label color="pink darken-3" dark>{{loggedInUser.role}}</v-chip>
                            </v-list-item-subtitle>
                            <v-list-item-subtitle  class="overline">{{loggedInUser.organization}}</v-list-item-subtitle>
                        </v-list-item-content>

                        <v-list-item-action>
                            <v-btn large icon @click="fav = !fav">
                                <v-icon large tile>mdi-medal</v-icon>
                            </v-btn>
                        </v-list-item-action>
                    </v-list-item>
                </v-list>

                <v-divider></v-divider>

                <v-list>
                    <v-list dense shaped>
                        <v-list-item-group color="primary">
                            <v-list-item to="/profile">
                                <v-list-item-icon>
                                    <v-icon>person</v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-list-item-title>Profile</v-list-item-title>
                                    <v-list-item-subtitle>Check out your Profile</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item @click="logout" color="red">
                                <v-list-item-icon>
                                    <v-icon>exit_to_app</v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-list-item-title class="red--text">Logout</v-list-item-title>
                                    <v-list-item-subtitle class="red--text text--lighten-2">You'll be back where you left off</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list-item-group>
                    </v-list>
                </v-list>
            </v-card>
        </v-menu>
    </v-app-bar>
</template>

<script>
    import { Fragment } from 'vue-fragment'
    import firebase from 'firebase/app'
    require('firebase/auth');

    export default {
        name: "Header",
        components: { 'fragment': Fragment },
        data(){
            return{
                landing: {
                    headerColor: "primary",
                    isDark: true,
                    titleColor: 'white--text'
                },
                fav: true,
                menu: false,
                message: false,
                hints: true,

                name: '',
                role: '',
                organization: '',

                isLoggedIn: false,
                isSubscribed: false,
                isAdmin: false,
                currentUser: false,
            }
        },
        methods:{
            logout(){
                this.$store.dispatch('endSession');
                let navigate = this.$router;
                firebase.auth().signOut().then(() => {
                    navigate.push('/login');
                });
            }
        },
        created(){
            if(firebase.auth().currentUser){
                this.isLoggedIn = true;
                this.isSubscribed = this.loggedInUser.isSubscribed;
                this.isAdmin = this.loggedInUser.isAdmin;
                this.currentUser = firebase.auth().currentUser.email;
                this.landing.headerColor = "primary";
                this.landing.isDark = true;
                this.landing.titleColor = 'white--text';

            } else {
                this.landing.headerColor = "white";
                this.landing.isDark = false;
                this.landing.titleColor = 'black--text';
            }

        },
        computed:{
            displaySize(){
                return this.$vuetify.breakpoint.smAndUp;
            },
            loggedInUser(){
                return this.$store.getters.loggedInUser;
            },
        }
    }
</script>

<style scoped>
    .page_active {
        color: green !important;
    }
    a{
        text-decoration: none !important;
    }
</style>
