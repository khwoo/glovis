new Vue({
    el:'.container'
    ,data:{
        gift_message_main_url : ''
        ,bannerlist : []
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
    }
    ,created:function(){

        var that = this;

        that.$utils_link( that );

    }
    ,mounted : function(){

        var that = this;

        that.$utils_location_params(that);

        that.bannerinfo();

        // that.gift_message_main_url = [
        //     'gift_message_main.html'
        //     ,'?'
        //     ,'custNo=' + that.key_cid
        //     ,'&'
        //     ,'ticketNo=' + that.key_tid
        //     ,'&'
        //     ,'uid=' + that.key_uid
        // ].join('');

        that.gift_message_main_url = [
            'gift_coupon_details.html'
            ,'?'
            ,'custNo=' + that.key_cid
            ,'&'
            ,'ticketNo=' + that.key_tid
            ,'&'
            ,'uid=' + that.key_uid
        ].join('');

    }
    ,methods:{

        bannerinfo : function(){

            var that = this;

            var param = {};

            param.goodsCd = that.key_gc;

            BM.GOODS_BNR( param , function( res ){

                console.log( res );
                var array = new Array();

                var videolist = res.videoBnrList;
                var imglist = res.imgBnrList;

                for( var i = 0 ; i < imglist.length ;i++ ){
                    var _item = imglist[i].imgUrl;

                    array.push({
                        url : _item
                        ,type :'img'
                    });
                }

                if(array.length > 1 ){

                    that.videoArray( videolist , function( url ){

                        array.splice( 1 , 0 , url );

                    });

                }else if( array.length <= 0 || array.length < 2 ){

                    that.videoArray( videolist , function( url ){

                        array.push( url );

                    });

                }

                that.bannerlist = array;

            },function( code , msg ){

                that.$utils_popup( that , true , '' , msg );

            });


        }
        ,videoArray : function( videolist , callback ){

            var that = this;

            if( videolist.length > 0 ){

                return callback({
                    url : videolist[0].videoUrl
                    , type : 'video'
                });

            }

        }

    }
});