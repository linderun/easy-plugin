/**
 * app
 */
var App = {
    /**
     * 初始化
     */
    init: function () {
        if (!this.checkUrl()) {
            return false;
        }

        this.createMenu();

        this.onMessageAddListener();
    },

    restore: function () {
        this.sendMessageToBackground('removeMenu', function (response) {
            console.info('removeMenu:', response);
        });
    },

    checkUrl: function () {
        this.currentUrl = location.href;
        var platform = Config.platform();
        for (var i in platform) {
            if (document.domain.indexOf(platform[i]) > -1) {
                this.currentPlatform = platform[i];
                return true;
            }
        }
        return false;
    },

    createMenu: function () {
        switch (this.currentPlatform) {
            case 'aliexpress':
                if (this.currentUrl.indexOf('aliexpress.com/item/') !== -1 || this.currentUrl.indexOf('store/product') !== -1 || this.currentUrl.indexOf('aliexpress.com?spm') !== -1) {
                    this.sendMessageToBackground('createMenu', {'type': 'single'}, function (response) {
                        console.info('createMenu:', response);
                    });
                }
                break;
            case '1688':
                break;
            default:
                console.info('createMenu: platform not found.');
        }
    },

    sendMessageToBackground: function (action, options, callback) {
        chrome.runtime.sendMessage({action: action, data: options}, callback);
    },

    onMessageAddListener: function () {
        chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
            var html = $("html").html();
            var url = message.url;
            var data = {url: url, html: html, type: "rightCrawl"};
            console.info(data);
        });
    },

    currentUrl: '',

    currentPlatform: '',
}


$(document).ready(function () {
    App.init();

    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            App.restore();
        } else {
            App.init();
        }
        console.log('document.hidden:', document.hidden);
    });
});