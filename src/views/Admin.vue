<template>
    <v-container>
        <v-container>
            <v-container class="page_description pa-7" fluid>
                <v-layout align-center justify-space-around row fill-height>
                    <v-flex xs10 sm10 md10 class="text-start">
                        <h1 class="font-weight-light deep-orange--text text--darken-3">
                            Review Users
                        </h1>
                    </v-flex>
                    <v-flex xs2 sm2 md2 class="text-center">

                    </v-flex>
                </v-layout>
            </v-container>
            <v-container max-width="300">
                <v-alert
                        v-for="user in users" :key="user.id"
                        class="mb-1 px-6"
                        border="left"
                        colored-border
                        dense
                >
                    <v-layout row wrap align-center justify-center class="pl-2 patient-info text-center">
                        <v-flex xs6 sm6 md2>
                            <div class="caption grey--text">Full Name</div>
                            <div color="black text-capitalize">{{user.firstName + " " + user.lastName}}</div>
                        </v-flex>
                        <v-flex xs2 sm2 md2 class="text-start text-md-center">
                            <div class="caption grey--text">Role</div>
                            <div>{{user.role}}</div>
                        </v-flex>
                        <v-flex xs2 sm2 md2 class="text-start text-md-center">
                            <div class="caption grey--text">Organisation</div>
                            <div class="text-capitalize">{{user.organization}}</div>
                        </v-flex>
                        <v-flex xs6 sm6 md4 class="text-xs-center">
                            <div class="caption grey--text">Email</div>
                            <div>{{user.email}}</div>
                        </v-flex>
                        <v-flex xs6 sm6 md2>
                            <v-layout justify-center>
                                <v-switch v-model="user.isSubscribed" v-on:change="updateSubscription($event, user.id)" color="secondary" inset label="Subscribed" ></v-switch>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-alert>
                <v-layout row justify-center>
                    <v-progress-circular
                            class="text-center"
                            :size="70"
                            :width="7"
                            color="secondary"
                            indeterminate
                            v-show="isLoading"
                    ></v-progress-circular>
                </v-layout>
            </v-container>
        </v-container>
    </v-container>
</template>

<script>
    import db from '@/fb'
    export default {
        name: "Admin",
        data(){
            return{
                isLoading: false,
                snackbar: false,
                users: [],
            }
        },
        created(){
            let self = this;
            db.collection("users").get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    self.users.push({
                        ...doc.data(), id: doc.id
                    });
                });
                self.isLoading = false;
            });
        },
        methods: {
            updateSubscription(event, id){
                const usersDocRef = db.collection('users').doc(id);
                usersDocRef.update({isSubscribed: event}).then(() => {});
            }
        },
    }
</script>

<style scoped>
    .v-alert{
        background-color: #ECEFF1 !important;
    }
</style>