
new Vue ({
    el :'.container'
    ,data :{
    }
    ,created:function(){

        var that = this;

        that.$utils_link( that );

    }
    ,mounted : function(){

        var that = this;

        that.$utils_location_params(that);

    }
    ,methods :{

        wallet_url : function(){

            var that = this;

            var _url = [
                'wallet.html'
                ,'?'
                ,'custNo=' + that.key_custNo
                ,'&'
                ,'uid=' + that.key_uid
            ].join('');

            location.href = _url;

        }

    }

});