/*

LICENSE

https://github.com/jed/rndr.me

(The MIT License)

Copyright (c) 2013 Jed Schmidt <where@jed.is>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

*/

var system    = require("system")
var webserver = require("webserver")
var webpage   = require("webpage")

var config = {}
config.port = 8001
config.readyEvent = 'renderReady'
config.maxTime = 30000
config.maxBytes = 0x100000
config.loadImages = false


if (!config.port) {
  console.error("No port specified in " + configPath)
  phantom.exit(1)
}

var server    = webserver.create()
var listening = server.listen(config.port, onRequest)

if (!listening) {
  console.error("Could not bind to port " + config.port)
  phantom.exit(1)
}

function onRequest(req, res) {
  var page          = webpage.create()
  var bytesConsumed = 0

  if (req.method != "GET") {
    return send(405, toHTML("Method not accepted."))
  }

  var url = parse(req.url)

  if (url.pathname != "/") {
    return send(404, toHTML("Not found."))
  }

  var query = url.query
  var href  = query.href

  console.log('Req', href)

  if (!href) {
    return send(400, toHTML("`href` parameter is missing."))
  }

  var maxTime    = config.maxTime
  var maxBytes   = config.maxBytes
  var readyEvent = config.readyEvent
  var loadImages = config.loadImages

  page.settings.loadImages = loadImages

  page.onInitialized = function() {
    page.evaluate(onInit, readyEvent)

    function onInit(readyEvent) {
      window.addEventListener(readyEvent, function() {
        setTimeout(window.callPhantom, 0)
      })
    }
  }

  page.onResourceReceived = function(resource) {
    if (resource.bodySize) bytesConsumed += resource.bodySize

    if (bytesConsumed > maxBytes) {
      send(502, toHTML("More than " + maxBytes + "consumed."))
    }
  }

  page.onCallback = function() {
    console.log('Send', href);
    send(200, page.content)
  }

  var timeout = setTimeout(page.onCallback, maxTime)

  page.open(href)

  function send(statusCode, data) {
    clearTimeout(timeout)

    res.statusCode = statusCode

    res.setHeader("Content-Type", "text/html")
    res.setHeader("Content-Length", byteLength(data))
    res.setHeader("X-Rndrme-Bytes-Consumed", bytesConsumed.toString())

    res.write(data)
    res.close()

    page.close()
  }
}

function byteLength(str) {
  return encodeURIComponent(str).match(/%..|./g).length
}

function toHTML(message) {
  return "<!DOCTYPE html><body>" + message + "</body>\n"
}

function parse(url) {
  var anchor = document.createElement("a")

  anchor.href = url
  anchor.query = {}

  anchor.search.slice(1).split("&").forEach(function(pair) {
    pair = pair.split("=").map(decodeURIComponent)
    anchor.query[pair[0]] = pair[1]
  })

  return anchor
}
