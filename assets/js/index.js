$(function () {
    (function getUserInfo(params) {
        $.ajax({
            type: 'get',
            url: '/my/userinfo',
            headers: {
                Authorization: localStorage.getItem('token') || ''
            },
            success: function (res) {
                if (res.status !== 0) return layer.msg('获取用户信息失败！')
                // 获取用户信息成功，调用 renderAvatar 渲染用户的头象，设置文本
                renderAvatar(res.data)
            }
        })
    })();

    // 定义 renderAvatar 函数
    function renderAvatar(user) {
        // 1. 获取用户名，设置欢迎文本
        const name = user.nickname || user.username
        $('#welcome').html(`欢迎&nbsp;&nbsp;${name}`)

        // 2. 按需渲染用户头象
        if (user.user_pic !== null) {
            // 获取到头象，渲染用户头象
            $('.layui-nav-img').attr('src', user.user_pic).show().next().hide()
        } else {
            // 没有获取到头象，渲染文本头象
            $('.text-avatar').text(name[0].toUpperCase()).prev().hide()
        }
    }
})