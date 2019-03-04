<template>
  <vue-frappe
    :id="this.$props.portfolioData.id"
    :labels="this.$props.portfolioData.labels"
    :title="this.$props.portfolioData.type"
    type="pie"
    :height="300"
    :colors="['#7cd6fd', '#743ee2','#743bb2','green','yellow','black']"
    :dataSets="this.data"
  ></vue-frappe>
</template>
<script>
export default {
  props: ["portfolioData"],
  data() {
    return {
      data: [
        {
          chartType: "pie",
          values: this.$props.portfolioData.portions // [50, 50]
        }
      ]
    };
  }
};
</script>