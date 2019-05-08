<template>
  <div>
    <el-row :gutter="24" style="height:50px;display:flex;justify-content:center">
      <el-col :span="10">
        <el-autocomplete
          v-model="searchString"
          placeholder="Search coin, click to add..."
          :fetch-suggestions="searchCoin"
          @select="addToCustom"
        />
      </el-col>
      <el-col :span="10">
        <label
          :class="this.totalAllocation < 99 || this.totalAllocation > 100 ? 'error' : ''"
          style="font-size:21px;font-family: Advent Pro;"
        >{{this.totalAllocation}}% allocated</label>
      </el-col>
    </el-row>
    <el-row :gutter="24" style="height:80%;display:flex;justify-content:center">
      <el-row id="custom-allocations-container">
        <custom-allocation
          v-for="[k,v] in this.customAllocations"
          :key="k"
          :allocation="{coin:k,portion:v}"
        ></custom-allocation>
      </el-row>
    </el-row>
    <el-row :gutter="24" style="height:10%;display:flex;justify-content:center">
      <el-button
        @click="setCustomPortfolio"
        class="select-button"
        :disabled="this.totalAllocation < 99 || this.totalAllocation > 100"
      >Confirm</el-button>
    </el-row>
  </div>
</template>

<script>
import api from "../../api/client";
import Allocation from "./Allocation";
import CustomAllocation from "./CustomAllocation";
import { mapMutations, mapState } from "vuex";
import { EventBus } from "../../util/eventBus";

export default {
  data() {
    return {
      searchString: "",
      customAllocations: new Map(),
      availableCurrencies: [],
      trackChangeTrick: 1,
      totalAllocation: 0
    };
  },
  computed: {
    ...mapState(["portfolio"])
  },
  mounted() {
    EventBus.$on("update:allocation", allocation => {
      this.customAllocations.set(allocation.coin, allocation.portion);

      if (this.customAllocations.size === 0) return 0;

      let total = 0.5;

      this.customAllocations.forEach((v, k, m) => {
        total += v;
      });

      this.totalAllocation = total;
    });

    if (this.availableCurrencies.length === 0) {
      api.currencies().then(curr => {
        for (let c in curr.data.binance) this.availableCurrencies.push(c);
      });
    }
  },
  components: { Allocation, CustomAllocation },
  methods: {
    ...mapMutations(["setPortfolio"]),
    setCustomPortfolio: function() {
      let allocations = [];
      this.customAllocations.forEach((v, k) => {
        allocations.push({ coin: k, portion: v / 100 });
      });

      api
        .setCustomPack(
          localStorage["userId"],
          allocations
        )
        .then(res => {
          EventBus.$emit("custom:set");
          EventBus.$emit("settingsChanged");
        })
        .catch(err => {
          this.$message.error(
            `Error while setting custom allocation, try again.`
          );
        });
    },
    searchCoin: function(searchString, cb) {
      var results = searchString
        ? this.availableCurrencies.filter(curr =>
            curr.toLowerCase().startsWith(searchString)
          )
        : this.availableCurrencies;
      // call callback function to return suggestions
      cb(
        results.map(a => {
          return { value: a };
        })
      );
    },
    addToCustom: function(item) {
      if (!this.customAllocations.has(item.value))
        this.customAllocations.set(item.value, 0);

      this.searchString = "";
    }
  }
};
</script>

<style scoped>
.portfolio-type {
  font-size: 18px;
  font-family: Lato;
  flex: 0 0 auto;
}

.portfolio-distribution {
  font-size: 18px;
  font-family: Roboto;
  flex: 1 1 0%;
}

.portfolio-type-container {
  border: solid 1px lightgray;
  margin: 10px;
  border-radius: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.el-row {
  margin: 10px;
}

.select-button {
  width: 200px;
  background: cornflowerblue;
  color: white;
  border: 0px;
}

#custom-allocations-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 10px;
  padding-top: 20px;
}

#custom-allocations-container > .el-card:first-child {
  grid-column-start: 1;
}

.error {
  color: red;
}
</style>
