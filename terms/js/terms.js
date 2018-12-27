
var vm = new Vue({
    el: '.container',
    data: {
        termsShow:false , // popup 사용 여부
        termsYn  : 'N',
        loading_type : false
        ,popdata : {

            alertOption : false
            ,alertTitle : ''
            ,alertContent : ''
            ,alertStyle : ''

        }
    },

    created:function(){

        var that = this;

        that.$utils_link( that );

    },
    mounted: function() {

        var that = this;

        that.$utils_location_params( that );

        if( that.key_custNo == null || that.key_custNo == 'undefined' || that.key_custNo == '' ){

            location.href = 'hyundaimembers://checklogin##' + location.href ;

        }else{

            that.init();

        }



    },
    methods: {


        /**
        *
        *   약광동의 API 호출
        *
        * 2018/8/13 下午3:39
        */
        termsAgree:function(){

            var that = this;

            var params = {}

            params.custNo = that.key_custNo;

            BM.PRIVACY_AGREEMENT_INSERT( params, function( res){

                if(res.resultYn == 'Y'){

                    that.$utils_popup(that, true , '' , '정보제공 동의 성공' );
                    that.termsYn = 'Y';
                    that.termsShow = false;

                }else{

                    that.$utils_popup(that, true , '' , res.errorMessage );

                }

            } ,function( code , msg ){

                that.$utils_popup(that,true , '' , msg );

            } );

        },

        /**
        *
        * 약관등의
        *
        * 2018/8/13 下午3:32
        */
        termsClick:function(){

            var that = this;

            if( that.termsYn == 'Y' ){

                //that.$utils_popup(that,true , '' , '정보제공 동의 했습니다' );
                that.termsShow = true;
            }else{

                that.termsShow = true;

            }

        },
        /**
        *
        *   초기화
        *
        * 2018/8/10 上午11:58
        */
        init:function(){

            var that = this;

            that.custNo = that.key_loginUserNo;
            that.loading_type = true;

            var params = {};

            params.custNo = that.key_custNo;

            BM.PRIVACY_AGREEMENT_CHECK( params , function( res ){

                that.loading_type = false;

                if(res.resultYn == 'Y' ){
                    that.termsYn = res.agreeExistsYn;
                }else{

                    that.$utils_popup(that, true , '' , res.errorMessage );

                }

            },function (code , msg ) {
                that.loading_type = false;
                that.$utils_popup(that,true ,'' ,  msg );
            });

        }

    }

});