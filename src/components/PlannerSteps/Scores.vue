<template>
    <v-stepper-content v-bind:step="stepNum">
        <v-layout row wrap>
            <v-flex xs12 sm12 md5 class="px-3 py-1">
                <v-text-field
                        outlined
                        label="APACHE II"
                        v-model.number="apache"
                        type="number"
                        v-validate="'required|between:0,71|numeric'"
                        :error-messages="errors.collect('apache')"
                        data-vv-name="apache"
                        required
                ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md5 class="px-3 py-1">
                <v-text-field
                        outlined
                        label="SOFA"
                        v-model.number="sofa"
                        type="number"
                        v-validate="'required|between:0,24|numeric'"
                        :error-messages="errors.collect('sofa')"
                        data-vv-name="sofa"
                        required
                ></v-text-field>
            </v-flex>
        </v-layout>
        <v-layout row wrap>
            <v-flex xs12 sm12 md10 class="px-3 py-1">
                <v-combobox
                        v-model="comorbidities"
                        :items="comorbidity_samples"
                        comorbidities
                        clearable
                        label="Comorbidities"
                        multiple
                        solo
                        prepend-icon="playlist_add"
                >
                    <template v-slot:selection="{ attrs, item, select, selected }">
                        <v-chip
                                v-bind="attrs"
                                :input-value="selected"
                                close
                                @click="select"
                                @click:close="remove(item)"
                        >
                            <strong>{{ item }}</strong>&nbsp;
                        </v-chip>
                    </template>
                </v-combobox>
            </v-flex>
        </v-layout>
        <v-btn color="primary" @click="submit">
            Continue
        </v-btn>
        <v-btn text>Cancel</v-btn>
    </v-stepper-content>
</template>

<script>
    import {differenceInDays} from 'date-fns'

    export default {
        $_veeValidate: {
            validator: 'new',
        },
        name: "Scores",
        props: ['stepNum'],
        data(){
            return{
                comorbidities: [],
                comorbidity_samples: [
                    "Hypertension",
                    "Diabetics",
                    "IHD",
                    "COPD",
                    "Chronic respiratory failure",
                    "Acute respiratory failure",
                    "Chronic renal failure",
                    "Acute renal failure",
                    "Acute on chronic renal failure",
                    "Obesity",
                    "Irritable bowel syndrome",
                    "Inflammatory bowel disease",
                    "Acute pancreatitis",
                    "Acute on chronic pancreatitis",
                    "Stroke",
                    "Burns",
                    "Abdominal trauma",
                    "Intestinal surgery",
                    "Intestinal perforation",
                    "Abdominal surgery",
                    "Polytrauma",
                    "Poisoning",
                    "Fractures",
                    "Thoracic injury",
                    "Thoracic surgery",
                    "Bariatric surgery",
                    "Sepsis",
                    "Hepatic failure",
                    "Septic shock",
                    "Urosepsis",
                    "CABG",
                    "ANGIOPLASTY",
                    "CNS infection",
                    "ECMO",
                    "IABP",
                    "Mechanical ventilation",
                    "Dialysis",
                    "CRRT",
                    "Trans venous pacing",
                ],
                apache: '',
                sofa: '',
                age: '',
                dictionary: {
                    custom: {
                        apache: {
                            required: () => 'APACHE II Score can not be empty',
                            numeric: 'The Score must Have only digits',
                            between: 'The Score should be in valid range'
                        },
                        sofa: {
                            required: () => 'SOFA Score can not be empty',
                            between: 'The Score should be in valid range',
                            numeric: 'The Score must Have only digits'
                        },
                        comorbidities: {
                            required: () => 'Place None if No Co - Morbidities',
                        },
                    },
                },
            }
        },
        methods:{
            remove (item) {
                this.comorbidities.splice(this.comorbidities.indexOf(item), 1);
                this.comorbidities = [...this.comorbidities]
            },
            formatFirebaseDate: function (stamp){
                let UTCDate = new Date(0);
                UTCDate.setUTCSeconds(stamp.seconds);
                return UTCDate;
            },
            submit: function () {
                this.$validator.validateAll().then(valid => {
                    let params = {which: 'scores', nextStep: 2};
                    if(valid){
                        params.isInfoValid = true;
                        params.apache = this.apache;
                        params.sofa = this.sofa;
                        params.comorbidities = this.comorbidities;
                        params.patient_id = this.$route.params.id;
                        params.nutric = this.calculateNutricScore(
                            this.patient.age,
                            params.apache,
                            params.sofa,
                            params.comorbidities.length,
                            differenceInDays(this.formatFirebaseDate(this.patient.ICUEnterDate), this.formatFirebaseDate(this.patient.ICUExitDate))
                        );
                        params.onStepNum = 1;
                    } else {
                        params.isInfoValid = false;
                        params.apache = null;
                        params.sofa = null;
                        params.comorbidities = null;
                        params.patient_id = this.$route.params.id;
                        params.patient_age = this.patient.age;
                        params.nutric = null;
                    }
                    // eslint-disable-next-line no-unused-vars
                    let {isInfoValid, which, nextStep, ...temp} = params;
                    this.$store.dispatch('updatePlannerValues', {values: {...temp}, plannerId: this.$route.params.plannerId});
                    this.$emit('gotoNextStep' , params);
                });
            },
            calculateNutricScore: function (age, apache, sofa, comorbidities, hospToICU) {
                // High Fever, TBSL, Seizure
                let nutric_score = 0;

                if(50 <= age && age < 75){
                    nutric_score += 1;

                } else if (age >= 75){
                    nutric_score += 2;
                }
                /* APACHE II Points*/
                if(15 <= apache && apache < 20){
                    nutric_score += 1;

                } else if(20 <= apache && apache < 28){
                    nutric_score += 2;

                } else if(apache >= 28){
                    nutric_score += 3;
                }

                /* SOFA Points*/
                if(6 <= sofa && sofa < 10){
                    nutric_score += 1;

                } else if(sofa >= 10){
                    nutric_score += 2;
                }

                if(comorbidities > 2){
                    nutric_score += 1;
                }

                if(hospToICU > 1){
                    nutric_score += 1;
                }
                return nutric_score;
            },

            clear: function () {
                this.apache = '';
                this.sofa = '';
                this.comorbidities = '';
                this.$validator.reset();
            },
        },
        computed:{
            patient(){
                return this.$store.getters.loadedPatient(this.$route.params.id);
            }
        },
        created () {
            this.$validator.localize('en', this.dictionary);
            let values = this.$store.getters.getPlannerValues;
            this.apache = values.apache;
            this.sofa = values.sofa;
            this.comorbidities = values.comorbidities;
            this.age = values.age;
        },
    }
</script>

<style scoped>

</style>