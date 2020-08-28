<template>
<div>
    <!-- 导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>   
    </el-breadcrumb>
    <!-- 内容用卡片 -->
    <el-card class="box-card">
        <el-row :gutter="20">
            <el-col :span="8">            
                    <el-input placeholder="请输入内容" >
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>                
            </el-col>
            <el-col :span="4">
                <el-button type="primary">添加用户</el-button>
                
            </el-col>           
        </el-row>
    </el-card>
    <!-- 下面的表格数据 -->
    <template>
    <el-table
      :data="userList"
      stripe
      border
    >
      <el-table-column type="index"></el-table-column>
      <el-table-column
        prop="username"
        label="姓名"
        >
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        >
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话">
      </el-table-column>
      <el-table-column
        prop="role_name"
        label="角色">
      </el-table-column>
      <el-table-column
        prop="mg_state"
        label="状态">
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作">
      </el-table-column>
    </el-table>
  </template>
</div>
</template>

  

<script>
export default {
    data(){
        return{
            // 放置get请求的params参数
            paramsUser:{
                query:'',
                pagenum:1,
                pagesize:2
            },
            // 放置返回回来的用户列表数据
            userList:[],
            total:0
        }
    },
     created() {
        // 调用方法,请求用户列表数据
      this.getUser()
     
    },
    methods: {
      async  getUser(){
           const {data:res}=await this.$http.get('/users',{params:this.paramsUser})
           if(res.meta.status!==200)return this.$message.error("请求数据失败")
            this.userList=res.data.users
            this.total=res.data.total
            console.log(res)
            console.log(this.total)
        }
    },
    
}
</script>

<style>

</style>