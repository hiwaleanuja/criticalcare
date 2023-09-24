<template>
    <v-stepper-content v-bind:step="stepNum">
        <v-layout row wrap>
            <v-flex xs12 sm6 md6 class="px-3 py-1">
                <v-text-field v-model.number="creatinine" type="number" label="Creatinine-Height Index" suffix="g %" outlined></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md6 class="px-3 py-1">
                <v-textarea label="Nitrogen Balance" rows="1" outlined v-model="n2Balance"></v-textarea>
            </v-flex>
        </v-layout>
        <v-layout row wrap>
            <v-flex xs12 sm6 md6 class="px-3 py-1">
                <v-textarea rows="1" label="Pulmonary Function" outlined v-model="pulmonaryFunction"></v-textarea>
            </v-flex>
            <v-flex xs12 sm6 md6 class="px-3 py-1">
                <v-textarea outlined v-model="physicalFindings" rows="1" label="Physical Findings"></v-textarea>
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
        name: "Tests",
        props: ['stepNum'],
        data(){
            return{
                creatinine: '',
                n2Balance: '',
                pulmonaryFunction: '',
                physicalFindings: '',
            }
        },
        methods: {
            submit: function () {
                let params = {
                    which: 'tests',
                    nextStep: 4,
                    isInfoValid: true,
                    creatinine: this.creatinine,
                    n2Balance: this.n2Balance,
                    pulmonaryFunction: this.pulmonaryFunction,
                    physicalFindings: this.physicalFindings,
                    onStepNum : 3,
                };
                // eslint-disable-next-line no-unused-vars
                let {isInfoValid, which, nextStep, ...temp} = params;
                this.$store.dispatch('updatePlannerValues', {values: {...temp}, plannerId: this.$route.params.plannerId});
                this.$emit('gotoNextStep' , params);
            },
        },
        created(){
            let values = this.$store.getters.getPlannerValues;
            this.creatinine = values.creatinine;
            this.n2Balance = values.n2Balance;
            this.pulmonaryFunction = values.pulmonaryFunction;
            this.physicalFindings = values.physicalFindings;
        },
    }
</script>

<style scoped>

</style>