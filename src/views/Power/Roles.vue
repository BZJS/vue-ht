<template>
  <div>
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 卡片 -->
      <el-card>
          <!-- 添加角色按钮 -->
          <el-row>
              <el-col>
                  <el-button type="primary">添加角色</el-button>
              </el-col>
          </el-row>
          <!-- 列表 -->
          <el-table :data="RolesList">
              <!-- 展开 -->
              <el-table-column type="expand">
                  <template slot-scope="scope">
                      <!-- 栅格布局 -->
                      <el-row v-for="(item1) in scope.row.children" :key="item1.id">
                          <!-- 放置一级权限 -->
                          <el-col :span="5">
                              <el-tag>{{item1.authName}}</el-tag>
                              <i class="el-icon-caret-right"></i>
                          </el-col>
                          <!-- 放置二级权限 -->
                          <el-col :span="19">
                              <!-- 一列中又有两列 -->
                              <el-row v-for="item2 in item1.children" :key="item2.id">
                                  <el-col>
                                    <el-tag type="success">{{item2.authName}}</el-tag>
                                     <i class="el-icon-caret-right"></i>
                                  </el-col>
                                  <el-col></el-col>
                              </el-row>
                          </el-col>
                      </el-row>
                  </template>
              </el-table-column>
              <!-- 索引序号 -->
              <el-table-column type="index"></el-table-column>
              <el-table-column prop="roleName" label="角色名称"></el-table-column>
              <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
              <el-table-column label="操作">
                  <!-- 作用域插槽 -->
                  <template slot-scope="scope">
                      <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                      <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                      <el-button size="mini" type="warning" icon="el-icon-setting">分配权限</el-button>
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
            // 放置角色列表数据
            RolesList:[]
        }
    },
    methods: {
      async  getRolesList(){
          const {data:res}=await this.$http.get('/roles')
          if(res.meta.status!==200)return this.$message.error("请求失败")
          this.RolesList=res.data
          console.log(this.RolesList)

      }
    },
    created() {
        // 调用请求角色列表数据
        this.getRolesList()
    },
}
</script>

<style lang="less" scoped>
    .el-row{
        border-bottom: 1px solid #eeeeee;
        padding-bottom: 10px;

    }
</style>>

