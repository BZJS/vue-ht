<template>
<el-container class="home_container">
    <!-- 头部 -->
  <el-header class="header">
      <span>后台管理系统</span>
      <el-button type="info" @click="loginOut">退出</el-button>
  </el-header>
  <!-- 下边部分 -->
  <el-container class="content">
      <!-- 左边 -->
    <el-aside :width="controlClose ? '64px':'200px'" class="aside">
        <el-menu
      background-color="#313743"
      text-color="#fff"
      active-text-color="#409eff"
      unique-opened
      collapse-transition
      :collapse="controlClose"
      router
      :default-active="tabColor">
      <!-- 展开收缩按钮 -->
      <div class="control_button" @click="closeMenu">
          |||
      </div>
      <!-- 这里菜单的同时点击展开是因为index相同,ps:index接受字符串 -->
      <el-submenu :index="item.id+''" v-for="(item,index) in menuList" :key="item.id">
        <template slot="title">
          <i :class="menuListIcon[index]"></i>
          <span class="icon_title">{{item.authName}}</span>
        </template>
        <!-- 这里菜单的同时点击展开是因为index相同,ps:index接受字符串 -->
        <el-menu-item :index="'/'+childItem.path+''" v-for="childItem in item.children" :key="childItem.id"
        @click="changeTab('/'+childItem.path+'')"
        >
            <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{childItem.authName}}</span>
            </template>
        </el-menu-item>
        
      </el-submenu>
      
    </el-menu>
    </el-aside>
    <!-- 右边 -->
    <el-main class="main">
        <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
  
</template>

<script>
export default {
    data(){
        return{
            // 左侧菜单栏
            menuList:[],
            menuListIcon:[
                'iconfont icon-yonghu',
                'iconfont icon-quanxianshezhi',
                'iconfont icon-shangpinguanli',
                'iconfont icon-ding_huabanfuben',
                'iconfont icon-shujuguanli'
            ],
            controlClose:false,
            // 二级菜单高亮
            tabColor:''
        }
    }
    ,
    methods: {
        // 登出按钮
        loginOut(){
            window.sessionStorage.clear()
            this.$router.replace('/login')
        },
        // 获取菜单数据
       async getList(){
          const {data:res} =await this.$http.get('/menus')
          if(res.meta.status!==200)return this.$message.error(res.meta.msg)
          this.menuList=res.data
          
          
        },
        
        closeMenu(){
            this.controlClose=!this.controlClose
        },
        changeTab(path){
            window.sessionStorage.setItem('menu',path)
            this.tabColor=path
            
            

        }
    },
    created() {
        this.getList()
        this.tabColor=window.sessionStorage.getItem('menu')
    },
}
</script>
    
<style lang="less" scoped>
    .home_container{
        height: 100%;
        .header{
            display: flex;
            justify-content: space-between;
            padding: 20px 10px 10px 40px;
            background-color:#313743 ;
            align-items: center;
            
            span{
                font-size: 20px;
                color: #fff;
                display: flex;
                align-items: center;
                padding: 10px;
            }
            
        }
        .content{
            .aside{
                background-color: #313743;
                
                
                .icon_title{
                    padding-left: 10px;
                    
                }
                

            }
            .main{
                background-color: #e9edf0;
            }

        }

    }
    .control_button{
        color: #eeeeee;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        cursor: pointer;
        background-color:#475162;
    }
</style>>

