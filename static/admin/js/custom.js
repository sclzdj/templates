/*!
* 后台自定义js
*/

$(function () {
    //日期
    $('.search-datepicker').datepicker({
        format: 'yyyy-mm-dd',
        disableTouchKeyboard: true, //开启移动设备不弹出虚拟键盘
        Integer: 1,//每周从星期一开始
        autoclose: true,
        clearBtn: true,
        todayHighlight: true,
        language: 'zh-CN'
    })

})
