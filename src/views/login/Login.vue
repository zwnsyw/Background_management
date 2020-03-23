<template>
    <div class="login">
        <div class="login_box">
            <!-- loge模块 -->
            <div class="login_loge">
                <img src="../../assets/logo.png" alt="">
            </div>
            <!-- form表单模块 -->
            <el-form ref="login_form" :model="login_form" :rules="login_form_ruls" class="login_form" label-width="0px">
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <el-input v-model="login_form.username" prefix-icon="iconfont icon-xingzhuanggongnengtubiao-"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input v-model="login_form.password" type="password" prefix-icon="iconfont icon-mima"></el-input>
                </el-form-item>
                <!-- 按钮区域 -->
                <el-form-item  class="login_btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="restLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>

export default {
    data(){
        return {
            login_form:{
                username: 'admin',
                password: '123456'
            },
            // 表单验证规则
            login_form_ruls:{
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    methods:{
        // 重置表单
        restLoginForm(){
            this.$refs.login_form.resetFields();
        },
        // 登录
        login(){
            this.$refs.login_form.validate( async (valid)=>{
                console.log(valid)
                if (!valid) {
                    return
                }
                
                const {data: res} = await this.$http.post("login",this.login_form)
                console.log(res);
                if(res.meta.status !== 200)return this.$message.error(res.meta.msg);                ;
                this.$message.success(res.meta.msg);
                window.sessionStorage.setItem("token" , res.data.token)
                this.$router.push("/home")
                
            })
        }

    }
}
</script>


<style lang="less" scoped>

.login{
    background-color: #2b4b6b;
    height: 100%;
}
.login_box{
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 30px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);

    .login_loge{
        width: 130px;
        height: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px #eee;
        background-color: #fff;

        position: absolute;
        left: 50%;
        transform: translate(-50%,-50%);


        img{
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;
        }

    }
}
// 表单区域
.login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 10px;
    box-sizing: border-box;

}
.login_btns{
    display: flex;
    justify-content: flex-end;
}

</style>