<template>
  <v-hover open-delay="700" close-delay="300">
    <v-navigation-drawer
      permanent
      drawer="true"
      right
      app
      :temporary="hover && mini"
      slot-scope="{ hover }"
      :mini-variant="mini && !hover"
    >
      <v-toolbar flat class="transparent">
        <v-list>
          <v-list-tile
            @click="navigateUser(customer.uID, customer.name)"
            :to="`/users/${(name).split(' ').join('_')}`"
            avatar
            v-if="uID"
          >
            <v-list-tile-avatar>
              <img :src="customer.profileURL">
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title>
                {{name}}
                <br>
                {{uID}}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-toolbar>

      <v-list class="pt-3">
        <v-list-tile
          v-for="item in items"
          :key="item.title"
          router
          :to="item.route"
          @click.stop="hover = !hover"
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile key="Log Out" @click.stop="hover = !hover" @click.exact="signOutUser">
          <v-list-tile-action>
            <v-icon>check_box_outline_blank</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>Log Out</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  </v-hover>
</template>

<script>
import tileMixin from "../mixins/tileMixin";
import { mapGetters } from "vuex";
import selectedUserMixin from "../mixins/selectedUserMixin";

export default {
  data() {
    return {
      drawer: true,
      items: [
        { title: "Home", icon: "dashboard", route: "/" },
        { title: "Landing", icon: "question_answer", route: "/Landing" },
        { title: "Add a Mix", icon: "question_answer", route: "/addMix" },
        { title: "Playlists", icon: "playlist_add", route: "/playlists" }
      ],
      mini: true
    };
  },

  mixins: [tileMixin, selectedUserMixin],

  computed: {
    ...mapGetters([
      "uID",
      "name",
      "profileURL",
      "customer"
      // ...
    ]),

    storageuID() {
      return JSON.parse(localStorage.getItem("vuex")).uID;
    }
  },

  methods: {
    signOutUser() {
      this.$store.dispatch("logUserOut");
    },

    clickID() {
      this.navigateUser(this.customer.uID, this.customer.name);
    }
  },

  created() {}
};
</script>

