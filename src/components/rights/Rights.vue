<template>
  <el-table :data="rightsList" stripe style="width: 100%">
    <el-table-column type="index" width="50"> </el-table-column>
    <el-table-column prop="authName" label="权限名称" width="180"> </el-table-column>
    <el-table-column prop="path" label="路径" width="180"> </el-table-column>
    <el-table-column prop="level" label="层级"> 
        <template slot-scope="scope">
            <span v-if="scope.row.level === '0'">一级</span>
            <span v-else-if="scope.row.level === '2'">二级</span>
            <span v-else>三级</span>
        </template>    
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  data() {
    return {
      rightsList: [
        
      ],
    };
  },

  mounted(){
      this.getrightdata();
  },
  methods: {
      getrightdata(){
          this.$http.get('/rights/list')
          .then(res => {
              console.log(res);
            this.rightsList = res.data.data;
          })
      }
  }
};
</script>

<style>
</style>