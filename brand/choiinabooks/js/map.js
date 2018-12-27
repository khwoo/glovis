new Vue({

    el:".container",
    data: {
        brandName : '최인아책방'
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