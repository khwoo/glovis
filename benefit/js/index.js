
var vm = new Vue({
    el: '.container',
    data: {
        productUrl : 'payment.html?'
        ,authStatus : false
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
        ,poptipsdata : {
            alertOption : false
            ,alertContent : ''
        }
    },

    created:function(){

        var that = this;

        that.$utils_link( that );

    },
    mounted: function() {

        var that = this;
        that.$utils_location_params( that );

        that.$utils_offeringPageOpen( that , function( msg ){

            that.authStatus = false;
            that.$utils_popTips( that, true , msg );

            throw msg;

        });

        that.productUrl = that.$utils_addPageParam( that , that.productUrl );
        that.authStatus = true;

    },
    methods: {

        productlist:function () {

            var that = this;

            location.href = that.productUrl;

        }

    }

});