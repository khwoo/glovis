new Vue({

    el:".container",
    data: {
        link_url : ''
        ,widthStr:0
        ,heightStr:0
        ,brandName : '최인아책방'
    },
    filters:{



    },
    created:function(){

        var that = this;

        that.$utils_link( that );

    },
    mounted: function() {

        var that = this;

        that.$utils_location_params(that);

        that.brandName = that.key_bannerNm;

        that.link_url = decodeURIComponent(that.key_linkUrl);

        setTimeout(function(){
        var height = window.innerWidth;
        var width = window.innerWidth;
        var nav_height = document.querySelector('.container_box').offsetHeight;

        that.widthStr = window.innerWidth;
        that.heightStr = window.innerHeight - nav_height;



        },1);
    }
    ,methods: {

        echoss_link : function( callback ){

            var that = this;

            that.$utils_echossHttpSend(PF_URL + "/fcm/gateway/link", {

                uid     : that.key_uid,
                sid     : that.key_uid,
                sto     : 0

            }, "POST", function(result) {

                that.key_custNo = result.user;
                var scheme = result.scheme;

                var historyParam = {};

                historyParam.custNo = that.key_custNo;
                historyParam.uid = that.key_uid;

                that.$utils_history_replaceState( historyParam );

                that.wallet_url = scheme + "://echoss/close";

                return callback();

            }, function(errorCode, errorMessage, result) {
                if(result != undefined) {
                    var scheme = result.scheme;

                    that.wallet_url = scheme + "://echoss/close";
                }

                return callback();

            });

        }

    }

});