var vm = new Vue ({
    el:".container",
    data: {
        navTitle: '이용내역',

        productName: '스타벅스코리아 아이스아메리카노 1+1 SET 2줄 일수도 있지',
        usedStatus: 3,
        customerNumber: '023397984216',
        usedDate: '2018-04-09 15:00',
        usedPoint: 1000,
        usedPlace: '스타벅스코리아 판교점',

        canceled: null, // 취소는 true, 아니면 false
        cancelDate: '2018. 04. 09 12:00',
        cancelContent: '가맹점 요청에 의한 취소',

        bought: null, // 이미 구매는 true, 아니면 false
        boughtQuantity: 10,
        alertShow: false
    },
    filters:{
        formatPoint:function(value,unit){
            unit = 'P';
            return parseInt(value).toLocaleString() + unit;
        }
    },
    created:function(){

        var that = this;

        that.$utils_link( that );

    },
    mounted: function() {
        this.$nextTick(function() {

            if(this.usedStatus == 1) {
                this.usedStatus = '현장사용'
                this.canceled = false
                this.bought = false
            }else if (this.usedStatus == 2) {
                this.usedStatus = '현장사용 취소'
                this.canceled = true
                this.bought = false
            }else if(this.usedStatus == 3) {
                this.usedStatus = '구매'
                this.canceled = false
                this.bought = true
            }else if(this.usedStatus == 4) {
                this.usedStatus = '구매취'
                this.canceled = true
                this.bought = true
            }

        })
    },

    methods: {
        tap_buyCancel: function() {
            this.alertShow = true
        },
        tap_cancel: function() {
            this.alertShow = false
        },
        tap_buyConfirm: function() {

        }
    }
});

