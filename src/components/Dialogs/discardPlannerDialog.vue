<template>
    <v-dialog v-model="dialog" width="500">
        <template v-slot:activator="{ on }">
            <v-btn color="red accent-4" block dark v-on="on">
                Discard Plan
            </v-btn>
        </template>
        <div>
            <v-card>
                <v-card-title class="headline" primary-title>Discard Options</v-card-title>
                <v-card-text class="subtitle-1">
                    Are you sure about discarding the plan?
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="submitResponse(true)">
                        Discard
                    </v-btn>
                    <v-btn color="primary" text @click="submitResponse(false)">
                        Cancel
                    </v-btn>
                </v-card-actions>
            </v-card>
        </div>
    </v-dialog>
</template>

<script>
    export default {
        name: "discardPlannerDialog",
        data(){
            return{
                dialog: false,
            }
        },
        methods: {
            submitResponse(discardPlan){
                this.dialog = false;
                if(discardPlan){
                    this.$emit('discardResponse');
                }
            },
        },
    }
</script>

<style scoped>

</style>