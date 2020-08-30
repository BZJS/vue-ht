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
                    <el-input placeholder="请输入内容" v-model="paramsUser.query" clearable>
                        <el-button slot="append" icon="el-icon-search" @click="getUser"></el-button>
                    </el-input>                
            </el-col>
            <el-col :span="4">
                <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
                
            </el-col>           
        </el-row>

        <!-- 下面的表格数据 -->
    <template>
    <el-table
      :data="userList"
      stripe
      border>
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
          <!-- 作用域插槽的用法 -->
          <template slot-scope="scope">
            <el-switch
            v-model="scope.row.mg_state"  @change="changeState(scope.row)">
          </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUser(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)"></el-button>
            
              <!-- 文字提示 -->
              <!-- 这里出现一个错误那就是更改width后这里的三个按钮没有实现一行,这里是有div的包裹的原因 -->
              <el-tooltip class="item" effect="dark" content="分配角色" placement="top-start" >
                <el-button type="warning" icon="el-icon-setting" size="mini" @click="roleMan(scope.row)"></el-button>
              </el-tooltip>
            
            
          </template>
        </el-table-column>
    </el-table>
  </template>

        <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="paramsUser.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="paramsUser.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <!-- 用户添加的对话框 -->
    <el-dialog
      title="用户添加信息"
      :visible.sync="dialogVisible"
      width="30%"
      @close="resetForm"
      >
      <!-- 表单+验证 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="移动电话" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

<!-- 用户修改数据的对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="editDialogVisible"
      width="30%"
      @close="idUserReset"
      >
      <!-- 验证用户信息 -->
      <el-form :model="searchId" :rules="SearchRules" ref="proUserRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username" >
          <el-input v-model="searchId.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="searchId.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="searchId.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
  </el-dialog>

<!-- 用户列表分配角色按钮的对话框 -->
    <el-dialog
      title="分配"
      :visible.sync="roleDialog"
      width="50%"
      >
      <div>
        <p>{{userRole.username}}</p>
        <p>{{userRole.role_name}}</p>
        <!-- select组件 -->
        <el-select v-model="selectId" placeholder="请选择">
          <el-option
            v-for="item in manList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveRole">确 定</el-button>
      </span>
    </el-dialog>
    </el-card>

    
    
</div>
</template>

  

