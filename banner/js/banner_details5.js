

/**
*
*   티팩토리912 혜택 소개
*
*/
var vm = new Vue({
    el: '.container',
    data: {
       bannerDetailSrc: 'image/event04-1.png'
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


        bannerclick:function(){

            var that = this;

	        if(that.$utils_blueLoginCheck(that)){
		        location.href = [''
			        ,'https://web.12cmservice.co.kr/tami/bluemembers/main.html?'
			        ,'custNo=' + that.key_custNo
			        ,'&menuIdx=CTG0002'
			        ,'&categoryIdx=CTG0002CT0019'
			        ,'&uid=' + that.key_uid
		        ].join('');
            }



        }


    }

});