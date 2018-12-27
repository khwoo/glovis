// remSize();
// window.addEventListener('resize',function() {
// 	remSize();
// });
// function remSize() {
//
// 	let htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;
// 	let htmlDom = document.getElementsByTagName('html')[0];
// 	htmlDom.style.fontSize = htmlWidth / 10 + 'px';
//
// }

function adapt(designWidth, rem2px){
    var d = window.document.createElement('p');
    d.style.width = '1rem';
    d.style.display = "none";
    var head = window.document.getElementsByTagName('head')[0];
    head.appendChild(d);
    var defaultFontSize = parseFloat(window.getComputedStyle(d, null).getPropertyValue('width'));
    return defaultFontSize
};


!(function( doc , win , designWidth , rem2px ) {
    var docEl = doc.documentElement,
        defaultFontSize = adapt(designWidth, rem2px),
			//16,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',

        recalc = function() {
            var clientWidth = win.innerWidth
                || doc.documentElement.clientWidth
                || doc.body.clientWidth;

            if (!clientWidth) return;
            if (clientWidth < 750) {
                docEl.style.fontSize = clientWidth / designWidth * rem2px / defaultFontSize * 100 + '%';

            }

            // else {
            //     docEl.style.fontSize = clientWidth / designWidth * rem2px / defaultFontSize * 100 + '%';
            //     //docEl.style.fontSize = '625%';
            // }
        };
    if (!doc.addEventListener) return;

    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);

})(		document
		, window
		, document.documentElement.clientWidth
		,   document.documentElement.clientWidth / 10
);





// var _loading_str = '<div id="init_loading" class="loading_parent"><div class="loading_sub"></div></div>';
//
// document.write( _loading_str );

document.onreadystatechange = completeLoading;

//加载状态为complete时移除loading效果
function completeLoading() {
    if (document.readyState == "complete") {
        // var loadingMask = document.getElementById('init_loading');
        // loadingMask.parentNode.removeChild(loadingMask);
    }
}
