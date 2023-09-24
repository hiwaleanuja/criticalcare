<template>
    <v-stepper-content v-bind:step="stepNum">
        <v-layout justify-space-around row fill-height>
            <v-layout align-center justify-space-around row fill-height>
                <v-flex xs6 sm6 md3 class="text-center">
                    <div
                        v-bind:class="[
                                { 'subtitle-1': $vuetify.breakpoint.mdAndUp },
                                { 'subtitle-2': $vuetify.breakpoint.smAndDown },
                                'font-weight-light grey--text'
                            ]"
                    >
                        Required Calories
                    </div>
                    <div>
                        <span
                                class="display-2 font-weight-light"
                                v-bind:class="[
                                { 'display-2': $vuetify.breakpoint.mdAndUp },
                                { 'display-1': $vuetify.breakpoint.smAndDown },
                            ]"
                        >
                            {{reqCalories}}
                        </span>
                    </div>
                </v-flex>
                <v-flex xs6 sm6 md3 class="text-center">
                    <div
                            v-bind:class="[
                                { 'subtitle-1': $vuetify.breakpoint.mdAndUp },
                                { 'subtitle-2': $vuetify.breakpoint.smAndDown },
                                'font-weight-light grey--text'
                            ]"
                    >
                        Required Protein
                    </div>
                    <div>
                        <span
                                class="display-2 font-weight-light"
                                v-bind:class="[
                                { 'display-2': $vuetify.breakpoint.mdAndUp },
                                { 'display-1': $vuetify.breakpoint.smAndDown },
                            ]"
                        >
                            {{reqProteins}}
                        </span>
                    </div>
                </v-flex>
            </v-layout>
            <v-flex x12 sm12 md12 class="px-md-6 text-center">
                <v-card flat class="px-2 mx-md-4">
                    <v-card-title>
                        <v-layout align-center justify-space-between row fill-height>
                            <v-flex xs12 sm9 md4 class="px-3" >
                                <v-switch v-model="calorimeter" color="orange accent-4" label="Indirect Calorimeter"></v-switch>
                            </v-flex>
                            <v-flex xs12 sm12 md4>
                                <v-text-field
                                        :disabled="!calorimeter"
                                        class="pb-0"
                                        label="Required Calories"
                                        rounded
                                        filled
                                        v-model.number="reqCalories"
                                        type="number"
                                ></v-text-field>
                            </v-flex>
                        </v-layout>
                    </v-card-title>
                </v-card>
                <v-card flat :disabled="calorimeter" class="px-2 mx-md-4">
                    <v-card-title>
                        <v-layout align-center justify-space-between row fill-height>
                            <v-flex xs9 sm9 md4 class="text-start">
                                <h2 class="font-weight-medium pb-2">
                                    Select Calorie Factor
                                </h2>
                            </v-flex>
                            <v-flex xs3 sm3 md3 class="text-center pt-6">
                                <span class="display-3 font-weight-thin grey--text">{{calorieFactor}}</span>
                            </v-flex>
                            <v-flex xs12 sm12 md4>
                                <v-slider
                                        v-model.number="calorieFactor"
                                        class="pt-md-12 px-md-4"
                                        thumb-label
                                        max="30"
                                        min="20"
                                ></v-slider>
                            </v-flex>
                        </v-layout>
                    </v-card-title>
                </v-card>
                <v-card flat class="pa-2 ma-md-4">
                    <v-card-title>
                        <v-layout align-center justify-space-between row fill-height>
                            <v-flex xs9 sm9 md4 class="text-start">
                                <h2 class="font-weight-medium pb-8">
                                    Select Protein Factor
                                </h2>
                            </v-flex>
                            <v-flex xs3 sm3 md3 class="text-center pb-8">
                                <span class="display-3 font-weight-thin grey--text">{{proteinFactor}}</span>
                            </v-flex>
                            <v-flex xs12 sm12 md4>
                                <v-text-field
                                        class="pb-0"
                                        label="Protein Factor"
                                        rounded
                                        filled
                                        v-model.number="proteinFactor"
                                        type="number"
                                        v-validate="'required|between:0.5,2|decimal'"
                                        :error-messages="errors.collect('proteinFactor')"
                                        data-vv-name="proteinFactor"
                                        required
                                ></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md6>
                                <v-checkbox color="black" v-model="proteinCheck" @change="proteinFactor=1.5" value="Patient is on Surgery" label="Is Patient On Surgery?"></v-checkbox>
                                <v-checkbox color="black" v-model="proteinCheck" @change="proteinFactor=0.8" value="Patient is Renal" label="Is Patient Renal?"></v-checkbox>
                                <v-checkbox color="black" v-model="proteinCheck" @change="proteinFactor=1.0" value="Patient is Diabetic & Normal" label="Is Patient Diabetic & Normal?"></v-checkbox>
                                <v-checkbox color="black" v-model="proteinCheck" @change="proteinFactor=1.2" value="Patient is COPD" label="Is Patient COPD?"></v-checkbox>
                                <v-checkbox color="black" v-model="proteinCheck" @change="proteinFactor=1"   value="Patient Has Burns" label="Does Patient Have Burns?"></v-checkbox>
                            </v-flex>
                            <v-flex xs12 sm12 md6>
                                <v-checkbox color="black" v-model="proteinCheck" @change="proteinFactor=1"   value="Patient is suffering from Trauma" label="Is Patient Suffering from Trauma?"></v-checkbox>
                                <v-checkbox color="black" v-model="proteinCheck" @change="proteinFactor=1"   value="Patient is Post Operative" label="Is Patient Post Operative?"></v-checkbox>
                                <v-checkbox color="black" v-model="proteinCheck" @change="proteinFactor=1"   value="Patient is in ECMO Treatment" label="Extracorporeal membrane oxygenation"></v-checkbox>
                                <v-checkbox color="black" v-model="proteinCheck" @change="proteinFactor=1"   value="Patient is suffering from poisoning" label="Is patient suffering from Poisoning"></v-checkbox>
                            </v-flex>
                        </v-layout>
                    </v-card-title>
                </v-card>
            </v-flex>
        </v-layout>
        <v-btn color="primary" @click="submit">
            Continue
        </v-btn>
        <v-btn text>Cancel</v-btn>
    </v-stepper-content>
