
Vue.use(scroll);

var vm = new Vue ({
    el:".container",
    data: {
        menuIdx : 0 ,
        brandMenuId : 'CTGBRAND',       // 브랜드 메뉴 아이디
        pageNo : 1,	                    // 페이지
        loadValue : 100,                // 로드 위치
        loadStatus :true,               // 로드 상태
        menuList: [],                   // menu data
        menuShow: false,
        perLineFive: false,             // category_box 에 한줄에 매뉴 노출 수량 4개 or 5개
        categoryIdx: 0 ,
        categoryList: [],               // 카테고리
        mainSwiper: [],                 // 배너
        productList: [],                // 상품
        productCountType : 1            //
        ,loading_show : true
        ,coupon_box : ''
        ,wallet_url : ''
        ,loading_type : false
        ,popdata : {
            alertOption : false
            ,alertTitle : ''
            ,alertContent : ''
            ,alertStyle : ''
        }
        ,rmd_categoryShow :false             //인기 카테고리 노출 여부
        ,rmd_brandShow : false               //인기 브랜드 노출 여부
        ,brand_infoShow : false             //브랜드 리시트 정보 노출 여부

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
	watch:{

		menuIdx:function(newVal , oldVal){
			this.rmd_categoryShow = true;
			this.rmd_brandShow = true;
            if(newVal != '0' || newVal != 0){
                this.rmd_categoryShow = false;
                this.rmd_brandShow = false;
            }

            if( newVal === this.brandMenuId ){
                this.brand_infoShow = true;
            }else{
	            this.brand_infoShow = false;
            }
        }
    }
    ,mounted: function() {
        var that = this;

        that.$utils_location_params( that );

        that.echoss_link( function(){
            that.$utils_link( that );

            that.$ScrollStart( that , function(){
                that.productData( false );
            });

            that.coupon_box = [
                'coupon_box.html'
                ,'?'
                ,'custNo=' + that.key_custNo
                ,'&'
                ,'uid=' + that.key_uid
            ].join('');

            that.wallet_url =[
                'wallet.html'
                ,'?custNo=' + that.key_custNo
                ,'&'
                ,'uid=' + that.key_uid
            ].join('');

            var param = {};
            param.custNo = that.key_custNo;
            // 181002 추가( 최초화면을 혜택화면으로 )
            // that.key_menuIdx = '0';

            if(that.key_menuIdx === undefined || that.key_menuIdx === '0' || that.key_menuIdx === 0 ){
                that.menuIdx = '0';
            }

            if( that.key_menuIdx != null && that.key_menuIdx != "undefined" && that.key_menuIdx != "0"){
                param.ctgrGrpCd = that.key_menuIdx;
                that.menuIdx = that.key_menuIdx;
            }

            if( that.key_categoryIdx != null && that.key_categoryIdx != "undefined" ){
                param.ctgrCd = that.key_categoryIdx;
                that.categoryIdx = that.key_categoryIdx;
            }

            that.loading_type = true;

            BM.MAIN( param ,function( res ){
                that.mainData( res );
                if(res.bnrList.length > 0){
                    that.banrData( res );
                }
                that.productData(  true , res );
                that.loading_type = false;
            },function( code , msg ){
                that.loading_type = false;
                that.$utils_popup( that , true , '' , msg );

            });
        });

    },
    computed: {
        filterCategory:function(){
            return this.categoryList.parts.slice(1);
        }
    },
    methods: {
        echoss_link : function( callback ){

            var that = this;

            that.$utils_echossHttpSend(PF_URL + "/fcm/gateway/link", {

                uid     : that.key_uid,
                sid     : that.key_uid,
                sto     : 0

            }, "POST", function(result) {

                that.key_custNo = result.user;
                var scheme = result.scheme;
                that.key_scheme = scheme;

                var historyParam = {};

                historyParam.custNo = that.key_custNo;
                historyParam.uid = that.key_uid;

                that.$utils_history_replaceState( historyParam );

                return callback();

            }, function(errorCode, errorMessage, result) {
                if(result != undefined) {
                   var scheme = result.scheme;
                    that.key_scheme = scheme;
                }

                return callback();

            });

        }
	 ,userInfo : function(){

            var that = this;

            var param = {};
            param.custNo = that.key_custNo;
            try {
                BM.REGIST(param, function (res) {

                }, function (code, msg) {

                });
            }catch( e ){

                //error

            }

        }

        ,cityIndex: function() {
            var cityId = event.target.value;
            if(cityId !=0) {
                this.selectAllCity = false
            }
        }

        ,categoryFocus : function(){

            var that = this;

            try {

                setTimeout(function(){

                    var _id = that.categoryIdx;

                    var _category = document.querySelector('.category_banner');

                    if( that.categoryIdx == 0 || that.categoryIdx == null || that.categoryIdx == '' ){
                        _category.scrollLeft = 0;
                        return;
                    }

                    var _li = _category.getElementsByTagName('li');

                    _li_Left = 0;

                    _li_that_left = 0;

                    _li_No = 0;

                    _li_i = 0;

                    for (var i = 0; i < _li.length; i++) {

                        var _item = _li[i];

                        if( _li_No <= 0 ){

                            _li_No = _item.clientWidth;

                        }

                        if (_item.querySelector('a').getAttribute('data-id') == _id) {

                            _li_i = i + 1;

                            _li_that_left = document.querySelector('*[data-id='+ _id +']').offsetLeft;

                            break;

                        }

                        _li_Left += _item.clientWidth;

                    }

                    var _scrollLeft = 0 ;


                    var _win_width = document.documentElement.clientWidth;

                    _scrollLeft = (( _win_width - _li_No ) / 2).toFixed(0);

                    _scrollLeft = _li_that_left - _scrollLeft;

                    _category.scrollLeft = _scrollLeft;


                },1);

            }catch (e) {

                //error

            }


        }
        /**
         *
         * 상품 정보
         *
         * */
        ,productData : function( scroll , data ){

            var that = this;

            if(!scroll){

                if(that.productCountType <= 0){

                    return;

                }
                that.loadStatus = false;
                that.loading_show = false;
                var param = {};
                param.lastSelNo = that.productList.length;
                param.custNo = that.key_custNo;
                if( that.menuIdx !== 0 && that.menuIdx != '0' ){
                    if(that.categoryIdx !== 0){
                        param.ctgrGrpCd = that.menuIdx;
                        param.ctgrCd = that.categoryIdx;
                        if(param.ctgrCd === ''){

                            param.ctgrCd = '';

                        }
                    }else{
                        param.ctgrGrpCd = '';
                        param.ctgrCd = '';
                    }
                }else{
                    param.ctgrGrpCd = '';
                }
                console.log(param);
                BM.SAL_GOODS_LIST( param ,function(res){

                    that.loadStatus = true;
                    that.loading_show = true;
                    if( res.salGoodsList.length > 0 ){
                        that.productData_handle( scroll ,  res);
                    }else{
                        that.productCountType = 0;
                    }


                },function( code , msg ){
                    that.loadStatus = true;
                    that.loading_show = true;
                });

            }else{
                that.productCountType = 1; //
                that.productData_handle( scroll , data );

            }
        }
        ,productData_handle : function( scroll , data ){

            var that = this;

            var productList = new Array();
            for(var i = 0 ; i < data.salGoodsList.length ; i++ ){
                var _item = data.salGoodsList[i];

                //goodsSalGbn 1 포인트 쿠폰
                //goodsSalGbn 2 할인 쿠폰

                if(_item.goodsSalGbn == '1' ){

                    _item.url = 'details.html'+
                        '?custNo='+ that.key_custNo +''+
                        '&uid=' + that.key_uid + '' +
                        '&productId='+ _item.goodsCd +' ';

                }

                if(_item.goodsSalGbn == '2' ){

                    _item.url = 'discount_details.html'+
                        '?custNo='+ that.key_custNo +''+
                        '&uid=' + that.key_uid + '' +
                        '&productId='+ _item.goodsCd +' ';

                }

                if(_item.goodsQttEpsYn == 'N' ){

                    _item.url = 'details_1.html'+
                        '?custNo='+ that.key_custNo +''+
                        '&uid=' + that.key_uid + '' +
                        '&productId='+ _item.goodsCd +' ';

                }


                productList.push( _item );
            }

            if( scroll ){

                that.productList = productList;

            }else{

                for(var i = 0 ; i < productList.length ; i++ ){

                    that.productList.push( productList[i] );

                }

            }

            that.categorySort(that.key_categoryIdx , that.productList );

        }
        //배너 정보
        ,banrData : function( data ){
            var that = this;

            /*
                배너 연결 구분 :
                0-연결없음
                1-상품연결
                2-외부연결
                3-내부연견
             */

            var arr = new Array();

            for(var i = 0 ; i < data.bnrList.length ;i++ ){

                var _item = data.bnrList[i];

                var _href = 'javascript:void(0);';

                var _target = '_blank';

                switch(_item.bnrLinkGbn){

                    case "1":

                        //상품연결
                        //


                        if(_item.goodsSalGbn == '1' ){

                            _href = 'details.html'+
                                '?custNo='+ that.key_custNo +''+
                                '&uid=' + that.key_uid + '' +
                                '&productId='+ _item.goodsCd +' ';

                        }

                        if(_item.goodsSalGbn == '2' ){

                            _href = 'discount_details.html'+
                                '?custNo='+ that.key_custNo +''+
                                '&uid=' + that.key_uid + '' +
                                '&productId='+ _item.goodsCd +' ';

                        }

                        break;
                    case "2":

                        //외부연결
                        _href = _item.linkUrl;

                        _target = '_blank';

                        break;
                    case "3":

                        //내부연결
                        _href = [
                            _item.linkUrl
                            ,'?'
                            ,'custNo=' + that.key_custNo
                            ,'&'
                            ,'uid=' + that.key_uid
                            ,'&'
                            ,'bannerNm=' + _item.bnrNm
                            ,'&'
                            ,'linkUrl=' + encodeURIComponent(_item.linkUrl)
                        ].join('');

                        break;

                }

                _item.href = _href;

                _item.target = _target;


                arr.push( _item );
            }

            that.mainSwiper     = arr;

            setTimeout(function(){
                new Swiper ('.main_swiper',{
                    autoplay: {
                        delay: 4000
                        ,disableOnInteraction : false
                    },
                    loop: true,
                    pagination: {
                        el: '.main_pagination'
                    }
                });
            },1);

        }
        /**
        *
        * 메인 정보
        *
        */
        ,mainData : function( data ){
            var that = this;
            var menuList        = new Array();
            var categoryList    = new Array();
            menuList.push({
                    id : 0
                    ,name : '홈'
            });
            //메뉴 정보
            for(var i = 0 ; i < data.ctgrGrpList.length ; i++ ){
                var _item   = data.ctgrGrpList[i];

                //메뉴
                var _menu_param  = {};
                _menu_param.id   = _item.ctgrGrpCd;
                _menu_param.name = _item.ctgrGrpNm;
                menuList.push(_menu_param);

                //카테고리
                var _category_param = {};
                _category_param.categoryType = _item.ctgrGrpCd;
                _category_param.categoryNm = _item.ctgrGrpNm;
                _item.ctgrList.unshift({
                    ctgrCd : ''
                    ,ctgrImg : 'images/icon_all_category.png'
                    ,ctgrNm :'전체'
                });
                _category_param.parts = _item.ctgrList;
                categoryList.push( _category_param );

            }

            //브랜드 메뉴 추가
            var _brandInfo = {
	            id : that.brandMenuId
		        ,name : '브랜드'
            }

            menuList.push(_brandInfo);

            that.menuList       = menuList;
            that.categoryList   = categoryList;
            that.categoryFocus();

        }
        /**
        * *************************************************************************
        * ********************************** 그룹 **********************************
        * *************************************************************************
        *
        */
        ,selectgroup : function( e ){
            var that = this;
            var parent = e.target;
            var p = true;
            while( p ){
                if( parent.getAttribute('data-id') != null && parent.getAttribute('data-id') != '' ){
                    p = false;
                }else{
                    parent = parent.parentNode;
                }
            }
            var id = parent.dataset.id;
            that.menuIdx = id;
            that.categoryIdx = 1;

		    that.rmd_categoryShow = false;
		    that.rmd_brandShow = false;

            var id = parent.dataset.id;
            that.categoryIdx = id;

            var historyParam = {};

            if( that.menuIdx == '0' ){
                historyParam.custNo = that.key_custNo;
                historyParam.uid = that.key_uid;
            }else {
                historyParam.custNo = that.key_custNo;
                historyParam.menuIdx = that.menuIdx;
                historyParam.categoryIdx = '';
                historyParam.uid = that.key_uid;
            }

            that.$utils_history_replaceState( historyParam );

            var param = new Array();

            if( that.menuIdx == 0 ){
                param.custNo = that.key_custNo;
            }else{
                param.ctgrGrpCd = that.menuIdx;
                param.custNo = that.key_custNo;
                param.ctgrCd = '';
                that.key_categoryIdx = '';
                that.categoryIdx = '';
            }

            that.loading_type = true;

            BM.MAIN( param ,function( res ){
                if( res.bnrList.length > 0 ){
                    that.banrData( res );
                }
                that.productData(  true , res );

                that.loading_type = false;

            },function( code , msg ){

                that.loading_type = false;
                that.$utils_popup( that , true , '' , msg );

            });
            // param.ctgrGrpCd = 'CTG0001';

        }
        //카테고리
        ,selectCategory : function( e ){
            var that = this;
            var parent = e.target;
            var p = true;
            while( p ){
                console.log(parent.getAttribute('data-id'));
                if( parent.getAttribute('data-id') != null){
                    p = false;
                }else{
                    parent = parent.parentNode;
                }
            }
            var id = parent.dataset.id;
            that.categoryIdx = id;

            var param = new Array();

            var _menuSHow = false;

            if(that.menuShow){
                that.menuShow = false;
                that.menuIdx = parent.getAttribute('data-group_id');
                _menuSHow = true;
            }

            param.custNo = that.key_custNo;
            param.ctgrGrpCd = that.menuIdx;

            console.log(param.ctgrGrpCd)
        if( that.categoryIdx === '' ){

                param.ctgrCd = '';

            }else{

                param.ctgrCd = that.categoryIdx;

            }
            console.log(param);


            //$utils_history_replaceState

            var historyParam = {};

            historyParam.custNo = that.key_custNo;
            historyParam.menuIdx = that.menuIdx;
            historyParam.categoryIdx = that.categoryIdx;
            historyParam.uid = that.key_uid;

            that.$utils_history_replaceState( historyParam );

            that.key_categoryIdx = that.categoryIdx;

            that.$utils_pageView( that );

            that.loading_type = true;

            BM.MAIN( param ,function( res ){

                console.log("categroy : " + that.categoryIdx);

                if( res.bnrList.length > 0 ){

                    that.banrData( res );

                }
                //menuShow
                console.log(that.menuShow);

                that.productData(  true , res );

                that.loading_type = false;

                if(_menuSHow){

                    that.categoryFocus();

                }

                //that.categoryFocus();

            },function( code , msg ){
                that.loading_type = false;
                that.$utils_popup( that , true , '' , msg );
            });

        }
        /**
        *
        *   카테고리 정렬
        *
        * 2018/8/13 上午10:46
        */
        ,categorySort:function( categoryId , data ){

            var that = this;

            try {
                console.log(categoryId);
                //data.salGoodsList
                if (categoryId == 'CTG0001CT0010') {

                    // 순서	극 장 명	            상품코드
                    // 1	잠실 자동차극장	        G18080601272
                    // 2	일산 자유로극장	        G18080601273
                    // 3	장흥 자동차극장	        G18080601274
                    // 4	양평 유니모극장	        G18080601275
                    // 5	광릉수목원 자동차극장	    G18080601276
                    // 6	포천자동차극장	        G18080601277
                    // 7	무비마운틴	            G18080601285
                    // 8	시네마파크	            G18080601278
                    // 9	씨네 80	            G18080601284
                    // 10	블루마씨네	            G18080601281
                    // 11	대전 자동차극장	        G18080601282
                    // 12	씨네드림	            G18080601280
                    // 13	강릉 자동차극장	        G18080601279
                    // 14	오송 자동차극장	        G18080601288
                    // 15	용봉산 시네마	        G18080601286
                    // 16	로드 시네마	        G18080601287

                    var categoryCdList = new Array();

                    categoryCdList.push('G18080601272');
                    categoryCdList.push('G18080601273');
                    categoryCdList.push('G18080601274');
                    categoryCdList.push('G18080601275');
                    categoryCdList.push('G18080601276');
                    categoryCdList.push('G18080601277');
                    categoryCdList.push('G18080601285');
                    categoryCdList.push('G18080601278');
                    categoryCdList.push('G18080601284');
                    categoryCdList.push('G18080601281');
                    categoryCdList.push('G18080601282');
                    categoryCdList.push('G18080601280');
                    categoryCdList.push('G18080601279');
                    categoryCdList.push('G18080601288');
                    categoryCdList.push('G18080601286');
                    categoryCdList.push('G18080601287');

                    var categorySortList = new Array();

                    for (var i = 0; i < categoryCdList.length; i++) {
                        let code = categoryCdList[i];
                        for (let q = 0; q < data.length; q++) {
                            let item = data[q];
                            if (item.goodsCd == code) {
                                categorySortList.splice(i, 0, item);
                            }
                        }
                    }

                    var categoryCdString = categoryCdList.join('');

                    for (let q = 0; q < data.length; q++) {
                        let item = data[q];
                        if (categoryCdString.indexOf(item.goodsCd) == -1) {
                            categorySortList.push(item);
                        }
                    }

                    that.productList = categorySortList;

                }else if(categoryId == 'CTG0002CT0019'){

                    var categoryCdList = new Array();

                    categoryCdList.push('G18081401307');
                    categoryCdList.push('G18081401306');
                    categoryCdList.push('G18081401305');

                    var categorySortList = new Array();

                    for (var i = 0; i < categoryCdList.length; i++) {
                        let code = categoryCdList[i];
                        for (let q = 0; q < data.length; q++) {
                            let item = data[q];
                            if (item.goodsCd == code) {
                                categorySortList.splice(i, 0, item);
                            }
                        }
                    }

                    var categoryCdString = categoryCdList.join('');

                    for (let q = 0; q < data.length; q++) {
                        let item = data[q];
                        if (categoryCdString.indexOf(item.goodsCd) == -1) {
                            categorySortList.push(item);
                        }
                    }

                    that.productList = categorySortList;

                }else if(categoryId == 'CTG0001CT0009' ){

                    var categoryCdList = new Array();

                    categoryCdList.push('G18062701128');
                    categoryCdList.push('G18081401307');
                    categoryCdList.push('G18081401306');
                    categoryCdList.push('G18081401305');

                    var categorySortList = new Array();

                    for (var i = 0; i < categoryCdList.length; i++) {
                        let code = categoryCdList[i];
                        for (let q = 0; q < data.length; q++) {
                            let item = data[q];
                            if (item.goodsCd == code) {
                                categorySortList.splice(i, 0, item);
                            }
                        }
                    }

                    var categoryCdString = categoryCdList.join('');

                    for (let q = 0; q < data.length; q++) {
                        let item = data[q];
                        if (categoryCdString.indexOf(item.goodsCd) == -1) {
                            categorySortList.push(item);
                        }
                    }

                    that.productList = categorySortList;


                }

            }catch(e ){

                console.log('카테고리 순서 에러');

            }



        }
    }
});


var recommendSwiper = new Swiper('.recommend_swiper',{
    // autoplay: {
    //     delay: 5000,
    // },
    loop: true,
    slidesPerView : 2,
    slidesPerGroup : 2,
    // spaceBetween : '10%',
    pagination: {
        el: '.recommend_pagination'
    }
});
