
var myPath="../";
if(document.getElementById("myConfigLib") != null){
	myPath="";
}
var footerSection =  '<br><br><footer class="footer">'+
            '<div class="container">'+
                '<div class="row">'+
                    '<div class="col-md-9">'+
                        '<div class="footer-text one">'+
                            '<h3>CONTACT US</h3>'+
                            '<ul>'+
                                '<li><a href="javascript:void(0)"><i class="material-icons">location_on</i>Sector 23, Plot Number 142, ULWE, Navi Mumbai</a></li>'+
                                '<li><a href="mailto:info@ulweallinone.in" target="_blank"><i class="material-icons">email</i>info@ulweallinone.in</a></li>'+							''+								
								'<li><a href="'+myPath+'PrivacyPolicy.html"><i class="material-icons">privacy_tip</i>Privacy Policy / Team & Condition</a></li>'+
								'<li>'+
									'<a target="_blank" href="https://api.whatsapp.com/send?phone=+919820684534&amp;text=Hi"><img src="'+myPath+'img/whatsapp.png" style="height:40px"></a>&nbsp;&nbsp;'+
									'<a href="#" onclick="return openFBDetails();" ><img style="height:40px" src="'+myPath+'img/fb.png"></a>&nbsp;&nbsp;'+
									'<a target="_blank" href="http://twitter.com/share?text=Ulwe AllinOne Best website in Navi Mumbai&url=http://ulweallinone.in&hashtags=Ulwe,naviMumbai" ><img src="'+myPath+'img/twitter.png" style="height:40px" /></a>&nbsp;&nbsp;'+
									'<a href="tel:9820684534"><img style="height:40px" src="'+myPath+'img/callus.png"></a>&nbsp;&nbsp;'+
									'<a href="mailto:info@ulweallinone.in" target="_blank"><img style="height:40px" src="'+myPath+'img/email.png"></a>'+
								'</li>'+
				    		'</ul>'+
                        '</div>'+
                    '</div>'+
					'<div class="col-md-3">'+
                        '<div class="footer-text one">'+
                            '<br>'+
                            '<ul>'+
                                '<li><img src="'+myPath+'img/3dDesignLogo.png" /></li>'+
								'<li class="playStoreIcon"><a target="_blank" href="https://play.google.com/store/apps/details?id=com.ulweallinone&amp;pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1"><img alt="Get it on Google Play" src="'+myPath+'img/applogo.PNG" style="height:60px;border-radius:10px"></a></li>'+
							'</ul>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>'+
            '<div class="footer_bottom">'+
                '<p>Copyright@2020 <a href="javascript:void(0)" id="serviceArea">UlweAllinOne</a> All Rights Reserved</p>'+
            '</div>'+
        '</footer>';
		
var deliverySection = '<section class="ftco-section">'+
			'<div class="container">'+
				'<div class="row no-gutters ftco-services">'+
          '<div class="col-md-3 text-center d-flex align-self-stretch">'+
            '<div class="media block-6 services mb-md-0 mb-4">'+
              '<div class="icon bg-color-1 active d-flex justify-content-center align-items-center mb-2">'+
            		'<span class="flaticon-shipped"></span>'+
              '</div>'+
              '<div class="media-body">'+
                '<h3 class="heading">Free Shipping</h3>'+
                '<span>On order over 200 Rs.</span>'+
              '</div>'+
            '</div>'+  
          '</div>'+
          '<div class="col-md-3 text-center d-flex align-self-stretch">'+
            '<div class="media block-6 services mb-md-0 mb-4">'+
              '<div class="icon bg-color-2 d-flex justify-content-center align-items-center mb-2">'+
            		'<span class="flaticon-diet"></span>'+
              '</div>'+
              '<div class="media-body">'+
                '<h3 class="heading">Always Fresh</h3>'+
                '<span>Product well package</span>'+
              '</div>'+
            '</div>'+
          '</div>'+
          '<div class="col-md-3 text-center d-flex align-self-stretch">'+
            '<div class="media block-6 services mb-md-0 mb-4">'+
              '<div class="icon bg-color-3 d-flex justify-content-center align-items-center mb-2">'+
            		'<span class="flaticon-award"></span>'+
              '</div>'+
              '<div class="media-body">'+
                '<h3 class="heading">Superior Quality</h3>'+
                '<span>Quality Products</span>'+
              '</div>'+
            '</div>'+  
          '</div>'+
          '<div class="col-md-3 text-center d-flex align-self-stretch">'+
            '<div class="media block-6 services mb-md-0 mb-4">'+
              '<div class="icon bg-color-4 d-flex justify-content-center align-items-center mb-2">'+
            		'<span class="flaticon-customer-service"></span>'+
              '</div>'+
              '<div class="media-body">'+
                '<h3 class="heading">Support</h3>'+
                '<span>8:00 AM To 8:00 PM, Support</span>'+
              '</div>'+
            '</div>'+      
          '</div>'+
        '</div>'+
			'</div>'+
		'</section>';	
		