</template>

<script>
    export default {
        name: "Delivery",
        props: ['stepNum'],
        data(){
            return{
                calorimeter: false,
                consideredWeight: '',
                proteinCheck: [],
                proteinFactor: 0.8,
                calorieFactor: 24,
                reqCalories: '',
                reqProteins: '',
                dictionary: {
                    custom: {
                        proteinFactor: {
                            required: () => 'Protein Factor can not be empty',
                            decimal: 'Protein Factor must Have only digits',
                            between: 'Protein Factor should be in valid range'
                        },
                    }
                }
            }
        },
        methods: {
            submit: function () {
                this.$validator.validateAll().then(valid => {
                    let params = {which: 'delivery', nextStep: 6};
                    if(valid){
                        params.isInfoValid = true;
                        params.proteinCheck = this.proteinCheck;
                        params.calorimeter = this.calorimeter;
                        params.proteinFactor = Number(this.proteinFactor);
                        params.calorieFactor = Number(this.calorieFactor);
                        params.reqCalories = this.reqCalories;
                        params.reqProteins = this.reqProteins;
                        params.onStepNum = 5;
                    } else {
                        params.isInfoValid = false;
                        params.proteinCheck = null;
                        params.calorimeter = false;
                        params.proteinFactor = 0.8;
                        params.calorieFactor = 24;
                        params.reqCalories = null;
                        params.reqProteins = null;
                    }
                    // eslint-disable-next-line no-unused-vars
                    let {isInfoValid, which, nextStep, ...temp} = params;
                    this.$store.dispatch('updatePlannerValues', {values: {...temp}, plannerId: this.$route.params.plannerId});
                    this.$emit('gotoNextStep' , params);
                })
            }
        },
        watch:{
            calorieFactor: function (value) {
                if(!this.calorimeter){
                    this.reqCalories = ~~(this.consideredWeight * value);
                }
            },
            proteinFactor: function (value) {
                this.reqProteins = ~~(this.consideredWeight * value);
            },
        },
        created(){
            let values = this.$store.getters.getPlannerValues;
            console.log(values.consideredWeight, this.calorieFactor);
            this.calorimeter = values.calorimeter;
            this.consideredWeight = values.consideredWeight;
            if(values.calorimeter){
                this.reqCalories = values.reqCalories;
            } else {
                this.reqCalories = ~~(values.consideredWeight * this.calorieFactor);
            }
            this.reqProteins = ~~(values.consideredWeight * this.proteinFactor);
            this.proteinFactor = values.proteinFactor;
            this.calorieFactor = values.calorieFactor;
            this.proteinCheck = values.proteinCheck;
        },
        mounted () {
            this.$validator.localize('en', this.dictionary);
        },
    }
</script>

<style scoped>

</style>