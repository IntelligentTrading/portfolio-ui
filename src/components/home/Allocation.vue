<template>
  <el-card style="height:150px">
    <el-row :gutter="24">
      <el-col :span="20" style="display:flex">
        <div class="symbol">{{allocation.coin}}</div>
        <div class="amount">{{tokens}}</div>
      </el-col>
      <el-col :span="4">
        <img :src="icon">
      </el-col>
    </el-row>
    <el-row style="margin-top:10px; bottom:-50px">
      <el-progress :percentage="allocation.portion * 100"></el-progress>
    </el-row>
  </el-card>
</template>
<script>
import mh from "../../util/mathHelper";

export default {
  props: ["allocation"],
  computed: {
    icon: function() {
      return `https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@f3661dbd785a91bd2fc1da34750ce1dce2ac771b/svg/color/${this.$props.allocation.coin.toLowerCase()}.svg`;
    },
    tokens: function() {
      return mh.down(this.$props.allocation.amount, 2);
    }
  }
};
</script>
<style>
.symbol {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 20px;
}

.amount {
  font-family: "Helvetica Neue";
  font-weight: 200;
  margin-left: 10px;
  font-size: 20px;
}
</style>

