new Vue({

    el:".container",
    data: {
        brandName : ''
        ,lat : 0
        ,lng : 0

    },
    filters:{



    },
    created:function(){

        var that = this;

        that.$utils_link( that );

    },
    mounted: function() {

        var that = this;

        that.$utils_location_params(that);

        that.lat        = that.key_lat;
        that.lng        = that.key_lng;

        if( that.key_title == undefined || that.key_title == '' ){

            that.brandName = "MAP";

        }else{

            that.brandName  = decodeURIComponent(that.key_title);

        }




    }

});