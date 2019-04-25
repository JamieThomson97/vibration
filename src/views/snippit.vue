<script>

beforeRouteEnter(to, from, next) {
    var storage = JSON.parse(localStorage.getItem("vuex"));
    if (!storage) {
      next("/landing");
    } else {
      if (storage.customer == undefined ) {
        next("/landindg");
      } else {
        next();
      }
    }
  }

</script>


