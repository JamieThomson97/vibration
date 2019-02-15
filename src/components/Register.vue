<template>
  <v-container>
      <v-layout>
          <v-card class="card">
                <form @submit.prevent="registerUser">
                    <div class="card-body">
                        <input type="text" class="form-control" v-model="email" placeholder="email">
                    </div>
                    <div class="card-body">
                        <input type="password" class="form-control" v-model="password" placeholder="password">
                    </div>
                    <div class="card-body">
                        <v-btn outline type="submit" class="btn">Register</v-btn>
                    </div>
                </form>
          </v-card>
      </v-layout>
  </v-container>
</template>

<script>

//import firebase from 'firebase'

  export default {

      name: 'register',

    data (){
        return{
            email:"",
            password:"",
            event
        }
    },

    methods: {
        registerUser(){
            this.$store.dispatch('signUserUp', {email: this.email, password: this.password})
        },
    }
}
</script>

<style>

</style>
