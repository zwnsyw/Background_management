<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="addCate">添加分类</el-button>
                </el-col>
            </el-row>

            <!-- 表格树控件 -->
            <table-tree
                :data="cateList"
                :columns="tableColumns"
                border
                show-index
                :expand-type="false"
                :selection-type="false"
                class="tabletree"
            >
                <template slot="isOk" slot-scope="scope">
                    <i
                        class="el-icon-success"
                        v-if="scope.cat_deleted===false"
                        style="color:lightgreen"
                    ></i>
                    <i class="el-icon-error" v-else style="color:lightgreen"></i>
                </template>
                <template slot="order" slot-scope="scope">
                    <el-tag type size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
                    <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
                    <el-tag type="danger" size="mini" v-else>三级</el-tag>
                </template>
                <template slot="operate" slot-scope="scope">
                    <el-button type="primary">编辑</el-button>
                    <el-button type="danger">删除</el-button>
                </template>
            </table-tree>

            <!-- 分页 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="cateQuery.pagenum"
                :page-sizes="[5, 10, 20, 100]"
                :page-size="total"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            ></el-pagination>
        </el-card>

        <!-- 添加分类对话框 -->
        <el-dialog title="添加分类" :visible.sync="addDialogVisible" width="50%" @close="addCateClose">
            <!-- 分类表单 -->
            <el-form :model="addCateForm" :rules="cateRules" ref="addCateRef" label-width="100px">
                <el-form-item label="活动名称" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类：">
                    <!-- options 用来指定数据源 -->
                    <!-- props 用来指定配置对象 -->
                    <el-cascader
                        expand-trigger="hover"
                        v-model="cascaderValue"
                        :options="ParentCateList"
                        :props="cascaderProps"
                        @change="cascaderHandleChange"
                        clearable
                        change-on-select
                    ></el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCateDialog">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // get查询参数
            cateQuery: {
                type: 3,
                pagenum: 1,
                pagesize: 5
            },
            // 商品分类数据列表
            cateList: [],
            // 数据总条数
            total: 0,
            tableColumns: [
                {
                    label: "分类名称",
                    prop: "cat_name",
                    width: "100px"
                },
                {
                    label: "是否有效",
                    type: "template",
                    template: "isOk",
                    width: "100px"
                },
                {
                    label: "排序",
                    type: "template",
                    template: "order",
                    width: "100px"
                },
                {
                    label: "操作",
                    type: "template",
                    template: "operate",
                    width: "100px"
                }
            ],
            // 控制添加分类对话框
            addDialogVisible: false,
            addCateForm: {
                // 将要添加的分类的名称
                cat_name: "",
                // 父级分类的Id
                cat_pid: 0,
                // 分类的等级，默认要添加的是1级分类
                cat_level: 0
            },
            cateRules: {
                cat_name: [
                    {
                        required: true,
                        message: "请输入活动名称",
                        trigger: "blur"
                    }
                ]
            },
            // 父级分类列表
            ParentCateList: [],
            // 指定级联选择器的配置对象
            cascaderProps: {
                value: "cat_id",
                label: "cat_name",
                children: "children"
            },
            cascaderValue: []
        };
    },
    created() {
        this.getCateList();
    },
    methods: {
        // 请求商品分类数据
        async getCateList() {
            const { data: res } = await this.$http.get("categories", {
                params: this.cateQuery
            });
            console.log(res);
            if (res.meta.status !== 200) {
                return this.$message.error(res.meta.msg);
            }
            this.cateList = res.data.result;
            this.total = res.data.total;
        },
        handleSizeChange(newSize) {
            console.log(newSize);
            this.cateQuery.pagesize = newSize;
            this.getCateList();
        },
        handleCurrentChange(newPage) {
            console.log(newPage);
            this.cateQuery.pagenum = newPage;
            this.getCateList();
        },
        // 添加分类按钮事件
        addCate() {
            this.getParentCate();
            this.addDialogVisible = true;
        },
        //获取父级分类数据
        async getParentCate() {
            const { data: res } = await this.$http.get("categories", {
                params: { type: 2 }
            });
            console.log(res);
            if (res.meta.status !== 200)
                return this.$message.error(res.meta.msg);
            this.ParentCateList = res.data;
        },
        // 级联改变 选择项发生变化触发这个函数
        cascaderHandleChange() {
            console.log(this.cascaderValue);
            // 大于0就说明选中了，反之
            if (this.cascaderValue.length > 0) {
                // 父级分类id
                this.addCateForm.cat_pid = this.cascaderValue[
                    this.cascaderValue.length - 1
                ];
                // 为当前分类的等级赋值
                this.addCateForm.cat_level = this.cascaderValue.length;
            } else {
                // 没选中，重置表单
                this.addCateForm.cat_pid = 0;
                this.addCateForm.cat_level = 0;
            }
        },
        // 确定按钮
        addCateDialog() {
            // console.log(this.addCateForm);
            this.$refs.addCateRef.validate(
                // 表单预校验
                async valid => {
                    console.log(valid);
                    if (!valid) {
                        return;
                    }
                    const { data: res } = await this.$http.post(
                        "categories",
                        this.addCateForm
                    );
                    if (res.meta.status !== 201)
                        return this.$message.error(res.meta.msg);
                    this.$message.success(res.meta.msg);
                }
            );
        },
        // 添加分类对话框关闭事件
        addCateClose() {
            this.$refs.addCateRef.resetFields();
            this.cascaderValue = [];
            this.addCateForm.cat_pid = 0;
            this.addCateForm.cat_level = 0;
        }
    }
};
</script>

<style lang="less" scoped>
.tabletree {
    font-size: 16px;
    color: #444;
    margin-top: 15px;
}
.el-cascader {
    width: 100%;
}
</style>