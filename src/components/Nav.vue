<template>
   <v-hover open-delay="700" close-delay="300">
      <v-navigation-drawer permanent drawer="true" right app :temporary="hover && mini" slot-scope="{ hover }" :mini-variant="mini && !hover">
        <v-toolbar flat class="transparent">
            <v-list>
                <v-list-tile avatar v-if="user">
                <v-list-tile-avatar>
                    <img src="https://randomuser.me/api/portraits/men/85.jpg">
                </v-list-tile-avatar>

                <v-list-tile-content>
                    <v-list-tile-title>{{user.id}}</v-list-tile-title>
                </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-toolbar>

            <v-list class="pt-3">
            

            <v-list-tile
                v-for="item in items"
                :key="item.title"
                router :to="item.route"
                @click.stop="hover = !hover"
                
            >
                <v-list-tile-action>
                <v-icon>{{ item.icon }}</v-icon>
                </v-list-tile-action>

                <v-list-tile-content> 
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
            </v-list>
        </v-navigation-drawer>
   </v-hover>
</template>

<script>
export default {
    data (){
        return{
            drawer:true,
            items: [
            { title: 'Home', icon: 'dashboard', route: '/' },
            { title: 'About', icon: 'question_answer', route: '/about' }
            ],
            mini:true,
            
            
        }
    },

    computed: {

        user(){
            return this.$store.getters.user
        },
        storageUser(){
            return JSON.parse(localStorage.getItem('vuex')).user
        }
    }
}
</script>

