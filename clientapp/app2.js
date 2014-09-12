Function.prototype.bind = require('function-bind');

function links (arr) {
    arr = arr.map(function (item) {
        return '<a href="' + item + '">Link to page ' + item + '</a>';
    });
    arr.unshift('<p>');
    arr.push('</p>');
    return arr.join('');
}

var home = links.bind(links, ['/page1', '/page3']);
var page1 = links.bind(links, ['/page2']);
var page2 = links.bind(links, ['/', '/page1']);
var page3 = links.bind(links, ['/', '/page2']);
var View = require('ampersand-view');
var MainView = require('ampersand-main-view');

function PageWithTitle(template) {
    return View.extend({
        template: template
    });
}

var MyMainView = MainView.extend({
    template: '<div><h1>Title</h1><div role="page"></div></div>',
    router: {
        routes: {
            '': 'index',
            'page1': 'page1',
            'page2': 'page2',
            'page3': 'page3'
        },
        index: function () {
            this.triggerPage(PageWithTitle(home));
        },
        page1: function () {
            this.triggerPage(PageWithTitle(page1));
        },
        page2: function () {
            this.triggerPage(PageWithTitle(page2));
        },
        page3: function () {
            this.triggerPage(PageWithTitle(page3));
        }
    },
    updatePage: function () {
        MainView.prototype.updatePage.apply(this, arguments);
        setTimeout(function () {
            var readyEvent = document.createEvent("Event");
            readyEvent.initEvent("renderReady", true, true);
            window.dispatchEvent(readyEvent);
        }, 2000);
    }
});

$(function () {
    new MyMainView();
});

