$(function () {
    let form = layui.form
    // 初始化富文本编辑器
    initEditor()

    // 调用 initcate() 渲染文章类别下拉框的 option
    initcate()

    // 定义 initcate 方法
    function initcate() {
        // 发起 Ajax 请求 请求文章分类列表
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                const {
                    status,
                    message
                } = res
                if (status !== 0) return layer.msg(message)
                // 调用 template 方法, 渲染模板到 select 下拉框
                const htmlStr = template('tem-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 调用 form.resnder() 方法
                form.render()
            }
        })
    }

    // 初始化裁剪区域
    const $image = $('#image')
    const options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    $image.cropper(options)

    // 选择文件
    // 给选择封建按钮 注册点击事件
    $('#btnChooseImage').on('click', function () {
        // 模拟 file 框的点击
        $('#coverFile').click()
    })

    // 将选择的图片设置到裁剪区域中
    // 监听 input#file 的change 事件
    $('#coverFile').on('change', function (e) {
        // 获取文件
        const files = e.target.files
        // 判断是否选择了文件
        if (files.length === 0) return layer.msg('未获取任何文件！')
        // 获取文件的 URL
        let newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 定义 state 的值
    let art_state = '已发布'
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })

    // 给表单绑定提交事件
    $('#formPub').on('submit', function (e) {
        // 阻止表单默认提交行为
        e.preventDefault()
        // 快速创建一个 FormData 对象
        let fd = new FormData($(this)[0])
        // 把 state 值添加到 fd 中
        fd.append('state', art_state)

        // 将文件输出为一个对象，添加到 fd 中
        $image.cropper('getCroppedCanvas', {
            // 创建一个 Canvas 画布
            width: 400,
            height: 280
        }).toBlob(function (blob) {
            // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作
            fd.append('cover_img', blob)
            // 调用 pubArticle() 函数，发起 ajax 请求发布文章

            pubArticle(fd)
        })
    })

    // 定义 pubArticle 方法
    function pubArticle(fd) {
        $.ajax({
            type: 'post',
            url: '/my/article/add',
            data: fd,
            // jQuery 提交 FormData 数据必须配置以下两项
            contentType: false,
            processData: false,
            success: function (res) {
                const {
                    status,
                    message
                } = res
                if (status !== 0) return layer.msg(message)
                layer.msg(message)
                // 发布文章成功后，跳转到文章列表页面
                location.href = '/Event_code/article/art_list.html'
            }
        })
    }
})