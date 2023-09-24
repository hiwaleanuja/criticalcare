<template>
    <div>
        <v-container class="page_description pa-7">
            <v-layout align-center justify-space-around row fill-height>
                <v-flex xs12 sm12 md8 class="text-start">
                    <v-layout align-space-around column justify-center fill-height class="px-md-6">
                        <v-flex xs12 class="px-5">
                            <h1 class="font-weight-medium">
                                {{ patient.name }}
                            </h1>
                        </v-flex>
                        <v-flex>
                            <v-layout justify-start row fill-height class="px-8">
                                <v-flex xs6 sm6 md3>
                                    <div class="caption grey--text">Admitted</div>
                                    <div class="text-capitalize">{{formatFirebaseDate(patient.admission_date)}}</div>
                                </v-flex>
                                <v-flex xs6 sm6 md2>
                                    <div class="caption grey--text">Nutric Score</div>
                                    <div v-if="patient.latestNutric < 0" class="text-capitalize">Not Available</div>
                                    <div v-else class="text-capitalize">{{patient.latestNutric}}</div>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-flex>
                <v-flex xs12 sm6 md2 class="text-center pt-6 px-1">
                    <choose-plan
                            :inICU="patient.inICU"
                            :icuStatus="patient.inICU ? 'EXIT ICU' : 'SHIFT ICU'"
                            :numberOfPlans="planner_documents.length"
                            @planChooseResponse="toggleICU"
                    />
                </v-flex>
                <v-flex xs12 sm6 md2 class="text-center px-1">
                    <fragment v-if="patient.isCurrentPlanComplete">
                        <v-btn
                                color="secondary"
                                block
                                outlined
                                :loading="statusLoading"
                                :disabled="!patient.inICU"
                                @click="createPlanner"
                                exact
                        >
                            <v-icon>add</v-icon>
                            Create Plan
                        </v-btn>
                    </fragment>
                    <fragment v-else>
                        <v-btn
                                color="secondary"
                                block
                                outlined
                                :loading="statusLoading"
                                :disabled="!patient.inICU"
                                @click="continuePlanner"
                                exact
                        >
                            Continue
                        </v-btn>
                    </fragment>
                </v-flex>
            </v-layout>
        </v-container>
        <v-container>
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
            <v-alert
                    border="left"
                    color="secondary"
                    dark
                    v-if="planner_documents.length < 1 && !isLoading"
            >
                No Plans Created Yet. Please Shift To ICU or Create a New Plan.
            </v-alert>
            <v-timeline v-else dense>
                <v-timeline-item v-for="plan in planner_documents" :key="plan.id">
                    <v-card class="elevation-2">
                        <v-card-title class="font-weight-light">
                            {{formatFirebaseDate(plan.createdOn)}}
                            <v-spacer></v-spacer>
                            <v-btn outlined color="primary" @click="printToPdf(plan, patient)">Print</v-btn>
                        </v-card-title>
                        <v-divider/>
                        <v-card-text>

                            <v-layout row wrap justify-space-around align-center class="pl-2 text-center">
                                <v-flex xs6 sm4 md2 v-for="(score, name) in plan.scores" :key="name">
                                    <div class="subtitle-2 text-uppercase grey--text--darken-2">{{score.score_name}}</div>
                                    <div class="subtitle-1 black--text text-capitalize">{{score.value}}</div>
                                </v-flex>
                            </v-layout>

                            <v-card class="my-3" outlined>
                                <v-layout row wrap align-center class="pl-2">
                                    <v-flex xs12 sm12 md3>
                                        <v-list-item three-line>
                                            <v-list-item-content>
                                                <div class="subtitle-2 text-uppercase mb-4">
                                                    Patient has <strong :class="getNutricStatus(plan.scores.nutric.value).color">{{getNutricStatus(plan.scores.nutric.value).value}}</strong>
                                                    nutric score.
                                                </div>
                                                <v-list-item-title class="headline mb-1">{{plan.feedingCategory}}</v-list-item-title>
                                                <v-list-item-subtitle>
                                                    Patient is on
                                                    <strong class="indigo--text">{{plan.feedingType}}</strong>
                                                    type of feed.
                                                </v-list-item-subtitle>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </v-flex>
                                    <v-flex xs12 sm12 md3>
                                        <v-list-item three-line>
                                            <v-list-item-content>
                                                <div class="body-2">
                                                    {{getNutricStatus(plan.scores.nutric.value).description}}
                                                </div>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </v-flex>
                                    <v-flex xs12 sm6 md3 class="text-center">
                                        <div class="subtitle-2 text-uppercase grey--text">Calories</div>
                                        <div>
                                            <span class="display-2 font-weight-light" v-text="plan.suppliedCal"></span>
                                            <span class="subheading font-weight-light mr-1">/ {{plan.reqCalories}}</span>
                                        </div>
                                    </v-flex>
                                    <v-flex xs12 sm6 md3 class="text-center">
                                        <div class="subtitle-2 text-uppercase grey--text">Proteins</div>
                                        <div>
                                            <span class="display-2 font-weight-light" v-text="plan.suppliedProt"></span>
                                            <span class="subheading font-weight-light mr-1">/ {{plan.reqProteins}}</span>
                                        </div>
                                    </v-flex>
                                </v-layout>
                            </v-card>
                        </v-card-text>
                    </v-card>
                </v-timeline-item>
            </v-timeline>
        </v-container>

    </div>

