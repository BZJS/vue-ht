<template>
  <div class="login_container">
      <div class="login_box">
          <!-- 登录的头像 -->
          <div class="logo_img">
              <img src="../../../assets/logo.png" alt="">
          </div>
            <!-- 登录的表单 -->
            <el-form label-width="0px" class="login-form" v-model="form">
                <el-form-item>
                    <el-input prefix-icon="iconfont icon-yonghu" v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input prefix-icon="iconfont icon-mima" v-model="form.password" type="password"></el-input>
                </el-form-item>
                <el-form-item class="login-botton">
                    <el-button type="primary" disabled>登录</el-button>
                    <el-button  type="info" disabled>重置</el-button>
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
                username:'1',
                password:'1'
            }
        }
    }
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

