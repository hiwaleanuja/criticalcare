<template>
    <div class="planner">
        <v-container class="page_description pa-7" fluid >
            <v-layout align-center justify-space-around row fill-height>
                <v-flex xs12 sm12 md6>
                    <h1 class="font-weight-light">
                        Plan Nutrition for <span class="font-weight-regular">{{ patient.name }}</span>
                    </h1>
                </v-flex>

                <v-flex xs12 sm12 md2 class="text-center pt-6 px-1">
                    <discard-planner-dialog @discardResponse="discardPlanner"/>
                </v-flex>
            </v-layout>
        </v-container>
        <v-container v-bind:class="{'ma-0 pa-0':$vuetify.breakpoint.smAndDown}">
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
            <v-stepper v-if="!isLoading" v-model="step" vertical class="pa-0 ma-0">
                <fragment v-for="(page, index) in pages" :key="page.component">
                    <v-stepper-step :complete="step > index+1" :step=index+1 :rules="[() => page.isValidated]" editable>
                        {{page.name}}
                        <small>{{page.description}}</small>
                    </v-stepper-step>
                    <component :is="page.component" :stepNum="index+1" :patient="patient" @gotoNextStep="nextStep" :reqCal="requiredCalories" :reqProt="requiredProteins"/>
                </fragment>
            </v-stepper>
        </v-container>
    </div>
</template>

<script>
    import {Scores, Preview, Additives, Investigations, Delivery, Feeding, Tests, Compositions} from '@/components/PlannerSteps'
    import { Fragment } from 'vue-fragment'
    import DiscardPlannerDialog from "@/components/Dialogs/discardPlannerDialog";

    export default {
        props: ['id', 'plannerId'],
        data(){
            return {
                isLoading: false,
                step: 1,
                pages: [
                    {component: 'scores' ,          isValidated: true, name: 'Nutritional Scores',   description: 'Provide Vitals and Scores'},
                    {component: 'compositions',     isValidated: true, name: 'Body Compositions',    description: 'Measure and Provide Body Compositions'},
                    {component: 'tests',            isValidated: true, name: 'Tests and Procedures', description: 'Provide Data of specific Tests'},
                    {component: 'feeding',          isValidated: true, name: 'Feeding Category',     description: 'Provide feeding type and category'},
                    {component: 'delivery',         isValidated: true, name: 'Stress Factors',       description: 'Stress factors for Protein and Calorie Planning'},
                    {component: 'investigations',   isValidated: true, name: 'Investigations',       description: 'Investigations and Biochemical Data'},
                    {component: 'additives',        isValidated: true, name: 'Additives',            description: 'Supplements and Vitamins'},
                    {component: 'preview',          isValidated: true, name: 'Preview',              description: 'Preview Planner'},
                ],
                requiredCalories: '',
                requiredProteins: '',
            }
        },
        components:{
            DiscardPlannerDialog,
            'fragment'          : Fragment,
            'scores'            : Scores,
            'compositions'      : Compositions,
            'tests'             : Tests,
            'feeding'           : Feeding,
            'delivery'          : Delivery,
            'investigations'    : Investigations,
            'additives'         : Additives,
            'preview'           : Preview,
        },
        watch: {
            step: function (stepVal) {
                if(stepVal === 7){
                    this.requiredCalories = this.$store.state.loadedPlannerValues.reqCalories;
                    this.requiredProteins = this.$store.state.loadedPlannerValues.reqProteins;
                }
            }
        },
        methods: {
            nextStep: function (params) {
                this.step = params.nextStep;
                this.pages.find(page => page.component === params.which).isValidated = params.isInfoValid;
                if(params.which === 'preview'){
                    this.$router.go(-1);
                }
            },
            discardPlanner(){
                this.$store.dispatch('updatePatientData', {patientId: this.id, values: {currentPlan: null, isCurrentPlanComplete: true}}).then(() => {
                    this.$store.dispatch('deleteCurrentPlanner', this.plannerId);
                    this.$router.go(-1);
                });
            }
        },
        computed: {
            patient(){
                return this.$store.getters.loadedPatient(this.id)
            }
        },
        created(){
            let that = this;
            that.isLoading = true;
            that.$store.dispatch('loadPlannerValues', that.plannerId).then(() => {
                that.isLoading = false;
            });
        }
    }
</script>

<style scoped>

</style>