chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'createMenu') {
        Menu.createMenu(request.data.type, sendResponse);
    } else if (request.action === 'removeMenu') {
        Menu.removeMenu(sendResponse);
    }
    return true;
});

/**
 * Menu
 */
var Menu = {
    // 创建菜单
    createMenu: function (type, sendResponse) {
        switch (type) {
            case 'singleCrawl':
                chrome.contextMenus.create({
                    id: type,
                    type: 'normal', // 类型，可选：["normal", "checkbox", "radio", "separator"]，默认 normal
                    title: '采集此产品', // 显示的文字，除非为“separator”类型否则此参数必需，如果类型为“selection”，可以使用%s显示选定的文本
                    contexts: ['all'], // 上下文环境，可选：["all", "page", "frame", "selection", "link", "editable", "image", "video", "audio"]，默认page
                    onclick: MenuEvent.singleCrawl // 单击时触发的方法
                });
                sendResponse(type + '-ok');
                break;
            case 'searchCrawl':
                chrome.contextMenus.create({
                    id: type,
                    type: 'normal',
                    title: '采集当前页产品',
                    contexts: ['all'],
                    onclick: MenuEvent.searchCrawl
                });
                sendResponse(type + '-ok');
                break;
            default:
                sendResponse(type + '-none');
        }
    },

    // 移除菜单
    removeMenu: function (sendResponse) {
        chrome.contextMenus.removeAll();
        sendResponse('ok');
    },
};

/**
 * MenuEvent
 */
var MenuEvent = {
    singleCrawl: function (info, tab) {
        chrome.tabs.sendMessage(tab.id, {type: 'singleCrawl', url: info.pageUrl});
    },

    searchCrawl: function (info, tab) {
        chrome.tabs.sendMessage(tab.id, {type: 'searchCrawl', url: info.pageUrl});
    }
};
