<template>
  <Scrollama @step-enter="stepEnterHandler">
    <div class="step1" data-step="a">Step 1</div> // classes like .step1 are helpful to adjust the style and dimensions of a step
    <div class="step2" data-step="b">Step 2</div> // data-* attributes are helpful to store instructions to be used in handlers
    <div class="step3" data-step="c">Step 3</div>
  </Scrollama>
</template>

<script>
import 'intersection-observer' // for cross-browser support
import Scrollama from 'vue-scrollama'

export default {
  components: {
    Scrollama
  },
  methods: {
    stepEnterHandler ({element, index, direction}) {
      // handle the step-event as required here
      console.log(element, index, direction)
    }
  }
}

</script>

<style src="vue-scrollama/dist/vue-scrollama.css"></style>

<style>


.scrollama-container {
  display: flex;
}
.scrollama-graphic {
    flex: 1;
    height: 80vh;
    top: 10vh;
  }
.scrollama-steps {
    flex: 1;
  }


</style>