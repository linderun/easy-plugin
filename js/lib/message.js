/**
 * Message
 * Message.success('成功')
 */
var Message = {
    'warning': function (msg, speed, existTime) {
        var options = {
            msg: msg,
            speed: speed || 300,
            existTime: existTime || 8000,
            className: "easy-alert-warning",
            title: "系统信息："
        };
        this.show(options);
    },

    'success': function (msg, speed, existTime) {
        var options = {
            msg: msg,
            speed: speed || 300,
            existTime: existTime || 8000,
            className: "easy-alert-success",
            title: "温馨提示："
        };
        this.show(options);
    },

    'error': function (msg, speed, existTime) {
        var options = {
            msg: msg,
            speed: speed || 300,
            existTime: existTime || 10000,
            className: "easy-alert-danger",
            title: "错误提示："
        };
        this.show(options);
    },

    'danger': function (msg, speed, existTime) {
        var options = {
            msg: msg,
            speed: speed || 300,
            existTime: existTime || 10000,
            className: "easy-alert-danger",
            title: "警告信息："
        };
        this.show(options);
    },

    'show': function (options) {
        var div = $('<div class="easy-alert ' + options.className + '" role="alert" >'
            + options.title + options.msg
            + '<span class="easy-close" data-dismiss="alert">×</span>'
            + '</div>');
        div.find('.easy-close').click(function () {
            div.toggle(options.speed);
            div.remove();
        });

        $('body').append(div);
        div.show(options.speed);

        //隐藏对象
        setTimeout(function () {
            div.toggle(options.speed);
        }, options.existTime);
        //移除对象
        setTimeout(function () {
            div.remove();
        }, options.existTime + 5000);
    }
};