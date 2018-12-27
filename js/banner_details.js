
var vm = new Vue({
    el: '.container',
    data: {
       bannerDetailSrc: 'images/banner_details_1.png'
    },

    created:function(){

        var that = this;

        that.$utils_link( that );

    },
    mounted: function() {

        var that = this;

        that.$utils_location_params( that );

    },
    methods: {



    }

});