/**
 * app
 */
var App = {
    // 初始化
    init: function () {
        if (!this.checkUrl()) {
            return false;
        }

        this.initMenu();

        this.onMessageAddListener();
    },

    // 销毁
    restore: function () {
        this.sendMessageToBackground('removeMenu', function (response) {
            console.info('removeMenu:', response);
        });
    },

    // 检查当前链接是否满足加载插件
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

    initMenu: function () {
        switch (this.currentPlatform) {
            case 'aliexpress':
                if (this.currentUrl.indexOf('aliexpress.com/item/') !== -1 || this.currentUrl.indexOf('store/product') !== -1 || this.currentUrl.indexOf('aliexpress.com?spm') !== -1) {
                    this.sendMessageToBackground('createMenu', {'type': 'singleCrawl'}, function (response) {
                        console.info('createMenu:', response);
                    });
                } else if (this.currentUrl.indexOf('www.aliexpress.com/wholesale') !== -1 || this.currentUrl.indexOf('www.aliexpress.com/w/wholesale') !== -1 || this.currentUrl.indexOf('www.aliexpress.com/category') !== -1 || this.currentUrl.indexOf('aliexpress.com/store/') !== -1) {
                    this.sendMessageToBackground('createMenu', {'type': 'searchCrawl'}, function (response) {
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
            if (message.type == 'singleCrawl') {
                Crawl.singleCrawl(message);
            } else if (message.type == 'searchCrawl') {
                Crawl.searchCrawl(message);
            } else {
                console.info('message:', message);
            }
        });
    },

    currentUrl: '',

    currentPlatform: '',
};

// 执行
$(document).ready(function () {
    App.init();

    /*document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            App.restore();
        } else {
            App.init();
        }
        console.log('document.hidden:', document.hidden);
    });*/
});
