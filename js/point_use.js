var vm = new Vue({
    el: '.container',
    data: {
        navTitle: '포인트 사용하기',
        myPoint: 0,
        noticeContent: '*이마트24 전 매장에서 사용가능<br/>' +
                        '*1일 2회, 최대 1만점까지 사용가능',
        pointList: [
            {
                usePoint: 1000
            },
            {
                usePoint: 3000
            },
            {
                usePoint: 5000
            },
            {
                usePoint: 10000
            }
        ],

        headerPoint: null,
        usePage: false,

        alertOption: false,
        alertTitle: '',
        alertContent: '',
        wallet_url : '',
        // buySuccess: null,
        buySuccess: true // 임시로 포인트 사용 성공
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
        ,loading_type : false
        ,echoss_onStamp_type : false
        ,stampUse : true ,
    },
    filters:{
        formatMoney:function(value,unit){
            unit = 'P';
            return parseInt(value).toLocaleString() + unit;
        }
    },
    created:function(){

        var that = this;

        that.$utils_link( that );

    },
    mounted: function() {

        var that = this;

        that.$utils_location_params(that);

        that.wallet_url = [
            'wallet.html'
            ,'?'
            ,'custNo=' + that.key_custNo
            ,'&'
            ,'uid=' + that.key_uid
        ].join('');

        that.cust_point_info( function( res ){

                var _cust_point = res;

            that.$utils_echoss_init( that ,function( res ){

                echoss.Icon.enableStampingErrorMsg(false);

                console.log(_cust_point);

                that.myPoint = _cust_point.custPoint;

                that.loading_type = false;

                echoss.Icon.hideIcon();

            },function( code , msg  ){

                that.loading_type = false;
                that.$utils_popup( that, true , '' , msg );

            });

        },function(code , msg ){

            //error
            that.$utils_popup(that, true , '' , msg );

        });





        this.$nextTick(function() {



        })
    },
    methods: {

        cust_point_use : function( data ){

            var that = this;

            var param = {};

            param.custNo = that.key_custNo;
            param.usePoint = that.headerPoint;
            param.eq = data.equipTyp;
            param.s = data.s;
            param.p = data.p;
            param.c = data.c;
            param.version = data.version;
            param.brdId = that.key_brandCd;

            BM.POINT_USE( param , function(){

                var _message = '블루멤버스 포인트 '+ that.headerPoint +'점 사용처리가 완료되었습니다.';

                stopStampAnimation();

                that.$utils_popupForm(that, true , '' , _message , true , function(){

                    that.cust_point_info(function( res ){

                        that.myPoint = res.custPoint;
                        that.loading_type = false;

                    },function( code , msg ){

                        that.$utils_popup(that,true,'', msg );

                    });

                    that.point_use_close();

                },function(){

                });

            },function( code , msg ){

                stopStampAnimation();
                that.$utils_popup(that, true , '' , msg );

            });

        }
        /*
        *
        * 유저 포인트 정보 조회
        *
        * */
        ,cust_point_info : function( callbackSuccess , callbackFail ){

            var that = this;
            var param = {};

            param.custNo = that.key_custNo;

            that.loading_type = true;

            BM.CUST_POINT_SEARCH(param , function( res ){

                return callbackSuccess(res);

            },function( code , msg ){
                that.loading_type = false;
                return callbackFail(code , msg );

            });

        }

        /*
        *
        * 포인트 사용 페이지
        *
        * */
        ,tap_pointUse: function(index) {

            var that = this;

            if(that.myPoint>=that.pointList[index].usePoint) {

                that.usePage = true;
                that.headerPoint = that.pointList[index].usePoint;

               // if(!that.echoss_onStamp_type){

                    echoss.Icon.enableStampingErrorMsg(true);

                    that.$utils_echoss_onStamp( function( res ){
                        //포인트 사용
                        that.cust_point_use( res );

                    },function(code , msg ){

                        that.$utils_popup(that,true,'',msg);

                    });

                    that.echoss_onStamp_type = true;

               // }

                echoss.Icon.showIcon();

                that.stampUse = true;


                //otp

                that.$utils_setOtp( that,  function(){

                    //otp 사용 처리
                    var _message = '블루멤버스 포인트 '+ that.headerPoint +'점 사용처리가 완료되었습니다.';

                    that.$utils_popupForm(that, true , '' , _message , true , function(){

                        that.cust_point_info(function( res ){

                            that.myPoint = res.custPoint;
                            that.loading_type = false;

                        },function( code , msg ){

                            that.$utils_popup(that,true,'', msg );

                        });

                        that.point_use_close();

                    },function(){

                    });

                },function( code , msg ){
                    //otp error
                    that.$utils_popup(that,true,'', msg );

                });

            }

        }

        /*
        *
        * 포인트 사용 close
        *
        * */
        ,point_use_close : function(){

            var that = this;

            that.usePage = false;

            echoss.Icon.hideIcon();

            that.$utils_echoss_onStampRemove();

            echoss.Icon.enableStampingErrorMsg(false);

        }
        ,tap_buyConfirm: function() {
            this.alertOption = true
            if(this.buySuccess == true) {
                this.alertTitle = ''
                this.alertContent = '블루멤버스 포인트'+ this.headerPoint +'점 <br> 사용처리가 완료되었습니다.'

            }else{
                this.alertTitle = ''
                this.alertContent = '1일 사용가능 포인트를 모두 <br/>소진하였습니다.<br/>' +
                    '다음에 이용해 주세요.'
            }
        },
        tap_buyOptionConfirm: function() {
            this.alertOption = false
        }
    }

});