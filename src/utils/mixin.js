
export const statusMixin = {
    methods: {
        resStatus(res, sta = 200) {
            if (res.meta.status !== sta) {
                console.log("混入的方法");
                return this.$message.error(res.meta.msg)
            }
            this.$message.success("删除参数成功！");
            console.log("混入的方法");
            return true
        }
    },
}