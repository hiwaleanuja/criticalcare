<template>
    <div ref="printablePlan">
        <h1>Critical Care</h1>
        <h3></h3>
    </div>
</template>

<script>
    import db from '@/fb'
    export default {
        name: "PrintPlan",
        props: {
            planId: String,
        },
        data() {
            return {
                dialog: false,
                plannerValues: null,
                storeValues: {},
            }
        },
        methods : {
            printToPdf: function () {
                let that = this;
                db.collection("planner").doc(this.planId).get().then(function (doc) {
                    Object.assign(that.storeValues, doc.data());
                });
                this.d = new Printd();
                this.d.print(this.$refs.printablePlan)
            },
        },
    }
</script>

<style scoped>

</style>