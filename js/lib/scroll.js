

var scroll = {};

scroll.install = function( Vue , options ){

	Vue.prototype.$ScrollStart = function( vue , callback ){

		document.addEventListener('scroll' , function(e){

			Load( vue , document , function( res ){

				if( res && vue.loadStatus ){
					return callback( true );
				}

			});

		}, false );

	}

	var Load = function( vue , document , callback ){

		var _top = getScrollTop(document);

		vue = vue || {};

		var _clientHeight = getClientHeight(document);

		var _pageHeight = getPageHeight(document);

		var loadValue = vue.loadValue;

		if( ( _top + _clientHeight + loadValue ) >= _pageHeight ){

			return callback(true );

		}

		return callback(false);

	}

	var getScrollTop = function( dom ){

		var _top = 0;
		_top = ( dom.documentElement.scrollTop || 0 ) + ( document.body.scrollTop || 0 );
		return _top;

	}

	var getClientHeight = function( dom ){

		var _clientHeight = 0;

		_clientHeight = dom.documentElement.clientHeight || 0;

		return _clientHeight;

	}

	var getPageHeight = function(dom){

		var _pageHeight = 0;

		_pageHeight = dom.documentElement.offsetHeight || 0;

		return _pageHeight;

	}
	
}