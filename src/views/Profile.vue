<template>
    <v-container class="pa-md-10">
        <v-snackbar v-model="snackbar" :timeout="4000" color="success">
            Updated successfully
            <v-btn text @click="snackbar=false">Close</v-btn>
        </v-snackbar>

        <v-container class="page_description" fluid>
            <v-layout align-space-around justify-space-between fill-height class="px-6">
                <v-flex xs12 sm4 md4>
                    <h1 class="font-weight-light deep-orange--text text--darken-3"> Profile Settings </h1>
                </v-flex>
            </v-layout>
        </v-container>
        <v-divider></v-divider>
        <v-layout row wrap align-center justify-center col class="pa-6" >
            <v-flex xs12 sm4 md4 class="ma-2">
                <h2 class="font-weight-medium">Public Avatar</h2>
                <p class="font-weight-medium caption">Your Avatar is generated uniquely with your name</p>
            </v-flex>
            <v-flex xs12 sm3 md3>
                <v-avatar size="100" >
                    <img src="http://tinygraphs.com/labs/isogrids/hexa16/tinygraphs?theme=heatwave&numcolors=4&size=220&fmt=svg" alt="John">
                </v-avatar>
            </v-flex>
            <v-flex xs12 sm3 md3>
                <v-chip v-if="loggedInUser.isSubscribed" class="ma-2 text-end" color="orange" text-color="white">
                    Premium Account
                    <v-icon right>mdi-star</v-icon>
                </v-chip>
                <v-chip v-else class="ma-2 text-end" color="grey" text-color="white">
                    Unsubscribed
                </v-chip>
            </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row wrap justify-center col class="pa-6" >
            <v-flex xs12 sm4 md4 class="px-3">
                <h2 class="font-weight-medium">Your Name</h2>
                <p class="font-weight-medium caption">Changes will be reflected across your Account</p>
            </v-flex>
            <v-flex xs12 sm3 md3 class="ma-2">
                <v-text-field
                        v-model="firstName"
                        label="First Name"
                        outlined
                        v-validate="'required|max:10|alpha_spaces'"
                        :error-messages="errors.collect('firstName')"
                        :counter="10"
                        data-vv-name="firstName"
                        required
                ></v-text-field>
            </v-flex>
            <v-flex xs12 sm3 md3 class="ma-2">
                <v-text-field
                        v-model="lastName"
                        label="Last Name"
                        outlined
                        v-validate="'required|max:10|alpha_spaces'"
                        :error-messages="errors.collect('lastName')"
                        :counter="10"
                        data-vv-name="lastName"
                        required
                ></v-text-field>
            </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row wrap justify-center col class="pa-6" >
            <v-flex xs12 sm4 md4 class="px-3">
                <h2 class="font-weight-medium">Account Role</h2>
                <p class="font-weight-medium caption">Your account has features according your role</p>
            </v-flex>
            <v-flex xs12 sm6 md6 class="ma-2">
                <v-text-field
                        v-model="role"
                        label="Role"
                        outlined
                        v-validate="'required|max:20|alpha_spaces'"
                        :error-messages="errors.collect('role')"
                        :counter="10"
                        data-vv-name="role"
                        required
                ></v-text-field>
            </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row wrap justify-center col class="pa-6" >
            <v-flex xs12 sm4 md4 class="px-3">
                <h2 class="font-weight-medium">Organisation</h2>
                <p class="font-weight-medium caption">Specify name of the organization you work for</p>
            </v-flex>
            <v-flex xs12 sm6 md6 class="ma-2">
                <v-text-field
                        v-model="organization"
                        label="Organization Name"
                        outlined
                        v-validate="'required|max:20|alpha_spaces'"
                        :error-messages="errors.collect('organization')"
                        :counter="20"
                        data-vv-name="organization"
                        required
                ></v-text-field>
            </v-flex>
        </v-layout>
        <v-layout row wrap justify-center col class="pa-6">
            <v-flex xs12 sm4 md4 class="px-3"></v-flex>
            <v-flex xs12 sm6 md6 class="mx-2">
                <v-btn block max-width="300" color="info" @click="update()">Save Changes</v-btn>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        name: "Profile",
        data() {
            return{
                snackbar: false,
                firstName: '',
                lastName:'',
                role:'',
                organization: '',
                isSubscribed: false,
                isAdmin: false,
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
        computed: {
            loggedInUser(){
                return this.$store.getters.loggedInUser;
            },
        },
        created(){
            this.firstName = this.loggedInUser.firstName;
            this.lastName = this.loggedInUser.lastName;
            this.role = this.loggedInUser.role;
            this.organization = this.loggedInUser.organization;
        },
        methods:{
            update(){
                let that = this;
                this.$validator.validateAll().then(valid => {
                    if(valid){
                        let payload = {
                            id: that.loggedInUser.id,
                            values : {
                                firstName: that.firstName,
                                lastName: that.lastName,
                                role: that.role,
                                organization: that.organization,
                            }
                        };
                        that.$store.dispatch('updateUserData', payload);
                        that.snackbar = true;
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>