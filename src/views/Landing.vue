<template>
    <v-container fluid>
        <v-layout align-center justify-space-around row wrap class="pa-10 mx-10">
            <v-flex xs12 sm12 md4>
                <h1 class="font-weight-medium">
                    Create new account
                </h1>
                <v-text-field
                        label="Email"
                        outlined
                        dense
                ></v-text-field>
                <v-text-field
                        label="Password"
                        outlined
                        dense
                ></v-text-field>
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
                <v-img :src="require('@/assets/43071-transp.jpg')"></v-img>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        name: "Landing"
    }
</script>

<style scoped>

</style>