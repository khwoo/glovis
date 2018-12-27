
var vm = new Vue({
    el: '.container',
    data: {
        alertDirection: false,
        alertTitle: '이용안내',
        brand_gift_url : '' ,
        contentList: [
            {
                title: '사용방법안내',
                content: '1. 블루멤버스 포인트로 교환권을 구매합니다.<br/>' +
                '2. 보관함에서 교환권 쿠폰번호를 확인합니다.<br/>' +
                '3. 쿠폰번호를 복사하고 제주항공 사이트에서 예매 결제단계에서 쿠폰번호를 입력하여 혜택을 적용합니다.<br/>'
            },
            {
                title: '유의사항',
                content: '발급일로부터 12개월 내에 사용가능합니다.<br/>' +
                '블루멤버스 이달의 혜택 보관함에서 쿠폰번호를 확인하시면, 쿠폰사용완료로 간주합니다. 실제 제주항공 사이트에서 사용 시 쿠폰번호를 확인하여 혜택 적용이 처리됩니다.<br/>'
            }
        ],
    },

    mounted: function() {

        var that = this;

        that.$utils_location_params(that);

        that.brand_gift_url = [
            '../../brand_gift.html'
            ,'?custNo=' + that.key_custNo
            ,'&brandCd=' + that.key_brandCd
            ,'&'
            ,'uid=' + that.key_uid
        ].join('');

        this.$nextTick(function() {

        })
    },
    methods: {

    }

});