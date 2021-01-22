$(function () {
    console.log( window.parent.document.getElementById("art_cate"));
    var form = layui.form;
    var layer = layui.layer;
    // 获取文章分类
    initCate()
    function initCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 调用模板引擎
                var str = template("tpl-cate", res);
                $("[name=cate_id]").html(str)
                // 调用方法
                form.render()
            }
        });
    }


    // 初始化富文本编辑器
    initEditor()


    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    // 4.选择封面按钮
    $("#btnChooseImage").on("click", function () {
        $("#coverFile").click()
    })


    // 5.获取用户选择的文件
    $("#coverFile").change(function (e) {
        var file = e.target.files[0]
        if (file === undefined) {
            return;
        }
        var newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })


    // 6.设置状态
    var state = "已发布";
    $("#btnSave2").on("click", function () {
        state = "草稿"
    })


    // 7.提交
    $("#form-pub").on("submit", function (e) {
        e.preventDefault();
        var fd = new FormData(this);
        fd.append("state", state)
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作 
                fd.append("cover_img",blob)
                console.log(...fd);
                // 因为这个方法是异步的，所以ajax必须在这里面发布
                publishArticle(fd)
            })
    })

    function publishArticle(fd) {
        $.ajax({
            method: "POST",
            url: "/my/article/add",
            data:fd,
            contentType:false,
            processData:false,
            success: function (res) {
                if(res.status !== 0){
                    return layer.msg(res.message)
                }
                layer.msg("发布文章成功!!!")
                window.parent.document.getElementById("art_cate").click()
            }
        });
    }
})