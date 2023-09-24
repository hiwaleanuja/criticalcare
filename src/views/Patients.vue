<template>
    <v-container>
        <v-snackbar v-model="snackbar" :timeout="4000" color="success">
            Patient added successfully
            <v-btn text @click="snackbar=false">Close</v-btn>
        </v-snackbar>

        <v-container>

        </v-container>

        <v-container class="page_description pa-7" fluid>
            <v-layout align-center justify-space-around row fill-height>
                <v-flex xs10 sm10 md10 class="text-start">
                    <h1 class="font-weight-light deep-orange--text text--darken-3">
                        Patients Under Supervision
                    </h1>
                </v-flex>
                <v-flex xs2 sm2 md2 class="text-center">
                    <add-patient @patientAdded="snackbar=true"/>
                </v-flex>
            </v-layout>
        </v-container>
        <v-container>
            <v-alert
                    border="left"
                    color="secondary"
                    dark
                    v-if="patients.length < 1"
            >
                No Patients Created Yet. Please Add a New Patient to proceed.
            </v-alert>
            <v-alert
                    v-else
                    v-for="patient in patients" :key="patient.id"
                    class="mb-1 px-6"
                    border="left"
                    colored-border
                    :color="getStatusColor(patient.latestNutric)"
                    dense
            >
                <v-layout row wrap align-center class="pl-2 patient-info">
                    <v-flex xs6 sm6 md2>
                        <router-link class="patient-profile-link" :to="{ name: 'patient-profile', params: { id: patient.id }}" exact>
                            <div class="caption grey--text">Full Name</div>
                            <div color="black text-capitalize">{{patient.name}}</div>
                        </router-link>
                    </v-flex>
                    <v-flex xs2 sm2 md2 class="text-start text-md-center">
                        <div class="caption grey--text">Age</div>
                        <div>{{patient.age}}</div>
                    </v-flex>
                    <v-flex xs2 sm2 md2 class="text-start text-md-center">
                        <div class="caption grey--text">Gender</div>
                        <div class="text-capitalize">{{patient.gender}}</div>
                    </v-flex>
                    <v-flex xs2 sm2 md2 class="text-end text-md-center">
                        <div class="caption grey--text">BMI</div>
                        <div>{{patient.bmi}}</div>
                    </v-flex>
                    <v-flex xs6 sm6 md2 class="text-xs-center">
                        <div class="caption grey--text">Admission Date</div>
                        <div>{{formatDate(patient.admission_date)}}</div>
                    </v-flex>
                    <v-flex xs6 sm6 md2>
                        <v-layout justify-center>
                            <v-chip v-if="patient.inICU" class="white--text caption" color="deep-orange accent-4">IN ICU</v-chip>
                            <v-chip v-else class="white--text caption" color="blue darken-4">STABLE</v-chip>
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
</template>

<script>
    import AddPatientDialog from "@/components/Dialogs/AddPatientDialog";
    import {format} from 'date-fns'

    require('firebase/database');

    export default {
        name: "Patients",
        components:{
            'add-patient': AddPatientDialog,
        },
        data(){
            return{
                snackbar: false,
            }
        },
        methods: {
            formatDate: function (stamp) {
                let UTCDate = new Date(0);
                UTCDate.setUTCSeconds(stamp.seconds);
                return format(UTCDate, 'Do MMM YYYY');
            },
            getStatusColor(status){
                if(status === -1){
                    return 'black';

                } else if(status >= 0 && status < 4){
                    return 'blue accent-4';

                } else if(status >= 4 && status <= 5) {
                    return 'amber accent-4';

                } else if(status > 5 && status <= 9){
                    return 'red accent-4';
                }
            }
        },
        computed:{
            patients(){
                return this.$store.getters.loadedPatients;
            },
            error(){
                return this.$store.getters.error;
            },
            isLoading(){
                return this.$store.getters.loading;
            }
        },
    }
</script>

<style scoped>
    .patient-profile-link{
        text-decoration: none;
        color: black;
    }
    .patient-profile-link:hover{
        color: black;
    }
    .v-alert{
        background-color: #ECEFF1 !important;
    }
</style>