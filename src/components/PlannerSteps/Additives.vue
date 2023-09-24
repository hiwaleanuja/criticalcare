<template>
    <v-stepper-content v-bind:step="stepNum" :class="{'pa-0 ma-0':$vuetify.breakpoint.xs}">
        <v-layout align-space-between justify-space-between column fill-height class="pb-3">
            <v-flex>
                <v-layout align-center justify-space-around row fill-height>
                    <v-flex xs6 sm6 md3 class="text-center">
                        <div
                                v-bind:class="[
                                    { 'subtitle-1': $vuetify.breakpoint.mdAndUp },
                                    { 'subtitle-2': $vuetify.breakpoint.smAndDown },
                                    'font-weight-light grey--text'
                                ]"
                        >
                            Supplied Calories
                        </div>
                        <div>
                            <span
                                    class="display-2 font-weight-light"
                                    v-bind:class="[
                                    { 'display-2': $vuetify.breakpoint.mdAndUp },
                                    { 'display-1': $vuetify.breakpoint.smAndDown },
                                ]"
                            >
                                {{totCalories}}
                            </span>
                            <span class="subheading font-weight-light mr-1">/ {{reqCal}}</span>
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
                            Supplied Proteins
                        </div>
                        <div>
                            <span
                                    class="display-2 font-weight-light"
                                    v-bind:class="[
                                    { 'display-2': $vuetify.breakpoint.mdAndUp },
                                    { 'display-1': $vuetify.breakpoint.smAndDown },
                                    'font-weight-light'
                                ]"
                            >
                                {{totProteins}}
                            </span>
                            <span class="subheading font-weight-light mr-1">/ {{reqProt}}</span>
                        </div>
                    </v-flex>
                    <v-flex xs12 sm12 md4 class="pa-3 ma-md-3">
                        <v-text-field
                                v-model="search"
                                append-icon="search"
                                label="Search"
                                single-line
                                hide-details
                                outlined
                                clearable
                        ></v-text-field>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex>
                <v-data-table
                        :headers="headers"
                        :items="products"
                        :search="search"
                        class="elevation-1"
                        item-key="product"
                        show-select
                        group-by="category"
                        v-model="additives_list"
                        color="red"
                >
                    <template v-slot:item.unit="{ item }">
                        <v-btn-toggle @change="trackUnits">
                            <v-btn small text @click="decrement(item)">
                                <v-icon>remove</v-icon>
                            </v-btn>
                            <v-btn small class="unit" text disabled>
                                {{ item.unit }}
                            </v-btn>
                            <v-btn small text @click="increment(item)">
                                <v-icon>add</v-icon>
                            </v-btn>
                        </v-btn-toggle>
                    </template>
                </v-data-table>
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
        name: "Additives",
        props: ['stepNum', 'reqCal', 'reqProt'],
        data(){
            return{
                value: 0,
                singleSelect: false,
                search: '',
                additives_list: [],
                requiredCalories: '',
                requiredProteins: '',
                totCalories: 0,
                totProteins: 0,
                headers: [
                    {
                        text: 'Product (per serving)',
                        sortable: false,
                        align: 'left',
                        value: 'product',
                    },
                    {text: 'Proteins (g)',  value: 'proteins'},
                    {text: 'Calories (g)',  value: 'calories'},
                    {text: 'Units',         value: 'unit'},
                    {text: 'Category',      value: 'category'},
                ],
                products: [],
            }
        },
        methods:{
            trackUnits: function(){
                this.totProteins = 0;
                this.totCalories = 0;
                this.additives_list.forEach(item => {
                    this.totCalories += ~~(item.calories * item.unit);
                    this.totProteins += ~~(item.proteins * item.unit);
                });
            },
            increment: function(value){
                value.unit += 1
            },
            decrement: function(value){
                if(value.unit > 0){
                    value.unit -= 1
                }
            },
            submit: function () {
                let params = {which: 'additives', nextStep: 8};
                if(this.additives_list.length > 0){
                    params.isInfoValid = true;
                    params.additives_list = this.additives_list;
                    params.suppliedCalories = this.totCalories;
                    params.suppliedProteins = this.totProteins;
                    params.onStepNum = 7;
                } else {
                    params.isInfoValid = false;
                    params.additives_list = [];
                    params.suppliedCalories = '';
                    params.suppliedProteins = '';
                }
                // eslint-disable-next-line no-unused-vars
                let {isInfoValid, which, nextStep, ...temp} = params;
                this.$store.dispatch('updatePlannerValues', {values: {...temp}, plannerId: this.$route.params.plannerId});
                this.$emit('gotoNextStep' , params);
            }
        },
        created(){
            db.collection('additives').get().then(querySnapshot => {
                querySnapshot.docs.forEach(doc => {
                    let product = {id: doc.id, unit: 0, ...doc.data()};
                    this.products.push(product)
                })
            });
        },
        computed: {
            plannerValues(){
                return this.$store.state.loadedPlannerValues;
            },
        },
        watch: {
            additives_list: function (value) {
                this.totProteins = 0;
                this.totCalories = 0;
                value.forEach(item => {
                    this.totCalories += ~~(item.calories * item.unit);
                    this.totProteins += ~~(item.proteins * item.unit);
                });
            },
        }
    }
</script>

<style scoped>
    .unit.theme--light.v-btn.v-btn--disabled{
        color: black !important;
    }
</style>