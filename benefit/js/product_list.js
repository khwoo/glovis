
var vm = new Vue({
    el: '.container',
    data: {
        productlist: [
            {
                "chCd": "3b807881ea0a4e4bae3cc31f5cdc8ac7",
                "goodsCd": "G18051400176",
                "rcmdGoodsYn": "N",
                "goodsSalGbn": "1",
                "goodsQttEpsYn": "N",
                "goodsQttGbn": "2",
                "goodsSalPrice": "2000",
                "goodsNm": "현대블루-글라소)에너지500ML",
                "goodsGbn": "G",
                "goodsImg": "https://12cm-image.s3.amazonaws.com/commerce/dev/goods/20180514172359958.jpg",
                "brdId": "V00A002B121",
                "brdNm": "코카콜라",
                "salStDt": "20180514",
                "salEndDt": "20181231",
                "soldOutYn": "N",
                "goodsCnt": 975
            },
            {
                "chCd": "3b807881ea0a4e4bae3cc31f5cdc8ac7",
                "goodsCd": "G18070200247",
                "rcmdGoodsYn": "N",
                "goodsSalGbn": "2",
                "goodsQttEpsYn": "Y",
                "goodsQttGbn": "1",
                "goodsSalPrice": "0",
                "goodsNm": "부동산 중개 수수료 10% 할인권",
                "goodsGbn": "G",
                "goodsImg": "https://12cm-image.s3.amazonaws.com/commerce/dev/goods/20180702102716777.png",
                "brdId": "V00A044B013",
                "brdNm": "아라바요",
                "salStDt": "20180702",
                "salEndDt": "20180731",
                "soldOutYn": "N",
                "goodsCnt": 0
            },
            {
                "chCd": "3b807881ea0a4e4bae3cc31f5cdc8ac7",
                "goodsCd": "G18071100269",
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
        ]
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

    },
    mounted: function() {

        var that = this;

        that.$utils_location_params( that );

         console.log(that.key_custNo);

        that.$utils_offeringPageOpen(that, function( msg ){

            that.$utils_popupForm(that,true,'' , msg , true , function(){

                location.href = that.$utils_addPageParam( that , 'index.html?' );

            });
            return;
        });

         console.log(that.$utils_addPageParam( that , 'pageUrl?'));

         that.productInfo();
    },
    filters:{
        formatPoint:function(value,unit){
            //unit = 'P';
            unit = '';
            return parseInt(value).toLocaleString() + unit;
        }
    },
    methods: {

        productInfo:function () {

            var that = this;

            var productList = new Array();

            for(var i = 0 ; i < that.productlist.length ; i++ ){
                var _item = that.productlist[i];

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


                productList.push( _item );

            }

            that.productlist = productList;

        }

    }

});