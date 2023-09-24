<template>
    <v-dialog v-model="dialog" width="500">
        <template v-slot:activator="{ on }">
            <v-btn color="red accent-4" block :loading="statusLoading" dark v-on="on">
                {{ icuStatus }}
            </v-btn>
        </template>
<!--    Enter ICU Dialog-->
        <div v-if="!inICU">
            <v-card>
                <v-card-title class="headline" primary-title>Plan options</v-card-title>

                <v-card-text class="subtitle-1">
                    <div v-if="numberOfPlans > 0">
                        Do you want to create a New Plan or use the latest One?
                    </div>
                    <div v-else>
                        No Nutrition Plan exits, please create a new one before shifting to ICU.
                    </div>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn v-if="numberOfPlans > 0" color="primary" text @click="submitResponse(false)">
                        Use Latest
                    </v-btn>
                    <v-btn color="primary" text @click="submitResponse(true)" exact>
                        Create New
                    </v-btn>
                </v-card-actions>
            </v-card>
        </div>
<!--    Exit ICU Dialog-->
        <v-card v-else>
            <v-card>
                <v-card-title class="headline" primary-title>Sure?</v-card-title>
                <v-card-text class="subtitle-1">
                    <div>
                        Are you sure about shifting patient out of ICU?
                    </div>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="submitResponse(false)">
                        Yes, Sure
                    </v-btn>
                    <v-btn color="primary" text @click="dialog = false">
                        No
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-card>

    </v-dialog>
</template>

<script>
    export default {
        name: "PlanChooseDialog",
        props: ['icuStatus', 'numberOfPlans', 'inICU'],
        data(){
            return{
                dialog: false,
            }
        },
        methods: {
            submitResponse(enterWithPlan){
                this.dialog = false;

                if(enterWithPlan){
                    this.$emit('planChooseResponse', true);
                } else {
                    this.$emit('planChooseResponse', false);
                }
            },
        },
        computed:{
            statusLoading(){
                return this.$store.getters.loading;
            }
        }
    }
</script>

<style scoped>
.message{
    color: gray;
    font-size: 20px;
    font-weight: normal;
}
</style>