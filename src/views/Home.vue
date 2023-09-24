<template>
    <v-container class="pa-md-4">
        <v-container class="page_description px-0" fluid>
            <v-layout align-space-around column justify-start fill-height>
                <v-flex xs12>
                    <h1 class="font-weight-light deep-orange--text text--darken-3"> Dashboard </h1>
                    <h1 class="subtitle-1"> Welcome back, {{loggedInUser.firstName}} </h1>
                </v-flex>
            </v-layout>
        </v-container>
        <v-layout row wrap justify-center>
            <v-flex xs12 sm6 md4>
                <v-card class="ma-3 text-center" min-height="200" color="blue-grey lighten-5">
                    <v-card-text>
                        <p class="display-4 indigo--text mt-2 pb-4">{{totalCount}}</p>
                        <v-divider></v-divider>
                        <div class="subtitle-2 text-uppercase black--text mt-3">Total Patients</div>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs12 sm6 md4>
                <v-card class="ma-3 pa-0 text-center" min-height="200" color="blue-grey lighten-5">
                    <v-card-text>
                        <p v-if="totalCount < 1" class="display-4 indigo--text mt-2 pb-4">-</p>
                        <pie-chart v-else :data="statusPieData" :height="150"></pie-chart>
                        <v-divider></v-divider>
                        <div class="subtitle-2 text-uppercase black--text mt-3">ADMISSION STATUS</div>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs12 sm6 md4>
                <v-card class="ma-3 text-center" min-height="200" color="blue-grey lighten-5">
                    <v-card-text>
                        <p v-if="totalCount < 1" class="display-4 indigo--text mt-2 pb-4">-</p>
                        <pie-chart v-else :data="nutricPieData" :height="150"></pie-chart>
                        <v-divider></v-divider>
                        <div class="subtitle-2 text-uppercase black--text mt-3">SEVERITY DISTRIBUTION</div>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
        <v-layout row wrap justify-center>
            <v-flex xs12 sm6 md6>
                <v-card tile class="ma-3">
                    <v-list shaped>
                        <v-subheader>PATIENTS IN ICU</v-subheader>
                        <v-list-item
                                v-for="patient in ICUPatients"
                                :key="patient.id"
                                :to="{ name: 'patient-profile', params: { id: patient.id }}"
                        >
                            <v-list-item-content>
                                <v-list-item-title>{{patient.name}}</v-list-item-title>
                            </v-list-item-content>

                            <v-list-item-avatar>
                                <v-chip color="red" dark class="ma-2">ICU</v-chip>
                            </v-list-item-avatar>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-flex>
            <v-flex xs12 sm6 md6>
                <v-card tile class="ma-3">
                    <v-list shaped>
                        <v-subheader>INCOMPLETE PLANS</v-subheader>
                        <v-list-item
                                v-for="patient in patientsWithIncompletePlan"
                                :key="patient.id"
                                :to="{ name: 'planner', params: { id: patient.id, plannerId: patient.currentPlan }}"
                        >
                            <v-list-item-content>
                                <v-list-item-title>{{patient.name}}</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    require('firebase/auth');
    import PieChart from "@/charts/PieChart";
    export default {
        name: 'home',
        components: {
            PieChart,
        },
        data(){
            return{
                title: 'Your Logo',
                name: '',
                item: 1,
                items: [
                    { text: 'Real-Time', icon: 'mdi-clock' },
                    { text: 'Audience', icon: 'mdi-account' },
                    { text: 'Conversions', icon: 'mdi-flag' },
                ],
            }
        },
        computed: {
            loggedInUser(){
                return this.$store.getters.loggedInUser;
            },
            totalCount(){
                return this.$store.getters.loadedPatients.length;
            },
            ICUPatients(){
                return this.$store.getters.getPatientsInICU;
            },
            stableCount(){
                return this.$store.getters.getStablePatients.length;
            },
            patientsWithIncompletePlan(){
                return this.$store.getters.getPatientsWithIncompletePlan;
            },
            statusPieData(){
                return {
                    labels: ["Stable", "ICU"],
                    datasets: [
                        {
                            label: "Data One",
                            backgroundColor: ["#125fcc", "#f8383f"],
                            data: [this.stableCount, this.ICUPatients.length],
                        }
                    ]
                }
            },
            nutricPatientDist(){
                return this.$store.getters.getPatientsNutricDist;
            },
            nutricPieData(){
                return {
                    labels: ["NA", "Low", "High"],
                    datasets: [
                        {
                            label: "Data One",
                            backgroundColor: ["#636363", "#029200", "#f8383f"],
                            data: this.nutricPatientDist,
                        }
                    ]
                }
            }
        },
        mounted () {
            this.fillData();
            this.chartData.datasets[0].data = [10,12]
        },
        methods: {
            fillData () {
                this.chartData = {
                    labels: [this.getRandomInt(), this.getRandomInt()],
                    datasets: [
                        {
                            label: 'Data One',
                            backgroundColor: '#f87979',
                            data: [this.getRandomInt(), this.getRandomInt()]
                        }, {
                            label: 'Data One',
                            backgroundColor: '#f87979',
                            data: [this.getRandomInt(), this.getRandomInt()]
                        }
                    ]
                }
            },
            getRandomInt () {
                return Math.floor(Math.random() * (50 - 5 + 1)) + 5
            }
        }
    };
</script>
