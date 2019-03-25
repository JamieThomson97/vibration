<template>
  <ais-instant-search
    :search-client="searchClient"
    index-name="demo_ecommerce"
  >
  </ais-instant-search>
</template>

<script>
import algoliasearch from 'algoliasearch/lite';

export default {
  data() {
    return {
      searchClient: algoliasearch(
        'YourApplicationID',
        'YourAPIKey'
      ),
    };
  },
};
</script>