<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <el-table :data="rightsList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="权限名称" prop="authName"></el-table-column>
                <el-table-column label="路径" prop="path"></el-table-column>
                <el-table-column label="权限等级" prop="level">
                    <template slot-scope="scope">
                        <el-tag v-show="scope.row.level == 0" type="" effect="dark">等级一</el-tag>
                        <el-tag v-show="scope.row.level == 1" type="success" effect="dark">等级二</el-tag>
                        <el-tag v-show="scope.row.level == 2" type="warning" effect="dark">等级三</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            rightsList: []
        };
    },
    created() {
        this.getRightsList();
    },
    methods: {
        // 网络请求权限数据
        async getRightsList() {
            const { data: res } = await this.$http.get("rights/list");
            if (res.meta.status !== 200)
                return this.$message.error(res.meta.msg);
            this.rightsList = res.data;
            this.$message.success(res.meta.msg);
        }
    }
};
</script>

<style lang="less" scoped>
</style>