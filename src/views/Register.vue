<template>
    <v-layout align-center justify-space-around row wrap class="px-md-10 py-md-5 mx-md-10">
        <v-flex xs12 sm12 md7 class="ma-0 pa-0">
            <v-img :src="require('@/assets/19876-trimmed.jpg')"></v-img>
        </v-flex>
        <v-flex xs12 sm12 md4   >
                <app-alert v-if="error" @dismissed="onDismissed" :text="error"/>
                <h1 class="font-weight-medium">
                    Register
                </h1>
                <p class="font-weight-light">
                    Create an account to design the most hassle free and customised nutrition plans for your patients.
                </p>
                <v-layout row wrap>
                    <v-flex xs12 sm12 md6 class="pa-1">
                        <v-text-field
                                v-model="firstName"
                                label="First Name"
                                outlined
                                v-validate="'required|max:10|alpha_spaces'"
                                :error-messages="errors.collect('firstName')"
                                :counter="10"
                                data-vv-name="firstName"
                                required
                        />
                    </v-flex>
                    <v-flex xs12 sm12 md6 class="pa-1">
                        <v-text-field
                                v-model="lastName"
                                label="Last Name"
                                outlined
                                v-validate="'required|max:10|alpha_spaces'"
                                :error-messages="errors.collect('lastName')"
                                :counter="10"
                                data-vv-name="lastName"
                                required
                        />
                    </v-flex>
                </v-layout>

                <v-layout row wrap>
                    <v-flex xs12 sm12 md6 class="pa-1">
                        <v-text-field
                                v-model="organization"
                                label="Organization Name"
                                outlined
                                v-validate="'required|max:20|alpha_spaces'"
                                :error-messages="errors.collect('organization')"
                                :counter="20"
                                data-vv-name="organization"
                                required
                        />
                    </v-flex>
                    <v-flex xs12 sm12 md6 class="pa-1">
                        <v-text-field
                                v-model="role"
                                label="Role"
                                outlined
                                v-validate="'required|max:20|alpha_spaces'"
                                :error-messages="errors.collect('role')"
                                :counter="10"
                                data-vv-name="role"
                                required
                        />
                    </v-flex>
                </v-layout>

                <v-layout row wrap>
                    <v-flex xs12 sm12 md12>
                        <v-text-field
                                v-model="email"
                                label="E-Mail Address"
                                outlined
                                v-validate="'required|email'"
                                :error-messages="errors.collect('email')"
                                data-vv-name="email"
                                required
                        />
                    </v-flex>
                </v-layout>

                <v-layout row wrap>
                    <v-flex xs12 sm12 md12>
                        <v-text-field
                                :append-icon="show ? 'visibility' : 'visibility_off'"
                                :type="show ? 'text' : 'password'"
                                @click:append="show = !show"
                                counter
                                outlined
                                hint="At least 8 characters"
                                label="Password"
                                v-validate="'required'"
                                name="password"
                                :class="{'is-danger': errors.has('password')}"
                                :error-messages="errors.collect('password')"
                                ref="password"
                                v-model="password"
                        />
                    </v-flex>
                </v-layout>

                <v-layout row wrap>
                    <v-flex xs12 sm12 md12>
                        <v-text-field
                                :append-icon="show ? 'visibility' : 'visibility_off'"
                                :type="show ? 'text' : 'password'"
                                @click:append="show = !show"
                                outlined
                                label="Confirm Password"
                                v-validate="'required|confirmed:password'"
                                name="confirmPassword"
                                :class="{'is-danger': errors.has('confirmPassword')}"
                                :error-messages="errors.collect('confirmPassword')"
                                data-vv-as="confirmPassword"
                                v-model="confirmPassword"
                        />
                    </v-flex>
                </v-layout>

                <v-layout row wrap class="mx-1">
                    <v-flex xs12 sm12 md12>
                        <v-layout align-center justify-start row fill-height>
                            <v-flex xs12 sm12 md4>
                                <v-btn block @click="register" :loading="loading" dark color="orange">
                                    Register
                                </v-btn>
                            </v-flex>
                            <v-flex xs8 sm8 md6 :class="flexClass">
                                <div class="text-end">Already Have An Account?</div>
                            </v-flex>
                            <v-flex xs4 sm4 md2 :class="flexClass">
                                <v-btn to="/login" text color="orange">
                                    login
                                </v-btn>
                            </v-flex>
                        </v-layout>
                    </v-flex>
                </v-layout>

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
        name: "Register",
        data(){
            return {
                id: '',
                firstName: '',
                lastName:'',
                role:'',
                organization: '',
                isSubscribed: false,
                isAdmin: false,
                email: '',
                password: '',
                confirmPassword: '',
                show: false,
                loading: false,
                error: null,
                dictionary: {
                    attributes: {
                        email: 'E-mail Address',
                    },
                    custom:{
                        firstName: {
                            required: () => 'First Name can not be empty',
                            max: 'First Name should be of at most 10 characters long',
                            alpha_spaces: 'First Name should only have alphabetic characters'
                        },
                        lastName: {
                            required: () => 'Last Name can not be empty',
                            max: 'Last Name should be of at most 10 characters long',
                            alpha_spaces: 'Last Name should only have alphabetic characters'
                        },
                        role: {
                            required: () => 'Role can not be empty',
                            max: 'Role should be of at most 20 characters long',
                            alpha_spaces: 'Role should only have alphabetic characters'
                        },
                        organization: {
                            required: () => 'Organization can not be empty',
                            max: 'Organization should be of at most 20 characters long',
                            alpha_spaces: 'Organization should only have alphabetic characters'
                        },
                        password: {
                            required: () => "Password is Required",
                        },
                        confirmPassword:{
                            required: () => "Confirm Password is required",
                            confirmed: 'Passwords Do Not Match',
                        },
                    }
                },
            }
        },
        methods:{
            register: function(e){
                let that = this;
                that.error = null;
                that.$validator.validateAll().then(valid => {
                    if(valid){
                        that.loading = true;
                        firebase.auth()
                            .createUserWithEmailAndPassword(that.email, that.password)
                            .then(function (user) {
                                that.loading = false;
                                that.id = user.user.uid;
                                if(user){
                                    const newUser = {
                                        id: user.user.uid,
                                        email: user.user.email,
                                        firstName: that.firstName,
                                        lastName: that.lastName,
                                        organization: that.organization,
                                        role: that.role,
                                        isSubscribed: that.isSubscribed,
                                        isAdmin: that.isAdmin,
                                    };
                                    that.$store.dispatch('loadPatients');
                                    that.$store.dispatch('createNewUser', newUser);
                                }
                            });

                        firebase.auth().signOut().then(() => {
                            that.$router.push('/login');
                        });
                    }
                });
                e.preventDefault();
            },
            onDismissed(){
                this.error = null;
            }
        },
        computed: {
            flexClass(){
                return {
                    'pt-6': this.$vuetify.breakpoint.smAndDown
                }
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