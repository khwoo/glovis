var vm = new Vue({
    el: '.container',
    data: {
        navTitle: '이마트24',
        shopSrc: 'images/submain_shop01.png',
        backgroundColor: '#FBDA33',
        hasMap: false,
        point_use_url : '',
        brand_gift_url : '',
        coupon_box :''

    },

    mounted: function() {

        var that = this;

        that.$utils_location_params(that);

        that.coupon_box = [
            'coupon_box.html'
            ,'?'
            ,'custNo=' + that.key_custNo
            ,'&'
            ,'uid=' + that.key_uid
        ].join('');

        that.point_use_url = [
            'point_use.html'
            ,'?custNo=' + that.key_custNo
            ,'&brandCd=' + that.key_brandCd
            ,'&'
            ,'uid=' + that.key_uid
        ].join('');

        that.brand_gift_url = [
            'brand_gift.html'
            ,'?custNo=' + that.key_custNo
            ,'&brandCd=' + that.key_brandCd
            ,'&'
            ,'uid=' + that.key_uid
        ].join('');

        this.$nextTick(function() {
            this.onReady = !this.onReady;

        })
    },
    methods: {
        wallet_url : function(){
            var that = this;

            var _url = [
                'wallet.html'
                ,'?'
                ,'custNo=' + that.key_custNo
                ,'&'
                ,'uid=' + that.key_uid
            ].join('');

            location.href = _url;

        }
    }
});