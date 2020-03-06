<template>
  <el-card style="width:250px;padding:10px">
    <el-row :gutter="24">
      <el-col style="text-align:left" :span="18">
        <span>{{ this.$props.allocation.coin }}</span>
      </el-col>
      <el-col :span="4">
        <img :src="icon" />
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="20">
        <el-slider v-model="alloc.portion" @change="updatePortion"></el-slider>
      </el-col>
      <el-col :span="3" style="padding-top:10px">
        <label>{{ alloc.portion }}%</label>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import { EventBus } from "../../util/eventBus";

export default {
  props: ["allocation"],
  data() {
    return {
      alloc: {}
    };
  },
  beforeMount() {
    this.$data.alloc = JSON.parse(JSON.stringify(this.$props.allocation));
  },
  computed: {
    icon: function() {
      return `https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@f3661dbd785a91bd2fc1da34750ce1dce2ac771b/svg/color/${this.$props.allocation.coin.toLowerCase()}.svg`;
    }
  },
  methods: {
    updatePortion: function(value) {
      EventBus.$emit("update:allocation", {
        coin: this.$props.allocation.coin,
        portion: value
      });
    }
  }
};
</script>

<style></style>
