var vm = new Vue({
    el: '.container',
    data: {
        navTitle: '이마트24'

    },
    created:function(){

        var that = this;

        that.$utils_link( that );

    },
    mounted: function() {
        this.$nextTick(function() {
            this.onReady = !this.onReady;



        })
    },
    methods: {

    }

});