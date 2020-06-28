$(function () {
    // 定义密码校验规则
    const form = layui.form
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须为6到12位，且不能出现空格！'],
        samePwd: function (value) {
            if (value === $('.layui-form [name=oldPwd]').val()) {
                return '新旧密码不能相同！'
            }
        },
        rePwd: function (value) {
            if (value !== $('.layui-form [name=newPwd]').val()) {
                return '两次输入的密码必须相同！'
            }
        }
    })

    // 发起 ajax 请求，修改密码
    // 监听表单的提交行为
    $('.layui-form').on('submit', function (e) {
        // 阻止表单默认提交行为
        e.preventDefault()
        // 去除 reqpwd 中的数据
        let data = $(this).serialize()
        let dataArr = data.split('&')
        let index = dataArr.findIndex(item => item.includes("rePwd"))
        dataArr.splice(index, 1)
        data = dataArr.join('&')
        // 发起 ajax 请求
        $.ajax({
            type: 'post',
            url: '/my/updatepwd',
            data: data,
            success: function (res) {
                const {
                    status,
                    message
                } = res
                if (status !== 0) return layer.msg(message)
                layer.msg(message)
                // 重置表单
                $('.layui-form')[0].reset()
            }
        })
    })
})