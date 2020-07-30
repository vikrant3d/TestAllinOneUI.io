
function resizeCustPic(obj,e){
		resizeImageToSpecificWidth($(obj).attr('data-fileid')+"custPic",e);		
	}
    function resizeImageToSpecificWidth(imgPath,e) {
		var width = 190;
        if (e.target.files && e.target.files[0]) {
            var reader = new FileReader();
            reader.onload = function(event) {
                var img = new Image();
                img.onload = function() {
                    if (img.width > width) {
                        var oc = document.createElement('canvas'), octx = oc.getContext('2d');
                        oc.width = img.width;
                        oc.height = img.height;
                        octx.drawImage(img, 0, 0);
                        while (oc.width * 0.5 > width) {
                            oc.width *= 0.5;
                            oc.height *= 0.5;
                            octx.drawImage(oc, 0, 0, oc.width, oc.height);
                        }
                        oc.width = width;
                        oc.height = width;//oc.width * img.height / img.width;
                        octx.drawImage(img, 0, 0, oc.width, oc.height);
						//$(".fa-refresh").remove();
                        document.getElementById(imgPath+"-image").src = oc.toDataURL();
                    }
                };
                document.getElementById(imgPath+"-orignal").src = event.target.result;
                img.src = event.target.result;
				document.getElementById(imgPath+"-image").style.height="100px"
		    };
            reader.readAsDataURL(e.target.files[0]);
			
        }		
    }