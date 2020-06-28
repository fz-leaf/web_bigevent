$(function () {
    // 1. 实现裁剪预览功能
    // 1.1 获取裁剪区域的 DOM 元素
    const $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }
    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 实现图片上传
    // 点击上传按钮，模拟input#file的点击
    $('#btnUploadImage').on('click', function () {
        $('#file').click()
    })

    // 更换裁剪区域图片
    // 给文件选择框绑定 change 事件，选择文件就会触发事件
    $('#file').on('change', function (e) {
        console.log(e.target.files);
        // 获取文件
        let filelist = e.target.files
        if (filelist.length === 0) {
            return layer.msg('请选择图片！')
        }
        // 拿到用户选择的文件
        let file = filelist[0]
        // 将文件转化为路径
        let imgURL = URL.createObjectURL(file)
        // console.log(imgURL); => blob 格式图片
        // 重新初始化裁剪区域
        $image.cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', imgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪路径

        // 将裁剪的图片上传到数据库
        let dataURL = $image.cropper('getCroppedCanvas', {
            // 创建一个 Canvas 画布
            width: 100,
            height: 100
        }).toDataURL('image/png')

        // 发起 Ajax 请求
        $.ajax({
            type: 'post',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if (res.status !== 0) return layer.msg('更换头像失败！')
                layer.msg('更换头象成功！')
                window.parent.getUserInfo()
            }
        })
    })
})