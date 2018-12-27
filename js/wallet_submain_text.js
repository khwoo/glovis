var vm = new Vue({
    el: '.container',
    data: {
        navTitle: '최인아책방',
        logoSrc: 'images/logo_shop03.png',
        backgroundColor: '#fff',
        hasMap: true,
        shopTitle: '블루멤버스 포인트로<br/>혼자만의 시간을 즐겨보세요.',
        shopName: '최인아책방 혼자의 서재',
        shopAddress: '서울특별시 강남구 선릉로 521 3층',
        shopTel: '02-555-7330',
        ordinaryTime: '11:00~21:00',
        weekendTime: '11:00~20:00',
        shopIntro: '최인아책방은 오천여 권의 장서를 갖춘 중형 서점이자 강연, 모임, <br/>' +
        '콘서트 등이 활발하게 이루어지는 복합 문화 공간. 책방 주인이 <br/>' +
        '선별한 좋은 책들이 주제별로 진열되어 있고 지인들이 <br/>' +
        '추천한 책 안에는 추천 이유를 진솔하게 <br/>' +
        '적은 북카드가 들어있어 자신에게 필요한 <br/>' +
        '책을 쉬이 선택할 수 있습니다. <br/>',
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
        ,map_url : function(){

            var that = this;

            location.href = 'map.html';

        }
    }

});