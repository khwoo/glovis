
new Vue({
    el: '.container',
    data: {
        onReady:false,
        wallet_url : 'javascript:void(0)' ,
        bizlist : []
        ,brandUrllist : []
        ,bannerlist : []
        ,coupon_box :''
        ,main_url :''
        ,bannerView_YN : false
        ,loading_type : true
        ,popdata : {

            alertOption : false
            ,alertTitle : ''
            ,alertContent : ''
            ,alertStyle : ''

        }
        ,popformdata : {

            alertOption : false
            ,alertTitle : ''
            ,alertContent : ''
            ,alertStyle : ''
            ,alertCall_1 : null
            ,alertCall_2 : null
            ,cancelShow : true

        }
    },

    created:function(){

        var that = this;

        that.$utils_link( that );

    }
    ,mounted: function() {

        var that = this;

        that.$utils_location_params(that);

        that.echoss_link( function(){

            that.brand_url();

            that.coupon_box = [
                'coupon_box.html'
                ,'?'
                ,'custNo=' + that.key_custNo
                ,'&'
                ,'uid=' + that.key_uid
            ].join('');

            //main.html
            that.main_url = [
                'main.html'
                ,'?'
                ,'custNo=' + that.key_custNo
                ,'&'
                ,'uid=' + that.key_uid
            ].join('');

            that.categorylist();

        });

        this.$nextTick(function() {
            this.onReady = !this.onReady;
        })
    },
    methods: {

        echoss_link : function( callback ){

            var that = this;

            that.$utils_echossHttpSend(PF_URL + "/fcm/gateway/link", {

                uid     : that.key_uid,
                sid     : that.key_uid,
                sto     : 0

            }, "POST", function(result) {

                that.key_custNo = result.user;
                var scheme = result.scheme;

                var historyParam = {};

                historyParam.custNo = that.key_custNo;
                historyParam.uid = that.key_uid;

                that.$utils_history_replaceState( historyParam );

                that.wallet_url = scheme + "://echoss/close";

                return callback();

            }, function(errorCode, errorMessage, result) {
                if(result != undefined) {
                   var scheme = result.scheme;

                    that.wallet_url = scheme + "://echoss/close";
                }

                return callback();

            });

        }
        ,userInfo : function(){

            var that = this;

            var param = {};
            param.custNo = that.key_custNo;
            try {
                BM.REGIST(param, function (res) {

                }, function (code, msg) {

                });
            }catch( e ){

                //error

            }

        }

        ,categorylist : function(){

            var that = this;

            BM.MAIN_CTGR({},function( res ){

                console.log( res);

                var bannerlist = res.bnrList;

                //배너 정보
                if(bannerlist.length > 0 ){
                    that.bannerData( bannerlist );
                }

                var categorylist = new Array();

                for(var i = 0 ; i < res.ctgrList.length ;i++ ){

                    var _item = res.ctgrList[i];

                    var _info = {};

                    _info.categoryCd =  _item.ctgrCd;
                    _info.groupId = _item.ctgrGrpCd;
                    _info.categoryNm = _item.ctgrNm;
                    _info.bizImg = _item.ctgrImg;
                    _info.url = "main.html?custNo="+ that.key_custNo +"&menuIdx="+ _item.ctgrGrpCd +"&categoryIdx="+ _item.ctgrCd +"&uid=" + that.key_uid;

                    categorylist.push( _info );

                }

                that.bizlist = categorylist;

                that.loading_type = false;

            },function( code , msg ){
                that.loading_type = false;
                that.$utils_popup(  that    ,   true    ,   '' ,    msg );

            });

        }
        ,bannerData : function( list ){

            var that = this;


            that.bannerView_YN = true;

            /*
                배너 연결 구분 :
                0-연결없음
                1-상품연결
                2-외부연결
                3-내부연견
             */

            var arr = new Array();

            for(var i = 0 ; i < list.length ;i++ ){

                var _item = list[i];

                var _href = 'javascript:void(0);';

                var _target = '_blank';

                switch(_item.bnrLinkGbn){

                    case "1":

                        //상품연결
                        //

                        if(_item.goodsSalGbn == '1' ){

                            _href = 'details.html'+
                                '?custNo='+ that.key_custNo +''+
                                '&uid=' + that.key_uid + '' +
                                '&productId='+ _item.goodsCd +' ';

                        }

                        if(_item.goodsSalGbn == '2' ){

                            _href = 'discount_details.html'+
                                '?custNo='+ that.key_custNo +''+
                                '&uid=' + that.key_uid + '' +
                                '&productId='+ _item.goodsCd +' ';

                        }

                        break;
                    case "2":

                        //외부연결
                        _href = _item.linkUrl;

                        _target = 'view_window';

                        break;
                    case "3":

                        //내부연결
                        _href = [
                            _item.linkUrl
                            ,'?'
                            ,'custNo=' + that.key_custNo
                            ,'&'
                            ,'uid=' + that.key_uid
                            ,'&'
                            ,'bannerNm=' + _item.bnrNm
                            ,'&'
                            ,'linkUrl=' + encodeURIComponent(_item.linkUrl)
                        ].join('');

                        break;

                }

                _item.href = _href;
                _item.target = _target;

                arr.push( _item );
            }

            that.bannerlist = arr;

            setTimeout(function(){

                new Swiper ('.main_swiper',{
                    autoplay: {
                        delay: 4000
                        ,disableOnInteraction : false
                    },
                    loop: true,
                    pagination: {
                        el: '.main_pagination'
                    }
                });

            },100);

            // "bnrList": [
            //     {
            //         "bnrCd": "B00007",
            //         "bnrLinkGbn": "1",
            //         "bnrNm": "TEST",
            //         "bnrImg": "https://12cm-image.s3.amazonaws.com/pointMall/dev/bnr_20180503204519653.png",
            //         "linkUrl": "",
            //         "goodsCd": "G18050300173"
            //     },
            //     {
            //         "bnrCd": "B00008",
            //         "bnrLinkGbn": "3",
            //         "bnrNm": "TEST11",
            //         "bnrImg": "https://12cm-image.s3.amazonaws.com/pointMall/dev/bnr_20180504102442432.png",
            //         "linkUrl": "http://page-dev.echoss.co.kr/bluemembers/wallet.html",
            //         "goodsCd": ""
            //     },
            //     {
            //         "bnrCd": "B00009",
            //         "bnrLinkGbn": "0",
            //         "bnrNm": "연결없는 배너",
            //         "bnrImg": "https://12cm-image.s3.amazonaws.com/pointMall/dev/bnr_20180504103839683.png",
            //         "linkUrl": "",
            //         "goodsCd": ""
            //     }
            // ]


        }
        ,brand_url : function(){

            var that = this;

            var _url = new Array();


            // 브랜드 1

            _url.push({
                link_url : [
                    'brand/jejuair/wallet_submain_1.html'
                    ,'?'
                    ,'custNo=' + that.key_custNo
                    ,'&'
                    //,'brandCd=V00A012B011'  //상용
                    ,'brandCd=V00A002B301'  //개발
                    ,'&'
                    ,'uid=' + that.key_uid
                ].join('')
                ,image_url : 'images/shop_img_1.png'
            });

            // 브랜드 2

            _url.push({
                link_url : [
                    'brand/googleplay/wallet_submain_2.html'
                    ,'?'
                    ,'custNo=' + that.key_custNo
                    ,'&'
                    //,'brandCd=V00A012B012'  //상용
                    ,'brandCd=V00A002B302'  //개발
                    ,'&'
                    ,'uid=' + that.key_uid
                ].join('')
                ,image_url : 'images/shop_img_2.png'
            });

            // 브랜드 3

            _url.push({
                link_url : [
                    'brand/choiinabooks/wallet_submain_3.html'
                    ,'?'
                    ,'custNo=' + that.key_custNo
                    ,'&'
                    //,'brandCd=V00A012B003'  //상용
                    ,'brandCd=V00A044B001'  //개발
                    ,'&'
                    ,'uid=' + that.key_uid
                ].join('')
                ,image_url : 'images/shop_img_3.png'
            });

            // 브랜드 4

            _url.push({
                link_url : [
                    'brand/plazacc/wallet_submain_4.html'
                    ,'?'
                    ,'custNo=' + that.key_custNo
                    ,'&'
                    //,'brandCd=V00A003B371'  //상용
                    ,'brandCd=V00A044B002'  //개발
                    ,'&'
                    ,'uid=' + that.key_uid
                ].join('')
                ,image_url : 'images/shop_img_4.png'
            });

            that.brandUrllist = _url;


        }
        ,company_url:function(){

            var that = this;

            var _url = [
                'company_info.html'
                ,'?'
                ,'custNo=' + that.key_custNo
                ,'&'
                ,'uid=' + that.key_uid
            ].join('');

            location.href = _url;

        }
        ,devRedirect:function(){

            var that = this;

            var params = {};

            params.custNo = that.key_custNo;

            BM.TEESCANNER_TKN( params, function( res ){

                location.href = res.REDIRECT_URL;

            },function(){

            });

        }

    }

});


