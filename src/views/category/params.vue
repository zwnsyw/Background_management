<template>
    <div class="Params">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>参数管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <!-- 警告视图 -->
            <el-alert title="注意：只允许为第三级分类修改参数！" type="warning" :closable="false" show-icon></el-alert>
            <!-- 级联选择 -->
            <el-cascader
                expandTrigger="hover"
                v-model="selectKey"
                :options="catelists"
                :props="cateProps"
                @change="cateItemChange"
                class="cascader-params"
            ></el-cascader>
            <!-- 标签页 -->
            <el-tabs
                class="tabs-params"
                v-model="activeTabsName"
                type="card"
                @tab-click="handleTabClick"
            >
                <el-tab-pane label="动态参数" name="many">
                    <el-button
                        type="primary"
                        size="mini"
                        :disabled="isTrue"
                        @click="addDialogVisible = true"
                    >添加参数</el-button>
                    <el-table :data="manyTabeData" style="width: 100%" stripe>
                        <!-- 展开行 -->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag
                                    class="tag-Params"
                                    closable
                                    v-for="(item,index) in scope.row.attr_vals"
                                    :key="index"
                                >{{item}}</el-tag>
                                <el-input
                                    id="input-new-tag"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm"
                                    @blur="handleInputConfirm"
                                ></el-input>
                                <el-button
                                    v-else
                                    class="button-new-tag"
                                    size="small"
                                    @click="showInput(scope.row)"
                                >+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index"></el-table-column>
                        <el-table-column prop="attr_name" label="属性名称"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button
                                    size="mini"
                                    type="primary"
                                    icon="el-icon-edit"
                                    @click="editParemsDialog(scope.row.attr_id)"
                                >编辑</el-button>
                                <el-button
                                    size="mini"
                                    type="danger"
                                    icon="el-icon-delete"
                                    @click="removeParams(scope.row.attr_id)"
                                >删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only">
                    <el-button
                        type="primary"
                        size="mini"
                        :disabled="isTrue"
                        @click="addDialogVisible = true"
                    >添加属性</el-button>
                    <el-table :data="onlyTabeData" style="width: 100%" stripe>
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag
                                    v-for="(item,index) in scope.row.attr_vals"
                                    :key="index"
                                >{{item}}</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column type="index"></el-table-column>
                        <el-table-column prop="attr_name" label="属性名称"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button
                                    size="mini"
                                    type="primary"
                                    icon="el-icon-edit"
                                    @click="editParemsDialog(scope.row.attr_id)"
                                >编辑</el-button>
                                <el-button
                                    size="mini"
                                    type="danger"
                                    icon="el-icon-delete"
                                    @click="removeParams(scope.row.attr_id)"
                                >删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <!-- 添加对话框 -->
        <el-dialog
            :title="'添加' + titleText"
            :visible.sync="addDialogVisible"
            width="50%"
            @close="dialogClose"
        >
            <el-form :model="addForm" :rules="addFormrules" ref="addFormRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addParams">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改对话框 -->
        <el-dialog
            :title="'修改' + titleText"
            :visible.sync="editDialogVisible"
            width="50%"
            @close="editdialogClose"
        >
            <el-form :model="editForm" :rules="editFormrules" ref="editFormRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="editForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editParams">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { statusMixin } from "../../utils/mixin";
