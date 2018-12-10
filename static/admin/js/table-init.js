var init_table = function() {
    var left_column = '0';
    var right_column = '0';
    var left_width = 0;
    var right_width = 0;
    var table_main = $('#builder-table-main');
    var table_head = $('#builder-table-head').find('table');
    var table_left_head = $('#builder-table-left-head').find('table');
    var table_left_body = $('#builder-table-left-body').find('table');
    var table_right_head = $('#builder-table-right-head').find('table');
    var table_right_body = $('#builder-table-right-body').find('table');
    var table_head_tr_td = table_main.find('tr:first-child td');
    var table_body = $('#builder-table-body');
    var table_body_col  = table_body.find('col');
    var table_body_first_tr_th_len = table_body_col.length;
    var right_column_start = table_body_first_tr_th_len - right_column;
    table_head.width(table_main.width());
    table_left_head.width(table_main.width());
    table_left_body.width(table_main.width());
    table_right_head.width(table_main.width());
    table_right_body.width(table_main.width());
    // 设置表头列宽度
    $.each(table_head_tr_td, function (i, e) {
        if (i < left_column) {
            left_width += $(this).outerWidth();
        }
        if (i >= right_column_start) {
            right_width += $(this).outerWidth();
        }
    });
    /*设置左边固定列*/
    $('#builder-table-left').width(left_width);
    /*设置右侧固定列*/
    $('#builder-table-right').width(right_width);
};
jQuery(window).on('resize load', function () {
    init_table();
});
$(document).ready(function () {
    var builder_table_head = $('#builder-table-head');
    var builder_table_left_body = $('#builder-table-left-body');
    var builder_table_right_body = $('#builder-table-right-body');
    var table_main = $('#builder-table-main');
    var table_body = $('#builder-table-body');
    var table_right = $('#builder-table-right');
    var table_head_col  = builder_table_head.find('col');
    var table_body_col  = table_body.find('col');
    var table_left_head_col  = $('#builder-table-left-head').find('col');
    var table_right_head_col = $('#builder-table-right-head').find('col');
    var table_left_body_col = builder_table_left_body.find('col');
    var table_right_body_col = builder_table_right_body.find('col');
    $('#builder-table-wrapper').css('max-height', ($(window).height() - 380)+'px');
    table_body.css('max-height', $('#builder-table-wrapper').outerHeight() - 50);
    $.each(table_body_col, function (i, e) {
        var width = $(this).attr('width');
        table_head_col.eq(i).attr('width', width);
        table_left_head_col.eq(i).attr('width', width);
        table_left_body_col.eq(i).attr('width', width);
        table_right_head_col.eq(i).attr('width', width);
        table_right_body_col.eq(i).attr('width', width);
    });
    /* 监听滚动事件 */
    table_body.on( 'scroll', function (e) {
        builder_table_head.scrollLeft(this.scrollLeft);
        builder_table_left_body.scrollTop(this.scrollTop);
        builder_table_right_body.scrollTop(this.scrollTop);
    });
    if ($(window).width() > 768 && ($('#builder-table-main tbody').height() > table_body.height())) {
        $('#builder-table-head').css('margin-right', '17px');
        $('#builder-table-right').css('right', '17px');
    } else {
        $('.builder-table-right-header').hide();
        $('#builder-table-left,#builder-table-right').hide();
    }
    if (table_body.width() < $('#builder-table-main').width()) {
        builder_table_left_body.height(table_body.height() - 17);
        builder_table_right_body.height(table_body.height() - 17);
        table_right.height(table_body.height() + 33);
    } else {
        builder_table_left_body.height(table_body.height());
        builder_table_right_body.height(table_body.height());
        table_right.height(table_body.height() + 50);
    }
    /*行高亮*/
    var table_main_tr = table_main.find('tbody tr');
    var table_left_tr = builder_table_left_body.find('tbody tr');
    var table_right_tr = builder_table_right_body.find('tbody tr');
    table_main_tr.hover(function () {
        table_left_tr.eq($(this).index()).addClass('hover');
        table_right_tr.eq($(this).index()).addClass('hover');
    }, function () {
        table_left_tr.eq($(this).index()).removeClass('hover');
        table_right_tr.eq($(this).index()).removeClass('hover');
    });
    table_left_tr.hover(function () {
        table_main_tr.eq($(this).index()).addClass('hover');
        table_right_tr.eq($(this).index()).addClass('hover');
    }, function () {
        table_main_tr.eq($(this).index()).removeClass('hover');
        table_right_tr.eq($(this).index()).removeClass('hover');
    });
    table_right_tr.hover(function () {
        table_main_tr.eq($(this).index()).addClass('hover');
        table_left_tr.eq($(this).index()).addClass('hover');
    }, function () {
        table_main_tr.eq($(this).index()).removeClass('hover');
        table_left_tr.eq($(this).index()).removeClass('hover');
    });
});
