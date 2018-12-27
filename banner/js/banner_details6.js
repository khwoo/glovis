

/**
*
*   준오헤어 할인혜택 소개
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
					,'&menuIdx=CTG0001'
					,'&categoryIdx=CTG0001CT0007'
					,'&uid=' + that.key_uid
				].join('');
			}



		}


	}

});