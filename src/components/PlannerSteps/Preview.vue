<template>
    <v-stepper-content v-bind:step="stepNum" class="my-2" :class="{'pa-0 ma-0':$vuetify.breakpoint.xs}">
        <v-layout row justify-space-between align-center>
<!--        eslint-disable-next-line-->
            <v-flex :[data.cardFlex]="true" v-for="(data, data_name) in plannerValues" :key="data_name">
                <v-card outlined color="grey lighten-4" class="ma-2">
                    <v-card-text class="pb-0 text-center">
                        <div class="font-weight-light">{{data.description}}</div>
                        <p class="headline text--primary">{{data.name}}</p>
                    </v-card-text>

                    <v-divider></v-divider>
                    <v-layout row justify-space-around class="text-center pa-2">
<!--                    eslint-disable-next-line-->
                        <v-flex :[value.content_flex]="true" class="py-1" v-for="(value, value_name) in data.content" :key="value_name">
                            <div class="caption" :class="[(value.content_value === null) ? 'red--text' : 'indigo--text']">{{value.content_name}}</div>

                            <div v-if="value_name === 'additives_list'" class="pa-md-12">
                                <v-simple-table fixed-header>
                                    <thead>
                                        <tr>
                                            <th class="text-center">Product</th>
                                            <th class="text-center">Calories(g)</th>
                                            <th class="text-center">Proteins(g)</th>
                                            <th class="text-center">Category</th>
                                            <th class="text-center">Units</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="product in value.content_value" :key="product.Product">
                                            <td>{{ product.product }}</td>
                                            <td>{{ product.calories }}</td>
                                            <td>{{ product.proteins }}</td>
                                            <td>{{ product.category }}</td>
                                            <td>{{ product.unit}}</td>
                                        </tr>
                                    </tbody>
                                </v-simple-table>
                            </div>

                            <div v-else-if="value_name === 'comorbidities'" class="px-4">
                                <v-chip-group column active-class="primary--text">
                                    <v-chip v-for="tag in value.content_value" :key="tag">
                                        {{ tag }}
                                    </v-chip>
                                </v-chip-group>
                            </div>

                            <div class="text-capitalize" v-else>{{value.content_value}}</div>
                        </v-flex>
                    </v-layout>
                </v-card>
            </v-flex>
        </v-layout>

        <v-btn color="primary" :disabled="!isValid" @click="submit">
            Save Plan
        </v-btn>
        <v-btn text>Cancel</v-btn>
    </v-stepper-content>
</template>

