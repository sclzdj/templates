$(function () {
    //上传全局配置
    var server_upload_image_url = "http://dt5.dj/index/upload";//上传地址
    var server_img_host = "http://dt5.dj/";//图片显示前缀域名，上传成功后返回的是完整图片地址就留空


    // 图片上传初始化Web Uploader
    var uploader_image = [];
    for (var index = 0; index < $('.js-upload-image').length; index++) {
        var upload_type = $('.js-upload-image:eq(' + index + ')').attr('upload-type');
        uploader_image[index] = WebUploader.create({
            swf: './static/libs/webuploader/Uploader.swf',// swf文件路径
            server: server_upload_image_url,// 文件接收服务端
            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
            pick: {
                id: '.js-upload-image:eq(' + index + ') .filePicker', // 选择文件的按钮。可选。
                multiple: upload_type == 'images' ? true : false // 是否多选
            },
            // 只允许选择图片文件。
            accept: {
                title: upload_type, //指定接受哪些类型的文件
                extensions: 'gif,jpg,jpeg,bmp,png', //允许的文件后缀，不带点，多个用逗号分割
                mimeTypes: 'image/*' //文件mime类型
            },
            //附带参数
            formData: {},
            auto: true, // 选完文件后，是否自动上传
            fileVal: 'file', //设置文件上传域的name
            method: 'POST', //文件上传方式
            fileNumLimit: undefined, //验证文件总数量, 超出则不允许加入队列，默认undefined
            fileSizeLimit: undefined, //验证文件总大小是否超出限制, 超出则不允许加入队列，默认undefined
            fileSingleSizeLimit: undefined, //验证单个文件大小是否超出限制, 超出则不允许加入队列，默认undefined
            duplicate: true //为true允许重复上传同张图片
        });
        //标记这是第几个图片上传
        uploader_image[index].index = index;
        //记录上传文件
        uploader_image[index].files = [];
        if (upload_type == 'images') {
            //标记上传表单名称
            uploader_image[index].inputName = $('.js-upload-image:eq(' + index + ')').attr('input-name');
        }
        //标记上传类型
        uploader_image[index].upload_type = upload_type;
        // 当开始上传流程时触发
        uploader_image[index].on('startUpload', function () {
            Dolphin.loading();
        });
        // 当有文件添加进来的时候
        uploader_image[index].on('fileQueued', function (file) {
            var $li = $(
                '<div id="' + file.id + '" class="file-item js-gallery thumbnail" style="margin:0;margin-right: 10px; margin-bottom: 5px;">' +
                '<img>' +
                '<div class="info">' + file.name + '</div>' +
                '</div>'
                ),
                $img = $li.find('img');
            // $list为容器jQuery实例
            if (this.upload_type == 'images') {
                $('.js-upload-image:eq(' + this.index + ') .uploader-list').append($li);
            } else {
                $('.js-upload-image:eq(' + this.index + ') .uploader-list').empty();
                $('.js-upload-image:eq(' + this.index + ') .uploader-list').html($li);
            }
            //记录上传文件
            uploader_image[this.index].files[file.id] = file;
            // 创建缩略图
            // 如果为非图片文件，可以不用调用此方法。
            // thumbnailWidth x thumbnailHeight 为 100 x 100
            var thumbnailWidth = 100,
                thumbnailHeight = 100;
            uploader_image[this.index].makeThumb(file, function (error, src) {
                if (error) {
                    $img.replaceWith('<span>不能预览</span>');
                    return;
                }
                $img.prop('src', src);
            }, thumbnailWidth, thumbnailHeight);
        });
        // 文件上传过程中创建进度条实时显示。
        uploader_image[index].on('uploadProgress', function (file, percentage) {
            var $li = $('#' + file.id),
                $percent = $li.find('.progress span');
            // 避免重复创建
            if (!$percent.length) {
                $percent = $('<p class="progress"><span></span></p>')
                    .appendTo($li)
                    .find('span');
            }
            $percent.css('width', percentage * 100 + '%');
        });
        // 文件上传成功，给item添加成功class, 用样式标记上传成功。
        uploader_image[index].on('uploadSuccess', function (file, response) {
            if (response.status_code < 200 || response.status_code >= 300) {
                var $li = $('#' + file.id),
                    $error = $li.find('div.error'),
                    $retry = $li.find('div.retry');
                // 避免重复创建
                if (!$error.length) {
                    $error = $('<div class="error"></div>').appendTo($li);
                }
                if (!$retry.length) {
                    $retry = $('<div class="retry"></div>').appendTo($li);
                }
                $error.text(response.message);
                $retry.html('<a href="javascript:void(0);" uploader-index="' + this.index + '" file-id="' + file.id + '" class="uploader-retry text-primary">重试上传</a>');
            } else {
                $('#' + file.id).addClass('upload-state-done');
                //图片查看器赋值
                $('#' + file.id).find('img').attr('data-original', server_img_host + response.data.path);
                //viewer更新加载
                $('.gallery-list,.uploader-list').each(function () {
                    $(this).viewer('update');
                    $(this).viewer('destroy');
                    $(this).viewer({url: 'data-original'});
                });
                if (this.upload_type == 'images') {
                    //将上传的文件地址赋值给隐藏输入框，并添加元素
                    $('#' + file.id).append('<input type="hidden" name="' + this.inputName + '[]" value="' + server_img_host + response.data.path + '">');
                } else {
                    //将上传的文件地址赋值给隐藏输入框
                    $('#' + file.id).parent().parent().find('input[type="hidden"]').val(server_img_host + response.data.path);
                }
                //成功提示
                var $li = $('#' + file.id),
                    $success = $li.find('div.success');
                // 避免重复创建
                if (!$success.length) {
                    $success = $('<div class="success"></div>').appendTo($li);
                }
                $success.text('上传成功');
                //删除原有提示
                $li.find('div.error,div.retry').remove();
            }
        });
        // 文件上传失败，显示上传出错
        uploader_image[index].on('uploadError', function (file, reason) {
            var $li = $('#' + file.id),
                $error = $li.find('div.error'),
                $retry = $li.find('div.retry');
            // 避免重复创建
            if (!$error.length) {
                $error = $('<div class="error"></div>').appendTo($li);
            }
            if (!$retry.length) {
                $retry = $('<div class="retry"></div>').appendTo($li);
            }
            $error.text('上传失败');
            $retry.html('<a href="javascript:void(0);"  uploader-index="' + this.index + '" file-id="' + file.id + '" class="uploader-retry text-primary">重试上传</a>');
        });
        // 完成上传完了，成功或者失败，先删除进度条
        uploader_image[index].on('uploadComplete', function (file) {
            $('#' + file.id).find('.progress').remove();
            //添加删除按钮
            $('#' + file.id).append('<i class="fa fa-times-circle remove-picture" uploader-index="' + this.index + '" file-id="' + file.id + '"></i>');
            if (this.upload_type == 'images') {
                //添加拖拽按钮
                $('#' + file.id).append('<i class="fa fa-fw fa-arrows move-picture"></i>');
            }
        });
        // 当所有文件上传结束时触发
        uploader_image[index].on('uploadFinished', function () {
            Dolphin.loading('hide')
        });
    }


    //移除图片
    $(document).on('click', '.remove-picture', function () {
        //单图上传时需重置表单值
        $(this).parent().parent().parent().find('input[type="hidden"]').val('');
        //移除元素
        $(this).parent().remove();
        //移除队列中的对应图片
        var index = $(this).attr('uploader-index');
        var fileId = $(this).attr('file-id');
        uploader_image[index].removeFile(uploader_image[index].files[fileId], true);
        //viewer更新加载
        $('.gallery-list,.uploader-list').each(function () {
            $(this).viewer('update');
            $(this).viewer('destroy');
            $(this).viewer({url: 'data-original'});
        });
    });

    //重试上传
    $(document).on('click', '.uploader-retry', function () {
        var index = $(this).attr('uploader-index');
        var fileId = $(this).attr('file-id');
        uploader_image[index].retry(uploader_image[index].files[fileId]);
    });


    //多图上传拖拽排序
    $('.ui-sortable').sortable({
        placeholder: "ui-sortable-images-state-highlight",
        handle: ".move-picture"
    });
    $(".ui-sortable").disableSelection();
});
