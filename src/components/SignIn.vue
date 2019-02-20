<template>
    <v-container>
        <v-layout row>
            <v-flex>
                <v-btn :disabled="trueshowLogin" @click="trueshowLogin = !trueshowLogin">Sign In</v-btn>
            </v-flex>
            <v-flex>
                <v-btn :disabled="!trueshowLogin" @click="trueshowLogin = !trueshowLogin">Register</v-btn>
            </v-flex>
        </v-layout>
        <form @submit.prevent="registerorlogin" class="pt-3">
            
            <v-layout row class="pt-3">       
                <v-text-field outline type="text" v-model="email" placeholder="Email"></v-text-field>
            </v-layout>    
            
            <v-layout row>            
                <v-text-field outline type="password" v-model="password" class="form-control" placeholder="password"></v-text-field>
            </v-layout>
            <v-fade-transition>
                <v-layout v-if="!trueshowLogin" row>   
                        <v-text-field outline type="text" v-model="name" class="form-control" placeholder="What is your name?"></v-text-field>
                </v-layout>
            </v-fade-transition>
            <v-layout row>             
                <v-btn type=submit v-if="trueshowLogin" class="btn" value="Sign In">Sign In</v-btn>
            </v-layout>
            <v-layout row>
                <v-btn type=submit v-if="!trueshowLogin" class="btn">Register</v-btn>
            </v-layout>    
        </form>
    </v-container>
</template>

<script>

// import firebase from 'firestore'

  export default {

      name: 'register',

    data (){
        return{
            email:"",
            password:"",
            name:"",
            trueshowLogin: true,
            
        }
    },

    methods: {

        registerorlogin(){
            if(this.trueshowLogin){
                this.signInUser()
            }else{
                this.registerUser()
            }
        },

        signInUser(){
            this.$store.dispatch('signUserIn', {email: this.email, password: this.password})
            
        },

        registerUser(){
            this.$store.dispatch('signUserUp', {email: this.email, password: this.password, name: this.name})
        },
    },

    computed: {   
        
    }

  }
</script>

<style>

</style>
