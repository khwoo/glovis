var vm = new Vue ({
    el:".container",
    data: {
        navTitle: '이용내역',
        productImg: '',

        productName: '',
        usedStatus: 5,
        giftTo: '',
        giftFrom: '',

        customerNumber: '',
        usedDate: '',
        usedPoint: 0,

        canceled: null, // 취소는 true, 아니면 false
        cancelDate: '',

        boughtQuantity: 0,
        alertShow: false,
        ticketList:[],
        alertOption: false,
        alertTitle: '',
        alertContent: '',
        loading_type: true ,
        ticketCanPsbYn:'N',
        history_type : false, // true 선물  ,   false 구매
        coupon_box_url : '',
        ordGbn : '3' , // 상테
        btnType : '9' , // 1 [ 구매취소 쿠폰보기 ] 2 [ 선물취소 , 재전송 ] 9  [ 노출 않함. ]
        ordCanPsbYn : 'Y' , //구매 선물 취소 여부 Y 취소 가능
        retryYn : 'Y' ,
        popdata : {

             alertOption : false
            ,alertTitle : ''
            ,alertContent : ''
            ,alertStyle : ''

        },
        popformdata : {

             alertOption : false
            ,alertTitle : ''
            ,alertContent : ''
            ,alertStyle : ''
            ,alertCall_1 : null
            ,alertCall_2 : null
            ,cancelShow : true

        },
        giftUsed: true
    },
    filters:{
        formatPoint:function(value,unit){
            unit = 'P';
            return parseInt(value).toLocaleString() + unit;
        }
    },
    created:function(){

        var that = this;

        that.$utils_link( that );

    }
    ,mounted: function() {

        var that = this;

        that.$utils_location_params(that);


        that.coupon_box_url = [
            'coupon_box.html'
            ,'?'
            ,'custNo=' + that.key_custNo
            ,'&'
            ,'uid=' + that.key_uid
        ].join('');

        that.history_details(function(){

            that.loading_type = false;

        },function(code , msg ){
            that.loading_type = false;
            that.$utils_popup(that,true,'' , msg );
        });

        this.$nextTick(function() {

            if(this.usedStatus == 5) {
                this.usedStatus = '선물'
                this.canceled = false
            }else if (this.usedStatus == 6) {
                this.usedStatus = '선물취소'
                this.canceled = true
            }

        })
    },

    methods: {

        //이용내역 정보 처리
        history_details : function( callbackSuccess , callbackFail ){

            var that = this;

            var param = {};

            param.trxNo = that.key_trxNo;

            BM.CUST_ORD_DTL_INFO( param , function( res ){

                console.log(res);
                console.log('ticketCanPsbYn:' + res.ticketCanPsbYn);
                var data = res.ordDtlInfo;
                if(res.ticketList) {
                    that.ticketList = res.ticketList;
                }
                console.log(data);
                // "ordStCd": "2", //2:발급 완료, 9:주문 취소
                // "ordGbn": "1",  //1:구매 ,2:선물 ,3:현장구매     [9-3] 현장취소  [9-2] 선물취소  [9-1] 구매취소

                that.ordGbn = data.ordGbn;
                that.ticketCanPsbYn = res.ticketCanPsbYn;

                if( data.ordGbn == '2' ){ //선물

                    that.history_type   = true;
                    that.productImg     = data.goodsImg;
                    that.productName    = data.goodsNm;
                    that.giftTo         = data.recvTelNo;
                    that.giftFrom       = data.custNm;

                }

                if(data.ordGbn == '3'){
                    that.productName    = data.brdNm;
                }else{
                    that.productName    = data.goodsNm;
                }

                //취소는 true, 아니면 false
                if( data.ordStCd === '2' ){

                    switch(data.ordGbn){
                        case "1":
                            _status = '구매';
                            that.btnType = data.ordGbn;
                            break;
                        case "2":
                            _status = '선물';
                            that.btnType = data.ordGbn;
                            break;
                        case "3":
                            _status = '현장구매';
                            break;
                    }

                    that.canceled = false;

                }else if( data.ordStCd === '9' ){
                    switch(data.ordGbn){
                        case "1":
                            _status = '구매취소';
                            break;
                        case "2":
                            _status = '선물취소';
                            break;
                        case "3":
                            _status = '현장취소';
                            break;
                    }

                    that.cancelDate = [
                        data.ordCanDt.substr( 0, 4 )
                        ,'. '
                        ,data.ordCanDt.substr( 4, 2 )
                        ,'. '
                        ,data.ordCanDt.substr( 6, 2 )
                        ,'   '
                        ,data.ordCanTm.substr( 0 , 2 )
                        ,':'
                        ,data.ordCanTm.substr(2,2)
                    ].join('') ;//'2018. 06. 21  21:00';

                    that.canceled = true;
                }

                that.usedStatus = _status;
                that.customerNumber = that.key_custNo;

                that.usedDate = [
                    data.ordDt.substr( 0, 4 )
                    ,'. '
                    ,data.ordDt.substr( 4, 2 )
                    ,'. '
                    ,data.ordDt.substr( 6, 2 )
                    ,'   '
                    ,data.ordTm.substr( 0 , 2 )
                    ,':'
                    ,data.ordTm.substr(2,2)
                ].join('') ;//'2018. 06. 21  21:00';

                that.boughtQuantity = data.ordQtt +" 개";

                that.usedPoint = parseInt(data.payAmt).toLocaleString() +"P";

                that.ordCanPsbYn = data.ordCanPsbYn;

                that.retryYn = data.retryYn;

                return callbackSuccess(data);

            },function( code , msg ){
                return callbackFail(code , msg);
            });


        },

        //쿠폰 보기 [ 쿠폰 상세 이동 ]
        coupon_details_url: function(){
            var that = this;
            if(that.ticketList.length <= 0 ){
                return;
            }
            var ticket_info = that.ticketList[0];

            var _url = [
                'coupon_details.html'
                ,'?'
                ,'custNo=' + that.key_custNo
                ,'&'
                ,'ticketNo=' + ticket_info.ticketNo
                ,'&'
                ,'uid=' + that.key_uid
            ].join('');

            location.href = _url;

        },
        //구매 취소
        coupon_cancel : function( e ){

            var that = this;

            var _target = e.target;

            var _len = 0 ;

            var _cancelType = true;
            while( _cancelType){

                if(_len > 10 ){

                    _cancelType = false;

                }

                if( _target.getAttribute('data-type') == null){

                    _target = _target.parentNode;
                    _len += 1;

                }else{
                    _cancelType = false;
                }
            }

            var message_1 = '';
            var message_2 = '';

            if( _target.dataset.type == 'coupon' ){

                message_1 = '구매 취소하시겠습니까?';
                message_2 = '구매 취소가 완료되었습니다';

            }else if(_target.dataset.type =='gift'){

                message_1 = '취소 시 쿠폰을 더 이상 사용할 수 없습니다.' +
                            '선물받으신 분께 취소메시지가 발송됩니다.' +
                            '선물을 취소하시겠습니까?';
                message_2 = '선물 취소가 완료되었습니다.';

            }

            that.$utils_popupForm( that , true , '' , message_1 , false , function(){

                var param = {};
                param.trxNo = that.key_trxNo;
                that.loading_type = true;

                    BM.ORDER_CANCEL( param, function( res){

                        that.loading_type = false;
                        that.$utils_popupForm(that, true , '' , message_2 , true , function(){

                            that.loading_type = true;
                            //정보 다시 조회
                            that.history_details(function(){

                                that.loading_type = false;

                            },function(code , msg ){
                                setTimeout(function(){

                                    that.loading_type = false;
                                    that.$utils_popup(that,true,'' , msg );
                                },1);
                            });

                        });
                    },function( code , msg ){

                        that.loading_type = false;

                        that.$utils_popup(that , true , '' , msg , true );

                    });
            },function(){
                //취소
            });

        },

        tap_giftCancel: function() {
            this.alertShow = true
        },

        tap_cancel: function() {
            this.alertShow = false
        },
        tap_cancelConfirm: function() {
            this.alertShow = false
            this.alertOption = true
            if(this.giftUsed == true) {
                this.alertTitle = '선물취소'
                this.alertContent = '쿠폰을 사용하여 취소할 수 없습니다.'
            }else {
                this.alertTitle = '선물취소 완료'
                this.alertContent = '선물 취소가 완료되었습니다.'
            }
        },
        tap_buyOptionConfirm: function() {
            this.alertOption = false
        }
        ,history_replaceState : function(){

            var that = this;

            history.back( history.back() );
            //history.go(0);
            // that.coupon_box_url = [
            //     'coupon_box.html'
            //     ,'?'
            //     ,'custNo=' + that.key_custNo
            // ].join('');

        }

    }
});

