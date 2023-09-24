<template>
    <v-stepper-content v-bind:step="stepNum">
        <v-layout row wrap>
            <v-flex xs12 sm6 md6 class="px-3 py-1">
                <v-text-field
                        outlined
                        label="Weight"
                        suffix="Kg"
                        v-model.number="consideredWeight"
                        type="number"
                        v-validate="'required|between:1,450|numeric'"
                        :error-messages="errors.collect('weight')"
                        data-vv-name="weight"
                        required
                ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md6 class="px-3 py-1">
                <v-text-field label="Skin Folds" outlined suffix="Count" v-model.number="skinFolds" type="number"></v-text-field>
            </v-flex>
        </v-layout>
        <v-layout row wrap>
            <v-flex xs12 sm6 md6 class="px-3 py-1">
                <v-text-field label="Arm Muscle Area" outlined v-model.number="armMuscle" type="number"></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md6 class="px-3 py-1">
                <v-text-field label="Waist Circumference" suffix="Cms" outlined v-model.number="waistSize" type="number"></v-text-field>
            </v-flex>
        </v-layout>
        <v-btn color="primary" @click="submit">
            Continue
        </v-btn>
        <v-btn text>Cancel</v-btn>
    </v-stepper-content>
</template>

<script>
    import db from '@/fb'
    export default {
        $_veeValidate: {
            validator: 'new',
        },

        name: "Compositions",
        props: ['stepNum'],
        data(){
            return{
                patient: '',
                patientId: '',

                consideredWeight: '',
                skinFolds: '',
                armMuscle: '',
                waistSize: '',
                isOrgWeight: true,
                dictionary: {
                    weight: {
                        required: () => 'Weight can not be empty',
                        between: 'The Weight should be in valid range',
                        numeric: 'The Weight must Have only digits'
                    },
                }
            }
        },
        methods: {
            submit: function () {
                this.$validator.validateAll().then(valid => {
                    let params = {which: 'compositions', nextStep: 3};
                    if(valid){
                        params.isInfoValid = true;
                        params.consideredWeight = Number(this.consideredWeight);
                        params.skinFolds = this.skinFolds;
                        params.armMuscle = this.armMuscle;
                        params.waistSize = this.waistSize;
                        params.onStepNum = 2;
                    } else {
                        params.isInfoValid = false;
                        params.consideredWeight = null;
                        params.skinFolds = null;
                        params.armMuscle = null;
                        params.waistSize = null;
                    }
                    // eslint-disable-next-line no-unused-vars
                    let {isInfoValid, which, nextStep, ...temp} = params;
                    this.$store.dispatch('updatePlannerValues', {values: {...temp}, plannerId: this.$route.params.plannerId});
                    this.$emit('gotoNextStep' , params);
                });
            },
        },
        created() {
            db.collection('patients').doc(this.$route.params.id).get().then(res => {
                this.patient = res.data();
                this.patientId = res.id;
                this.consideredWeight = this.patient.weight;
            });

            let values = this.$store.getters.getPlannerValues;
            this.consideredWeight = values.consideredWeight;
            this.skinFolds        = values.skinFolds;
            this.armMuscle        = values.armMuscle;
            this.waistSize        = values.waistSize;
        },
        mounted () {
            this.$validator.localize('en', this.dictionary)
        },
    }
</script>

<style scoped>

</style>