<script>
    import db from '@/fb'

    export default {
        name: "Preview",
        props: ['stepNum'],
        data(){
            return{
                Valid: false,
            }
        },
        methods:{
            submit: function () {
                let params = {which: 'preview', nextStep: 8, onStepNum: 7, isInfoValid: true};
                const patientDocRef = db.collection('patients').doc(this.$route.params.id);
                patientDocRef.update({latestNutric: this.$store.getters.getPlannerValues.nutric});
                this.$store.dispatch('updatePlannerValues', {values: {isComplete: true}, plannerId: this.$route.params.plannerId}).then(() => {});
                this.$store.dispatch('updatePatientData', {patientId: this.$route.params.id, values: {isCurrentPlanComplete: true}}).then(() => {});
                this.$emit('gotoNextStep' , params);
            }
        },
        computed: {
            plannerValues(){
                let storeValues = this.$store.getters.getPlannerValues;
                return {
                    composition: {
                        name: 'Body Composition',
                        description: 'Patients Body Composition',
                        cardFlex: 'xs12 sm12 md3',
                        content: {
                            armMuscle: {
                                content_flex: 'xs6 sm6 md6',
                                content_name: 'Arm Muscle',
                                content_value: storeValues.armMuscle,
                                content_status: 'indigo--text'
                            },
                            skinFolds: {
                                content_flex: 'xs6 sm6 md6',
                                content_name: 'Skin Folds',
                                content_value: storeValues.skinFolds,
                                content_status: 'indigo--text'
                            },
                            waistSize: {
                                content_flex: 'xs6 sm6 md6',
                                content_name: 'Waist Size',
                                content_value: storeValues.waistSize,
                                content_status: 'indigo--text'
                            },
                            n2Balance: {
                                content_flex: 'xs6 sm6 md6',
                                content_name: 'N2 Balance',
                                content_value: storeValues.n2Balance,
                                content_status: 'indigo--text'
                            },
                        }
                    },

                    feeding: {
                        name: 'Feeding ',
                        description: 'Feeding Mode and Category',
                        cardFlex: 'xs12 sm12 md3',
                        content: {
                            ventilatorType: {
                                content_flex: 'xs6 sm6 md6',
                                content_name: 'Ventilator',
                                content_value: storeValues.ventilatorType,
                                content_status: 'indigo--text'
                            },
                            feedingType: {
                                content_flex: 'xs6 sm6 md6',
                                content_name: 'Feeding Type',
                                content_value: storeValues.feedingType,
                                content_status: 'indigo--text'
                            },
                            feedingCategory: {
                                content_flex: 'xs6 sm6 md6',
                                content_name: 'Feeding Category',
                                content_value: storeValues.feedingCategory,
                                content_status: 'indigo--text'
                            },
                            pulmonaryFunction: {
                                content_flex: 'xs6 sm6 md6',
                                content_name: 'Pulmonary Function',
                                content_value: storeValues.pulmonaryFunction,
                                content_status: 'indigo--text'
                            },
                        }
                    },

                    biochem: {
                        name: 'Bio-Chemical Data',
                        description: 'Patients Bio-Chemical Data',
                        cardFlex: 'xs12 sm12 md3',
                        content: {
                            creatinine: {
                                content_flex: 'xs6 sm6 md6',
                                content_name: 'Creatinine',
                                content_value: storeValues.creatinine,
                                content_status: 'indigo--text'
                            },
                            albumin: {
                                content_flex: 'xs6 sm6 md6',
                                content_name: 'Albumin',
                                content_value: storeValues.albumin,
                                content_status: 'indigo--text'
                            },
                            lymphCount: {
                                content_flex: 'xs6 sm6 md6',
                                content_name: 'Lymphocyte Count',
                                content_value: storeValues.lymphCount,
                                content_status: 'indigo--text'
                            },
                            transferrin: {
                                content_flex: 'xs6 sm6 md6',
                                content_name: 'Transferrin',
                                content_value: storeValues.transferrin,
                                content_status: 'indigo--text'
                            },
                        }
                    },

                    supplement: {
                        name: 'Supplementary Needs',
                        description: 'Required and Supplied',
                        cardFlex: 'xs12 sm12 md3',
                        content: {
                            reqCalories: {
                                content_flex: 'xs6 sm6 md6',
                                content_name: 'Req Calories',
                                content_value: storeValues.reqCalories,
                                content_status: 'indigo--text'
                            },
                            reqProteins: {
                                content_flex: 'xs6 sm6 md6',
                                content_name: 'Req Proteins',
                                content_value: storeValues.reqProteins,
                                content_status: 'indigo--text'
                            },
                            suppliedCal: {
                                content_flex: 'xs6 sm6 md6',
                                content_name: 'Supplied Calories',
                                content_value: storeValues.suppliedCalories,
                                content_status: 'indigo--text'
                            },
                            suppliedProt: {
                                content_flex: 'xs6 sm6 md6',
                                content_name: 'Supplied Proteins',
                                content_value: storeValues.suppliedProteins,
                                content_status: 'indigo--text'
                            },
                        }
                    },

                    scores: {
                        name: 'Nutritional Scores',
                        description: 'Patients Nutritional Scores',
                        cardFlex: 'xs12 sm12 md4',
                        content: {
                            apache: {
                                content_flex: 'xs4 sm4 md4',
                                content_name: 'APACHE II',
                                content_value: storeValues.apache,
                                content_status: 'indigo--text'
                            },
                            sofa: {
                                content_flex: 'xs4 sm4 md4',
                                content_name: 'SOFA',
                                content_value: storeValues.sofa,
                                content_status: 'indigo--text'
                            },
                            consideredWeight: {
                                content_flex: 'xs4 sm4 md4',
                                content_name: 'Weight',
                                content_value: storeValues.consideredWeight,
                                content_status: 'indigo--text'
                            },
                            comorbidities: {
                                content_flex: 'xs12 sm12 md12',
                                content_name: 'Co-Morbidities',
                                content_value: storeValues.comorbidities,
                                content_status: 'indigo--text'
                            },
                        }
                    },


                    physicalFindings: {
                        name: 'Physical Findings',
                        description: 'Any Physical Findings',
                        cardFlex: 'xs12 sm12 md4',
                        content: {
                            findings: {
                                content_flex: 'xs12 sm12 md12',
                                content_name: 'Findings',
                                content_value: storeValues.physicalFindings,
                                content_status: 'indigo--text'
                            },
                        }
                    },

                    inflammationMarkers: {
                        name: 'Inflammation Markers',
                        description: 'Inflammation Markers if Any',
                        cardFlex: 'xs12 sm12 md4',
                        content: {
                            markers: {
                                content_flex: 'xs12 sm12 md12',
                                content_name: 'Markers',
                                content_value: storeValues.inflammationMarkers,
                                content_status: 'indigo--text'
                            },
                        }
                    },

                    additives: {
                        name: 'Additives',
                        description: 'Additives Supplied to patient',
                        cardFlex: 'xs12 sm12 md12',
                        content: {
                            additives_list: {
                                content_flex: 'xs12 sm12 md12',
                                content_name: 'List of All Additives',
                                content_value: storeValues.additives_list,
                                content_status: 'indigo--text'
                            },
                        }
                    },
                };
            },
            isValid(){
                let storeValues = this.$store.getters.getPlannerValues;
                return !(
                    storeValues.apache              === null ||
                    storeValues.sofa                === null ||
                    storeValues.comorbidities       === null ||
                    storeValues.consideredWeight    === null ||
                    storeValues.reqProteins         === null ||
                    storeValues.reqCalories         === null ||
                    storeValues.suppliedProt        === null ||
                    storeValues.suppliedCal         === null ||
                    storeValues.additives_list      === null
                );
            }
        }
    }
</script>


<style scoped>

</style>