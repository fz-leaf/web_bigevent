$(function () {
    // 校验 nickname
    const form = layui.form
    form.verify({
        nickname: function (value) {
            if (value.length > 6) return '昵称长度必须在 1~6 个字符之间！'
        }
    })

    // 获取用户信息
    initUserInfo()

    // 定义 initUserInfo 函数
    function initUserInfo() {
        $.get('/my/userinfo', function (res) {
            const {
                status,
                message,
                data
            } = res
            if (status !== 0) return layer.msg(message)
            // 调用 form.val() 方法快速赋值
            form.val('formUserInfo', data)
        })
    }

    // 表单重置功能
    $('#btnReset').on('click', function (e) {
        // 阻止表单默认重置
        e.preventDefault()
        // 重新调用 initUserInfo
        initUserInfo()
    })

    // 发起更新用户信息请求
    $('.layui-form').on('submit', function (e) {
        // 阻止表单默认提交行为
        e.preventDefault()
        // 发起 ajax 请求
        const data = form.val('formUserInfo')
        delete data.username
        $.ajax({
            type: 'post',
            url: '/my/userinfo',
            data: data,
            success: function (res) {
                const {
                    status,
                    message
                } = res
                if (status !== 0) return layer.msg(message)
                layer.msg(message)
                // 调用父页面的方法，重新渲染头象
                window.parent.getUserInfo()
            }
        })
    })
})