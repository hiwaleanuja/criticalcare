<template>
    <v-stepper-content v-bind:step="stepNum">
        <v-layout row wrap>
            <v-flex xs12 sm12 md6 class="pa-1 mb-2">
                <v-card flat>
                    <v-card-title>Is the patient on Ventilator?</v-card-title>
                    <v-card-text>If yes, provide the type of ventilator</v-card-text>
                    <v-card-actions class="justify-center">
                        <v-radio-group
                                v-model="ventilatorType"
                                light
                                :row="$vuetify.breakpoint.smAndUp"
                                v-validate="'required'"
                                :error-messages="errors.collect('ventilator')"
                                data-vv-name="ventilator"
                                required
                        >
                            <v-radio label="Invasive" color="black" value="invasive"></v-radio>
                            <v-radio label="Non-Invasive" color="black" value="non-invasive"></v-radio>
                            <v-radio label="No Ventilator" color="black" value="no-ventilator"></v-radio>
                        </v-radio-group>
                    </v-card-actions>
                </v-card>
            </v-flex>

            <v-flex xs12 sm12 md6 class="pa-1 mb-2">
                <v-card flat>
                    <v-card-title>What is the Mode of Feeding?</v-card-title>
                    <v-card-text>Provide specific type in the menu below</v-card-text>
                    <v-card-actions class="justify-center">
                        <v-layout align-space-around justify-space-around column fill-height>
                            <v-flex>
                                <v-radio-group
                                        class="justify-center"
                                        v-model="feedingType"
                                        light
                                        :row="$vuetify.breakpoint.smAndUp"
                                        v-validate="'required'"
                                        :error-messages="errors.collect('feedingType')"
                                        data-vv-name="feedingType"
                                        required
                                >
                                    <v-radio label="Enteral" color="black" value="enteral"></v-radio>
                                    <v-radio label="Oral" color="black" value="oral"></v-radio>
                                    <v-radio label="Parenteral" color="black" value="parenteral"></v-radio>
                                </v-radio-group>
                            </v-flex>
                            <v-flex class="px-3">
                                <v-select
                                        :items="types[feedingType]"
                                        v-model="feedingCategory"
                                        label="Choose Type"
                                        no-data-text="Please select Mode of Feeding"
                                        solo
                                        v-validate="'required'"
                                        :error-messages="errors.collect('feedingCategory')"
                                        data-vv-name="feedingCategory"
                                        required
                                ></v-select>
                            </v-flex>
                        </v-layout>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
        <v-btn color="primary" @click="submit">Continue</v-btn>
        <v-btn text>Cancel</v-btn>
    </v-stepper-content>
</template>

<script>
    export default {
        $_veeValidate: {
            validator: 'new',
        },

        name: "Feeding",
        props: ['stepNum'],
        data(){
            return{
                row: null,
                ventilatorType: '',
                feedingCategory: '',
                feedingType: '',
                items: ['Foo', 'Bar', 'Fizz', 'Buzz'],
                types:{
                    enteral: ['Naso-Gastric Feed', 'PEG Tube', 'JT Feed'],
                    oral: ['Clear Liquid', 'Liquid', 'Soft Diet', 'Full Diet'],
                    parenteral: ['TPN', 'PPN'],
                },
                dictionary: {
                    custom: {
                        ventilator: {
                            required: 'Please Select type of ventilator',
                        },
                        feedingType: {
                            required: () => 'Please Select type of Feeding',
                        },
                        feedingCategory: {
                            required: () => 'Please Select Mode of Feeding',
                        },
                    }
                },
            }
        },
        methods:{
            submit: function () {
                this.$validator.validateAll().then(valid => {
                    let params = {which: 'feeding', nextStep: 5};
                    if(valid){
                        params.isInfoValid = true;
                        params.ventilatorType = this.ventilatorType;
                        params.feedingCategory = this.feedingCategory;
                        params.feedingType = this.feedingType;
                        params.onStepNum = 4;
                    } else {
                        params.isInfoValid = false;
                        params.ventilatorType = null;
                        params.feedingCategory = null;
                        params.feedingType = null;
                    }
                    // eslint-disable-next-line no-unused-vars
                    let {isInfoValid, which, nextStep, ...temp} = params;
                    this.$store.dispatch('updatePlannerValues', {values: {...temp}, plannerId: this.$route.params.plannerId});
                    this.$emit('gotoNextStep' , params);
                })
            }
        },
        created(){
            let values = this.$store.getters.getPlannerValues;
            this.ventilatorType = values.ventilatorType;
            this.feedingCategory = values.feedingCategory;
            this.feedingType = values.feedingType;
        },
        mounted () {
            this.$validator.localize('en', this.dictionary);
        },
    }
</script>

<style scoped>

</style>