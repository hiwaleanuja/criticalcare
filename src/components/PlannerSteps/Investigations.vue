<template>
    <v-stepper-content v-bind:step="stepNum">
        <v-layout row wrap>
            <v-flex xs12 sm6 md6 class="px-3 py-1">
                <v-text-field v-model.number="albumin" type="number" label="Albumin" suffix="g %" outlined></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md6 class="px-3 py-1">
                <v-text-field label="Transferrin" outlined suffix="mg/dL" type="number" v-model.number="transferrin"></v-text-field>
            </v-flex>
        </v-layout>
        <v-layout row wrap>
            <v-flex xs12 sm6 md6 class="px-3 py-1">
                <v-text-field :suffix="micro('&micro;')" label="Total Lymphocyte Count" outlined v-model.number="lymphCount" type="number"></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md6 class="px-3 py-1">
                <v-textarea outlined v-model="inflammationMarkers" rows="1" label="Bio Markers Of Inflammation"></v-textarea>
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
        name: "Investigations",
        props: ['stepNum'],
        data(){
            return{
                albumin: '',
                transferrin: '',
                lymphCount: '',
                inflammationMarkers: '',
            }
        },
        methods: {
            submit: function () {
                let params = {
                    which: 'investigations',
                    nextStep: 7,
                    isInfoValid: true,
                    albumin: this.albumin,
                    transferrin: this.transferrin,
                    lymphCount: this.lymphCount,
                    inflammationMarkers: this.inflammationMarkers,
                    onStepNum: 6,
                };
                // eslint-disable-next-line no-unused-vars
                let {isInfoValid, which, nextStep, ...temp} = params;
                this.$store.dispatch('updatePlannerValues', {values: {...temp}, plannerId: this.$route.params.plannerId});
                this.$emit('gotoNextStep' , params);
            },
            micro: function (str) {
                let textArea = document.createElement('textarea');
                textArea.innerHTML = str;
                return 'count/'+textArea.value+'L';
            }
        },
        created(){
            let values = this.$store.getters.getPlannerValues;
            this.albumin = values.albumin;
            this.transferrin = values.transferrin;
            this.lymphCount = values.lymphCount;
            this.inflammationMarkers = values.inflammationMarkers;
        },
    }
</script>

<style scoped>

</style>