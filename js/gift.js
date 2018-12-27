var vm = new Vue({
    el: '.container',
    data: {
        navTitle: '선물하기',

        totalPrice: 50000,
        totalPrice_text : '',

        totalQuantity: 1,
        totalQuantity_text : '' ,
        alertShow: false,
        alertOption: false,
        alertTitle: '',
        details_url : '',
        loading_type : false,
        gift_quantity_value : '' ,
        gift_to_value : '' ,
        alertStyle : '',
        buySuccess           : false,
        custMonthlyPsbCnt : 0 ,
        custMonthlyBuyCnt : 0 ,
        alertContent: ''
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

        that.totalQuantity_text = that.key_count +" 개";
        that.totalQuantity = that.key_count;
        that.totalPrice = that.key_totalprice;
        that.totalPrice_text = that.key_totalprice + "P";

        that.details_url = [
            'details.html'
            ,'?'
                ,'custNo=' + that.key_custNo
            ,'&'
                ,'productId=' + that.key_productId
            ,'&'
                ,'uid=' + that.key_uid
        ].join('');

        that.goods_info();

    },
    methods: {

        goods_info: function(){

            var that = this;

            var param = {};
            param.custNo = that.key_custNo;
            param.goodsCd = that.key_productId;

            that.loading_type = true;

            BM.SAL_GOODS_DTL_INFO( param , function(res) {
                console.log(res);

                that.custMonthlyPsbCnt = res.custMonthlyPsbCnt;
                that.custMonthlyBuyCnt = res.custMonthlyBuyCnt;
                that.loading_type = false;
            },function( code , msg ){
                that.loading_type = false;

                that.$utils_popup( that , true , '' , msg );

            });

        },
        //확인
        tap_buy: function() {
            var that = this;

            console.log(that.gift_quantity_value.trim().length);
            if( that.gift_quantity_value.trim().length <= 0 ){
                that.alertPop( '선물하기' , '선물 받을 연락처 입력하세요.' , 'text-align:center;' );
                return;
            }

            if( that.gift_to_value.trim().length <=0 ){
                that.alertPop( '선물하기' , '보내는 사람을 입력하세요.' , 'text-align:center;');
                return;
            }

            that.alertShow = true;

        },
        //취소
        tap_cancel: function() {
            var that = this;

            that.alertShow = false;
            that.btnOptionShow = false;
        },
        alertPop : function( title , content , style ){

            var that = this;
            that.alertOption = true;
            that.alertTitle = title;
            that.alertContent = content;
            if(style != null && style != 'undefined' ){

                that.alertStyle = style;

            }

        },
        //선물 확인
        tap_buyConfirm: function() {
            var that = this;

            that.loading_type = true;

            var param = {};

            param.custNo    = that.key_custNo;
            param.goodsCd   = that.key_productId;
            param.ordQtt    = that.key_count;
            param.ordGbn    = '2';
            param.custNm    = that.gift_to_value;
            param.recvTelNo = that.gift_quantity_value;
            that.alertShow  = false;

            BM.ORDER( param , function( res ){

                that.alertOption    = true;
                that.btnOptionShow  = false;
                that.loading_type   = false;

                that.alertPop( '선물완료',  [
                    '구매 완료되어 입력한 연락처로 상품을 SMS로 발송합니다.</br>'
                    ,'선물내역은 보관함에서 확인하실수 있습니다.'
                    ,'<span>당월 포인트구매 이용가능횟수 : '+ res.custMonthlyPsbCnt +'회</span>'
                ].join('') );

                that.buySuccess = true;

            },function( code , msg ){

                that.loading_type = false;
                that.alertPop( '선물실패',  msg );

            });

            // if(that.buySuccess == true) {
            //
            //     that.alertTitle = '구매완료';
            //     that.alertContent = '구매가 완료되었습니다.<br/>' +
            //         '구매한 상품은 보관함에서 확인할 수 <br/>있습니다.';
            //
            // }else{
            //
            //     that.alertTitle = '구매실패';
            //     that.alertContent = '포인트가 부족합니다.<br/>' +
            //         '블루멤버스 포인트를 확인후 다시 <br/>진행해주세요.';
            // }

        },
        tap_buyOptionConfirm: function() {
            var that = this;
            that.alertOption = false
            if(that.buySuccess){

                var historyParam = {};

                historyParam.custNo = that.key_custNo;
                historyParam.uid = that.key_uid;
                historyParam.link = 'gift';

                var url = location.href.substring( 0 , location.href.indexOf('?')).replace('gift' , 'coupon_box');

                that.$utils_history_replaceState( historyParam , url );

                history.go(0);

                // location.href =[
                //     'coupon_box.html'
                //     ,'?custNo=' + that.key_custNo
                //     ,'&'
                //     ,'uid=' + that.key_uid
                // ].join('');

            }

        }
    }

});