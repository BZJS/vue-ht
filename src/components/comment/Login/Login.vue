<template>
  <div class="login_container">
      <div class="login_box">
          <!-- 登录的头像 -->
          <div class="logo_img">
              <img src="../../../assets/logo.png" alt="">
          </div>
            <!-- 登录的表单 -->
            <el-form label-width="0px" ref="loginRef" class="login-form" :model="form" :rules="loginRules">
                <el-form-item prop="username">
                    <el-input prefix-icon="iconfont icon-yonghu" v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input prefix-icon="iconfont icon-mima" v-model="form.password" type="password"></el-input>
                </el-form-item>
                <el-form-item class="login-botton">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button  type="info" @click="loginReset">重置</el-button>
                </el-form-item>
            </el-form>
      </div>
  </div>
</template>

<script>
export default {
    data(){
        return{
            form:{
                username:'admin',
                password:'123456'
            },
            loginRules:{
                username: [
                    { required: true, message: '请输入用户名称', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
            password: [
                { required: true, message: '请输入密码', trigger: 'blur' },
                { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        loginReset(){
            this.$refs.loginRef.resetFields()
        },
         login(){
            this.$refs.loginRef.validate(async success=>{
                // console.log(success)
                if(!success)return
               const {data:res}=await this.$http.post('/login',this.form)
               if(res.meta.status!==200) this.$message("登录失败")
               else this.$message("登录成功")
               
            //    在sessionStorage中保存返回的token
               window.sessionStorage.setItem('token',res.data.token)
            //    跳转到home路由组件
            this.$router.push('/home')


            })
        }
    },
}
</script>

<style lang="less" scoped>
    .login_container{
        background-color: #2b4b6b;
        height: 100%;
        .login_box{
            width: 450px;
            height: 300px;
            background-color: #fff;
            border-radius:5px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%,-50%);
            .logo_img{
                width: 130px;
                height: 130px;
                border-radius: 50%;
                box-shadow: 0 0 10px #ddd;
                background-color: #fff;
                padding: 10px;
                position: absolute;
                left: 50%;
                transform: translate(-50%,-50%);
                img{
                    width: 100%;
                    height: 100%;
                    border-radius:50%;
                    background-color: #eee;

                }
            }
        }
        .login-form{
            box-sizing: border-box;
            padding: 0 10px;
            position: absolute;
            bottom: 0px;
            width: 100%;
            .login-botton{
                display: flex;
                justify-content: flex-end;
            }
        }
    }
</style>>

