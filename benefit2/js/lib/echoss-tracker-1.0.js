//
//  echoss-offering-tracker-1.0.js
//
//  Created by 12CM on 2018. 7. 31.
//  Copyright © 2018년 12CM. All rights reserved.
//

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    }
    else if (typeof exports === 'object') {
        module.exports = factory();
    }
    else {
        root.echossTracker = factory();
    }
} (this, function() {
    var echossTracker = echossTracker || {};
  
    echossTracker.auth = function(key, tel, successFunction, failFunction) {
        if(key == undefined)
            throw "\"key\" parameter at auth function";
  
        if(tel == undefined)
            throw "\"key\" parameter at auth function";
  
        if(successFunction == undefined)
            throw "\"successFunction\" parameter at auth function";
  
        echossHttpSend({
                telNo   : tel
        }, "https://offering-service-dev.echoss.net/api/target/"+key+"/auth", "POST", function(data){
            successFunction(data);
        }, function(errorCode, errorMsg) {
            if( failFunction != undefined )
                failFunction(errorCode, errorMsg);
        });
    };
  
    echossTracker.pageOpen = function(key , failcallback) {
        if(key == undefined)
            throw "\"key\" parameter at pageOpen function";

            echossHttpSend({}, "https://offering-service-dev.echoss.net/api/target/" + key + "/tracking/open", "POST" ,null , failcallback );

    };
  
    echossTracker.couponIssue = function(key) {
        if(key == undefined)
            throw "\"key\" parameter at couponIssue function";
  
        echossHttpSend({}, "https://offering-service-dev.echoss.net/api/target/"+key+"/tracking/issue", "POST");
    };
  
    echossTracker.couponUse = function(key) {
        if(key == undefined)
            throw "\"key\" parameter at couponUse function";
  
        echossHttpSend({}, "https://offering-service-dev.echoss.net/api/target/"+key+"/tracking/use", "POST");
    };
  
    function echossHttpSend(params, url, method, success, failed) {
        var xmlhttp;
        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        }
        else {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        if (params === undefined)
            params = {};

        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState === 4 ) {
                if(xmlhttp.status === 200){
                    var request = JSON.parse(xmlhttp.response);
                    if (request.resCd === "0000") {
                        if( success != undefined )
                            success(request.result);
                    }
                    else {
                        if( failed != undefined )
                            failed(request.resCd, request.resMsg);
                    }
                }
                else {
                    var errorCode = "ES99";
                    var errorMsg = "Please try again.";
                    //if (xmlhttp.response !== "" && xmlhttp.response !== undefined && xmlhttp.status !== 404) {
                    if (xmlhttp.response !== "" && xmlhttp.response !== undefined) {
                        var request = JSON.parse(xmlhttp.response);
                        errorCode = request.resCd;
                        errorMsg = request.resMsg;

                    }

                    if( failed != undefined )
                        failed(errorCode, errorMsg);
                }
            }
        }

        xmlhttp.open(method, url, true);
        xmlhttp.setRequestHeader("Content-type", "application/json");
        xmlhttp.setRequestHeader("Accept", "application/json");

        xmlhttp.send(JSON.stringify(params));
    }

    return echossTracker;
}));

