<template>
    <v-container>
        <v-container class="page_description px-7" fluid>
            <v-layout align-center row fill-height>
                <v-flex xs10 sm10 md10 class="text-start">
                    <h1 class="font-weight-light deep-orange--text text--darken-3">
                        Review Supplements
                    </h1>
                </v-flex>
            </v-layout>
        </v-container>
        <v-container max-width="400">
            <v-data-table
                    :headers="headers"
                    :items="products"
                    sort-by="calories"
                    class="elevation-1"
                    :loading="loading"
                    loading-text="Loading... Please wait"
                    :search="search"
            >
                <template v-slot:top>
                    <v-spacer></v-spacer>
                    <v-toolbar flat>
                        <v-layout row wrap align-center justify-space-around>
                            <v-flex xs12 sm6 md6>
                                <v-dialog v-model="dialog" max-width="500px">
                                    <template v-slot:activator="{ on }">
                                        <v-btn color="primary" dark class="mb-2" v-on="on">New Item</v-btn>
                                    </template>
                                    <v-card>
                                        <v-card-title>
                                            <span class="headline">{{ formTitle }}</span>
                                        </v-card-title>

                                        <v-card-text>
                                            <v-container>
                                                <v-row>
                                                    <v-col cols="16" sm="6" md="6">
                                                        <v-text-field outlined v-model="editedProduct.product" label="Product name"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12" sm="6" md="6">
                                                        <v-text-field outlined v-model="editedProduct.calories" label="Calories"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12" sm="6" md="6">
                                                        <v-select
                                                                v-model="editedProduct.category"
                                                                :items="['Enteral', 'Parenteral', 'Trace Elements', 'Immuno-Nutrition']"
                                                                label="Category"
                                                                outlined
                                                        ></v-select>
                                                    </v-col>
                                                    <v-col cols="12" sm="6" md="6">
                                                        <v-text-field outlined v-model="editedProduct.proteins" label="Protein (g)"></v-text-field>
                                                    </v-col>
                                                </v-row>
                                            </v-container>
                                        </v-card-text>

                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                                            <v-btn color="blue darken-1" text @click="save">Save</v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                            </v-flex>
                            <v-flex xs12 sm6 md4>
                                <v-text-field
                                        v-model="search"
                                        append-icon="search"
                                        label="Search"
                                        single-line
                                        hide-details
                                        outlined
                                ></v-text-field>
                            </v-flex>
                        </v-layout>
                    </v-toolbar>
                </template>
                <template v-slot:item.action="{ item }">
                    <v-icon small class="mr-2" @click="editItem(item)">edit</v-icon>
                </template>
                <template v-slot:no-data>
                    <v-btn color="primary" @click="initialize">Reset</v-btn>
                </template>
            </v-data-table>
        </v-container>
    </v-container>
</template>

<script>
    import db from '@/fb'
    export default {
        name: "supplements",
        data: () => ({
            dialog: false,
            loading: true,
            search: '',
            headers: [
                {
                    text: 'Product (per serving)',
                    sortable: false,
                    align: 'left',
                    value: 'product',
                },
                {text: 'Proteins (g)',  value: 'proteins'},
                {text: 'Calories (g)',  value: 'calories'},
                {text: 'Category',      value: 'category'},
                {text: 'Actions',      value: 'action', sortable: false },
            ],
            products: [],
            editedIndex: -1,
            editedProduct: {
                product: '',
                calories: 0,
                category: 0,
                proteins: 0,
            },
            defaultProduct: {
                product: '',
                calories: 0,
                category: 0,
                proteins: 0,
            },
        }),

        computed: {
            formTitle () {
                return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
            },
        },

        watch: {
            dialog (val) {
                val || this.close()
            },
        },

        created () {
            this.initialize()
        },

        methods: {
            initialize () {
                this.loading = true;
                let that = this;
                db.collection('additives').get().then(querySnapshot => {
                    querySnapshot.docs.forEach(doc => {
                        let product = {id: doc.id, ...doc.data()};
                        this.products.push(product)
                    });
                    that.loading = false;
                });
            },

            editItem (item) {
                this.editedIndex = this.products.indexOf(item);
                this.editedProduct = Object.assign({}, item);
                this.dialog = true
            },

            close () {
                this.dialog = false;
                setTimeout(() => {
                    this.editedProduct = Object.assign({}, this.defaultProduct);
                    this.editedIndex = -1
                }, 300)
            },

            save () {
                if (this.editedIndex > -1) {
                    let that = this;
                    that.loading = true;
                    Object.assign(this.products[this.editedIndex], this.editedProduct);
                    db.collection("additives").doc(this.editedProduct.id).update(this.editedProduct).then(() => {
                        that.loading = false;
                    })
                } else {
                    let that = this;
                    that.loading = true;
                    this.products.push(this.editedProduct);
                    db.collection('additives').add(this.editedProduct).then(() => {
                        that.loading = false;
                    })
                }
                this.close()
            },
        },
    }
</script>

<style scoped>

</style>