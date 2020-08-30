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
                              <el-tag closable @close="tabClose(scope.row,item1.id)">{{item1.authName}}</el-tag>
                              <i class="el-icon-caret-right"></i>
                          </el-col>
                          <!-- 放置二级权限 -->
                          <el-col :span="19">
                              <!-- 一列中又有两列 -->
                              <el-row v-for="item2 in item1.children" :key="item2.id">
                                  <el-col :span="6">
                                    <el-tag type="success" closable @close="tabClose(scope.row,item2.id)" >{{item2.authName}}</el-tag>
                                     <i class="el-icon-caret-right"></i>
                                  </el-col>
                                  <!-- 这里的数据库没有第三级权限信息了 -->
                                  <el-col :span="18" >                                   
                                      <el-tag type="warning" closable @close="tabClose(scope.row,item3.id)" v-for="item3 in item2.children" :key="item3.id">{{item3.authName}}</el-tag>
                                  </el-col>
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
                      <el-button size="mini" type="warning" icon="el-icon-setting" @click="setRights(scope.row)">分配权限</el-button>
                  </template>
              </el-table-column>

          </el-table>

          <!-- 分配权限管理的点击对话框 -->
          <el-dialog
            title="分配权限"
            :visible.sync="setRightsDialog"
            width="30%"
            @close="setRightClose"
            >
            <!-- 树形结构数据展示 -->
            <el-tree :data="RightsList" :props="RightsListItem" 
            show-checkbox
            node-key="id"
            default-expand-all 
            :default-checked-keys="defKeys"
            ref="rightsTree" 
            ></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightsDialog = false">取 消</el-button>
                <el-button type="primary" @click="settingRights">确 定</el-button>
            </span>
           </el-dialog>
      </el-card>

  </div>
</template>

<script>
export default {
    data(){
        return{
            // 放置角色列表数据
            RolesList:[],
            // 设置分配权限对话框的显示隐藏控制量
            setRightsDialog:false,
            // 获得所有权限列表
            RightsList:[],
            
            // 树形结构子项的内容
            RightsListItem:{
                label:'authName',
                children:'children'
            },
            defKeys:[],
            // 打开权限设置对话框时保存id
            Roles_id:0
           
            
        }
    },
    methods: {
      async  getRolesList(){
          const {data:res}=await this.$http.get('/roles')
          if(res.meta.status!==200)return this.$message.error("请求失败")
          this.RolesList=res.data
          console.log(this.RolesList)

      },
    //   删除权限tag触发的事件
      async tabClose(role,rightsId){
            const result=await  this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).catch(err=>err)
            if(result!=='confirm') return this.$message.error("取消删除")
            // 点击确认完就发送删除权限的请求
            const {data:res}  =await this.$http.delete(`roles/${role.id}/rights/${rightsId}`)
            if(res.meta.status!==200)return this.$message.info("删除失败")
            // 这里因为第一级的权限就在rolesId.children中
            // 这样赋值会使得三等级权限内容都变化
            // 而且这里不使用getRolesList刷新数据是因为会关闭展开列表
            role.children=res.data
            this.$message.success("删除成功")
        
     },
    //  分配权限管理的方法
    async setRights(roles){
        // 打开权限分配对话框时,存储当前id
        this.Roles_id=roles.id
        // 使用获取权限列表的数据的请求方法
        const{data:res}=await this.$http.get('rights/tree')
        if(res.meta.status!==200)return this.$message.error("权限列表请求失败")
        
        // console.log(res.data)
        this.RightsList=res.data
        console.log(this.RightsList)
        // 调用递归方法把得到的权限信息中的id存储到defKeys中,使得默认勾选对应的选项
        this.getLeafKeys(roles,this.defKeys)
        this.setRightsDialog=true
    },
    // 定义一个递归方法获取所有三级权限id
    // 并保存到defKeys数组中
    getLeafKeys(node,arr){
        // 如果当前node节点不包含children属性,则是三级节点
        if(!node.children){
            return arr.push(node.id)
        }
        node.children.forEach(item=>this.getLeafKeys(item,arr))
    },
    // 在关闭分配权限对话框时,重置defsKey数组
    setRightClose(){
        this.defKeys=[]
    },
    // 点击对话框的确定为当前用户添加权限
   async settingRights(){
        // 获得节点被选中的id
        const resId=[
            ...this.$refs.rightsTree.getCheckedKeys(),
            ...this.$refs.rightsTree.getHalfCheckedKeys()
        ]
        // 把数组转化为字符串
        const resStr=resId.join(',')
        // 调用设置权限的请求
        const {data:res}=await this.$http.post(`roles/${this.Roles_id}/rights`,{rids:resStr})
        if(res.meta.status!==200)return this.$message.error("分配权限失败")
        this.$message.success("分配权限成功")
        // 重新获取数据,加载权限
        this.getRolesList()
        this.setRightsDialog=false


    }

    },      
    created() {
        // 调用请求角色列表数据
        this.getRolesList()
    }
}
</script>

<style lang="less" scoped>
    .el-row{
        border-bottom: 1px solid #eeeeee;
        padding-bottom: 10px;

    }
</style>>