<script>
export default {
    data(){
      // 自定义校验邮箱的正则表达式
      var checkEmail = (rule, value, callback) => {
        const regEmail=/^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/
        if(regEmail.test(value)){
          return callback()
        }
        callback("请输入合法邮箱")
      }
      // 自定义校验手机的正则表达式
      var checkPhone = (rule, value, callback) => {
        const regPhone=/^1[3456789]\d{9}$/
        if(regPhone.test(value)){
          return callback()
        }
        callback("请输入合法的手机号")
      }
        return{
            // 放置get请求的params参数
            paramsUser:{
                query:'',
                // 当前页码
                pagenum:1,
                // 显示条数
                pagesize:2
            },
            // 放置返回回来的用户列表数据
            userList:[],
            total:0,
            // 控制添加用户对话框的显示隐藏
            dialogVisible:false,
            // 添加用户信息按钮的表单
            addForm:{
              username:'',
              password:'',
              email:'',
              mobile:''
            },
            // 添加用户信息按钮的表单的验证规则
            addFormRules:{
              username:[
                { required: true, message: '用户名', trigger: 'blur' },
                { min: 3, max: 7, message: '长度在 3 到 7 个字符', trigger: 'blur' }
              ],
              password:[
                { required: true, message: '密码', trigger: 'blur' },
                { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }
              ],
              mobile:[
                { validator: checkPhone, trigger: 'blur' }
              ],
              mobel:[
                 { validator: checkEmail, trigger: 'blur' }
              ]
            },
            // 控制修改用户的对话框
            editDialogVisible:false,
            // 查询到的用户的信息
            searchId:{},
            // 查询到的用户信息的表单验证
            SearchRules:{
              username:[
                { required: true, message: '用户名', trigger: 'blur' },
                { min: 3, max: 7, message: '长度在 3 到 7 个字符', trigger: 'blur' }
              ],
              email:[
                 { required: true, message: '邮箱', trigger: 'blur' },
                 { validator: checkEmail, trigger: 'blur' }
              ],
              mobile:[
                 { required: true, message: '手机号', trigger: 'blur' },
                 { validator: checkPhone, trigger: 'blur' }
              ]
            },
            // 控制用户角色分配按钮的对话框控制
            roleDialog:false,
            // 角色分配按钮对话框的数据
            manList:[],
            // 储存当点击角色分配按钮时的用户
            userRole:{},
            // 分配角色按钮对话框中的selete组件选中状态的ID
            selectId:0

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
                
      },
      handleSizeChange(newSize){
          this.paramsUser.pagesize=newSize
          
          this.getUser()
      },
      handleCurrentChange(newPage){
          this.paramsUser.pagenum=newPage
          
          this.getUser()
      },
      // 状态管理
      async changeState(userinfo){
        const {data:res}=await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)       
        if(res.meta.status!==200){
          // 这里是更改数据库失败,但是本地会更改,且提示失败,刷新还是原来的
          userinfo.mg_state=!userinfo.mg_state
          return this.$message.error("更新失败")
        }
        
        this.$message("更新成功")

      },
      // 对话框关闭时调用重置对话框内的表单
      resetForm(){
        this.$refs.addFormRef.resetFields()
      },
      // 添加用户
      addUser(){
        this.$refs.addFormRef.validate(async success=>{
          // success,可以打出来看看
          if(!success) return
          // 校验通过之后,可以发送网络请求
        const {data:res}= await this.$http.post('/users',this.addForm)
          // 然后关闭对话框
          if(res.meta.status===201){
            this.$message("添加失败")
          }
          this.$message("添加成功")
          this.dialogVisible=false
          // 然后重新发送用户列表请求
          this.getUser()
        })
      },
      // 修改用户
      async editUser(id){
        
        // 通过作用域插槽得到的用户id查询用户信息
        const {data:res}=await this.$http.get('/users/'+id)
        
        if(res.meta.status!==200)return this.$message("获取用户信息失败")
        // this.$message("获取用户信息成功")
        this.searchId=res.data
        
        // 打开对话框
        this.editDialogVisible=true
      },
      // 修改用户对话框的表单重置
      idUserReset(){
        this.$refs.proUserRef.resetFields()
      },
      // 修改用户表单验证
      editUserInfo(){
        this.$refs.proUserRef.validate(async success=>{
          if(!success)return this.$message("用户信息验证不通过")
          // 发送修改用户信息的请求
          const {data:res}=await this.$http.put(`users/${this.searchId.id}`,{email:this.searchId.email,mobile:this.searchId.mobile})
          if(res.meta.status!==200)return this.$message("修改用户信息失败")
          // 关闭对话框
          this.editDialogVisible=false
          // 调用用户信息请求方法
          this.getUser()
          // 提示成功修改
          this.$message("修改用户的信息成功")


        })
      },
      // 删除个人用户
     async deleteUser(id){
        const result=await  this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch(err=>err)
          // 成功/失败都会返回一个对应的字符串
        if(result!=='confirm'){
          return this.$message("取消修改")
        }
        // 进行调用网络请求删除
        const {data:res}=await this.$http.delete(`users/${id}`)
        if(res.meta.status!==200){
          return this.$message("删除失败")

        }
        this.$message.success("删除成功")
        // 重新加载用户数据进行渲染
        this.getUser()
        

    },
      // 分配角色按钮的点击事件
       async roleMan(role){
        //  存储当前用户信息
        this.userRole=role
          // 获取角色列表的数据
          const {data:res}=await this.$http.get('roles')
          if(res.meta.status!==200)return this.$message("获取信息失败")
          this.manList=res.data
          this.$message.success("获取信息成功")
          this.roleDialog=true

        },
        // 这里是有问题的,在修改确定之后,无法修改
        // 点击确认修改角色信息
        async saveRole(){
          // 判断是否选中角色信息
          if(!this.selectId){
            return this.$message("请输入角色信息")

          }
          console.log(this.userRole.id)
          const {data:res}=await this.$http.put(`users/${this.userRole.id}/role`,{rid:this.selectId})
          console.log(res)
          if(res.meta.status!==200){
            return this.$message("修改失败")
          }
          this.$message("修改成功")
          this.getUser()
          this.roleDialog=false

        }

    },
    
}
</script>

<style>

</style>