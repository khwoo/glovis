Vue.use(scroll);
var vm = new Vue ({
    el:".container",
    data: {
        menuIdx: 0,
        pageNo : 10,	//페이지
        coupon_pageNo:10,
        history_pageNo:10,
        loadValue : 100, //로드 위치
        loadStatus :true,  //로드 상태
        coupon_box_link : 'javascript:history.back();',
        loading_show : true,
        menuList: [
            {
                name: 'My쿠폰'
            },
            {
                name: '이용내역'
            }
        ],

        productList: [],        //유저 쿠폰

        historyList: [],        //이용 내역
        myCouponType : 1 , //
        historyType : 1,
        loading_type : false ,
        wallet_url : ''
        ,popdata : {

            alertOption : false
            ,alertTitle : ''
            ,alertContent : ''
            ,alertStyle : ''

        }
    },
    filters:{
        formatPoint:function(value,unit){
            unit = 'P';
            if(value>0) {
                return parseInt(value).toLocaleString() + unit;
            }else {
                return parseInt(value).toLocaleString() + unit;
            }

        }
    },
    created:function(){

        var that = this;

        that.$utils_link( that );

    },
    mounted: function() {

        var that = this;



        that.$utils_location_params(that);

        //링크 설정
        that.history_link();

        if( that.key_menuIdx != undefined ){

            that.menuIdx = that.key_menuIdx;

        }

        that.$ScrollStart(that, function(){
            //my_coupon
            if(that.menuIdx == 0 ){

                that.my_coupon(true);

            }else{

                //내역
                that.history(true);

            }


        });

        that.wallet_url = [
            'wallet.html'
            ,'?'
            ,'custNo=' + that.key_custNo
            ,'&'
            ,'uid=' + that.key_uid
        ].join('');

        //데이터 조회
        that.coupon_box_data();

    },
    methods: {

        history_link : function(){

            var that = this;

            if(that.key_link != undefined && that.key_link != 'undefined' ){

                switch( that.key_link ){

                    case "gift":

                        that.coupon_box_link = 'javascript:history.go(-2);';

                        break;

                }

            }

        }

        //보관함 메뉴 설정
        ,box_menu : function( e ){

            var that = this;

            var parent = e.target;
            var p = true;
            while( p ){
                if( parent.getAttribute('data-id') != null && parent.getAttribute('data-id') != '' ){
                    p = false;
                }else{
                    parent = parent.parentNode;
                }
            }

            var historyParam = {};

            historyParam.custNo = that.key_custNo;
            historyParam.menuIdx = parent.dataset.id;
            historyParam.uid = that.key_uid;
            that.menuIdx = parent.dataset.id;
            that.$utils_history_replaceState( historyParam );

        }

        //데이터 처리
        ,coupon_box_data : function(){

            var that = this;

            var param = {};

            param.custNo = that.key_custNo;

            that.loading_type = true;

            BM.COUPON_LOCKER( param , function(res){

                console.log(res);
                //isuHisList        //my 쿠폰
                that.my_coupon( false , res.isuHisList );


                //ordHisList        //이용내역
                that.history(false , res.ordHisList);

                that.loading_type = false;

            },function( code , msg ){

                that.loading_type = false;

                that.$utils_popup( that, true , '' , msg );

            });

        }
        //이용내역
        ,history : function( scroll , data ){


            var that = this;

            if(scroll){
                if(that.historyType <= 0){

                    return;

                }
                that.loading_show = false;
                that.loadStatus = false;
                var param = {};
                param.custNo = that.key_custNo;
                param.lastSelNo = that.history_pageNo;

                BM.CUST_ORD_HIS( param , function( res ){

                    console.log(res.ordHisList);

                    that.loadStatus = true;
                    that.loading_show = true;
                    if( res.ordHisList.length > 0 ){

                        that.history_pageNo += 10;
                        that.history_handle( scroll , res.ordHisList);
                    }else{

                        that.historyType = 0;
                    }

                },function(code , msg ){
                    that.loadStatus = true;
                    that.loading_show = true;
                    that.$utils_popup(that,true,'' , msg );

                });

            }else{
                //초기화 처리
                that.historyType = 1; //
                that.history_handle( scroll , data );
            }


        }
        //my 쿠폰
        ,my_coupon : function( scroll , data ){

            var that = this;

            if(scroll){
                if(that.myCouponType <= 0){

                    return;

                }
                that.loading_show = false;
                that.loadStatus = false;
                var param = {};
                param.custNo = that.key_custNo;
                param.lastSelNo = that.coupon_pageNo;

                BM.CUST_ISU_HIS( param , function( res ){

                    console.log(res.isuHisList);

                    that.loadStatus = true;
                    that.loading_show = true;
                    if( res.isuHisList.length > 0 ){

                        that.coupon_pageNo += 10;
                        that.my_coupon_handle( scroll , res.isuHisList);
                    }else{

                        that.myCouponType = 0;
                    }

                },function(code , msg ){
                    that.loadStatus = true;
                    that.loading_show = true;
                    that.$utils_popup(that,true,'' , msg );

                });

            }else{
                //초기화 처리
                that.myCouponType = 1; //
                that.my_coupon_handle( scroll , data );
            }

        }

        //이용내역
        ,history_handle : function( scroll , data ){

            var that = this;

            var couponList = new Array();



            for(var i = 0 ; i < data.length;i++ ){

                var _item = data[i];

                var _history = {};



                if(_item.ordGbn === '3' ){

                    _history.productName = _item.brdNm;

                }else{

                    _history.productName = _item.goodsNm;

                }

                _history.useDate = [
                    _item.ordDt.substr( 0, 4 )
                    ,'. '
                    ,_item.ordDt.substr( 4, 2 )
                    ,'. '
                    ,_item.ordDt.substr( 6, 2 )
                    ,'   '
                    ,_item.ordTm.substr( 0 , 2 )
                    ,':'
                    ,_item.ordTm.substr(2,2)
                ].join('') ;//'2018. 06. 21  21:00';
                _history.usePoint = _item.payAmt;

                var _status = ''; //쿠폰 상테

                // var history_status_details_url = [
                //     'history_status_details.html'
                //     ,'?'
                //     ,'custNo=' + that.key_custNo
                //     ,'&'
                //     ,'trxNo=' + _item.trxNo
                // ].join('');

                var _url = [
                    'history_gift_details.html'
                    ,'?'
                    ,'custNo=' + that.key_custNo
                    ,'&'
                    ,'trxNo=' + _item.trxNo
                    ,'&'
                    ,'uid=' + that.key_uid
                ].join('');

                if( _item.ordStCd === '2' ){
                    switch(_item.ordGbn){
                        case "1":
                            _status = '구매';
                            //history_status_details
                            //_url = history_status_details_url;
                            break;
                        case "2":
                            _status = '선물';
                            //history_gift_details
                            //_url = history_gift_details_url;
                            break;
                        case "3":
                            _status = '현장구매';
                            //history_status_details
                            //_url = history_status_details_url;
                            break;
                    }
                }else if( _item.ordStCd === '9' ){
                    switch(_item.ordGbn){
                        case "1":
                            _status = '구매취소';
                            //history_status_details
                            //_url = history_status_details_url;
                            break;
                        case "2":
                            _status = '선물취소';
                            //history_gift_details
                            //_url = history_gift_details_url;
                            break;
                        case "3":
                            _status = '현장취소';
                            //history_status_details
                            //_url = history_status_details_url;
                            break;
                    }
                }


                _history.status = _status;
                _history.url = _url;

                that.historyList.push(_history);

            }

        }
        //my 쿠폰
        ,my_coupon_handle : function( scroll , data ){

            var that = this;

            var couponList = new Array();

            console.log(data);

            for(var i = 0 ; i < data.length;i++ ){

                var _item = data[i];

                var _coupon = {};

                //if(_item.goodsSalGbn == '1' ){

                    _coupon.productHref = [
                        'coupon_details.html'
                        ,'?'
                        ,'custNo=' + that.key_custNo
                        ,'&'
                        ,'ticketNo=' + _item.ticketNo
                        ,'&'
                        ,'uid=' + that.key_uid
                    ].join('');

               // }

                // if(_item.goodsSalGbn == '2' ){
                //
                //     _coupon.productHref = [
                //         'discount_coupon_details.html'
                //         ,'?'
                //         ,'custNo=' + that.key_custNo
                //         ,'&'
                //         ,'ticketNo=' + _item.ticketNo
                //         ,'&'
                //         ,'uid=' + that.key_uid
                //     ].join('');
                //
                // }



                _coupon.productImg      = _item.goodsImg;
                _coupon.couponDisable   = false;
                _coupon.isPast          = false;

                if( _item.stCd === '2' || _item.stCd === '8' ){

                    //isPast true 기간만료 false 사용완료
                   if( _item.stCd === '2' ){
                       _coupon.isPast  = false;
                    }
                    if( _item.stCd === '8' ){
                        _coupon.isPast  = true;
                    }
                    _coupon.couponDisable = true;

                }

                _coupon.brandName   = _item.brdNm;
                _coupon.productName = _item.ticketGoodsNm;

                if( _item.expiDt.length == 2 ) {
                    if( _item.expiDt.indexOf("일") >= 0 )
                        _coupon.priceAfter = "구매일로부터 " + _item.expiDt.substr(0,1) + "일";
                    else if( _item.expiDt.indexOf("월") >= 0 )
                        _coupon.priceAfter = "구매일로부터 " + _item.expiDt.substr(0,1) + "개월";
                }
                else if( _item.expiDt.length == 3 ) {
                    if( _item.expiDt.indexOf("일") >= 0 )
                        _coupon.priceAfter = "구매일로부터 " + _item.expiDt.substr(0,2) + "일";
                    else if( _item.expiDt.indexOf("월") >= 0 )
                        _coupon.priceAfter = "구매일로부터 " + _item.expiDt.substr(0,2) + "개월";
                }
                else if( _item.expiDt.length == 8 ) {
                    _coupon.priceAfter = "~ " + _item.expiDt.substr(0,4) + "-" + _item.expiDt.substr(4,2) + "-" + _item.expiDt.substr(6,2);
                }
                else {
                    _coupon.priceAfter = "유효기간 없음";
                }

                that.productList.push(_coupon);

            }

        }

    }
});

