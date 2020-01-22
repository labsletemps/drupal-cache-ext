"use strict";

var cacheHeaders = {};
var currentTab;

function updateIcon(type) {
    browser.browserAction.setIcon({
        path: `icons/drupal-${type}.png`,
        tabId: currentTab.id
    });
}


function logCacheStatus(details) {
    currentTab = details.tabId;

    cacheHeaders = details.responseHeaders.filter(function(header){
        return header.name.indexOf('cache') >= 0 && header.name.startsWith('x-');
    });

    let cacheHits = cacheHeaders.filter(entry => entry.value === "HIT");
    let cacheMisses = cacheHeaders.filter(entry => entry.value === "MISS");
    let cacheOthers = cacheHeaders.filter(entry => entry.value !== "MISS" && entry.value !== "HIT");

    if (cacheOthers.length > 0) {
        updateIcon('ko');
    }

    if (cacheMisses.length > 0) {
        updateIcon('warn');
    }

    if (cacheHits.length > 0) {
        updateIcon('ok');
    }
}

browser.webRequest.onHeadersReceived.addListener(logCacheStatus, 
    {urls: ["<all_urls>"], types: ["main_frame"]}, ["responseHeaders"]);