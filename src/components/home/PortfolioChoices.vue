<template>
  <div style="height:500px">
    <el-row :gutter="24" style="height:100%;display:flex;justify-content:center">
      <el-col :span="7" class="portfolio-type-container">
        <el-row class="portfolio-type">Conservative</el-row>
        <el-row class="portfolio-distribution">
          <vue-frappe
            id="cons"
            :labels="[
                'BTC','ETH'
            ]"
            title
            type="pie"
            :height="350"
            :colors="['purple', '#ffa3ef', 'light-blue']"
            :dataSets="[{
                    name: 'Some Data', chartType: 'bar',
                    values: [50, 50]
                }]"
          ></vue-frappe>
        </el-row>
        <el-row style="flex:1">
          <el-button class="select-button" @click="setPortfolio('conservative')">Select</el-button>
        </el-row>
      </el-col>

      <el-col :span="7" class="portfolio-type-container">
        <el-row class="portfolio-type">Moderately Aggressive</el-row>
        <el-row class="portfolio-distribution">
          <vue-frappe
            id="mod"
            :labels="[
                'BTC','ETH','LTC'
            ]"
            title
            type="pie"
            :height="350"
            :colors="['purple', '#ffa3ef', 'light-blue']"
            :dataSets="[{
                    name: 'Some Data',
                    values: [50, 25,25]
                }]"
          ></vue-frappe>
        </el-row>
        <el-row style="flex:1">
          <el-button class="select-button" @click="setPortfolio('mod-aggressive')">Select</el-button>
        </el-row>
      </el-col>
      <el-col :span="7" class="portfolio-type-container">
        <el-row class="portfolio-type">Aggressive</el-row>
        <el-row class="portfolio-distribution">
          <vue-frappe
            id="agg"
            :labels="[
                'BTC','ETH','LTC','XRP','EOS','ADA'
            ]"
            title
            type="pie"
            :height="350"
            :colors="['purple', '#ffa3ef', 'light-blue','cornflowerblue','cyan']"
            :dataSets="[{
                    name: 'Some Data',
                    values: [50, 10,10,10,10,10]
                }]"
          ></vue-frappe>
        </el-row>
        <el-row style="flex:1">
          <el-button class="select-button" @click="setPortfolio('aggressive')">Select</el-button>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<<script>
export default {
  methods:{
    setPortfolio:function(type){
      this.$confirm(`This will automatically change your holdings to the selected portfolio. Continue?`, 'Portfolio selection', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        })
    }
  }
}
</script>

<style scoped>
.portfolio-type {
  font-size: 18px;
  font-family: Lato;
}

.portfolio-distribution {
  font-size: 18px;
  font-family: Roboto;
}

.portfolio-type-container {
  border: solid 1px lightgray;
  margin: 10px;
  border-radius: 20px;
  height: 100%;
}

.el-row {
  margin: 20px;
}

.select-button {
  width: 200px;
}
.frappe-chart .chart-legend {
  display: none;
}
</style>

