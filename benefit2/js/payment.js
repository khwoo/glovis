
var vm = new Vue({
    el: '.container',
    data: {
        productUrl : 'product_list.html?'
        ,loading_type : false
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
        ,phoneVal:''
        ,productinfo:{
            "chCd": "3b807881ea0a4e4bae3cc31f5cdc8ac7",
            "goodsCd": "G18031200142",
            "rcmdGoodsYn": "N",
            "goodsSalGbn": "1",
            "goodsQttEpsYn": "Y",
            "goodsQttGbn": "1",
            "goodsSalPrice": "5000",
            "goodsNm": "플라자CC용인 5만원권",
            "goodsGbn": "G",
            "goodsImg": "https://12cm-image.s3.amazonaws.com/commerce/dev/goods/20180312112804307.png",
            "brdId": "V00A002B148",
            "brdNm": "플라자cc",
            "salStDt": "20180312",
            "salEndDt": "20181231",
            "soldOutYn": "N",
            "goodsCnt": 0
        }
    },

    created:function(){

        var that = this;

        that.$utils_link( that );

    },
    mounted: function() {

        var that = this;

        that.$utils_location_params( that );

        that.$utils_offeringPageOpen(that, function( msg ){

            that.$utils_popupForm(that,true,'' , msg , true , function(){

                location.href = that.$utils_addPageParam( that , 'index.html?' );

            });


            return;

        });




    },
    methods: {

        productlist:function () {

            var that = this;

            if(that.phoneVal.length <= 0 ){
                that.$utils_popup(that,true,'' , '휴대폰번호를 입력하세요' );
                return;
            }

            that.loading_type = true;

            echossTracker.auth( that.key_otkey , that.phoneVal , function(result) {

                that.loading_type = false;
                console.log(result);

                that['key_custNo'] = result.user_id;

                var _item = that.productinfo;

                //goodsSalGbn 1 포인트 쿠폰
                //goodsSalGbn 2 할인 쿠폰
                if(_item.goodsSalGbn == '1' ){

                    _item.url = 'details/details.html'+
                        '?custNo='+ that.key_custNo +''+
                        '&otkey=' + that.key_otkey + '' +
                        '&uid=' + that.key_uid + '' +
                        '&productId='+ _item.goodsCd +' ';

                }

                if(_item.goodsSalGbn == '2' ){

                    _item.url = 'details/discount_details.html'+
                        '?custNo='+ that.key_custNo +''+
                        '&otkey=' + that.key_otkey + '' +
                        '&uid=' + that.key_uid + '' +
                        '&productId='+ _item.goodsCd +' ';

                }

                if(_item.goodsQttEpsYn == 'N' ){

                    _item.url = 'details/details_1.html'+
                        '?custNo='+ that.key_custNo +''+
                        '&otkey=' + that.key_otkey + '' +
                        '&uid=' + that.key_uid + '' +
                        '&productId='+ _item.goodsCd +' ';

                }

                //location.href = that.$utils_addPageParam( that , that.productUrl );

                location.href = _item.url;

            }, function(errorCode, errorMessage) {
                that.loading_type = false;
                console.log("["+errorCode+"] "+errorMessage);
                that.$utils_popup(that,true,'' , errorMessage );
            });



        }

    }

});