export default {
    data() {
        return {
            // 商品分类列表
            catelists: [],
            // 级联选择框的配置对象
            cateProps: {
                value: "cat_id",
                label: "cat_name",
                children: "children"
            },
            // 级联选择框双向绑定到的数组
            selectKey: [],
            // 标签页数据双向绑定
            activeTabsName: "many",
            manyTabeData: [],
            onlyTabeData: [],
            // 添加对话框
            addDialogVisible: false,
            addForm: {
                attr_name: ""
            },
            addFormrules: {
                attr_name: [
                    {
                        required: true,
                        message: "请输入活动名称",
                        trigger: "blur"
                    }
                ]
            },
            // 控制修改表单显示掩藏
            editDialogVisible: false,
            editForm: {
                attr_name: ""
            },
            editFormrules: {
                attr_name: [
                    {
                        required: true,
                        message: "请输入活动名称",
                        trigger: "blur"
                    }
                ]
            },
            // 添加tag显示隐藏
            // inputVisible: false,
            // inputValue: ''
        };
    },
    mixins: [statusMixin],
    created() {
        this.getCateList();
    },
    methods: {
        async getCateList() {
            const { data: res } = await this.$http.get("categories");
            if (res.meta.status != 200) {
                return this.$message.error(res.meta.msg);
            }
            console.log(res.data);
            this.catelists = res.data;
        },
        //级联项改变
        cateItemChange() {
            this.getParamsData();
        },
        // 标签页改变触发
        handleTabClick() {
            console.log(this.activeTabsName);
            this.getParamsData();
        },
        // 获取数据
        async getParamsData() {
            console.log(this.selectKey);
            if (this.selectKey.length !== 3) {
                console.log("没有选中三级");
                this.selectKey = [];
                return;
            }
            const { data: res } = await this.$http.get(
                `categories/${this.cateId}/attributes`,
                {
                    params: { sel: this.activeTabsName }
                }
            );
            if (res.meta.status !== 200) {
                return this.$message.error(res.meta.msg);
            }
            console.log(res.data);
            res.data.forEach(element => {
                element.attr_vals = element.attr_vals
                    ? element.attr_vals.split(" ")
                    : [];
                    element.inputVisible = false
                    element.inputValue = ''
            });
            console.log(res.data);

            if (this.activeTabsName === "many") {
                this.manyTabeData = res.data;
            } else {
                this.onlyTabeData = res.data;
            }
        },
        dialogClose() {
            this.$refs.addFormRef.resetFields();
        },
        editdialogClose() {
            this.$refs.editFormRef.resetFields();
        },
        // 对话框确定按钮，添加参数
        addParams() {
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) return;
                const { data: res } = await this.$http.post(
                    `categories/${this.cateId}/attributes`,
                    {
                        attr_name: this.addForm.attr_name,
                        attr_sel: this.activeTabsName
                    }
                );

                if (res.meta.status !== 201) {
                    return this.$message.error("添加参数失败！");
                }

                this.$message.success("添加参数成功！");
                this.addDialogVisible = false;
                this.getParamsData();
            });
        },
        async editParemsDialog(attrId) {
            // 查询当前参数的信息
            const { data: res } = await this.$http.get(
                `categories/${this.cateId}/attributes/${attrId}`,
                {
                    params: { attr_sel: this.activeTabsName }
                }
            );

            if (res.meta.status !== 200) {
                return this.$message.error("获取参数信息失败！");
            }

            this.editForm = res.data;
            this.editDialogVisible = true;
        },
        editParams() {
            this.$refs.editFormRef.validate(async valid => {
                if (!valid) return;
                const { data: res } = await this.$http.put(
                    `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
                    {
                        attr_name: this.editForm.attr_name,
                        attr_sel: this.activeTabsName
                    }
                );

                if (res.meta.status !== 200) {
                    return this.$message.error("修改参数失败！");
                }

                this.$message.success("修改参数成功！");
                this.getParamsData();
                this.editDialogVisible = false;
            });
        },
        // 根据Id删除对应的参数项
        async removeParams(attrId) {
            const confirmResult = await this.$confirm(
                "此操作将永久删除该参数, 是否继续?",
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }
            ).catch(err => err);

            // 用户取消了删除的操作
            if (confirmResult !== "confirm") {
                return this.$message.info("已取消删除！");
            }

            // 删除的业务逻辑
            const { data: res } = await this.$http.delete(
                `categories/${this.cateId}/attributes/${attrId}`
            );

            if (res.meta.status !== 200) {
                return this.$message.error("删除参数失败！");
            }
            this.resStatus(res);
            if (this.resStatus(res)) {
                console.log("成功混入方法");
            }
            this.$message.success("删除参数成功！");
            this.getParamsData();
        },
        // 添加tap,enter按下或失去焦点的时候
        handleInputConfirm(){
            console.log("添加tag");   
        },
        // 显示tag输入框
        showInput(scope){
            scope.inputVisible = true 
        }
    },
    computed: {
        isTrue() {
            if (this.selectKey.length === 3) return false;
            return true;
        },
        cateId() {
            if (this.selectKey.length == 3) {
                return this.selectKey[2];
            }
        },
        titleText() {
            if (this.activeTabsName == "many") {
                return "动态参数";
            } else {
                return "静态属性";
            }
        }
    }
};
</script>

<style lang="less">
.cascader-params,
.tabs-params {
    margin-top: 10px;
}
#input-new-tag{
    width: 100px;
}
.tag-Params{
    margin-right: 10px;
    margin-bottom: 5px;
}
</style>