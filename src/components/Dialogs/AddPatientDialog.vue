<template>
    <v-dialog v-model="dialog" width="900" :fullscreen="$vuetify.breakpoint.xsOnly">
        <template v-slot:activator="{ on }">
            <v-btn color="blue-grey darken-4" dark outlined v-on="on">
                <v-icon>person_add</v-icon>
            </v-btn>
        </template>

        <v-card>
            <v-layout align-center justify-space-between row fill-height class="px-8 py-4">
                <v-flex xs8 sm8 md8 class="text-start">
                    <h1 class="font-weight-light">
                        New Patient
                    </h1>
                </v-flex>
                <v-flex xs4 sm4 md4 class="text-end">
                    <v-btn color="black" dark outlined @click="clear">
                        <v-icon>restore</v-icon>
                    </v-btn>
                    <v-btn class="mx-2" color="error" dark outlined @click="dialog = false">
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-flex>
            </v-layout>

            <v-card-text>
                <v-layout align-space-around justify-center row fill-height class="pl-2">
                    <v-flex xs12 sm12 md6 justify-center>
                        <v-card class="ma-1">
                            <v-card-title>
                                Personal Details
                            </v-card-title>
                            <v-card-text>
                                <v-text-field
                                        outlined
                                        v-model="name"
                                        label="Full Name"
                                        prepend-icon="person"
                                        v-validate="'required|max:20|alpha_spaces'"
                                        :error-messages="errors.collect('name')"
                                        :counter="20"
                                        data-vv-name="name"
                                        required
                                        dense
                                ></v-text-field>
                                <v-layout row wrap justify-space-around align-center>
                                    <v-flex xs6 sm6 md6>
                                        <v-dialog
                                                ref="dialog"
                                                v-model="dateModal"
                                                :return-value.sync="dateOfBirth"
                                                persistent
                                                full-width
                                                width="290px"
                                        >
                                            <template v-slot:activator="{ on }">
                                                <v-text-field
                                                        outlined
                                                        label="Date Of Birth"
                                                        prepend-icon="event"
                                                        :value="formattedDate"
                                                        min="2019-11-19"
                                                        readonly
                                                        v-on="on"
                                                        v-validate ="{ rules: { required: isDobRequired} }"
                                                        :error-messages="errors.collect('dateOfBirth')"
                                                        data-vv-name="dateOfBirth"
                                                        data-vv-as="Date Of Birth"
                                                        required
                                                ></v-text-field>
                                            </template>
                                            <v-date-picker v-model="dateOfBirth" scrollable>
                                                <v-spacer></v-spacer>
                                                <v-btn text color="primary" @click="dateModal = false">Cancel</v-btn>
                                                <v-btn text color="primary" @click="$refs.dialog.save(dateOfBirth)">OK</v-btn>
                                            </v-date-picker>
                                        </v-dialog>
                                    </v-flex>
                                    <v-flex xs4 sm4 md4>
                                        <v-text-field
                                                outlined
                                                label="Age"
                                                v-model="age"
                                                v-validate ="{ rules: { required: isAgeRequired} }"
                                                data-vv-name="age"
                                                data-vv-as="Age"
                                                required
                                        ></v-text-field>
                                    </v-flex>
                                </v-layout>

                                <v-text-field
                                        outlined
                                        label="Phone Number"
                                        prepend-icon="call"
                                        v-model="contact"
                                        prefix="+91"
                                        v-validate="'required|length:10|numeric'"
                                        :error-messages="errors.collect('contact')"
                                        data-vv-name="contact"
                                        required
                                ></v-text-field>
                                <v-text-field
                                        outlined
                                        label="E-Mail Address"
                                        prepend-icon="alternate_email"
                                        v-model="email"
                                        v-validate="'required|email'"
                                        :error-messages="errors.collect('email')"
                                        data-vv-name="email"
                                        required
                                ></v-text-field>
                                <div>
                                    <h3 class="font-weight-regular">
                                        <v-icon>wc</v-icon>
                                        <span class="pl-5">Gender</span>
                                    </h3>
                                    <v-radio-group
                                            class="pl-11"
                                            v-model="gender"
                                            row
                                            required
                                            v-validate="'required'"
                                            :error-messages="errors.collect('gender')"
                                            data-vv-name="gender"
                                    >
                                        <v-radio label="Male" value="male"></v-radio>
                                        <v-radio label="Female" value="female"></v-radio>
                                    </v-radio-group>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-flex>
                    <v-flex xs12 sm12 md6 justify-center>
                        <v-layout wrap>
                            <v-flex>
                                <v-card class="ma-1">
                                    <v-card-title>
                                        Anthropometric Measurements
                                    </v-card-title>
                                    <v-card-text>
                                        <v-text-field
                                                outlined
                                                label="Height"
                                                suffix="CMS"
                                                prepend-icon="accessibility"
                                                v-model="height"
                                                v-validate="'required|between:1,300|numeric'"
                                                :error-messages="errors.collect('height')"
                                                data-vv-name="height"
                                                required
                                        ></v-text-field>
                                        <v-text-field
                                                outlined
                                                label="Weight"
                                                suffix="KG"
                                                prepend-icon="timelapse"
                                                v-model="weight"
                                                v-validate="'required|between:1,450|numeric'"
                                                :error-messages="errors.collect('weight')"
                                                data-vv-name="weight"
                                                required
                                        ></v-text-field>
                                    </v-card-text>
                                </v-card>
                            </v-flex>
                            <v-flex>
                                <v-card class="ma-1">
                                    <v-card-title>
                                        Patient History
                                    </v-card-title>
                                    <v-card-text>
                                        <v-textarea
                                                outlined
                                                label="Description"
                                                prepend-icon="assignment"
                                                rows="7"
                                                v-model="history"
                                        ></v-textarea>
                                    </v-card-text>
                                </v-card>
                            </v-flex>
                        </v-layout>
                    </v-flex>
                </v-layout>
            </v-card-text>
            <v-card-actions>
                <v-btn block large color="info" @click="submit" :loading="loading" dark >Add Patient</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import {format, differenceInYears, addYears} from 'date-fns'
    import firebase from 'firebase/app'
    require('firebase/auth');
    export default {
        $_veeValidate: {
            validator: 'new',
        },

        data () {
            return {
                name: '',
                dateOfBirth: '',
                age: '',
                dateModal: '',
                contact: '',
                email: '',
                gender: '',
                height: '',
                weight: '',
                history: '',

                loading: false,
                dialog: false,
                dictionary: {
                    attributes: {
                        email: 'E-mail Address',
                    },
                    custom: {
                        name: {
                            required: () => 'Name can not be empty',
                            max: 'Name should be of at most 20 characters long',
                            alpha_spaces: 'Name should only have alphabetic characters'
                        },
                        dateOfBirth: {
                            required: () => "Date Of Birth or Age is Required",
                        },
                        age:{
                            required: () => "Age or Date Of Birth is required",
                        },
                        contact: {
                            required: () => 'Phone NUmber can not be empty',
                            length: 'Phone Number must have exactly 10 digits',
                            numeric: 'The Phone number must Have only digits'
                        },
                        gender: {
                            required: 'Gender is required',
                        },
                        height: {
                            required: () => 'Height can not be empty',
                            numeric: 'The Height must Have only digits',
                            between: 'The Height should be in valid range'
                        },
                        weight: {
                            required: () => 'Weight can not be empty',
                            between: 'The Weight should be in valid range',
                            numeric: 'The Weight must Have only digits'
                        },
                    },
                },
            }
        },
        computed:{
            formattedDate(){
                return this.dateOfBirth ? format(this.dateOfBirth, 'Do MMM YYYY') : ''
            },
            isDobRequired(){
                return this.age === '';
            },
            isAgeRequired(){
                return this.dateOfBirth === '';
            }
        },
        methods: {
            submit () {
                let patient = {};
                this.$validator.validateAll().then(valid => {
                    if(valid){
                        this.loading = true;

                        patient.admission_date = new Date();
                        patient.ICUEnterDate = null;
                        patient.ICUExitDate = new Date();
                        patient.currentPlan = '';
                        patient.isCurrentPlanComplete = true;

                        patient.name = this.name;
                        patient.contact = this.contact;
                        patient.email = this.email;
                        patient.gender = this.gender;
                        patient.height = this.height;
                        patient.weight = this.weight;
                        patient.history = this.history;

                        patient.status = 'NaN';
                        patient.bmi = ~~(this.weight / (this.height/100 * this.height/100));
                        patient.icu_days = 0;
                        patient.inICU = false;
                        patient.latestNutric = -1;

                        patient.dateOfBirth = this.dateOfBirth;
                        patient.age = parseInt(this.age, 10);

                        if(this.dateOfBirth === ''){
                            patient.dateOfBirth = addYears(new Date(), -this.age);
                            patient.age = parseInt(this.age, 10);

                        } else if(this.age === ''){
                            patient.age = differenceInYears(new Date(), patient.dateOfBirth);
                            patient.dateOfBirth = this.dateOfBirth;
                        }

                        patient.creatorId = firebase.auth().currentUser.uid;

                        this.$store.dispatch('createPatient', patient).then(() => {
                            this.loading = false;
                            this.dialog = false;
                            this.clear();
                            this.$emit('patientAdded');
                        });
                    }
                });
            },
            clear () {
                this.name = '';
                this.dateOfBirth = '';
                this.contact = '';
                this.email = '';
                this.age = '';
                this.gender = '';
                this.height = '';
                this.weight = '';
                this.history = '';
                this.$validator.reset()
            },
        },
        mounted () {
            this.$validator.localize('en', this.dictionary)
        },
    }
</script>

<style scoped>

</style>