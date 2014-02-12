// follow @HenrikJoreteg and @andyet if you like this ;)
var ls = window.localStorage,
    out = {};

if (ls && (ls.debug === true || ls.debug === "true") && window.console) {
    out = window.console;
} else {
    var methods = "assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),
        l = methods.length,
        fn = function () {};

    while (l--) {
        out[methods[l]] = fn;
    }
}

module.exports = out;
