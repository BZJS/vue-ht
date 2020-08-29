<template>
  <div>
    <!-- 导航栏面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
      
    </el-breadcrumb>
    <!-- 卡片内容 -->
    <el-card class="box-card">
        <!-- 内容表格 -->
        <el-table
        :data="lightsList"
        style="width: 100%"
        Boolean
        border>
          <el-table-column
            type="index"
            width="50">
          </el-table-column>
          <el-table-column
            prop="authName"
            label="权限名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="path"
            label="路径"
            width="180">
          </el-table-column>
          <el-table-column
            label="权限等级"
            width="180">
            <!-- 使用作用域插槽获得权限等级数据 -->
            <template slot-scope="scope">
              <el-tag v-if="scope.row.level==='0'">权限一</el-tag>
              <el-tag type="success" v-else-if="scope.row.level==='1'">权限二</el-tag>
              <el-tag type="info" v-else>权限三</el-tag>
              </template>
          </el-table-column>
        </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data(){
    return{
      // 权限列表数据
      lightsList:[]
    }
  },
  created() {
    // 调用methods中获取权限列表数据方法
    this.getLights()
  },
  methods:{
    // 请求权限列表方法
   async getLights(){
     const {data:res}=await this.$http.get('rights/list')
     if(res.meta.status!==200)return this.$message.error("获取权限列表失败")
     this.lightsList=res.data
     
     
   }
  }
}
</script>

<style>

</style>