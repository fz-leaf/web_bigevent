$(function () {
    // 进入页面直接请求数据库数据渲染到表格中
    initArtCateList()

    // 添加类别功能
    // 1. 给 btn 添加点击事件
    // 预先保存 layer.open 的 index 方便关闭
    let indexAdd
    $('#btnAdd').on('click', function () {
        // 2. 调用 layer.open() 方法调出弹出层
        indexAdd = layer.open({
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
                layer.close(indexAdd)
            }
        })
    })
})

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