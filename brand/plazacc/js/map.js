new Vue({

    el:".container",
    data: {
        brandName : '플라자CC 용인'
    },
    filters:{



    },
    created:function(){

        var that = this;

        that.$utils_link( that );

    },
    mounted: function() {

    }

});