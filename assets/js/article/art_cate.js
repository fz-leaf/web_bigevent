$(function () {
    // 进入页面直接请求数据库数据渲染到表格中
    initArtCateList()
    const form = layui.form

    // 一、添加类别功能
    // 1. 给 btn 添加点击事件
    // 预先保存 layer.open 的 index 方便关闭
    let index
    $('#btnAdd').on('click', function () {
        // 2. 调用 layer.open() 方法调出弹出层
        index = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '250px'],
            content: $('#contentAdd').html()
        })
    })
    // 3. 给 添加按钮注册 提交事件
    // 这里 form 表单是动态添加的, 需要注册事件委托
    $('body').on('submit', '#contentAddForm', function (e) {
        // 阻止表单默认提交行为
        e.preventDefault()
        // 发起 ajax 请求
        $.ajax({
            type: 'POST',
            url: '/my/article/addcates',
            data: $('#contentAddForm').serialize(),
            success: function (res) {
                const {
                    status,
                    message
                } = res
                if (status !== 0) return layer.msg(message)
                layer.msg(message)
                // 添加成功，调用 initArtCateList 重新渲染表格文章分类
                initArtCateList()
                // 关闭对应弹出层
                layer.close(index)
            }
        })
    })

    // 二、编辑文章分类功能
    // 1. 给 编辑按钮 注册点击事件(事件委托)
    $('body').on('click', '#btnEdit', function () {
        // 2. 调用 layer.open 方法调出弹出层
        index = layer.open({
            type: 1,
            title: '修改分类',
            area: ['500px', '250px'],
            content: $('#contentEdit').html()
        })
        // 3. 发起 ajax 请求,根据 id 获取数据渲染到弹出层表单里面
        let id = $(this).attr('data-id')
        $.ajax({
            type: 'GET',
            url: `/my/article/cates/${id}`,
            success: function (res) {
                const {
                    status,
                    message,
                    data
                } = res
                if (status !== 0) return layer.msg(message)
                // 调用 form.val() 方法，给表单赋值
                form.val('editForm', data)
                // 更新数据成功，调用 
            }
        })

        // 4. 更新文章分类数据
        $('body').on('submit', '#contentEditForm', function (e) {
            // 阻止表单默认提交行为
            e.preventDefault()
            // 发起 ajax 请求
            $.ajax({
                type: 'POST',
                url: '/my/article/updatecate',
                data: $(this).serialize(),
                success: function (res) {
                    const {
                        status,
                        message
                    } = res
                    if (status !== 0) return layer.msg(message)
                    // 更新数据成功，调用 initArtCateList 重新渲染文章列表
                    initArtCateList()
                    // 关闭对应弹出层
                    layer.close(index)
                }
            })
        })
    })

    // 三、删除文章分类
    // 1. 给 btnDelete 按钮注册点击事件
    $('body').on('click', '#btnDelete', function () {
        id = $(this).attr('data-id')
        // 2. 调用 layer.confirm() 调出确认框
        layer.confirm('是否确认删除?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            // 点击确定的回调函数
            // 发起 ajax 请求删除数据
            $.ajax({
                type: 'GET',
                url: `/my/article/deldetecate/${id}`,
                success: function (res) {
                    const {
                        status,
                        message
                    } = res
                    if (status !== 0) return layer.msg(message)
                    layer.msg(message)
                    // 删除成功，调用 initArtCateList 重新渲染文章分类
                    initArtCateList()
                }
            })
            layer.close(index);
        });
    })

})
// 定义 initArtCateList 函数
function initArtCateList() {
    $.ajax({
        type: 'get',
        url: '/my/article/cates',
        success: function (res) {
            // console.log(res);
            // 调用 template 方法 参数一：id 参数二：对象
            const htmlStr = template('myTemp', res)
            $('tbody').html(htmlStr)
        }
    })
}