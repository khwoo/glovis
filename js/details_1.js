var vm = new Vue({
    el: '.container',
    data: {
        navTitle             : '상품상세',
        main_url             : '',
        productImg           : '',
        brandName            : '',
        productName          : '',
        productNotice        : '',
        priceAfter           : '',
        subMenuIdx           : 0,
        subMenuList          : [
            {name: '상품안내'},{name: '사용안내'},{name: '가맹점정보'}
        ],
        subContentList       : [],
        btnOptionShow        :false,
        productQuantity      : 1,
        maxProductQuantity   : 10, /* 최대 구매 수량 */
        totalPrice           : 0,

        /* 구매 alert */
        alertShow            : false,
        giftHref             : 'javascript:void(0)',
        /* 구매서공, 구매실패, 선물성공 alert */
        alertOption          : false,
        alertTitle           : '',
        prstPsbYn            : 'Y',
        loading_type         : false,
        custMonthlyPsbCnt    : 0 ,                                  //포인트 구매 가능 횟수
        custMonthlyBuyCnt    : 0 ,                                  //포인트 구매 한 횟수
        alertContent         : '',
	    custBuyLimitYn       : 'N',      //고객 구매 제한 여부(N:무제한, Y:제한)
	    custBuyLimitCnt      :"10",		//고객 구매 제한 건수

	    custGoodsBuyPsbYn    :"N",	    //고객 상품 구매 가능 여부(Y:구매가능, N:구매불가)
	    custGoodsBuyPsbCnt   :"-1",	    //고객 상품 구매 가능 건수
	    button_background    : '',       //구매 버튼 color
        buySuccess           : false
        ,popdata : {

            alertOption : false
            ,alertTitle : ''
            ,alertContent : ''
            ,alertStyle : ''

        }

    },
    filters:{
        formatMoney:function(value,unit){
            unit = 'P';
            return parseInt(value).toLocaleString() + unit;
        },
        formatCount:function(value){

            return parseInt(value).toLocaleString();
        }
        ,replace_br : function( value ){

            //replace(/\r\n/gi, "<br/>")
            return value.replace(/\r\n/gi, "<br/>");

        }
    },
    created:function(){

        var that = this;

        that.$utils_link( that );

    },
    mounted: function() {

        var that = this;
        that.$utils_location_params( that );

        that.main_url = [
            'main.html'
            ,'?'
            ,'custNo=' + that.key_custNo
            ,'&'
            ,'uid=' + that.key_uid
        ].join('');

        if(that.key_link == 'brand_gift'){

            that.main_url = [
                'brand_gift.html'
                ,'?'
                ,'custNo=' + that.key_custNo
                ,'&brandCd=' + that.key_brandCd
                ,'&'
                ,'uid=' + that.key_uid
            ].join('');

        }



        that.productDetailsData();

        //

        this.$nextTick(function() {
            this.totalPrice = this.priceAfter*this.productQuantity
        })
    },
    methods: {

        //상품 상세 정보
        productDetailsData : function() {
            var that = this;

            var param = {};
            param.custNo = that.key_custNo;
            param.goodsCd = that.key_productId;

            that.loading_type = true;

            BM.SAL_GOODS_DTL_INFO( param , function(res){
                console.log(res);

                that.productImg = res.goodsDtlImgs[0].goodsDtlImg;
                that.brandName = res.brdNm;
                that.productName = res.goodsNm;

                that.custMonthlyPsbCnt = res.custMonthlyPsbCnt;
                that.custMonthlyBuyCnt = res.custMonthlyBuyCnt;
                //expiDt

                //expiGbnCd
                //expiPrd

                // expire_div_code(0:없음, 1:일수, 2:개월수, 3:지정일)
                // exp_dt (숫자만 들어가 있음)
                switch( res.expiGbnCd ){

                    case "0" :

                        that.productNotice = "이용기간 제한없음";

                        break;
                    case "1" :

                        that.productNotice = that.$utils_date( that.$utils_addDate(Number(res.expiPrd)) , '년 ' ,'월 ' , '일까지 이용가능' );

                        break;

                    case "2" :

                        that.productNotice = that.$utils_date( that.$utils_addMonth(Number(res.expiPrd)) , '년 ' ,'월 ' , '일까지 이용가능' );

                        break;

                    case "3" :

                        that.productNotice = that.$utils_date( res.expiPrd , '년 ' , '월 ' , '일까지 이용가능' );

                        break;
                }

                that.priceAfter = res.goodsSalPrice;
                that.totalPrice = res.goodsSalPrice;
                that.prstPsbYn = res.prstPsbYn;
                that.goodsQttGbn = res.goodsQttGbn;
                that.goodsCnt = res.goodsCnt;

	            that.custBuyLimitYn = res.custBuyLimitYn;//고객 구매 제한 여부(N:무제한, Y:제한)
	            that.custBuyLimitCnt = res.custBuyLimitCnt;//고객 구매 제한 건수
	            that.custGoodsBuyPsbYn = res.custGoodsBuyPsbYn;//고객 상품 구매 가능 여부(Y:구매가능, N:구매불가)
	            that.custGoodsBuyPsbCnt = res.custGoodsBuyPsbCnt;//고객 상품 구매 가능 건수

	            if(that.custBuyLimitYn == 'Y'){
		            if(that.custGoodsBuyPsbYn == 'N' ){
			            that.button_background = 'background-color:rgba(127,127,127,1);border:none;';
		            }
	            }
                //value.replace(/\r\n/gi, "<br/>")
                that.subContentList.push({
                    contentText : [
                        ( res.goodsDescImg == null || res.goodsDescImg == '' ? '' : '<img style="width:100%;" src="'+ res.goodsDescImg +'" />' )
                        ,res.goodsDesc1.replace(/\r\n/gi, "<br/>")
                    ].join('')
                });

                that.subContentList.push({
                    contentText : [
                        ( res.useDescImg == null || res.useDescImg == '' ? '' : '<img style="width:100%;" src="'+ res.useDescImg +'" />' )
                        ,res.useDesc.replace(/\r\n/gi, "<br/>")
                    ].join('')
                });



                that.subContentList.push({
                    // contentText : [
                    //     '주소 : ' + res.brdAddr
                    //     ,'</br>'
                    //     ,'전화번호 : ' + res.brdTelNo
                    //     ,'</br>'
                    //     ,'</br>'
                    //     ,'가맹점 설명 : </br>' + res.brdDesc.replace(/\r\n/gi, "<br/>")
                    // ].join('')
                    contentText : [
                        res.brdDesc.replace(/\r\n/gi, "<br/>")
                    ].join('')
                });

                that.loading_type = false;

            },function( code , msg ){

                that.loading_type = false;

                that.$utils_popup( that , true , '' , msg );

            });


        }
        //상품 구매
        ,product_order : function( callback ){
            var that = this;

            var param = {};
            param.custNo = that.key_custNo;
            param.goodsCd = that.key_productId;
            param.ordQtt = that.productQuantity;
            param.ordGbn = '1';

            BM.MHOUSE_ORDER( param , function( res ){

                console.log(res);
                that.alertOption = true;
                that.alertTitle = '구매완료';
                that.alertContent = '구매가 완료되었습니다.<br/>구매한 상품은 보관함에서 확인할 수 있습니다.'+
                                    '<span>당월 포인트구매 이용가능횟수 : '+ res.custMonthlyPsbCnt +'회</span>';

                return callback(true);

            },function( code , msg ){
                that.$utils_popup(that,true , '' , msg );
                return callback(false);

            });
        }

        ,tap_plus: function() {
            var that = this;
            if(that.productQuantity<that.maxProductQuantity) {
                that.productQuantity ++;
                that.totalPrice = that.priceAfter*that.productQuantity
            }
        },

        tap_minus: function() {
            var that = this;
            if(that.productQuantity>1) {
                that.productQuantity --;
                that.totalPrice = that.priceAfter*that.productQuantity
            }
        },
        //구매
        tap_buy: function() {
            var that = this;

	        //구매 제한 여부
	        // "custBuyLimitYn":"Y",		//고객 구매 제한 여부(N:무제한, Y:제한)
	        // "custBuyLimitCnt":"10",		//고객 구매 제한 건수
	        //
	        // "custGoodsBuyPsbYn":"N",	//고객 상품 구매 가능 여부(Y:구매가능, N:구매불가)
	        // "custGoodsBuyPsbCnt":"-1"	//고객 상품 구매 가능 건수

	        //구매 제한 여부
	        if(!that.$utils_buy_limit_bottom(that)){
		        return;
	        }

            that.totalPrice = that.priceAfter;
            that.productQuantity = 1;
            that.alertShow = true;

        },
        //선물
        tap_gift: function() {
            var that =this;

	        //구매 제한 여부
	        // "custBuyLimitYn":"Y",		//고객 구매 제한 여부(N:무제한, Y:제한)
	        // "custBuyLimitCnt":"10",		//고객 구매 제한 건수
	        //
	        // "custGoodsBuyPsbYn":"N",	//고객 상품 구매 가능 여부(Y:구매가능, N:구매불가)
	        // "custGoodsBuyPsbCnt":"-1"	//고객 상품 구매 가능 건수

	        //구매 제한 여부
	        if(!that.$utils_buy_limit_bottom(that)){
		        return;
	        }

            location.href = that.gift_url();

        },
        //선물 페이지 url 설정.
        gift_url : function(){
            var that= this;

	        // that.custBuyLimitYn//고객 구매 제한 여부(N:무제한, Y:제한)
	        // that.custBuyLimitCnt//고객 구매 제한 건수
	        // that.custGoodsBuyPsbYn//고객 상품 구매 가능 여부(Y:구매가능, N:구매불가)
	        // that.custGoodsBuyPsbCnt//고객 상품 구매 가능 건수

            var _url = [
                'gift_1.html'
                ,'?'
                ,'custNo=' + that.key_custNo
                ,'&'
                ,'productId=' + that.key_productId
                ,'&'
                ,'count=' + that.productQuantity
                ,'&'
                ,'totalprice=' + that.totalPrice
                ,'&'
                ,'uid=' + that.key_uid
                ,'&'
                ,'custBuyLimitYn=' + that.custBuyLimitYn
                ,'&'
                ,'custBuyLimitCnt=' + that.custBuyLimitCnt
                ,'&'
                ,'custGoodsBuyPsbYn=' + that.custGoodsBuyPsbYn
                ,'&'
                ,'custGoodsBuyPsbCnt=' + that.custGoodsBuyPsbCnt
            ].join('');

            return _url;

        },

        tap_cancel: function() {
            var that = this;

            that.alertShow = false;
            that.btnOptionShow = false;

        },
        //구매 확인
        tap_buyConfirm: function() {
            var that = this;

            //tap_buyConfirm

            if(that.custMonthlyPsbCnt <= 0 ){

                that.alertShow      = false;

                return;

            }

            that.loading_type = true;
            that.alertShow      = false;

            that.product_order(function( res ){


                that.loading_type = false;
                that.btnOptionShow  = false;

                if( res ){

                    that.buySuccess = true;

                }else{

                    that.buySuccess = false;

                }


            });

        },
        tap_buyOptionConfirm: function() {
            //보관함 이동.
            var that = this;
            if( that.buySuccess ){

                var historyParam = {};

                historyParam.custNo = that.key_custNo;
                historyParam.uid = that.key_uid;

                var url = location.href.substring( 0 , location.href.indexOf('?')).replace('details_1' , 'coupon_box');

                that.$utils_history_replaceState( historyParam , url );

                history.go(0);

                // location.href=[
                //     'coupon_box.html'
                //     ,'?custNo=' + that.key_custNo
                //     ,'&'
                //     ,'uid=' + that.key_uid
                // ].join('');
            }
        }
    }

});