import Vue from 'vue'
import Vuex from 'vuex'
import db from '@/fb'
import firebase from 'firebase/app'
require('firebase/auth');
import createPersistedState from 'vuex-persistedstate'
import SecureLS from "secure-ls";
Vue.use(Vuex);

const ls = new SecureLS({ isCompression: false });

export default new Vuex.Store({
    state: {
        loadedPatients: [],
        loggedInUser: {
            id: null,
            firstName: null,
            lastName: null,
            organization: null,
            role: null,
            isSubscribed: false,
            isAdmin: false,
            email: null,
            contact: "",
        },
        loading: false,
        initialPlannerValues: {
            isComplete: false,
            onStepNum: null,
            createdOn: null,
            patient_id: null,
            calorimeter: false,

            nutric: null,
            apache: null,
            sofa: null,
            comorbidities: null,

            consideredWeight: null,
            skinFolds: null,
            armMuscle: null,
            waistSize: null,

            creatinine: null,
            n2Balance: null,
            pulmonaryFunction: null,
            physicalFindings: null,

            ventilatorType: null,
            feedingCategory: null,
            feedingType: null,

            proteinCheck: [],
            proteinFactor: 0.8,
            calorieFactor: 24,

            albumin: null,
            transferrin: null,
            lymphCount: null,
            inflammationMarkers: null,

            additives_list: null,
            suppliedCalories: null,
            suppliedProteins: null,
            reqCalories: null,
            reqProteins: null,
            creatorId: null,
        },
        loadedPlannerValues: {
            isComplete: false,
            onStepNum: null,
            createdOn: null,
            patient_id: null,
            calorimeter: false,

            nutric: null,
            apache: null,
            sofa: null,
            comorbidities: null,

            consideredWeight: null,
            skinFolds: null,
            armMuscle: null,
            waistSize: null,

            creatinine: null,
            n2Balance: null,
            pulmonaryFunction: null,
            physicalFindings: null,

            ventilatorType: null,
            feedingCategory: null,
            feedingType: null,

            proteinCheck: [],
            proteinFactor: 0.8,
            calorieFactor: 24,

            albumin: null,
            transferrin: null,
            lymphCount: null,
            inflammationMarkers: null,

            additives_list: null,
            suppliedCalories: null,
            suppliedProteins: null,
            reqCalories: null,
            reqProteins: null,
            creatorId: null,
        },
    },
    plugins: [createPersistedState({
        storage: {
            getItem: key => ls.get(key),
            setItem: (key, value) => ls.set(key, value),
            removeItem: key => ls.remove(key)
        }
    })],
    getters: {
        getPlannerValues(state) {
            return state.loadedPlannerValues;
        },
        loadedPatients(state){
            return state.loadedPatients;
        },
        getPatientsInICU(state){
            return state.loadedPatients.filter((patient) => {
                return patient.inICU === true;
            });
        },
        getStablePatients(state){
            return state.loadedPatients.filter((patient) => {
                return patient.inICU === false;
            });
        },
        getPatientsWithIncompletePlan(state){
            return state.loadedPatients.filter((patient) => {
                return patient.isCurrentPlanComplete === false;
            });
        },
        getPatientsNutricDist(state){
            let unCalculated =  state.loadedPatients.filter((patient) => {
                return patient.latestNutric === -1;
            });

            let low =  state.loadedPatients.filter((patient) => {
                return patient.latestNutric < 5;
            });

            let high =  state.loadedPatients.filter((patient) => {
                return patient.latestNutric > 5;
            });

            return [unCalculated.length, low.length, high.length]
        },
        loadedPatient(state){
            return (patientId) => {
                return state.loadedPatients.find((patient) => {
                    return patient.id === patientId;
                })
            };
        },
        loggedInUser(state){
            return state.loggedInUser;
        },
        loading(state){
            return state.loading;
        }
    },
    mutations: {
        setLoadedPatients(state, payload){
            state.loadedPatients = payload
        },
        updateCurrentPlannerValues(state, payload){
            for (let key in payload) {
                if (payload.hasOwnProperty(key)) {
                    state.loadedPlannerValues[key] = payload[key];
                }
            }
        },
        deleteCurrentPlanner(state){
            Object.assign(state.loadedPlannerValues, state.initialPlannerValues);
        },
        createPatient(state, payload){
            state.loadedPatients.push(payload)
        },
        updatePatient(state, payload){
            const patient = state.loadedPatients.find(patient => {
                return patient.id === payload.patientId;
            });
            Object.assign(patient, {...payload.values});
        },
        setLoggedInUser(state, payload){
            state.loggedInUser.id = payload.id;
            state.loggedInUser.firstName = payload.firstName ;
            state.loggedInUser.lastName = payload.lastName;
            state.loggedInUser.organization = payload.organization;
            state.loggedInUser.role = payload.role;
            state.loggedInUser.isSubscribed = payload.isSubscribed;
            state.loggedInUser.isAdmin = payload.isAdmin;
            state.loggedInUser.email = payload.email;
            state.loggedInUser.contact = payload.contact;
        },
        updateLoggedInUser(state, payload){
            state.loggedInUser.firstName = payload.firstName ;
            state.loggedInUser.lastName = payload.lastName;
            state.loggedInUser.organization = payload.organization;
            state.loggedInUser.role = payload.role;
        },
        setLoading(state, payload){
            state.loading = payload;
        },
        resetState(state){
            Object.assign(state.loadedPlannerValues, state.initialPlannerValues);
            state.loadedPatients = [];
            state.loading = false;
            state.loggedInUser = {
                id: null,
                firstName: null,
                lastName: null,
                organization: null,
                role: null,
                isSubscribed: false,
                isAdmin: false,
                email: null,
                contact: "",
            }
        }
    },
    actions: {
        fillPlannerValues({commit}, payload){
            const plannerDocRef = db.collection('planner').doc(payload.plannerId);
            plannerDocRef.update({...payload.values}).then(() => {
                commit('updateCurrentPlannerValues', {...payload.values})
            });
        },
        updatePlannerValues({commit}, payload){
            const plannerDocRef = db.collection('planner').doc(payload.plannerId);
            plannerDocRef.update({...payload.values}).then(() => {
                commit('updateCurrentPlannerValues', {...payload.values})
            });
        },
        deleteCurrentPlanner({commit}, payload){
            db.collection("planner").doc(payload).delete().then(function() {
                commit('deleteCurrentPlanner');
            }).catch(() => {});
        },
        createPatient({commit}, payload){
            return new Promise((resolve) => {
                db.collection('patients').add(payload)
                    .then((docReference) => {
                        commit('createPatient', {
                            ...payload, id: docReference.id
                        });
                        resolve();
                    })
                    .catch(() => {})
            })
        },
        loadPatients({commit}){
            commit('setLoading', true);
            const loggedInUserId = firebase.auth().currentUser.uid;
            const patients = [];
            db.collection("patients").where("creatorId", "==", loggedInUserId).get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    patients.push({
                        ...doc.data(), id: doc.id
                    });
                });
                commit('setLoadedPatients', patients);
                commit('setLoading', false);
            });
        },
        loadPlannerValues({commit}, payload){
            return new Promise((resolve) => {
                const plannerDocRef = db.collection('planner').doc(payload);
                plannerDocRef.get().then((doc) => {
                    commit('updateCurrentPlannerValues', doc.data());
                    resolve();
                }).catch(() => {})
            });
        },
        updatePatientData({commit}, payload){
            const patientDocRef = db.collection('patients').doc(payload.patientId);
            patientDocRef.update({...payload.values}).then(() => {
                commit('updatePatient', payload);
            });
        },
        createNewUser({commit}, payload){
            return new Promise((resolve) => {
                db.collection('users').doc(payload.id).set({
                    firstName: payload.firstName,
                    lastName: payload.lastName,
                    organization: payload.organization,
                    role: payload.role,
                    isSubscribed: payload.isSubscribed,
                    isAdmin: payload.isAdmin,
                    email: payload.email,
                    contact: "",
                }).then(() => {
                    commit('setLoggedInUser', {id: payload.id, ...payload});
                    resolve();
                });
            });
        },
        updateUserData({commit}, payload){
            const userDocRef = db.collection('users').doc(payload.id);
            userDocRef.update({...payload.values}).then(() => {
                commit('updateLoggedInUser', {...payload.values})
            });
        },
        loadLoggedInUser({commit}, payload){
            db.collection('users').doc(payload).get().then(doc => {
                commit('setLoggedInUser', {id: doc.id, ...doc.data()});
            });
        },
        endSession({commit}){
            commit('resetState')
        }
    }

})
