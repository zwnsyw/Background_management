<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
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

            <!-- 角色列表 -->
            <el-table :data="rolelist" border stripe>
                <!-- 角色列表 -->

                <!-- 展开列表 -->
                <el-table-column type="expand">
                    <!-- 分级 -->
                    <template slot-scope="scope">
                        <div class="outRow">
                            <el-row
                                v-for="(item1, index1) in scope.row.children"
                                class="lastBorder vcenter"
                            >
                                <!-- 一级 -->
                                <el-col :span="5">
                                    <el-tag
                                        type="primary"
                                        closable
                                        @close="removeRightById(scope.row, item1.id)"
                                    >
                                        {{item1.authName}}
                                        <i class="el-icon-caret-right"></i>
                                        <!-- {{scope.row}} -->
                                        <!-- <pre>{{rolelist}}</pre> -->
                                    </el-tag>
                                </el-col>

                                <!-- 二级 -->
                                <el-col :span="19">
                                    <el-row
                                        v-for="(item2, index2) in item1.children"
                                        :key="item2.id"
                                        class="vcenter"
                                    >
                                        <el-col :span="9">
                                            <el-tag
                                                type="success"
                                                closable
                                                @close="removeRightById(scope.row, item2.id)"
                                            >
                                                {{item2.authName}}
                                                <i class="el-icon-caret-right"></i>
                                            </el-tag>
                                        </el-col>

                                        <!-- 三级 -->
                                        <el-col :span="15">
                                            <el-tag
                                                type="warning"
                                                v-for="(item3, index3) in item2.children"
                                                closable
                                                @close="removeRightById(scope.row, item3.id)"
                                            >{{item3.authName}}</el-tag>
                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>
                        </div>
                    </template>
                </el-table-column>
                <!-- 索引列 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" min-width="65px">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                        <el-button
                            size="mini"
                            type="warning"
                            icon="el-icon-setting"
                            @click="showSetRightDialog(scope.row)"
                        >分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 分配权限树控件 -->
        <el-dialog
            title="分配权限"
            :visible.sync="rightDialogVisible"
            width="50%"
            @close="setDialogCloss"
        >
            <!-- <span>这是一段信息</span> -->

            <el-tree
                :data="rightList"
                :props="treeProps"
                node-key="id"
                :default-checked-keys="defKey"
                default-expand-all
                show-checkbox
                ref="treeRef"
            ></el-tree>

            <span slot="footer" class="dialog-footer">
                <el-button @click="rightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="rightDialogDetermine">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            rolelist: [],
            rightDialogVisible: false,
            rightList: [],
            treeProps: {
                children: "children",
                label: "authName"
            },
            // 默认选中
            defKey: [],
            nodeId: ''
        };
    },
    created() {
        this.getRolesList();
    },
    methods: {
        // 请求角色数据
        async getRolesList() {
            const { data: res } = await this.$http.get("roles");
            if (res.meta.status !== 200) {
                return this.$message.error(res.meta.msg);
            }

            this.rolelist = res.data;

            console.log(this.rolelist);
        },
        // 删除权限标签 通过id
        async removeRightById(role, rightId) {
            // 弹框提示用户是否要删除
            const confirmResult = await this.$confirm(
                "此操作将永久删除该权限, 是否继续?",
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }
            ).catch(err => err);

            if (confirmResult !== "confirm") {
                return this.$message.info("取消了删除！");
            }

            const { data: res } = await this.$http.delete(
                `roles/${role.id}/rights/${rightId}`
            );

            if (res.meta.status !== 200) {
                return this.$message.error(this.meta.msg);
            }

            // this.getRolesList()
            role.children = res.data;
        },
        // 分配权限
        async showSetRightDialog(node) {
            this.nodeId = node.id
            console.log("分配权限");
            const { data: res } = await this.$http.get("rights/tree");
            console.log(res);
            if (res.meta.status !== 200) {
                return this.$message.error(this.meta.msg);
            }
            this.rightList = res.data;

            this.getDefKeys(node, this.defKey);

            this.rightDialogVisible = true;
        },
        // 获取默认选中的id
        getDefKeys(node, arr) {
            console.log(node);
            if (!node.children) {
                return arr.push(node.id);
                console.log(arr);
            }
            node.children.forEach(item => this.getDefKeys(item, arr));
        },
        // 关闭树控件
        setDialogCloss() {
            this.defKey = [];
            console.log("关闭");
        },
        // 树控件--确定
        async rightDialogDetermine() {
           let tree = this.$refs.treeRef
            const keys = [
                ...tree.getCheckedKeys(),
                ...tree.getHalfCheckedKeys()
            ]
            console.log(keys);
            let idStr = keys.join(",")
            const { data: res } = await this.$http.post(
        `roles/${this.nodeId}/rights`,
        { rids: idStr }
      )
        if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败！')
      }

      this.$message.success('分配权限成功！')
      this.getRolesList()
      this.rightDialogVisible = false    
            
        }
    }
};
</script>

<style lang="less" scoped>
.outRow {
    padding: 7px;
    border: 1px solid #eee;
    // border-collapse: collapse;
    // border-bottom: none;

    .el-tag {
        margin: 7px;
    }
}
.vcenter {
    display: flex;
    align-items: center;
}
.lastBorder {
    border-bottom: 1px solid #eee;
}
</style>
