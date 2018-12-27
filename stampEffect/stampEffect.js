//Show Stamping Effect on screen
function startStampAnimation() {
	if (document.getElementById('modal-stamp') === null) {
        var elemDiv = document.createElement('div');
        elemDiv.id = 'modal-stamp';
        elemDiv.className = 'stamp-modal';
        var htmlStr = '';
        htmlStr += '<img src="./stampEffect/img_stamp_motion01.png" id="stampMotion01" />';
        htmlStr += '<img src="./stampEffect/img_stamp_motion02.png" id="stampMotion02" />';
        htmlStr += '<img src="./stampEffect/img_stamp_motion03.png" id="stampMotion03" />';
        htmlStr += '<img src="./stampEffect/img_stamp_motion04.png" id="stampMotion04" />';
        htmlStr += '<img src="./stampEffect/img_stamp_motion05.png" id="stampMotion05" />';        
        elemDiv.innerHTML = htmlStr;
        document.body.appendChild(elemDiv);
    }
	
    document.getElementById('modal-stamp').classList.add("effect-show");
    document.getElementById('stampMotion01').classList.add("rotateImgSlow");
    document.getElementById('stampMotion02').classList.add("rotateReverseImgFast");
    document.getElementById('stampMotion03').classList.add("rotateImgFast");
    document.getElementById('stampMotion05').classList.add("scaleUpImg");
}

// Dismiss Stamping Effect on screen
function stopStampAnimation() {
    if( document.getElementById('modal-stamp') == undefined )
        return;
    
    document.getElementById('modal-stamp').classList.remove("effect-show");
    document.getElementById('stampMotion01').classList.remove("rotateImgSlow");
    document.getElementById('stampMotion02').classList.remove("rotateReverseImgFast");
    document.getElementById('stampMotion03').classList.remove("rotateImgFast");
    document.getElementById('stampMotion05').classList.remove("scaleUpImg");
}
