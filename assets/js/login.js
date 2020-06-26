$(function () {
    // 一、 实现登录注册的切换
    // 1. 给 去注册 link_reg 注册点击事件
    $('.login-box #link_reg').on('click', function () {
        $('.login-box').hide().next().show()
    }) // 1. 给 去登录 link_login 注册点击事件
    $('.reg-box #link_login').on('click', function () {
        $('.reg-box').hide().prev().show()
    })

    // 二、自定义验证规则
    const form = layui.form

    form.verify({
        // 1. 密码校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须为6到12位，且不能出现空格'],
        // 2. 确认密码校验规则
        repwd: function (value) {
            const pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致'
                
            }
        }
    })
})