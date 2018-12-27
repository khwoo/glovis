
var vm = new Vue({
    el: '.container',
    data: {
        table: [
            {
                name: '구글플레이 기프트 카드 5,000원권',
                price: '4,900 포인트'
            },
            {
                name: '구글플레이 기프트 카드 10,000원권',
                price: '9,800 포인트'
            },
            {
                name: '구글플레이 기프트 카드 30,000원권',
                price: '29,400 포인트'
            },
        ],

        alertDirection: false,
        alertTitle: '이용안내',
        brand_gift_url : '',
        contentList: [
            {
                title: '사용방법안내',
                content: '1. 블루멤버스 포인트로 쿠폰을 구매합니다.<br/>' +
                '2. 보관함에서 쿠폰번호를 확인합니다.<br/> ' +
                '3. 쿠폰번호를 복사하고 플레이스토어 > 코드사용 메뉴에 <br/> ' +
                '<block style="visibility: hidden;">3. </block>쿠폰번호를 입력하여 등록 후 사용합니다.'
            },
            // {
            //     title: '유의사항',
            //     content: '교환권의 유효기간은 제한없으나, 한번 등록된 교환권은 환불이 불가합니다. <br/>' +
            //     '블루멤버스 이달의 혜택 보관함에서 쿠폰번호를 확인하시면, 쿠폰사용완료로 간주합니다. <br/>'
            // }
            //<p class="alert_content before on" >
            {
                title: '유의사항',
                content: '<p class="alert_content before on" >쿠폰의 유효기간은 제한없으나, 한번 등록된 쿠폰은 환불이 불가합니다.</p>' +
                '<p class="alert_content before on" >블루멤버스 이달의 혜택 보관함에서 쿠폰번호를 확인하시면, 쿠폰사용완료로 간주합니다.</p>'
            }
        ],
    },
    created:function(){

        var that = this;

        that.$utils_link( that );

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

    },
    methods: {

    }

});