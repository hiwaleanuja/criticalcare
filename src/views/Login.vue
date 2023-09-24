<template>
    <v-layout align-center justify-space-around row wrap class="pa-10 mx-10">
        <v-flex xs12 sm12 md4>
            <app-alert v-if="error" @dismissed="onDismissed" :text="error"/>
            <h1 class="font-weight-medium">
                A single stop to<br> plan critical nutrition
            </h1>
            <p class="font-weight-light">
                Here’s an advanced interactive platform for doctors and dietitians
                to plan and supervise their patient’s nutrition therapy.
                With the intelligent features,
                we are sure to make the journey of helping patients a smooth sailing one!
                Login in with your credentials to get started.
            </p>
            <v-text-field
                    v-model="email"
                    label="E-Mail Address"
                    outlined
                    v-validate="'required|email'"
                    :error-messages="errors.collect('email')"
                    data-vv-name="email"
                    required
            />
            <v-text-field
                    :type="show ? 'text' : 'password'"
                    outlined
                    label="Password"
                    @click:append="show = !show"
                    v-validate="'required'"
                    name="password"
                    :class="{'is-danger': errors.has('password')}"
                    :error-messages="errors.collect('password')"
                    ref="password"
                    v-model="password"
            />
            <v-layout row wrap class="mx-4">
                <v-flex xs12 sm12 md12>
                    <v-layout align-center justify-start row fill-height>
                        <v-flex xs12 sm12 md3>
                            <v-btn block @click="login" :loading="loading" dark color="orange">
                                Login
                            </v-btn>
                        </v-flex>
                        <v-flex xs8 sm8 md6 :class="flexClass">
                            <div class="text-end">Don't Have an Account?</div>
                        </v-flex>
                        <v-flex xs4 sm4 md2 :class="flexClass">
                            <v-btn to="/register" exact text color="orange">
                                Sign Up
                            </v-btn>
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
        </v-flex>
        <v-flex xs12 sm12 md6>
            <v-img :src="require('@/assets/43071-transp.jpg')"/>
        </v-flex>
    </v-layout>
</template>

<script>
    import firebase from 'firebase/app'
    require('firebase/auth');

    export default {
        $_veeValidate: {
            validator: 'new',
        },
        name: "Login",
        data(){
            return {
                email: '',
                password: '',
                loading: false,
                error: null,
                show: false,
                dictionary: {
                    attributes: {
                        email: 'E-mail Address',
                    },
                    custom:{
                        password: {
                            required: () => "Password is Required",
                        },
                    }
                }
            }
        },
        methods:{
            login: function(e){
                let that = this;
                that.error = null;

                that.$validator.validateAll().then(valid => {
                    if(valid){
                        that.loading = true;
                        firebase.auth().signInWithEmailAndPassword(that.email, that.password)
                            .then(function (user) {
                                if(user){
                                    that.$store.dispatch('loadPatients');
                                    that.$store.dispatch('loadLoggedInUser', user.user.uid);
                                }
                                that.loading = false;
                            }, error => {
                                that.loading = false;
                                that.error =  error.message;
                            });
                    }
                });
                e.preventDefault();
            },
            onDismissed(){
                this.error = null;
            }
        },
        watch: {
            loggedInUser(value){
                if(value !== null){
                    this.$router.push('/')
                }
            }
        },
        computed: {
            flexClass(){
                return {
                    'pt-6': this.$vuetify.breakpoint.smAndDown
                }
            },
            loggedInUser(){
                return this.$store.getters.loggedInUser.id;
            },
        },
        mounted () {
            this.$validator.localize('en', this.dictionary)
        },
    }
</script>

<style scoped>
    .rounded-card{
        border-radius:12px;
    }
</style>