setTimeout(function () {
    var readyEvent = document.createEvent("Event");
    readyEvent.initEvent("renderReady", true, true);
    window.dispatchEvent(readyEvent);
}, 5000);