var topHeader = '<div class="container">'+
    		'<div class="row no-gutters d-flex align-items-start align-items-center px-md-0">'+
	    		'<div class="col-lg-12 d-block">'+
		    		'<div class="row d-flex">'+
		    			'<div class="col-md-9 pr-4 d-flex  align-items-center">'+
					    	' <span class="text" style="color: white;font-size: 26px;font-weight: bold;"><img src="'+myPath+'img/mainlogo.png" style="height:75px;"/></span>'+
					    '</div>'+					    
					    '<div class="col-md-3 pr-4 d-flex topper align-items-center text-lg-right">'+
                          '<a href="'+$(".icon-shopping_cart").parent().attr('href')+'" class="nav-link" >'+
								'<img src="'+myPath+'img/mycart.png" style="height: 57px" />'+
								'<span class="cardCount" style="font-size: 29px;color:black;margin-top: 2px;position: absolute;"></span>'+
							'</a>'+
                        '</div>'+
				    '</div>'+
			    '</div>'+
		    '</div>'+
		  '</div>';	
		  
var topHeaderLogo = '<div class="container">'+
    		'<div class="row no-gutters d-flex align-items-start align-items-center px-md-0">'+
	    		'<div class="col-lg-12 d-block">'+
		    		'<div class="row d-flex">'+
		    			'<div class="col-md-9 pr-4 d-flex  align-items-center">'+
					    	' <span class="text" style="color: white;font-size: 26px;font-weight: bold;"><img src="'+myPath+'img/mainlogo.png" style="height:75px;"/></span>'+
					    '</div>'+
				    '</div>'+
			    '</div>'+
		    '</div>'+
		  '</div>';	

var slideImageSection=
	'<style>'+	
	'#sliding-image-1 {'+			   
			'background-image: url("images/bg_1.jpg");'+
		'}'+		  
		'#sliding-image-2 {'+			   
			'background-image: url("images/bg_2.jpg");'+
		'}'+
	'@media only screen and (max-width: 600px) {'+	
		'#sliding-image-1 {'+			   
			'background-image: url("images/bg_1_m.jpg");background-size: cover;'+
		'}'+		  
		'#sliding-image-2 {'+			   
			'background-image: url("images/bg_2_m.jpg");background-size: cover;'+
		'}'+			
	'}</style>'+
	'<section id="home-section" class="hero">'+
		  '<div class="home-slider owl-carousel">'+
	      '<div class="slider-item" id="sliding-image-1">'+
	      	'<div class="overlay"></div>'+
	      '</div>'+
		'<div class="slider-item" id="sliding-image-2">'+
	      	'<div class="overlay"></div>'+
	      '</div>'+
	    '</div>'+
    '</section>';
	
var cartSlider='<style>'+	
	'#sliding-image-1 {'+			   
			'background-image: url("images/bg_1.jpg")'+
		'}'+
	'@media only screen and (max-width: 600px) {'+	
		'#sliding-image-1 {'+			   
			'background-image: url("images/bg_1_m.jpg");background-size: cover;'+
		'}'+			
	'}</style>'+
	'<div class="hero-wrap hero-bread" id="sliding-image-1"></div>'+
	'<div class="container">'+
		'<div class="row text-center" style="display: block;width: 100%;">'+
			'<img src="../img/mycartdetails.png" style="max-width:100%">'+
		'</div>'+
	'</div>';	
	
var parentTopHeader = 
			'<div class="container">'+
    		'<div class="row no-gutters d-flex align-items-start align-items-center px-md-0">'+
	    		'<div class="col-lg-12 d-block">'+
		    		'<div class="row d-flex">'+
		    			'<div class="col-md-8">'+
					    	'<span class="text" style="font-size:28px;color:white;font-weight:bold">'+
									'<img src="img/mainlogo.png" style="height:75px;">'+
							'</span>'+
					    '</div>'+
						'<div class="col-md-4">'+
							'<a href="Registration.html"><img src="img/DoBusinessWithUs.png" width="175" height="60"></a>'+
							'<span class="text playStoreIcon">&nbsp;<a href="https://play.google.com/store/apps/details?id=com.ulweallinone&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1"><img alt="Get it on Google Play" src="img/applogo.PNG" style="height:40px;border-radius:10px;"/></a></span>'+
					    '</div>'+					   
				    '</div>'+
			    '</div>'+
		    '</div>'+
		'</div>';	
$("#topHeaderLogoSection").html(topHeaderLogo);
$("#parentTopHeaderSection").html(parentTopHeader);
$("#cartSliderSection").html(cartSlider);	
$("#slideImageSection").html(slideImageSection);		
$("#topHeadersection").html(topHeader);		
$("#footersection").html(footerSection);
$("#deliverysection").html(deliverySection);  

function openFBDetails(){
	window.open("https://www.facebook.com/sharer/sharer.php?u=ulweallinone.in", "pop", "width=600, height=400, scrollbars=no");
	return false;
}	