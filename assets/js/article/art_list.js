$(function () {
    // 定义一个查询的参数对象，请求数据时，需要提交给服务器
    const q = {
        pagenum: 1, // 页码值，默认请求  第一页的数据
        pagesize: 2, // 每页显示几条数据
        cate_id: '', // 文章分类的 id
        state: '' // 文章的发布状态
    }

    const form = layui.form

    // 调用 initTable 获取文章列表数据
    initTable()

    // 定义 initTable 函数
    function initTable() {
        $.ajax({
            type: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message)
                // 使用模板引擎渲染表格
                const htmlStr = template('myTemp', res)
                $('tbody').html(htmlStr)
                // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }

    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())
        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 调用 initCate 获取文章列表数据
    initCate()

    // 定义 initCate 函数
    function initCate() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) return layer.msg('获取文章列表失败！')
                // 获取文章列表成功，调用 template 渲染到下拉框里面
                const optionsStr = template('tem-cate', res)
                $('#cate_select').html(optionsStr)
                // 通过 layui 重新渲染表单区域的UI结构
                form.render()
            }
        })
    }

    // 实现筛选功能
    // 给 form 表单注册submit 事件
    $('#form-select').on('submit', function (e) {
        // 阻止表单默认跳转行为
        e.preventDefault()
        // 获取表单的数据
        const cate_id = $('[name=cate_id]').val()
        const state = $('[name=state]').val()
        // 为查询参数对象 q 中u对应的属性赋值
        q.cate_id = cate_id
        q.state = state

        // 扩展运算符
        // const formObj = form.val('formFilter')
        // inputParams = {
        //     ...q,
        //     ...formObj
        // }
        // 重新渲染表格
        initTable()
    })

    // 定义渲染分页的方法，接收一个总数量的参数
    function renderPage(total) {
        // 调用 laypage.render() 方法来渲染分页的结构
        layui.laypage.render({
            elem: 'pageBox', // 分页容器的 Id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10], // 每页展示多少条
            // 分页发生切换的时候，触发 jump 回调
            jump: function (obj, first) {
                // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
                // 如果 first 的值为 true，证明是方式2触发的
                // 否则就是方式1触发的
                // 把最新的页码值，赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr
                // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
                q.pagesize = obj.limit
                // 根据最新的 q 获取对应的数据列表，并渲染表格
                if (!first) {
                    initTable()
                }
            }
        })
    }

    // 删除功能
    // 给 btnDelete 删除按钮注册事件委托
    $('tbody').on('click', '.btnDelete', function () {
        // 获取页面中 #btnDelete 按钮的个数
        let btnNum = $('.btnDelete').length

        const id = $(this).attr('data-id')
        // 调用 layer.confirm() 调出确认框
        layer.confirm('是否确认删除?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            // 点击确定的回调函数
            // 发起 ajax 请求删除数据
            $.ajax({
                type: 'GET',
                url: `/my/article/delete/${id}`,
                success: function (res) {
                    const {
                        status,
                        message
                    } = res
                    if (status !== 0) return layer.msg(message)
                    layer.msg(message)
                    // 删除成功，调用 initTable 重新渲染文章分类
                    // 判断 删除按钮个数是否为1
                    if (btnNum === 1) {
                        // btnNum 最小为1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index);
        });
    })

    // 编辑文章功能
    // 1. 给 btnEdit 按钮注册点击事件委托
    let index
    $('tbody').on('click', '#btnEdit', function () {
        // 2. 调用 layer.open 方法调出弹出层
        index = layer.open({
            type: 1,
            title: '修改文章',
            area: ['500px', '350px'],
            content: $('#contentEdit').html()
        })
        // 2. 发起 ajax 请求数据，渲染弹出层的表单
        const id = $(this).attr('data-id')
        $.ajax({
            type: 'GET',
            url: `/my/article/getArticle/${id}`,
            data: {
                id
            },
            success: function (res) {
                const {
                    status,
                    message,
                    data
                } = res
                if (status !== 0) return layer.msg(message)
                // 调用 form.val() 方法将数据渲染到弹出框的表单里 
                form.val('editForm', data)
            }
        })
    })

    // 3. 给确定按钮注册事件委托点击事件，更新文章数据
    $('body').on('submit', '#contentEditForm', function (e) {
        // 阻止默认提交行为
        e.preventDefault()
        // 获取表单数据
        // let data = form.val('editForm')
        // delete data.cate_name

        // form.serialize() 方法
        // 有 disabled 属性 的表单， serialize() 不会获取到相应的 value 值
        let data = $(this).serialize()

        // 发起 ajax 请求，更新文章数据
        $.ajax({
            type: 'POST',
            url: '/my/article/update',
            data,
            success: function (res) {
                const {
                    status,
                    message
                } = res
                if (status !== 0) return layer.msg(message)
                layer.msg(message)
                // 更新成功，调用 initTable 重新渲染文章列表
                initTable()
                // 关闭对应弹出层
                layer.close(index)
            }
        })

    })
})