</template>

<script>
    import db from '@/fb'
    import jsPDF from 'jspdf';
    import firebase from 'firebase/app'
    require('firebase/auth');
    import {format} from 'date-fns'
    import { Fragment } from 'vue-fragment'
    import PlanChooseDialog from "@/components/Dialogs/PlanChooseDialog";
    export default {
        name: "patient-profile",
        props: ['id'],
        components:{
            'choose-plan': PlanChooseDialog,
            'fragment' : Fragment,
        },
        data(){
            return{
                statusLoading: false,
                isLoading: false,
                planner_documents: [],
            }
        },
        methods: {
            formatDate: function (stamp) {
                return format(stamp, 'Do MMM YYYY');
            },
            formatFirebaseDate: function (stamp){
                let UTCDate = new Date(0);
                UTCDate.setUTCSeconds(stamp.seconds);
                return format(UTCDate, 'Do MMM YYYY');
            },
            createPlanner(){
                let plannerValues = {
                        isComplete: false,
                        createdOn: new Date(),
                        patient_id: this.id,
                        calorimeter: false,

                        nutric: null,
                        apache: null,
                        sofa: null,
                        comorbidities: null,

                        consideredWeight: Number(this.patient.weight),
                        skinFolds: null,
                        armMuscle: null,
                        waistSize: null,

                        creatinine: null,
                        n2Balance: null,
                        pulmonaryFunction: null,
                        physicalFindings: null,

                        ventilatorType: null,
                        feedingCategory: null,
                        feedingType: null,

                        proteinCheck: [],
                        proteinFactor: 0.8,
                        calorieFactor: 24,

                        albumin: null,
                        transferrin: null,
                        lymphCount: null,
                        inflammationMarkers: null,

                        additives_list: null,
                        suppliedCalories: null,
                        suppliedProteins: null,
                        reqCalories: null,
                        reqProteins: null,
                        creatorId: firebase.auth().currentUser.uid,
                };
                db.collection('planner').add(plannerValues).then((docReference) => {
                    this.$store.dispatch('updatePatientData', {patientId: this.id, values: {currentPlan: docReference.id, isCurrentPlanComplete: false}}).then(() => {});
                    this.$router.push({ name: 'planner', params: { id: this.id, plannerId: docReference.id }});
                });
            },
            continuePlanner(){
                this.$router.push({ name: 'planner', params: { id: this.id, plannerId: this.patient.currentPlan }});
            },
            getNutricStatus(nutric){
                if(nutric >= 0 && nutric < 4){
                    return {value: 'low', color: 'green--text', description:'Patient has Low Malnutrition risk and Nutrition Therapy may not affect patient significantly'};

                } else if(nutric >= 4 && nutric <= 5) {
                    return {value: 'moderate', color: 'blue--text', description:'Patient has Moderate Malnutrition risk. Patient is likely To benefit from Nutrition Therapy'};

                } else if(nutric > 5 && nutric <= 9){
                    return {value: 'high', color: 'red--text', description: 'Patient has High Malnutrition risk and is associated with worse clinical outcomes. Nutrition Therapy must be initiated Immediately'};
                }
            },
            toggleICU(enterWithPlan){
                let that = this;
                that.statusLoading = true;
                if(this.patient.inICU){
                    that.$store.dispatch('updatePatientData', {patientId: this.id, values: {inICU: false, ICUExitDate: new Date()}}).then(() => {
                        that.statusLoading = false;
                    });
                } else {
                    that.$store.dispatch('updatePatientData', {patientId: this.id, values: {inICU: true, ICUEnterDate: new Date()}}).then(() => {
                        that.statusLoading = false;
                        if(enterWithPlan){
                            that.createPlanner();
                        }
                    });
                }
            },
            printToPdf: function (plan, patient) {
                let doc = new jsPDF();

                doc.setFontSize(40);
                doc.text('Critical Care', 70, 20);

                doc.setFontSize(12);
                doc.text('Nutrition Prescription', 90, 30);

                doc.setFontSize(10);
                doc.text('Date Printed: ' + this.formatDate(new Date()), 10, 40);

                doc.setFontSize(20);
                doc.text(patient.name, 10, 50);

                doc.setFontSize(10);
                doc.text("Admission: " + this.formatFirebaseDate(patient.admission_date), 10, 55);
                doc.text("Nutric: " + patient.latestNutric, 10, 60);

                doc.setFontSize(10);
                doc.text("Supplied Calories", 102, 48);
                doc.setFontSize(25);
                doc.text(plan.suppliedCal.toString(), 100, 60);
                doc.setFontSize(15);
                doc.text("/" + plan.reqCalories.toString(), 125, 60);

                doc.setFontSize(10);
                doc.text("Supplied Proteins", 167, 48);
                doc.setFontSize(25);
                doc.text(plan.suppliedProt.toString(), 165, 60);
                doc.setFontSize(15);
                doc.text("/" + plan.reqProteins.toString(), 180, 60);

                doc.setFontSize(9);
                doc.text(this.getNutricStatus(plan.scores.nutric.value).description, 10, 80);

                doc.setFontSize(9);
                doc.text("Patient is on " + plan.feedingType + " Type of feed", 10, 90);

                doc.text("================== Supplements Provided ==============", 10, 100);
                doc.text("Additive", 10, 110);
                doc.text("Category", 30, 110);
                doc.text("Calories", 50, 110);
                doc.text("Proteins", 70, 110);
                doc.text("Units", 90, 110);
                let start = 120;
                for (let key in plan.additives_list) {
                    doc.text(plan.additives_list[key].product.toString(), 10, start);
                    doc.text(plan.additives_list[key].category.toString(), 30, start);
                    doc.text(plan.additives_list[key].calories.toString(), 50, start);
                    doc.text(plan.additives_list[key].proteins.toString(), 70, start);
                    doc.text(plan.additives_list[key].unit.toString(), 90, start);
                    start += 10
                }

                doc.output('dataurlnewwindow');

            }
        },
        computed: {
            patient(){
                return this.$store.getters.loadedPatient(this.id)
            }
        },
        created() {
            let that = this;
            that.isLoading = true;
            const patientDocRef = db.collection('patients').doc(this.$route.params.id);
            db.collection('planner')
                .where("patient_id", "==", patientDocRef.id)
                .get()
                .then(querySnapshot => {
                    querySnapshot.docs.forEach(doc => {
                        const planner_values = doc.data();
                        let plan = {
                            planId: doc.id,
                            createdOn: planner_values.createdOn,
                            isComplete: planner_values.isComplete,
                                scores: {
                                    nutric:         {score_name: 'Nutric Score',    value: planner_values.nutric},
                                    apache:         {score_name: 'Apache II',       value: planner_values.apache},
                                    sofa:           {score_name: 'Sofa',            value: planner_values.sofa},
                                    comorbidities:  {score_name: 'Co-Morbidities',  value: planner_values.comorbidities !== null ? planner_values.comorbidities.length : 0},
                                    ventilator:     {score_name: 'Ventilator',      value: planner_values.ventilatorType},
                                },
                            status: this.patient.status,
                            feedingCategory: planner_values.feedingCategory,
                            feedingType:     planner_values.feedingType,
                            reqCalories:     planner_values.reqCalories,
                            reqProteins:     planner_values.reqProteins,
                            suppliedCal:     planner_values.suppliedCalories,
                            suppliedProt:    planner_values.suppliedProteins,
                            additives_list : planner_values.additives_list,
                        };
                        if(plan.isComplete){
                            this.planner_documents.push(plan);
                            this.planner_documents.sort(function(a, b) {
                                a = new Date(a.createdOn);
                                b = new Date(b.createdOn);
                                return a>b ? -1 : a<b ? 1 : 0;
                            });
                        }
                    });
                    that.isLoading = false;
                });
        },
    }
</script>

<style scoped>

</style>