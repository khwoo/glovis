
var image_load = {};
image_load.install = function( Vue , options ){
	options.str = 0;
	var image = [];
	Vue.prototype.$ImageLoad_Start = function( callback ){
		var _el = document.querySelector( options.el );
		var images = _el.querySelectorAll('img');
		var imageLen = images.length;
		if(imageLen <= 0 ){
			return;
		}
		_el.style.display = 'none';
		for(var i = 0 ; i < imageLen ; i++ ){
			var _item = images[i];
			var _src = _item.getAttribute('src');
			image[ i ] = new Image();
			image[ i ].src = _src;
			image[ i ].onload = function(){
				options.str += 1;
				if( options.str >= image.length ){
					_el.style.display = '';
				}
			}
		}
	}
}