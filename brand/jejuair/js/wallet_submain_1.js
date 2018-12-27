
var vm = new Vue({
    el: '.container',
    data: {
        alertDirection: false,
        alertTitle: '이용안내',
        brand_gift_url : '' ,
        point_use_url : '' ,
        contentList: [],
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

        that.point_use_url = [
            '../../point_use.html'
            ,'?custNo=' + that.key_custNo
            ,'&brandCd=' + that.key_brandCd
            ,'&'
            ,'uid=' + that.key_uid
        ].join('');

        var contentinfo_1 = {

            title : '사용방법안내'
            ,content : [
                 '1. 블루멤버스 포인트로 쿠폰을 구매합니다.</br>'
                ,'2. 상단 보관함에서 쿠폰 쿠폰번호를 확인합니다.</br>'
                ,'3. 쿠폰번호를 복사하고 제주항공 사이트에 로그인합니다.</br>'
                ,'<block style="visibility: hidden;">3. </block>제주항공</br>'
                ,'<block style="visibility: hidden;">3. </block><a href="toClient:doBrowser##http://www.jejuair.net/jejuair/kr/main.do">http://www.jejuair.net/jejuair/kr/main.do</a> </br>'
                ,'4. 마이페이지 > 나의쿠폰 메뉴에서 블루멤버스에서 </br>'
                ,'<block style="visibility: hidden;">4. </block>구매한 쿠폰번호를 등록합니다.</br>'
                ,'<block style="visibility: hidden;">4. </block>반드시 사전등록해야 쿠폰사용이 가능합니다.</br>'
                ,'5. 항공권 예매 시 해당 쿠폰을 선택하여 사용하시면 </br>'
                ,'<block style="visibility: hidden;">5. </block>혜택이 적용됩니다.</br>'
            ].join('')

        };

        var contentinfo_2 = {
            title : '유의사항'
            // ,content : [
            //      '<p class="alert_content before" style="padding: 0;">구매한 쿠폰은 2019년 04월 30일까지 사용가능합니다.</p>'
            //     ,'항공권 결제 시점이 19년 04월30일 이내여야 적용되며,</br>'
            //     ,'2019년 12월 31일전까지 스케쥴되어 있는 모든 항공편에 </br>'
            //     ,'할인적용됩니다.</br>'
            //     ,'블루멤버스 이달의 혜택 보관함에서 쿠폰번호를 확인하시면,'
            //     ,'쿠폰 사용완료로 간주합니다.&nbsp;유효기간 내 사용하지 않은 쿠폰에 대해서는 사용취소 및 구매취소가 가능합니다.</br>'
            //     ,'사용취소 및 구매취소는 고객센터로 연락주시기 바랍니다.</br>'
            // ].join('')

            ,content : [
                 '<p class="alert_content before on" >구매한 쿠폰은 2019년 04월 30일까지 사용가능합니다.</p>'
                ,'<p class="alert_content before on" >항공권 결제 시점이 19년 04월30일 이내여야 적용되며,'
                ,'2019년 12월 31일전까지 스케쥴되어 있는 모든 항공편에 '
                ,'할인적용됩니다.</p>'
                ,'<p class="alert_content before on" >블루멤버스 이달의 혜택 보관함에서 쿠폰번호를 확인하시면,'
                ,'쿠폰 사용완료로 간주합니다.&nbsp;유효기간 내 사용하지 않은 쿠폰에 대해서는 사용취소 및 구매취소가 가능합니다.</p>'
                ,'<p class="alert_content before on" >사용취소 및 구매취소는 고객센터로 연락주시기 바랍니다.</p>'
            ].join('')
        };

        that.contentList.push( contentinfo_1 );
        that.contentList.push( contentinfo_2 );

//         사용방법안내
//         1. 블루멤버스 포인트로 교환권을 구매합니다.
//         2. 상담 보관함에서 교환권 쿠폰번호를 확인합니다.
//         3. 쿠폰번호를 복사하고 제주항공 사이트에 로그인합니다.
//         4. 마이페이지 > 나의쿠폰 메뉴에서 블루멤버스를 통해 구매한 쿠폰을 등록합니다.
//         5. 항공권 예매 시 해당 쿠폰을 선택하여 사용하시면 혜택이 적용됩니다.
// ​
//     ​
//      ​   유의사항
//             구매한 쿠폰은 2019년 04월 30일까지 사용가능합니다.
//             항공권 결제 시점이 19년 04월30일 이내여야 적용되며,
//             2019년 12월 31일전까지 스케쥴되어 있는 모두 항공편에 할인적용됩니다.
// ​
//             블루멤버스 이달의 혜택 보관함에서 쿠폰번호를 확인하시면,
//             쿠폰사용완료로 간주합니다.
//             유효기간 내 사용하지 않은 쿠폰에 대해서는 사용취소 및 구매취소가 가능합니다.
//             사용취소 및 구매취소는 고객센터로 연락주시기 바랍니다.

    },
    methods: {

    }

});