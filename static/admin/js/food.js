$(document).ready(function(){
    // 模块拖拽
    $( "#sortable" ).sortable({
        connectWith: ".connectedSortable"
    }).disableSelection();

    // 保存节点
    $('#save').click(function(){
        Dolphin.loading();
        $.post("{:url('save')}", {menus: $('#menu_list').nestable('serialize')}, function(data) {
            Dolphin.loading('hide');
            if (data.code) {
                $('#save').removeClass('btn-success').addClass('btn-default disabled');
                Dolphin.notify(data.msg, 'success');
            } else {
                Dolphin.notify(data.msg, 'danger');
            }
        });
    });

    // 初始化节点拖拽
    $('#menu_list').nestable({maxDepth:4}).on('change', function(){
        $('#save').removeAttr("disabled").removeClass('btn-default disabled').addClass('btn-success');
    });

    // 隐藏禁用节点
    $('#hide_disable').click(function(){
        $('.dd-disable').hide();
    });

    // 显示禁用节点
    $('#show_disable').click(function(){
        $('.dd-disable').show();
    });

    // 展开所有节点
    $('#expand-all').click(function(){
        $('#menu_list').nestable('expandAll');
    });

    // 收起所有节点
    $('#collapse-all').click(function(){
        $('#menu_list').nestable('collapseAll');
    });

    // 禁用节点
    $('.dd3-content').delegate('.disable', 'click', function(){
        var self     = $(this);
        var ids      = self.data('ids');
        var ajax_url = '{:url("disable", ["table" => "admin_menu"])}';
        Dolphin.loading();
        $.post(ajax_url, {ids:ids}, function(data) {
            Dolphin.loading('hide');
            if (data.code) {
                self.attr('data-original-title', '启用').removeClass('disable').addClass('enable')
                    .children().removeClass('fa-ban').addClass('fa-check-circle-o')
                    .closest('.dd-item')
                    .addClass('dd-disable');
            } else {
                Dolphin.notify(data.msg, 'danger');
            }
        });
        return false;
    });

    // 启用节点
    $('.dd3-content').delegate('.enable', 'click', function(){
        var self     = $(this);
        var ids      = self.data('ids');
        var ajax_url = '{:url("enable", ["table" => "admin_menu"])}';
        Dolphin.loading();
        $.post(ajax_url, {ids:ids}, function(data) {
            Dolphin.loading('hide');
            if (data.code) {
                self.attr('data-original-title', '禁用').removeClass('enable').addClass('disable')
                    .children().removeClass('fa-check-circle-o').addClass('fa-ban')
                    .closest('.dd-item')
                    .removeClass('dd-disable');
            } else {
                Dolphin.notify(data.msg, 'danger');
            }
        });
        return false;
    });
});