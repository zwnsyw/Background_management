<template>
    <el-container class="home-container">
        <el-header>
            <div>
                <img src="../../assets/logo.png" alt />
                <span>后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>

       
        <el-container>
             <!-- 侧边栏 -->
            <el-aside :width="isCollapse ? '64px' : '200px'">
                <!-- 折叠和展开侧边栏 -->
                <div class="toggleCollapse" @click="toggleCollapse">
                    <i class="el-icon-s-fold"></i>
                </div>

                <el-menu
                    background-color="#333744"
                    text-color="#fff"
                    active-text-color="#409EFF"
                    unique-opened
                    :collapse="isCollapse"
                    :collapse-transition="false"
                    router
                    :default-active="activeItem"
                >
                    <!-- 一级菜单 -->
                    <el-submenu :index="item.id + '' " v-for="item in menuslist" :key="item.id">
                        <template slot="title">
                            <i :class="iconsObj[item.id]"></i>
                            <span>{{item.authName}}</span>
                        </template>

                        <!-- 二级菜单 -->
                        <el-menu-item
                            :index="'/' + subItem.path"
                            v-for="subItem in item.children"
                            :key="subItem.id"
                            @click="savePathStatus('/' + subItem.path)"
 
                        >
                            <i class="el-icon-menu"></i>
                            <span>{{subItem.authName}}</span>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>

            <!-- 内容主体区 -->
            <el-main>
                <!-- 路由占位符 -->
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    data() {
        return {
            menuslist: [],
            iconsObj: {
                "125": "iconfont icon-user",
                "103": "iconfont icon-tijikongjian",
                "101": "iconfont icon-shangpin",
                "102": "iconfont icon-danju",
                "145": "iconfont icon-baobiao"
            },
            // 全部展开/折叠侧边栏
            isCollapse: false,
            activeItem: ''
        };
    },
    created() {
        this.getMenuList();
        this.activeItem = window.sessionStorage.getItem("pathStatus")
    },
    methods: {
        logout() {
            window.sessionStorage.clear();
            this.$router.push("/login");
        },
        // 折叠展开侧边栏
        toggleCollapse(){
            this.isCollapse = !this.isCollapse
        },
        // 保存选项路由路径
        savePathStatus(pathStatus){
            window.sessionStorage.setItem("pathStatus", pathStatus)
            this.activeItem = pathStatus
        },

        // 网络请求相关
        async getMenuList() {
            const { data: res } = await this.$http.get("menus");
            // console.log(res);
            if (res.meta.status !== 200)
                return this.$message.error(res.meta.msg);
            this.menuslist = res.data;
        }
    }
};
</script>

<style lang="less" scoped>
.iconfont {
    margin-right: 10px;
}
.home-container {
    height: 100%;
}
.el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    > div {
        display: flex;
        align-items: center;
        color: #ddd;
        font-size: 20px;
        img {
            width: 50px;
        }
        span {
            margin-left: 15px;
        }
    }
}
// 侧边栏相关样式
.el-aside {
    background-color: #333744;

    .toggleCollapse{
        color: #ddd;
        text-align: center;
    }

    .el-menu {
        border-right: 0;

        .el-menu-item{
            background-color:  #aaa !important;
        }
    }
}
.el-main {
    background-color: #eaedf1;
}
</style>