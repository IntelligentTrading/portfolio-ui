<template>
<div style="margin:50px">
  <el-table :data="tableData" height="500px" style="width: 100%;height:100%:margin:20px">
    <el-table-column prop="email" label="Email" width="250" sortable></el-table-column>
    <el-table-column prop="portfolio.packs[0]" label="Portfolio" width="180" sortable></el-table-column>
    <el-table-column prop="exchanges" label="Exchanges" width="180" sortable>
        <template slot-scope="props">
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium" :type='props.row.exchanges.length > 0? "success":"danger"'>{{ props.row.exchanges.length }}</el-tag>
          </div>
      </template>
    </el-table-column>
    <el-table-column prop="createdAt" label="Created At" width="230" sortable></el-table-column>
  </el-table>
  </div>
</template>
<script>
import api from "../api/client";

export default {
  data() {
    return {
      tableData: []
    };
  },
  methods: {
    load() {
      return api.user().then(users => {
        this.tableData = users.data;
      });
    }
  },
  mounted(){
      this.load()
  }
};
</script>
