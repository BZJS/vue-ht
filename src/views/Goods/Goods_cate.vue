<template>
  <div>
      <!-- 导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>   
    </el-breadcrumb>
    <el-card>   
        <!-- 表格 -->
        <tree-table :data="GoodsList" :columns="columns" :selection-type="false" index-text="#" show-index :show-row-hover="false" :expand-type="false"></tree-table>
        <!-- 分页区域 -->

    </el-card>
  </div>
</template>

<script>
export default {
    data(){
        return{
            // 发送商品分类数据的请求的参数
            querInfo:{
                type:3,
                pagenum:1,
                pagesize:5
            },
            // 存储商品列表分类数据
            GoodsList:[],
            // 存储数据总条数
            total:0,
            // 配置表格的标题和内容
            columns:[
                {
                   label: '分类名称',
                   prop: 'cat_name'
                }
            ]
        }
    },
    created() {
        this.getGoods()
        
    },
    methods: {
        // 定义请求商品分类数据
        async getGoods(){
            const {data:res}=await this.$http.get('categories',{params:this.querInfo})
            console.log(res)
            if(res.meta.status!==200){
                return this.$message("请求商品列表数据失败")
            }
            this.GoodsList=res.data.result
            
            this.total=res.data.total
            
            
            
        }
    },
}
</script>

<style lang="less" scoped>

</style>>

