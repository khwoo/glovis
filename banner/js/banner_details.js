var vm = new Vue({
	el: '.container',
	data: {
		bannerDetailSrc: 'image/event01-1.png'

		/**
		 *
		 * terms.js
		 *
		 */
		, termsShow: false, // popup 사용 여부
		termsYn: 'N',
		loading_type: false
		, popdata: {

			alertOption: false
			, alertTitle: ''
			, alertContent: ''
			, alertStyle: ''

		}
		, popformdata: {

			alertOption: false
			, alertTitle: ''
			, alertContent: ''
			, alertStyle: ''
			, alertCall_1: null
			, alertCall_2: null
			, cancelShow: true

		}
	},

	created: function () {

		var that = this;

		that.$utils_link(that);

	},
	mounted: function () {

		var that = this;

		that.$utils_location_params(that);

		// if( that.key_custNo == null || that.key_custNo == 'undefined' || that.key_custNo == '' ){
		// 	location.href = 'hyundaimembers://checklogin##' + location.href ;
		// }else{
		// 	that.init();
		// }

	},
	methods: {

		 devRedirect: function () {

			var that = this;

			var params = {};

			params.custNo = that.key_custNo;
			params.uid = that.key_uid;

			BM.TEESCANNER_TKN(params, function (res) {

				location.href = res.REDIRECT_URL;

			}, function () {

			});

		}

		/**
		 *
		 *   약광동의 API 호출
		 *
		 * 2018/8/13 下午3:39
		 */
		, termsAgree: function () {

			var that = this;

			var params = {}

			params.custNo = that.key_custNo;

			BM.PRIVACY_AGREEMENT_INSERT(params, function (res) {

				if (res.resultYn == 'Y') {

					that.termsYn = 'Y';
					that.termsShow = false;
					that.$utils_popupForm(that, true, '', '정보제공 동의 성공', true, function () {
						that.devRedirect();
					});

				} else {

					that.$utils_popup(that, true, '', res.errorMessage);

				}

			}, function (code, msg) {

				that.$utils_popup(that, true, '', msg);

			});

		},


		testClick: function () {
			var that = this;

			var that = this;

			if (that.key_custNo == null || that.key_custNo == 'undefined' || that.key_custNo == '') {
				location.href = 'hyundaimembers://checklogin##' + location.href;
				return;
			}

			that.custNo = that.key_loginUserNo;
			that.loading_type = true;

			var params = {};

			params.custNo = that.key_custNo;

			BM.PRIVACY_AGREEMENT_CHECK(params, function (res) {

				that.loading_type = false;

				if (res.resultYn == 'Y') {
					that.termsShow = true;

				} else {
					that.termsShow = true;
					//that.$utils_popup(that, true, '', res.errorMessage);

				}

			}, function (code, msg) {
				that.loading_type = false;
				that.$utils_popup(that, true, '', msg);
			});

		},

		/**
		 *
		 * 약관등의
		 *
		 * 2018/8/13 下午3:32
		 */
		termsClick: function () {

			var that = this;

			if (that.key_custNo == null || that.key_custNo == 'undefined' || that.key_custNo == '') {
				location.href = 'hyundaimembers://checklogin##' + location.href;
				return;
			}

			that.custNo = that.key_loginUserNo;
			that.loading_type = true;

			var params = {};

			params.custNo = that.key_custNo;

			BM.PRIVACY_AGREEMENT_CHECK(params, function (res) {

				that.loading_type = false;

				if (res.resultYn == 'Y') {
					that.termsShow = false;

					that.$utils_popupForm(that, true, '', '정보제공 동의 했습니다', true, function () {
						that.devRedirect();
					});
				} else {
					that.termsShow = true;
					//that.$utils_popup(that, true, '', res.errorMessage);

				}

			}, function (code, msg) {
				that.loading_type = false;
				that.$utils_popup(that, true, '', msg);
			});


		}
	}

})