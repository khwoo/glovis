
var utils = {};

utils.install = function( Vue ){

    Vue.prototype.$utils_location_params = function( that ){
        var href = location.href;
        var _paramStr = href.split('?')[1];

        console.info( location );

        if(_paramStr == null || _paramStr == "undefined"){

            _paramStr = "_";

        }
        var _paramList = _paramStr.split('&');
        for(var i = 0 ; i < _paramList.length ; i++ ){
            var _str = _paramList[i];
            var _item = _str.split('=');


            if(_item[0] === 'loginUserNo' && _item[1] != '' ){
                that['key_custNo'] = _item[1];
            }

            that['key_' + _item[0] ] = _item[1];
        }

        //블루멤버스 page view
        pageVIewInfo(that);

    }

    Vue.prototype.$utils_offeringPageOpen = function( that ,   FailCallback ){

        try {

            echossTracker.pageOpen(that.key_otkey , function( code , msg ){

                FailCallback( msg );

            });


        }catch(e){

            FailCallback(e);

        }

    }

    Vue.prototype.$utils_link = function( that ){

        var referrer = document.referrer;

        if(that.appLink == null || that.appLink == '' ){

            that.appLink = '';

        }

        if( referrer ){

            that.appLink = "javascript:history.back();";

        }else{

            that.appLink = that.key_scheme + "://echoss/close";

        }

    }

    Vue.prototype.$utils_addPageParam = function( that , url ){

        if( url.indexOf('?') == -1 ){
            url += '?';
        }

        for( var item in that ){
            if(/^key_/.test(item)){
                url += item.replace('key_' , '') +"=" + that[item] +"&";
            }
        }

        if( url.substring( url.length - 1 , url.length ) == '&' ){
            url = url.substring(0 , url.length - 1 );
        }

        return url;

    }

    Vue.prototype.$utils_addDate = function( days ){

        return addDate(days);

    }

    Vue.prototype.$utils_addMonth = function( month ){

        return addMonth(month);

    }

    function addMonth(month){

        if (month == undefined || month == '') {
            month = 0;
        }
        var date = new Date();
        date.setMonth(date.getMonth() + month);
        var month = date.getMonth() + 1;
        var day = date.getDate();
        return date.getFullYear() + '' + getFormatDate(month) + '' + getFormatDate(day);

    }

    function addDate(days) {
        if (days == undefined || days == '') {
            days = 1;
        }
        var date = new Date();
        date.setDate(date.getDate() + days);
        var month = date.getMonth() + 1;
        var day = date.getDate();
        return date.getFullYear() + '' + getFormatDate(month) + '' + getFormatDate(day);
    }

    function getFormatDate(arg) {

        if (arg == undefined || arg == '') {
            return '';
        }

        var re = arg + '';
        if (re.length < 2) {
            re = '0' + re;
        }

        return re;
    }

	Vue.prototype.$utils_buy_limit = function( that ){

		let result = true;

		if(that.custBuyLimitYn == 'Y' ){
			result = false;
		}

		return result;

	}

    Vue.prototype.$utils_buy_limit_bottom = function( that ){

        let result = true;

	    if(that.custBuyLimitYn == 'Y' ){
		    if(that.custGoodsBuyPsbYn == 'N' ){
			    let msg = ['고객 당 구매 가능 개수가 제한된 상품입니다.<br/>'
				    ,'현재 고객님은 구매 가능한 횟수가 초과되어<br/>'
				    ,'더 이상 구매 하실 수 없습니다.'
			    ].join('');
			    that.$utils_popup(that,true,'' , msg );
			    result = false;
		    }
	    }

	    return result;

    }

    Vue.prototype.$utils_pageView = function( that ){

        pageVIewInfo(that);

    }

    //페이지 정보 통계
    function pageVIewInfo( that ){

        var pageNm = location.pathname.substring( location.pathname.lastIndexOf('/') + 1 , location.pathname.length );

        var linkCode = '';

        if(that.key_categoryIdx != undefined ){
            linkCode = that.key_categoryIdx;
        }else if(that.key_productId != undefined ){
            linkCode = that.key_productId;
        }else if(that.key_brandCd != undefined ){
            linkCode = that.key_brandCd;
        }else if(that.key_trxNo != undefined ){
            linkCode = that.key_trxNo;
        }else if(that.key_ticketNo != undefined ){
            linkCode = that.key_ticketNo;
        }

        var params = new Object();
        params.custNo			= that.key_custNo;
        params.linkCd			= linkCode;
        params.pageNm			= pageNm;


        try {
            BM.CONN_PAGE_REG(params, function () { }, function () { });
        }catch(e){}

    }

    //일자 설정
    //년 월 일
    Vue.prototype.$utils_date = function( str , item_1 , item_2 , item_3 ){
        if(item_1 == null || item_1 == 'undefined'){
            item_1 = '-';
        }
        if(item_2 == null || item_2 == 'undefined'){
            item_2 = '-';
        }
        if(item_3 == null || item_3 == 'undefined'){
            item_3 = '';
        }
        var arr = [
            str.substring(0,4)
            ,item_1
            ,str.substring(4,6)
            ,item_2
            ,str.substring(6,8)
            ,item_3
        ].join('');
        return arr;

    }


    Vue.prototype.$utils_echossHttpSend = function(url, params, method, success, failed) {
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
                        success(request.result);
                    }
                    else {
                        failed(request.resCd, request.resMsg, request.result);
                    }
                }
                else {
                    var errorCode = "ES99";
                    var errorMsg = "Please try again.";
                    if (xmlhttp.response !== "" && xmlhttp.response !== undefined && xmlhttp.status !== 404) {
                        var request = JSON.parse(xmlhttp.response);
                        errorCode = request.resCd;
                        errorMsg = request.resMsg;
                    }

                    failed(errorCode, errorMsg);
                }
            }
        }

        xmlhttp.open(method, url, true);

        xmlhttp.setRequestHeader("Content-type", "application/json");
        xmlhttp.setRequestHeader("Accept", "application/json");
        // xmlhttp.setRequestHeader("Accept-Language", esp.LANGUAGE_CODE);
        xmlhttp.setRequestHeader("Accept-Language", "ko");

        xmlhttp.setRequestHeader("Authorization", 'Basic ' + btoa('22cd9435-c1ef-4a1c-a511-791303a5a20f' + ':' + '33663161393164662D303534302D343739332D383562612D356637666264636135643934'));

        xmlhttp.send(JSON.stringify(params));
    }


    Vue.prototype.$utils_history_replaceState = function( param , url  ){

        if(url == null || url == 'undefined' ){

            url = location.href.substring( 0 , location.href.indexOf('?') ) ;

        }

        var paramStr = '';
        for( var key in param ){
            paramStr += key + "=" + param[key] + "&";
        }
        paramStr = paramStr.substring( 0 , paramStr.length - 1 );

        url = url + '?' + paramStr;

        history.replaceState( null , null , url );

    }





    Vue.prototype.$utils_popupForm = function( that , show , title , content  , cancelShow ,  callbackSuccess , callbackFail ){

        if(that.popformdata == null || that.popformdata == 'undefined'){
            that.popformdata = {};
        }
            console.log(that.popformdata);
        if(show == null || show == 'undefined' ){
            that.popformdata.alertOption = false;
        }else{
            that.popformdata.alertOption = show;
        }
        that.popformdata.alertOption = true;
        that.popformdata.alertTitle = title;
        that.popformdata.alertContent = content;
        that.popformdata.alertCall_1 = callbackSuccess;
        if(that.popformdata.cancelShow) {
            that.popformdata.alertCall_2 = callbackFail;
        }
        that.popformdata.cancelShow = cancelShow;

    }

    Vue.prototype.$utils_popup = function( that , show , title , content  ){

        if(that.popdata == null || that.popdata == 'undefined'){
            that.popdata = {};
        }

        if(show == null || show == 'undefined' ){
                that.popdata.alertOption = false;
        }else{
            that.popdata.alertOption = show;
        }
        that.popdata.alertOption = true;
        that.popdata.alertTitle = title;
        that.popdata.alertContent = content;

    }

    Vue.prototype.$utils_popTips = function( that , show , content  ){

        if(that.poptipsdata == null || that.poptipsdata == 'undefined'){
            that.poptipsdata = {};
        }
        if(show == null || show == 'undefined' ){
            that.poptipsdata.alertOption = false;
        }else{
            that.poptipsdata.alertOption = show;
        }
        that.poptipsdata.alertOption = show;
        that.poptipsdata.alertContent = content;

    }

    Vue.prototype.$utils_setOtp = function( that , callbackSuccess , callFail ){

        var _data = [
            '1'
            ,CHANNEL_CODE
            ,that.key_ticketNo
        ].join(',');

        if( location.href.indexOf('point_use') != -1 ){

            _data = [
                '2'
                ,CHANNEL_CODE
                ,that.key_custNo
                ,that.key_brandCd
                ,that.headerPoint
            ].join(',');

        }

        //echoss.Icon.setEchossIconData({
        echoss.Icon.setStampData({
            aprvData    : _data,
            //otpGbn,chCd,custNo,brdId,usePoint
            funcCd      : "SBLTM",
            isuDivCd    : echoss.Icon.OTP_ISSUE_TYPE.COMMON_ETC,
            cntYn       : "N"
        }, function(res) {

            console.log(res);

            echoss.Icon.hideIcon();

            return callbackSuccess();

        }, function(errorCode, errorMessage) {
            return callFail( errorCode , errorMessage );
        });

    }

    //초기화
    Vue.prototype.$utils_echoss_init = function( that, callbackSuccess , callbackFail ){
        var API_KEY = SVC_KEY;

        echoss.initializeSuccess = function() {

            echoss.setLanguageCode(echoss.Common.LANGUAGE_CODE_TYPE.KOREAN);

            echoss.Stamp.init( function(locUseTyp) {
                echoss.Icon.init();
                echoss.Icon.enableStampingErrorMsg(true);

                echoss.Icon.showIcon();

                return callbackSuccess(true);

            }, function(errorCode, errorMsg) {
                return callbackFail( errorCode , errorMsg );
            });
        }

        echoss.initializeFail = function(errorCode, errorMessage) {

            return callbackFail( errorCode , errorMessage );

        }
        echoss.initialize(API_KEY, echoss.REGION_CODE_TYPE.KOREA);
    }

    Vue.prototype.$utils_echoss_onStampRemove = function(){

        echoss.Stamp.onStamp = function(stampParams) {
            return;
        }
        echoss.Stamp.onError = function(errorCode, errorMsg) {
            return;
        };

    }

    Vue.prototype.$utils_echoss_onStamp = function( callbackSuccess , callbackFail ){
        echoss.Stamp.onStamp = function(stampParams) {

            startStampAnimation();
            return callbackSuccess(stampParams);
        }
        echoss.Stamp.onError = function(errorCode, errorMsg) {
            return callbackFail(errorCode , errorMsg);
        };
    }

    /**
    *
    * 블루멤버스 로그인 체크
    *
    */
    Vue.prototype.$utils_blueLoginCheck = function( that ){
	    if( that.key_custNo == null || that.key_custNo == 'undefined' || that.key_custNo == '' ){
		    location.href = 'hyundaimembers://checklogin##' + location.href ;
	    }
    }

    Vue.component('popupform' , {
        template : '<transition name="fade">' +
        '            <div v-if="popformdata.alertOption" class="modal alert">' +
        '                <div class="bg_shadow flex_column_center">' +
        '                    <div class="modal_box flex_column_center">' +
        '                        <p class="title" v-text="popformdata.alertTitle"></p>' +
        '                        <p style="text-align:center;" class="alert_content" v-html="popformdata.alertContent"></p>' +
        '                        <div class="btn_group flex_between">' +
        '                            <a v-if="!popformdata.cancelShow" class="btn_one flex_center" href="javascript:void(0)" @click="fail" style="margin: 0 5px 0 0;">' +
        '                                <p>취소</p>' +
        '                            </a>' +
        '                            <a class="btn_one flex_center" href="javascript:void(0)" @click="success">' +
        '                                <p>확인</p>' +
        '                            </a>' +
        '                        </div>' +
        '                    </div>' +
        '                </div>' +
        '            </div>' +
        '        </transition>'
        ,props: ['popformdata']
        ,methods : {
            success : function(){
                var that = this;
                that.popformdata.alertOption = false;
                return that.popformdata.alertCall_1();
            },

            fail:function(){
                var that = this;
                that.popformdata.alertOption = false;
                return that.popformdata.alertCall_2();
            }
        }
    });


    Vue.component('popup' , {
        template : '<transition name="fade">' +
        '            <div v-if="popdata.alertOption" class="modal alert">' +
        '                <div class="bg_shadow flex_column_center">' +
        '                    <div class="modal_box flex_column_center">' +
        '                        <p class="title" v-text="popdata.alertTitle"></p>' +
        '                        <p style="text-align:center;" class="alert_content" v-html="popdata.alertContent"></p>' +
        '                        <div class="btn_group flex_between">' +
        '                            <a class="btn_one flex_center" href="javascript:void(0)" @click="popdata.alertOption=!popdata.alertOption">' +
        '                                <p>확인</p>' +
        '                            </a>' +
        '                        </div>' +
        '                    </div>' +
        '                </div>' +
        '            </div>' +
        '        </transition>'
        ,props: ['popdata']
    });

    Vue.component('popuptips' , {
        template : '<transition name="fade">' +
        '            <div v-if="poptipsdata.alertOption" class="modal alert">' +
        '                <div class="bg_shadow flex_column_center">' +
        '                    <div class="modal_box flex_column_center" style="padding-bottom: 0;">' +
        '                        <p class="title"></p>' +
        '                        <p style="text-align:center;" class="alert_content" v-html="poptipsdata.alertContent"></p>' +
        '                        <p class="title"></p>' +
        '                    </div>' +
        '                </div>' +
        '            </div>' +
        '        </transition>'
        ,props: ['poptipsdata']
    });

    var VueBarcode = window.VueBarcode;
    Vue.component('barcode', VueBarcode);
    //로드 component
    Vue.component('loading', {
        template: '<div v-show="loading_type" class="loading_parent"><div class="loading_sub"></div></div>'
        ,props :['loading_type']
    })
}
//사용
Vue.use( utils );
