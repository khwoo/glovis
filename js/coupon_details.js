var vm = new Vue ({
    el:".container",
    data: {
        navTitle: '쿠폰상세',
        couponDisable: false,
        couponUsed: true,
        usedDate: '2018-04-09 15:00',
        usedPlace: '플라자CC용인',
        expiryDate: '2018-04-09',
        trxNo : '',
        productImg: '',
        brandName: 'Brand name',
        productName: 'Product name\n' +
        '상품명이 2줄일수 있겠죠?',
        useDate: '2018.12.31',
        couponNumber: 'code',
        brdId : '',
        noticeList: [],
        stampMethod : false ,
        coupon_details_move : 'javascript:void(0);',
        loading_type : false,
        ticketUseCd : "1" ,
        stampUse : true ,
        coupon_type : true , // 쿠폰 구분  true 포인트 false 할인
        coupon_use_type_stamp   : false ,
        coupon_use_type_barcode : false ,
        coupon_use_type_pinNo   : false ,
        coupon_use_type_pinNo_text : '' ,
        coupon_box_url : ''
        ,popdata : {

            alertOption : false
            ,alertTitle : ''
            ,alertContent : ''
            ,alertStyle : ''

        }

    },
    created:function(){

        var that = this;

        that.$utils_link( that );

    },
    mounted: function() {
        var that =this;
        that.$utils_location_params(that);

        that.coupon_box_url = [
            'coupon_box.html'
            ,'?'
            ,'custNo=' + that.key_custNo
            ,'&'
            ,'uid=' + that.key_uid
        ].join('');

        //

        that.loading_type = true;

        that.couponInfo(function( res){


            console.log(res.stCd);

            console.log([
                '사용 구분 : ' + res.ticketUseCd
                ,' [1] 스탬프 : ' + that.coupon_use_type_stamp
                ,' [2] 바코드 : ' + that.coupon_use_type_barcode
                ,' [3] 핀번호 : ' + that.coupon_use_type_pinNo
            ].join('\n'));

            //사용 방식
            if( that.coupon_use_type_stamp ){

                //발급 상태
                if( res.stCd == '1' ){

                    that.$utils_echoss_init( that ,function( res ){
                        that.$utils_echoss_onStamp( function( res ){
                            //쿠폰 사용
                            that.coupon_use(res);
                        },function(code , msg ){
                            that.$utils_popup(that,true,'',msg);
                        });

                        //otp
                        that.$utils_setOtp( that,  function(){

                            that.couponDisable = true;
                            that.couponUsed = true;

                            that.loading_type = false;

                            that.couponInfo(function(){},function(){});

                        },function( code , msg ){
                            //otp error
                            that.$utils_popup(that,true,'', msg );

                        });

                        ///////////// OTP /////////////

                        that.loading_type = false;

                    },function( code , msg  ){
                        that.loading_type = false;
                        that.$utils_popup( that, true , '' , msg );
                    });

                }else{

                    //사용 완료 .
                    that.loading_type = false;
                }

            }else{

                that.loading_type = false;

            }

        },function( code, msg ){
            that.loading_type = false;

        });




    },

    methods: {

        /*
        *
        * 스탬프 쿠폰 사용
        *
        * */
        coupon_use : function( data ){

            var that = this;

            if(that.couponDisable){

                return;

            }

            var param = {};

            param.custNo = that.key_custNo;
            param.ticketNo = that.key_ticketNo;
            param.eq = data.equipTyp;
            param.s = data.s;
            param.p = data.p;
            param.c = data.c;
            param.version = data.version;
            param.brand = that.brdId;
            param.useGbnCd = '1';

            BM.TICKET_USE( param , function( res ){

                stopStampAnimation();

                that.couponDisable = true;
                that.couponUsed = true;

                that.usedDate = [
                    res.useDt.substr(0,4)
                    ,'-'
                    ,res.useDt.substr( 4 , 2 )
                    ,'-'
                    ,res.useDt.substr( 6 , 2 )
                    ,' '
                    ,res.useTm.substr( 0 , 2 )
                    ,':'
                    ,res.useTm.substr( 2 , 2 )
                ].join('');

                that.usedPlace = res.useCtnt;

                that.coupon_use_type_pinNo_text = '쿠폰번호 : ' + that.couponNumber;


                //////////////////////////////////////////////////

                    try {
                        echoss.Icon.hideIcon();
                    }catch(e){
                        console.log(e);
                    }

                    try {
                        that.$utils_echoss_onStampRemove();
                    }catch(e){
                        console.log(e);
                    }

                    try{
                        echoss.Icon.enableStampingErrorMsg(false);
                    }catch(e){
                        console.log(e);
                    }

                //////////////////////////////////////////////////

            },function( code , msg ){

                stopStampAnimation();

                that.$utils_popup(that,true,'' , msg);

            });

        }

        /*
        *
        * 핀번호 쿠폰 사용
        *
        *
        * */
        ,coupon_pinNo_use : function( data ){

            var that = this;

            if(that.couponDisable){

                return;

            }

            var param = {};

            param.custNo = that.key_custNo;
            param.ticketNo = that.key_ticketNo;
            param.brand = that.brdId;
            param.useGbnCd = '4';
            that.loading_type = true;

            BM.TICKET_USE( param , function( res ){

                that.couponDisable = true;
                that.couponUsed = true;
                that.loading_type = false;

                that.usedDate = [
                    res.useDt.substr(0,4)
                    ,'-'
                    ,res.useDt.substr( 4 , 2 )
                    ,'-'
                    ,res.useDt.substr( 6 , 2 )
                    ,' '
                    ,res.useTm.substr( 0 , 2 )
                    ,':'
                    ,res.useTm.substr( 2 , 2 )
                ].join('');

                that.usedPlace = res.useCtnt;

                that.coupon_use_type_pinNo_text = '쿠폰번호 : ' + that.couponNumber;

                //////////////////////////////////////////////////

                try {
                    echoss.Icon.hideIcon();
                }catch(e){
                    console.log(e);
                }

                try {
                    that.$utils_echoss_onStampRemove();
                }catch(e){
                    console.log(e);
                }

                try{
                    echoss.Icon.enableStampingErrorMsg(false);
                }catch(e){
                    console.log(e);
                }

                //////////////////////////////////////////////////


            },function( code , msg ){

                that.loading_type = false;
                that.$utils_popup(that,true,'' , msg);

            });

        }

        /*
        *
        * 할인 쿠폰 사용
        *
        *
        * */
        ,discount_coupon_use : function( data ){

            var that = this;

            if(that.couponDisable){

                return;

            }

            var param = {};

            param.custNo = that.key_custNo;
            param.ticketNo = that.key_ticketNo;
            param.brand = that.brdId;
            param.useGbnCd = '5';

            that.loading_type = true;

            BM.TICKET_USE( param , function( res ){

                that.couponDisable = true;
                that.couponUsed = true;
                that.loading_type = false;
                that.coupon_type = true; // 할인 쿠폰

                that.usedDate = [
                    res.useDt.substr(0,4)
                    ,'-'
                    ,res.useDt.substr( 4 , 2 )
                    ,'-'
                    ,res.useDt.substr( 6 , 2 )
                    ,' '
                    ,res.useTm.substr( 0 , 2 )
                    ,':'
                    ,res.useTm.substr( 2 , 2 )
                ].join('');

                that.usedPlace = res.useCtnt;

                that.coupon_use_type_pinNo_text = '쿠폰번호 : ' + that.couponNumber;

                //////////////////////////////////////////////////

                try {
                    echoss.Icon.hideIcon();
                }catch(e){
                    console.log(e);
                }

                try {
                    that.$utils_echoss_onStampRemove();
                }catch(e){
                    console.log(e);
                }

                try{
                    echoss.Icon.enableStampingErrorMsg(false);
                }catch(e){
                    console.log(e);
                }

                //////////////////////////////////////////////////


            },function( code , msg ){

                that.loading_type = false;
                that.$utils_popup(that,true,'' , msg);

            });

        }

        ,couponInfo: function( callbackSuccess , callbackFail ){

            var that = this;

            var param = {};

            param.ticketNo = that.key_ticketNo;
            BM.TICKET_INFO( param , function( res ){

                console.log(res);
                that.productImg = res.ticketDtlImgUrl;
                that.brandName = res.brdNm;
                that.productName = res.ticketGoodsNm;
                that.brdId = res.brdId;
                that.trxNo = res.trxNo;

                if( res.expiDt.length == 2 ) {
                    if( res.expiDt.indexOf("일") >= 0 )
                        that.useDate = "구매일로부터 " + res.expiDt.substr(0,1) + "일까지 이용가능";
                    else if( res.expiDt.indexOf("월") >= 0 )
                        that.useDate = "구매일로부터 " + res.expiDt.substr(0,1) + "개월까지 이용가능";
                }
                else if( res.expiDt.length == 3 ) {
                    if( res.expiDt.indexOf("일") >= 0 )
                        that.useDate = "구매일로부터 " + res.expiDt.substr(0,2) + "일까지 이용가능";
                    else if( res.expiDt.indexOf("월") >= 0 )
                        that.useDate = "구매일로부터 " + res.expiDt.substr(0,2) + "개월까지 이용가능";
                }
                else if( res.expiDt.length == 8 ) {
                    that.useDate = that.$utils_date( res.expiDt , '년' , '월 ' , '일까지 이용가능' );
                }
                else {
                    that.useDate = "이용기간 제한없음";
                }

                that.couponNumber = res.pinNo.trim();

                that.noticeList.push({
                    noticeTitle : '상품안내'
                    ,productNotice : res.goodsDesc.replace(/\r\n/gi, "<br/>")
                });

                that.noticeList.push({
                    noticeTitle : '사용안내'
                    ,productNotice : res.useDesc.replace(/\r\n/gi, "<br/>")
                });

                that.noticeList.push({
                    noticeTitle : '가맹점 정보'
                    // ,productNotice : [
                    //     '주소 : ' + res.brdAddr
                    //     ,'</br>'
                    //     ,'전화번호 : ' + res.brdTelNo
                    //     ,'</br>'
                    //     ,'</br>'
                    //     ,'가맹점 설명 : </br>' + res.brdDesc.replace(/\r\n/gi, "<br/>")
                    // ].join('')
                    ,productNotice : [
                        res.brdDesc.replace(/\r\n/gi, "<br/>")
                    ].join('')
                    //"주소 :" + res.brdAddr
                });

                console.log(res.brdDesc);
                //쿠폰 상테
                that.couponDisable   = false;
                that.couponUsed          = false;

                    var _useCd = res.ticketUseCd.split(',');

                    for (var i = 0; i < _useCd.length; i++) {

                        switch (_useCd[i]) {

                            case "1":

                                that.coupon_use_type_stamp = true;

                                break;
                            case "2":

                                that.coupon_use_type_barcode = true;

                                break;
                            case "3":

                                that.coupon_use_type_pinNo = true;
                                that.coupon_use_type_pinNo_text = '쿠폰번호 확인을 위해 본 버튼을 클릭해 주세요.';
                                break;
                            case "4":

                                that.coupon_type = false;

                                break;

                        }

                    }


                if( res.stCd === '2' || res.stCd === '8' ){
                    if( res.stCd === '2' ){

                        that.couponUsed  = true;

                        that.usedDate = [
                            res.useDt.substr(0,4)
                            ,'-'
                            ,res.useDt.substr( 4 , 2 )
                            ,'-'
                            ,res.useDt.substr( 6 , 2 )
                            ,' '
                            ,res.useTm.substr( 0 , 2 )
                            ,':'
                            ,res.useTm.substr( 2 , 2 )
                        ].join('');

                        that.usedPlace = res.useCtnt;

                    }
                    if( res.stCd === '8' ){

                        that.couponUsed  = false;
                        that.expiryDate = that.useDate;

                    }
                    that.couponDisable = true;


                    that.coupon_use_type_pinNo_text = '쿠폰번호 : ' + that.couponNumber;
                    that.coupon_type = true;
                }

                //스탬프 , 박코드
                //ticketUseCd

                // coupon_use_type_stamp   : false
                // coupon_use_type_barcode : false
                // coupon_use_type_pinNo   : false

                //res.ticketUseCd = '4,1,2';

                // var _useCd = res.ticketUseCd.split(',');
                // var _val = 0;
                // for(var i = 0 ; i< _useCd.length;i++){
                //     if(_useCd[i] == '1' || _useCd[i] =='2' ){
                //         _val += 1;
                //         that.ticketUseCd = _useCd[i];
                //     }
                // }
                // if(_val >= 2){
                //     that.ticketUseCd = '9';
                // }

            return callbackSuccess(res);

            },function( code , msg ){
                that.$utils_popup(that,true, '' , msg );
                return callbackFail(code , msg );
            });

        }

    }
});

