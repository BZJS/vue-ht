<template>
  <div>
      <!-- 导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>   
    </el-breadcrumb>
    <el-card>   
        <!-- 添加分类按钮 -->
        <el-button @click="addTypeM" type="primary" class="tb">添加分类</el-button>
        <!-- 表格 -->
        <tree-table :data="GoodsList" :columns="columns" :selection-type="false" index-text="#" show-index :show-row-hover="false" :expand-type="false">
            <!-- 是否有效模板 -->
            <template slot="isok" slot-scope="scope">
                <i style="color:lightgreen" v-if="scope.row.cate_delete===false" class="el-icon-success"></i>
                <i style="color:red" v-else class="el-icon-error"></i>
            </template>
            <!-- 排序模板 -->
            <template slot="sort" slot-scope="scope">
                <el-tag v-if="scope.row.cat_level===0">一级</el-tag>
                <el-tag type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
                <el-tag type="warning" v-else>三级</el-tag>
            </template>
            <!-- 操作模板 -->
            <template slot="opt" slot-scope="scope">
                <el-button icon="el-icon-edit" size="mini" type="warning">编辑</el-button>
                <el-button icon="el-icon-folder-delete" size="mini" type="danger">删除</el-button>
            </template>   
        </tree-table>
        <!-- 分页区域 -->
        <el-pagination
            @size-change="handlePageNum"
            @current-change="handlePageSize"
            :current-page="querInfo.pagenum"
            :page-sizes="[2,3, 4, 5]"
            :page-size="querInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
        <!-- 点击添加分类的对话框 -->
        <el-dialog
            title="添加分类"
            :visible.sync="addType"
            width="50%"
            >
            <!-- 添加信息 -->
            <el-form :model="addTypeList" :rules="addTypeRules" ref="ruleForm" label-width="100px">
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="addTypeList.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类"></el-form-item>
                    
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addType = false">取 消</el-button>
                <el-button type="primary" @click="addType = false">确 定</el-button>
            </span>
        </el-dialog>
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
                },
                {
                    label:'是否有效',
                    // 表示自定义模板
                    type:'template',
                    // 模板名称
                    template:'isok'
                },
                {
                    label:'排序',
                    // 表示自定义模板
                    type:'template',
                    // 模板名称
                    template:'sort'
                },
                {
                    label:'操作',
                    // 表示自定义模板
                    type:'template',
                    // 模板名称
                    template:'opt'
                },

            ],
            // 添加分类对话框显示和隐藏控制
            addType:false,
            // 点击添加分类获取到信息
            addTypeList:{
                // 将要添加的分类的名称
                cate_name:'',
                // 父级分类的id
                cat_pid:0,
                // 分类的等级,默认要添加的是1级分类
                cate_level:0
                
            },
            // 点击添加对话框中表单验证的
            addTypeRules:{
              cat_name:[
                  { required: true, message: '请输入分类名称', trigger: 'blur' }
              ]
            },
            // 获取到父级分类的数据
                parentList:[]
        }
    },
    created() {
        this.getGoods()
        
    },
    methods: {
        // 定义请求商品分类数据
        async getGoods(){
            const {data:res}=await this.$http.get('categories',{params:this.querInfo})
            // console.log(res)
            if(res.meta.status!==200){
                return this.$message("请求商品列表数据失败")
            }
            this.GoodsList=res.data.result
            
            this.total=res.data.total
            
            
            
        },
        // 分页功能的两个方法
        // 当点击这两个方法都有默认参数,分别代表的都是当前页

        handlePageNum(pageSize){
            this.pagesize=pageSize
            this.getGoods()
        },
        handlePageSize(pageNum){
            this.pagenum=pageNum
            this.getGoods()
        },
        // 添加分类按钮点击事件
        addTypeM(){
            this.addType=true
            this.getParentsList()
        },
        // 获取父级分类数据的方法
        async getParentsList(){
            const {data:res}=await this.$http.get('/categories',{params:{
                type:2
            }})
            if(res.meta.status!==200){
                return this.$message("获取数据失败")
            }
            this.parentList=res.data
            
        }



    },
}
</script>

<style lang="less" scoped>
    .tb{
        margin-bottom: 20px;
    }
</style>>

