
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


                location.href = that.$utils_addPageParam( that , that.productUrl );

            }, function(errorCode, errorMessage) {
                that.loading_type = false;
                console.log("["+errorCode+"] "+errorMessage);
                that.$utils_popup(that,true,'' , errorMessage );
            });



        }

    }

});