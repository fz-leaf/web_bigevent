$(function () {
    (function getUserInfo(params) {
        $.ajax({
            type: 'get',
            url: '/my/userinfo',
            // headers: {
            //     Authorization: localStorage.getItem('token') || ''
            // },
            // beforeSend: function (xhr) {
            //     xhr.setRequestHeader('Authorization', localStorage.getItem('token'))
            // }
            success: function (res) {
                if (res.status !== 0) return layer.msg('获取用户信息失败！')
                // 获取用户信息成功，调用 renderAvatar 渲染用户的头象，设置文本
                renderAvatar(res.data)
            },
            
        })
    })();

    // 定义 renderAvatar 函数
    function renderAvatar(user) {
        // 1. 获取用户名，设置欢迎文本
        // const {
        //     username,
        //     user_pic,
        //     nickname = '靓仔',
        //     asd = 'qqq'
        // } = user
        // console.log(asd);
        const name = user.nickname || user.username
        $('#welcome').html(`欢迎&nbsp;&nbsp;${name}`)

        // 2. 按需渲染用户头象
        if (user.user_pic) {
            // 获取到头象，渲染用户头象
            $('.layui-nav-img').attr('src', user.user_pic).show().next().hide()
        } else {
            // 没有获取到头象，渲染文本头象
            $('.text-avatar').text(name[0].toUpperCase()).prev().hide()
        }
    }

    // 退出功能
    $('#btnLogout').on('click', function () {
        // 提示用户确认框
        layer.confirm('是否确认退出？', {
            icon: 3,
            title: '提示'
        }, function (index) {
            // 删除 token 退回到 登录界面
            localStorage.removeItem('token')
            location.href = '/Event_code/login.html'

            // 关闭 confim 确认框
            layer.close(index);
        });
    })
})