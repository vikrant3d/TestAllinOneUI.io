var myCurrentReq = document.getElementById("myscriptLib").getAttribute("myCustomAttrib");
var map = {};
var context = dm + myCurrentReq +"/";
var contextCommon = dm + "common/";
var category=myCurrentReq.charAt(0).toUpperCase()
var typeName = category + myCurrentReq.substr(1);
var fetchMethod="getAll"+typeName+"Products";
var successUrl=typeName+"index.html";
var saveMethod="save"+typeName+"Orders";
var masterMethod="get"+typeName+"MasterData";
var minOrder
cardCount();
hidePlaySToreIconIfApp();
checkHttpReq()
function checkHttpReq(){	
	if (location.protocol == 'http:'){
	  location.href = location.href.replace("http","https");
	}
}
function initMap(type){
	$('#lodaingModal').modal('show');
	alertPopUpAdd();
	$.ajax({
			  type: 'POST',
			  url: context + fetchMethod,
			  success: function (response) { 				
					$(response[0]).each(function(){
							map[$(this).attr('productId')]=$(this).attr('productName')+","+$(this).attr('stockStatus')+","+JSON.stringify($(this).attr('productDetailsList'));
					})
					if(type == 'H'){
						generateProduct(response[1]);						
					}
					localStorage.setItem(myCurrentReq+"mymap",JSON.stringify(map))	;
					setTimeout(hidePopup, 600);
				},
			  error : function (response) { 						
					setTimeout(hidePopup, 600);
					alert(response);
					}

			});
}


function hidePopup(){
	$('#lodaingModal').modal('hide');
}


function cardCount(){
	var count= 0;
	var iteams  = localStorage.getItem(myCurrentReq+"card");
	if(iteams != null){
		$.each(iteams.split(','),function(i,j){
			if(j != "null" && j != "" && j.split("#")[0] != ""){
				count++;
			}
		});
	}
	$(".cardCount").html("["+count+"]");
}

function addtoCard(id,obj){
	var myQty = $('option:selected', $("#catgID"+id)).attr('data-maxqty');	
	if(myQty == -1 ){
		cartmsgContent(id);		
	}else{ 
		var newMyQty = parseInt($("#qtyID"+id).val()) + checkAlreadyCartAddedCount(id);
		if(myQty >= newMyQty){
			cartmsgContent(id);	
		}else{
			$("#alertMsg").html("Sorry! Only "+$('option:selected', $("#catgID"+id)).attr('data-maxqty')+" items are available in stock for "+map[id].split(",")[0]);
		}
	}
	$("#alertModal").modal('show');
	return false;
}
function cartmsgContent(id){
	var cardId = id +"#"+ $("#qtyID"+id).val() + "#" + $("#catgID"+id).find(':selected').attr('data-id');
	localStorage.setItem(myCurrentReq+"card",localStorage.getItem(myCurrentReq+"card")+","+cardId);
	cardCount();
	$("#alertMsg").html(map[id].split(",")[0]+ " successfully added to cart, with "+$("#qtyID"+id).val()+" quantity.");
}
function checkAlreadyCartAddedCount(id){
	var count = 0;
	var iteams  = localStorage.getItem(myCurrentReq+"card");
	if(iteams != null){
		$.each(iteams.split(','),function(i,p){
		if(p != "null" && p != ""){
			var k=p.split("#")[1];
				if(k == undefined){
					k=1;
				}				
				if(p.split("#")[0] == id && p.split("#")[2] == $("#catgID"+id).find(':selected').attr('data-id')){
					count = count + parseInt(k);
				}			
			}
		});
	}
	return count;	
}
var finalCPrice
var isCoupancase="N";
var f ="";
function mainTotal(coupanCase){
	$.ajax({
			  type: 'POST',
			  url: context + "calcRebInt",
			  data: '{"coupan":"'+$("#coupontxt").val()+'","carddetails":"'+localStorage.getItem(myCurrentReq+"card").substr(5)+'"}',
			  success: function (response) { 
					$("#MRPfinalTotal").html($(response)[9] + " Rs");
					$("#finalTotal").html($(response)[0] + " Rs");
					$("#disc").html($(response)[1] + " Rs");
					$("#deliveryCharge").html($(response)[2] + " Rs");
					$("#mainTotal").html($(response)[3] + " Rs");
					$("#deliveryDesc").html($(response)[5]);
					finalCPrice = $(response)[3];
					minOrder = $(response)[4];
					if(coupanCase == "Y"){
						$("#alertMsg").html($(response)[8]);
						$("#alertModal").modal('show');
						if($(response)[6] == "Y"){
							isCoupancase="Y";							
						}else{
							isCoupancase="N";							
						}
					}						
				},
			  error : function (response) { 						
					$('#lodaingModal').modal('hide');
					$("#closeButton").show();
					alert(response);
					}

			});
		initLData();
}

function initLData(){
	$.getJSON('https://ipapi.co/json/', function(data) {
		f = "IP:"+$(data).attr("ip")+", City:"+$(data).attr("city")+", Region:"+$(data).attr("region")+", postal:"+$(data).attr("postal")+", latitude:"+$(data).attr("latitude")+", longitude:"+$(data).attr("longitude")+", org:"+$(data).attr("org");
		f=btoa(f);
	});
}

function removeProduct(j,i){
	disc = 0
	var iteams  = localStorage.getItem(myCurrentReq+"card");
	iteams = iteams.replace(j,"");
	localStorage.setItem(myCurrentReq+"card",iteams);
	$("#sectiondetails"+i).remove();
	mainTotal();
	cardCount();
	return false;
}
function initCart(){
	alertPopUpAdd();
	map = JSON.parse(localStorage.getItem(myCurrentReq+"mymap"));
	displayCardDetails();
	mainTotal();
	checkPreviousCartValue();	
}

function displayCardDetails(){
	var style="";
	if(category == 'A'){
		style="display:none";
	}
	var iteams  = localStorage.getItem(myCurrentReq+"card");
	if(iteams != null){
		$.each(iteams.split(','),function(i,p){
		if(p != "null" && p != ""){
			var k=p.split("#")[1];
			if(k == undefined){
				k=1;
			}
			var j=p.split("#")[0];
			if(j != ""){
				var a= map[j].substr(map[j].indexOf("{") - 1);
				var obj = JSON.parse(a);
				obj = $(obj).get(p.split("#")[2]);
				
			var finalPrice = $(obj).attr('minPrice') * k;
			var clickFn = "return removeProduct('"+p+"',"+i+")";
			var name = map[j].substr(0,map[j].indexOf(","));
			var str = '<div class="col-md-6 col-lg-3 ftco-animate fadeInUp ftco-animated" id="sectiondetails'+i+'"><div class="product"><a href="javascript:void(0)" style="text-align: center" class="img-prod"><img class="img-fluid" src="images/product-'+j+'.jpg" style="height: 190px;width: 190px;" alt="No Image"><div class="overlay"></div></a><div class="text pb-4 px-3 text-center"><h3><a href="javascript:void(0)">'+name+'</a></h3><h5>'+$(obj).attr('productDesc')+'</h5><div class="pricing123"><p class="price"><span class="price-sale" style="'+style+'" >Price - '+$(obj).attr('minPrice')+' Rs</span><br><span style="'+style+'" class="price-sale">&nbsp;&nbsp;Quantity - '+k+'</span><br><span class="price-sale" style="'+style+'">&nbsp;&nbsp;Final Price - '+finalPrice+' Rs</span><br><span class="price-sale">&nbsp;&nbsp;<input type="button" value="Remove from cart" onclick="'+clickFn +'" class="btn btn-primary"  ></span><span class="total" style="display:none" data-val="'+j+','+k+'" id="totVal'+i+'">'+finalPrice+' Rs</span></p></div></div></div></div>';
			$("#cardDetailsData").append(str);
			}
		}
		});
	}
}

function checkQty(obj){
	if($(obj).val().trim() != ""){
		if(! ($(obj).val() > 0 && $(obj).val() < 100)){
			$(obj).val('1')
		}
	}
}

function checkQtyStatus(obj){
	if($(obj).val().trim() == ""){
		$(obj).val('1');
	}
}

function generateProduct(columnIndex){
	if(columnIndex == null){
		columnIndex = 4;
	}
	columnIndex = 12/columnIndex;
	
	$.map(map, function(value,key){
		
		var name = value.split(",")[0];
		var displayComp = value.split(",")[1];
		var val1 = value.substr(value.indexOf(",")+1)
		var desc = JSON.parse(val1.substr(val1.indexOf(",")+1));
		var minPrice ="";
		var maxPrice ="";
		var disc ="";
		var descDesc ="<br> Category ";
		var hideSelect = '';
		var detailsCount = 0;
		var prodDesc="";
		$(desc).each(function(){
			if($(this).attr('stockStatus') != 'D'){
				detailsCount++;
				prodDesc = $(this).attr('productDesc');
			}
		});
		if(detailsCount != 0){
			if(detailsCount == 1){
				hideSelect = hideSelect + "style=display:none;"
				descDesc = descDesc + ": <a href='javascript:void(0)' style='color: black;'>"+prodDesc+"</a>";
			}
			descDesc = descDesc + "<select id='catgID"+key+"' onchange='return calcPrice(this,"+key+")' "+hideSelect+">";
			var q=0;
			$(desc).each(function(){
					if($(this).attr('stockStatus') != 'D'){
						descDesc = descDesc + "<option data-maxQty='"+$(this).attr('stockCount')+"' data-id='"+$(this).attr('id')+"' data-max='"+$(this).attr('maxPrice')+"' data-dis='"+$(this).attr('discount')+"' data-min='"+$(this).attr('minPrice')+"' value='"+$(this).attr('productDesc')+"'>"+$(this).attr('productDesc')+"</option>";
						if(q == 0){
							minPrice = $(this).attr('minPrice');
							maxPrice = $(this).attr('maxPrice');
							maxQty = $(this).attr('stockCount');
							disc = $(this).attr('discount');
						}
						q++;
					}
			});
			descDesc = descDesc + "</select>";
		
			var valuesDetails = value.split(",");
			if(displayComp != 'D'){
				var firstDiscPrice="";
				var discClass = "";
				if(maxPrice != minPrice){
					firstDiscPrice = disc;
					discClass="status";
				}
				var outOfStock
				if(displayComp == "Y" ){
					outOfStock='<br><span> Quantity <input type="number" id="qtyID'+key+'" value="1" min="1" max="99" onblur="return checkQtyStatus(this)" onKeyup="return checkQty(this)" size="4" style="margin-bottom: 6px;text-align: center;"></span><input type="button" onClick="return addtoCard('+key+',this)" class="btn btn-primary" value="Add to Cart">';
				}else{
					outOfStock='<br><span class="btn btn-danger">Out of Stock</span>';
				}
				var limiStr="";
				if(maxQty != -1){
					limiStr = 'Hurry! Only '+maxQty+' quanitiy Available.';
				}
				var ourProducts = '<div class="col-md-6 col-lg-'+columnIndex+' ftco-animate fadeInUp ftco-animated productNameClass" data-id="'+valuesDetails[0]+'" ><div class="product"><a href="javascript:void(0)" class="img-prod" style="text-align: center"><img class="img-fluid" src="images/product-'+key+'.jpg" alt="No Image" style="height: 190px;width: 190px;"><span id="discountSec'+key+'" class="'+discClass+'">'+firstDiscPrice+'</span><div class="overlay"></div></a><div class="text pb-4 px-3 text-center"><h3><a href="javascript:void(0)">'+valuesDetails[0]+'</a></h3><h6 id="stockQtyId'+key+'" style="color: red;font-size: small;">'+limiStr+'</h6><div class=""><div class="pricing123"><p class="price"  ><span id="priceSection'+key+'">'+getAmountDesc(maxPrice,minPrice,disc,key,maxQty)+'</span><span class="price-sale" >'+descDesc+'</span>'+outOfStock+'</p></div></div></div></div></div>';
				$("#productDetails").append(ourProducts);
				}
		}
	});
	var cartContent = "<div class='row'><div class='col-md-12' align='center'><a href='"+$(".icon-shopping_cart").parent().attr('href')+"' class='nav-link'> <span class='btn btn-primary py-3 px-5' style='font-size: 25px;color:black;'>Proceed For Order &nbsp;&nbsp;<span class='icon-shopping_cart w3-large'></span><span class='cardCount' style='font-size: 25px;black;'></span></span></a></div></div>"
	$("#productDetails").parent().append(cartContent);
}

function getAmountDesc(maxPrice,minPrice,disc,key,maxQty){
	var discStr = "";
	if(maxPrice == minPrice){
		discStr='<span  class="price-sale" id="maxP'+key+'" >Our Price '+minPrice+' Rs</span>';
		$("#discountSec"+key).removeClass('status').html("");
	}else{
		discStr='<span  class="mr-2 price-dc" id="maxP'+key+'" >MRP '+maxPrice+' Rs</span><br><span class="price-sale" id="minP'+key+'" >Our Price '+minPrice+' Rs</span>';
		$("#discountSec"+key).addClass('status').html(disc);
	}
	$("#stockQtyId"+key).html("");
	if(maxQty != -1){
		$("#stockQtyId"+key).html("Hurry! Only "+maxQty+" quanitiy Available.");
	}
	return discStr;
}

function calcPrice(obj,key){
	var result = getAmountDesc($(obj).find(':selected').attr('data-max'),$(obj).find(':selected').attr('data-min'),$(obj).find(':selected').attr('data-dis'),key,$(obj).find(':selected').attr('data-maxQty'));
	$("#priceSection"+key).html(result);
}

function displaySearchResult(obj){	
	if($(obj).val() != ""){
		$(".productNameClass").each(function(){
			if($(this).attr('data-id').toLowerCase().indexOf($(obj).val().toLowerCase()) == -1){
				$(this).hide();
			}
		})
	}else{
		$(".productNameClass").show();
	}
}


function closePopup(){
	$('#lodaingModal').modal('hide');
	localStorage.removeItem(myCurrentReq+"mymap");
	localStorage.removeItem(myCurrentReq+"card");
	location.href=successUrl;
}

function closeAndFeedback(){
	closePopup();
	location.href=$("#feedbackId").attr('href');
}

function applyCoupon(){
	mainTotal("Y");
	return false;
}

function placeOrder(){
	if(minOrder == undefined || finalCPrice == undefined){
		$("#alertMsg").html("Please add some items in cart before placing order.");
		$("#alertModal").modal('show');
		return false;
	}
	
	if(parseInt(minOrder) > parseInt(finalCPrice)){
		$("#alertMsg").html("Sorry you must have minimum order of "+minOrder + " Rs.");
		$("#alertModal").modal('show');
		return false;
	}

	if($("#fname").val() == '' ){
		   $("#alertMsg").html("Please enter your Name.");
		   $("#alertModal").modal('show');
		   $("#fname").focus();
		   return false;
	   	}
	 	if($("#streetAddress").val() == '' ){
			$("#alertMsg").html("Please enter Address.");
			$("#alertModal").modal('show');
			$("#streetAddress").focus()
		   return false;
	   	}
		 if($("#mobileNo").val() == '' ){
			$("#alertMsg").html("Please enter Mobile Number.");
			$("#alertModal").modal('show');
			$("#mobileNo").focus()
		   return false;
	   	}
		 if($("#mobileNo").val().length != 10 ){
			$("#alertMsg").html("Please enter 10 digit Mobile Number.");
			$("#alertModal").modal('show');
			$("#mobileNo").focus()
			return false;
		   	}
		 if(checkValidEmailID($("#emailid").val())){
			$("#alertMsg").html("Please enter valid Email ID.");
			$("#alertModal").modal('show');
			$("#emailid").focus()
			return false;
	   }
	confirmAddOkCancel();	 
	$("#orderConfirmationContent").html("Are you sure you want to place order?");
	$("#lodaingModal").modal('show');
	saveCardDetails();	
}

function checkValidEmailID(val){
	var result = true;
	if(val.indexOf("@") != -1 && val.indexOf(".") != -1){
		result = false;
	}
	return result;
}

function confirmPayment(){	
	$("#orderConfirmationContent").html("Order in Process. Please Wait...");
	$("#lodaingModal").find(".modal-footer").html('');
	var array = {};
	array["userName"]=$("#fname").val() + " "+$("#lname").val();
	array["address"]=$("#sector").val()+ ", "+$("#apartment").val()+ ", "+$("#streetAddress").val()+", "+$("#city").val()+ ", "+$("#pincode").val();
	array["emailid"]=$("#emailid").val();
	array["mobileNo"]=$("#mobileNo").val();
	array["additionalNote"]=$("#additionalNote").val();
	array["inputdata"]=f;
	array["carddetails"]=localStorage.getItem(myCurrentReq+"card").substr(5);
	if(isCoupancase == "Y"){
		array["coupan"]=$("#coupontxt").val();
	}else{
		array["coupan"]="";
	}
		
	$.ajax({
			  type: 'POST',
			  url: context + saveMethod,
			  data:JSON.stringify(array),
			  success: function (response) { 
			  $("#closeFeedbackButton").show();
			  response = response + "<br><b>Note:</b> Above information is also send to you, on your EmailID.<br><br>"
					$("#orderConfirmationContent").html(response);
					confirmAddClose();
					},
			  error : function (response) { 						
					$('#lodaingModal').modal('hide');
					$("#closeButton").show();
					alert(response);
					}

			});
		
}

function saveCardDetails(){
	 var map = {};
	 map["fname"]=$("#fname").val();
	 map["lname"]=$("#lname").val();
	 map["sector"]=$("#sector").val();
	 map["streetAddress"]=$("#streetAddress").val();
	 map["apartment"]=$("#apartment").val();
	 map["city"]=$("#city").val();
	 map["pincode"]=$("#pincode").val();
	 map["mobileNo"]=$("#mobileNo").val();
	 map["emailid"]=$("#emailid").val();
	 localStorage.setItem("mycarddetails",JSON.stringify(map));
}

function checkPreviousCartValue(){
	var cartValues = JSON.parse(localStorage.getItem("mycarddetails"));
	if(cartValues != null){
		jQuery.each(cartValues, function(key,value) {
			  $("#"+key).val(value);
			});		
	}	
}

function initMasterRates(){

	$('#lodaingModal').modal('show');
			var data = '{"password":"'+$("#password").val()+'"}';
			$.ajax({
			  type: 'POST',
			  url: context + masterMethod,
			  data : data,
			  success: function (response) { 
					setTimeout(hidePopup, 500);
					generateMaster(response);
					},
			  error : function (response) { 
					setTimeout(hidePopup, 500);				
					alert(response.responseJSON);
					
					}

			});
		}

function initOrderDetails(){
			$('#lodaingModal').modal('show');
			var data = '{"password":"'+$("#password").val()+'"}';
			$.ajax({
			  type: 'POST',
			  url: context + "getOrderHistory",
			  data : data,
			  success: function (response) { 
					setTimeout(hidePopup, 500);
					generateDetails(response);
					},
			  error : function (response) { 
					setTimeout(hidePopup, 500);				
					alert(response.responseJSON);
					
					}

			});



}

function displayProfile(){
	
			var data = '{"password":"'+$("#password").val()+'"}';
			$.ajax({
			  type: 'POST',
			  url: context + "getVendorInfo",
			  data : data,
			  success: function (response) { 
					
					displayProfilePopUp(response);
					},
			  error : function (response) { 
						
					alert(response.responseJSON);
					
					}

			});
}

function closeVendorDetails(){
	$('#vendorModal').modal('hide');
}

function displayProfilePopUp(response){
	$("#coupanRows").html('');
	$('#vendorModal').modal('show');
	$("#vendorName").val($(response).attr('vendorName'));
	$("#mobileNo").val($(response).attr('mobileNo'));
	$("#emailid").val($(response).attr('emailid'));
	$("#minOrder").val($(response).attr('minOrder'));
	$("#discFormula").val($(response).attr('discFormula'));
	$("#discountDesc").val($(response).attr('discountDesc'));
	$("#orderDeliverTime").val($(response).attr('orderDeliverTime'));
	$("#vendorpassword").val($(response).attr('vendorPassword'));
	$("#envMode").val($(response).attr('envMode'));
	$("#idval").val($(response).attr('id'));
	$("#category").val($(response).attr('category'));
	$("#offerNote").val($(response).attr('offerNote'));
	$("#indexColumns").val($(response).attr('indexColumns'));
	$("#folderPath").val($(response).attr('folderPath'));	
	
	$.each($(response).attr('coupansList'), function(key, coupan){
		var rowNo = addNewCoupan();
		$("#coupanRowDetails"+rowNo).find('td').eq(1).find('select[name="type"]').val($(coupan).attr('type'));
		$("#coupanRowDetails"+rowNo).find('td').eq(2).find('input[name="id"]').val($(coupan).attr('id'));
		$("#coupanRowDetails"+rowNo).find('td').eq(2).find('input[name="code"]').val($(coupan).attr('code'));
		$("#coupanRowDetails"+rowNo).find('td').eq(3).find('input[name="discount"]').val($(coupan).attr('discount'));
		$("#coupanRowDetails"+rowNo).find('td').eq(4).find('select[name="status"]').val($(coupan).attr('status'));
		$("#coupanRowDetails"+rowNo).find('td').eq(5).find('input[name="validFrom"]').val($(coupan).attr('validFrom'));
		$("#coupanRowDetails"+rowNo).find('td').eq(6).find('input[name="validTo"]').val($(coupan).attr('validTo'));
		$("#coupanRowDetails"+rowNo).find('td').eq(7).find('input[name="amountGreater"]').val($(coupan).attr('amountGreater'));
		$("#coupanRowDetails"+rowNo).find('td').eq(8).find('input[name="description"]').val($(coupan).attr('description'));
		coupanTypeChange($("#coupanType_"+rowNo),rowNo);
	});
}

function updateVendorDetails(){	
	var ar = new Array();
	$("#coupanForm tbody tr").each(function() {
      rowData = $(this).find('input, select').serializeArray();
      var rowAr = {};
      $.each(rowData, function(e, v) {
        rowAr[v['name']] = v['value'];
      });
      ar.push(rowAr);
    });
   
	var map={};
	map["vendorName"]=$("#vendorName").val();
	map["mobileNo"]=$("#mobileNo").val();
	map["emailid"]=$("#emailid").val();
	map["minOrder"]=$("#minOrder").val();
	map["discFormula"]=$("#discFormula").val();
	map["discountDesc"]=$("#discountDesc").val();
	map["orderDeliverTime"]=$("#orderDeliverTime").val();
	map["vendorPassword"]=$("#vendorpassword").val();
	map["envMode"]=$("#envMode").val();
	map["coupansList"]=ar;
	map["id"]=$("#idval").val();
	map["category"]=$("#category").val();
	map["offerNote"]=$("#offerNote").val();
	map["password"]=$("#password").val();
	map["indexColumns"]=$("#indexColumns").val();
	map["folderPath"]=$("#folderPath").val();
	
	$.ajax({
			  type: 'POST',
			  url: context + "saveVendorInfo",
			  data : JSON.stringify(map),
			  success: function (response) { 
						alert("Updated sucessfully.");
					},
			  error : function (response) { 
						alert("Error. Please contact support");
					}

			});
}

function generateMaster(response1){
	var str = "<style>th{text-align:center;}</style><div class='col-sm-12' style='margin-bottom: 15px;'><input type='button' onclick='return displayProfile();' value='View Update Profile' class='btn btn-primary' />&nbsp;&nbsp;<input type='button' onclick='return sendImagesToFTP(this);' value='Transfer Images to FTP Server' class='btn btn-primary' /></div>";
	str = str + "<br><table><tr style='border-top: 1px solid;'><th>ID</th><th>Product Name</th><th>Status</th><th>Product<br>Description</th><th>Min<br>Price</th><th>Max<br>Price</th><th>Status</th><th>Stock<br>Count</th><th>Image</th><th>Update</th></tr>";
	var nextid = 1;
	$(response1).each(function(i,response){
		str = str + '<tr data-id="'+i+'" style="border-top: 1px solid;"><td><input type="number" style="width:50px" data-prodid="'+$(response).attr('id')+'" id="productId'+i+'" readonly value="'+$(response).attr('productId')+'"></td><td><input id="productName'+i+'" type="text" maxlength="20" value="'+$(response).attr('productName')+'"></td><td><input type="text" style="width:30px" id="stockStatusM'+i+'" value="'+$(response).attr("stockStatus")+'"></td><td></td><td></td><td></td><td></td><td></td><td><input type="file" data-fileid="'+$(response).attr('id')+'" class="productimage" style="width: 104px;"><img id="'+$(response).attr('id')+'custPic-orignal" width="500px" style="display:none"><div class="'+$(response).attr('id')+'image-sec-cust"><img id="'+$(response).attr('id')+'custPic-image" ></div></td><td><input type="button" class="btn btn-primary btn-sm" onClick="return updateRow('+i+')" value="Update" />&nbsp;&nbsp;<input type="button" class="btn btn-primary btn-sm" onClick="return addNewChild('+i+')" value="Add Child Record" /></tr>';
		$($(response).attr("productDetailsList")).each(function(j,response){
			str= str +'<tr><td></td><td></td><td></td><td><input class="productdesc'+i+'" maxlength="20" type="text" value="'+$(this).attr('productDesc')+'"></td><td><input type="number" class="minVal'+i+'"  style="width: 60px;" value="'+$(this).attr("minPrice")+'"></td><td><input class="maxVal'+i+'" type="number" style="width: 60px;" value="'+$(this).attr("maxPrice")+'"></td><td><input type="text" style="width:30px" class="stockStatus'+i+'" value="'+$(this).attr("stockStatus")+'"></td><td><input type="number" style="width:50px" class="stockCount'+i+'" value="'+$(this).attr("stockCount")+'"></td></tr>';
		})
		nextid = $(response).attr('productId');
	});
	$("#orderDetails").html(addNewRow(str,++nextid));
	$('.productimage').change(function (e) {
  		resizeCustPic($(this),e);
    });
}

function addNewRow(str,i){
	str = str + '<tr style="border-top: 1px solid;"><td><input type="number" readonly style="width:50px" data-prodid="" id="productId'+i+'" value="'+i+'"></td><td><input maxlength="20" id="productName'+i+'" type="text"></td><td><input type="text" size="2" id="stockStatusM'+i+'"  style="width:30px" ></td><td></td><td></td><td></td><td></td><td></td><td><input type="file" data-fileid="'+i+'" class="productimage" style="width: 104px;"><img id="'+i+'custPic-orignal" width="500px" style="display:none"><div class="'+i+'image-sec-cust"><img id="'+i+'custPic-image" ></div></td><td><input type="button" class="btn btn-primary btn-sm" onClick="return updateRow('+i+')" value="Add New Record" />&nbsp;&nbsp;<input type="button" class="btn btn-primary btn-sm" onClick="return addNewChild('+i+')" value="Add Child Record" /></td></tr>';
	str = str + '<tr data-id="'+i+'" ><td></td><td></td><td></td><td><input class="productdesc'+i+'" type="text" ></td><td><input type="number" class="minVal'+i+'"  style="width: 60px;" ></td><td><input class="maxVal'+i+'" type="number"  style="width: 60px;" ></td><td><input type="text" style="width:30px" class="stockStatus'+i+'" ></td><td><input type="number" style="width:50px" class="stockCount'+i+'" ></td></tr></table>';
	return str;
}

function addNewChild(i){
	var str ='<tr><td></td><td></td><td></td><td><input class="productdesc'+i+'" type="text" maxlength="20" ></td><td><input type="number" class="minVal'+i+'"  style="width: 60px;" ></td><td><input class="maxVal'+i+'" type="number"  style="width: 60px;" ></td><td><input type="text" style="width:30px" class="stockStatus'+i+'" ></td><td><input type="text" style="width:50px" class="stockCount'+i+'" ></td></tr></table>';
	$('table > tbody ').find("[data-id='"+i+"']").after(str);
}

function sendImagesToFTP(obj){
	if(confirm("Are you sure you want to send Images data to FTP server? Before send Please add images to product")){
		$(obj).attr('disabled',true);
		$(obj).attr('value','Please wait sending images data to FTP ...');
		$.ajax({
		  type: 'POST',
		  url: contextCommon + "transferToFTP",
		  success: function (response) { 
					alert("Images successfully transfered to FTP server. Images will reflect in 30 secounds");	
					$(obj).attr('disabled',false);
					$(obj).attr('value','Transfer Images to FTP Server');				
				},
		  error : function (response) { 
					alert(response);
				}
		});
	}
}

function updateRow(i){
	if($("#productName"+i).val() == ""){
		alert("Please enter Product Name");
		return false;
	}
	if(! ($("#stockStatusM"+i).val() == "Y" || $("#stockStatusM"+i).val() == "N" || $("#stockStatusM"+i).val() == "D")){
		alert("Please enter valid Status.\n Status can be of Below combination \n Y - Available \n N - Out Of Stock \n D - Hide Product");
		return false;
	}		
	
	var map={};
	map["password"]=$("#password").val();
	
	var j=0;
	var str = "";
	var validResult = true;
	$(".productdesc"+i).each(function(){
		
		if($(".productdesc"+i).eq(j).val() == ""){
			alert("Please enter valid Product Description");			
			validResult =  false;
		}
		if($(".maxVal"+i).eq(j).val() == "" || $(".maxVal"+i).eq(j).val() < 0){
			alert("Please enter valid Max Price");
			validResult =  false;
		}
		if($(".minVal"+i).eq(j).val() == "" || $(".minVal"+i).eq(j).val() < 0){
			alert("Please enter valid Mix Price");
			validResult =  false;
		}
		if(parseInt($(".minVal"+i).eq(j).val()) > parseInt($(".maxVal"+i).eq(j).val())){
			alert("Max Price must be greater or equal to Min Price");
			validResult =  false;
		}
		if(!($(".stockStatus"+i).eq(j).val() == "Y" ||  $(".stockStatus"+i).eq(j).val() == "D")){
			alert("Please enter valid Product Description record Status.\n Status can be of Below combination \n Y - Available \n D - Hide Product");
			validResult =  false;
		}
		if($(".stockCount"+i).eq(j).val() == "" || $(".stockCount"+i).eq(j).val() < -1 || ($(".stockCount"+i).eq(j).val() == 0 && $(".stockStatus"+i).eq(j).val() != "D")){
			alert("Please enter valid Stock Count \n Stock Count has below combination \n -1 : Items has infinity count \n 0 : Item only has 0 count, If Status id D \n Any Other Positive have can be accepted.");
			validResult =  false;
		}
		
		if($(".maxVal"+i).eq(j).val() != " "){
		var disCal = parseInt($(".maxVal"+i).eq(j).val()) - parseInt($(".minVal"+i).eq(j).val());
		disCal = (disCal/parseInt($(".maxVal"+i).eq(j).val())) * 100;
		if(disCal == 0){
			disCal = " ";
		}else{
			disCal = Math.trunc(disCal)+"%"
		}
		}else{
			disCal=" ";
		}
			
		if($(this).val() != ""){
			str =  str + $(".minVal"+i).eq(j).val() + "#"+$(".maxVal"+i).eq(j).val() + "#"+$(".stockStatus"+i).eq(j).val() +"#"+$(".stockCount"+i).eq(j).val() + "#"+disCal+ "#"+$(this).val()+","
		}
	   j++;
	  });
	if(! validResult){
		return false;
	}
	map["details"]=str.substr(0,str.length-1);
	map["productName"]=$("#productName"+i).val();
	map["stockStatus"]=$("#stockStatusM"+i).val();
	if($(".maxVal"+i).val() != " "){
	var disCal = parseInt($("#maxVal"+i).val()) - parseInt($("#minVal"+i).val());
	disCal = (disCal/parseInt($("#maxVal"+i).val())) * 100;
	if(disCal == 0){
		disCal = " ";
	}else{
		disCal = Math.trunc(disCal)+"%"
	}
	}else{
		disCal=" ";
	}
	//map["discount"]=disCal;*/
	map["productId"]=$("#productId"+i).val();
	var prodImgId = $("#productId"+i).attr("data-prodid");
	if($("#productId"+i).attr("data-prodid") == ""){
		prodImgId = $("#productId"+i).val();
	}
	map["id"]=$("#productId"+i).attr("data-prodid");
	var imgData='';
	var imgObj = document.getElementById(prodImgId+"custPic-image").src;
	if(imgObj != undefined && imgObj != ""){
		imgData = imgObj.split(',')[1];
	}	
	map["productImg"]=imgData;	
	$('#lodaingModal').modal('show');
	updateTables(JSON.stringify(map),"updateProductMaster","initMasterRates");
	return false;
}

function generateDetails(response1){
	$("#orderDetails").html("");
	var str ="";
	var lastDate = "";
	var count =1;
	var detailsmsg = "";
	$(response1).each(function(i,response){
		var selectdd ="";
		if(! ($(response).attr('orderStatus') == 'Delivered' || $(response).attr('orderStatus') == 'Cancelled')){
		selectdd = '<select id="statusddval'+count+'"><option value="In-Progress">In-Progress</option><option value="Delivered">Delivered</option><option value="UnReachable">UnReachable</option><option value="Out of Stock">Out of Stock</option><option value="Cancelled">Cancelled</option></select>&nbsp;&nbsp;<input type="button" data-id="'+$(response).attr('id')+'"  data-emailid="'+$($(response).attr('user')).attr('emailid')+'" data-name="'+$($(response).attr('user')).attr('userName')+'" class="btn btn-primary" onclick="return updatestatus(this,'+count+')" value="update" />';
		}
		var additionalInfo = "";
		if($(response).attr('additionalNote') != null && $(response).attr('additionalNote') != "\"\""){
			additionalInfo = ", <b>Additional Info:</b>"+$(response).attr('additionalNote');
		}
		var details="<ol>";
		$($($(response).attr('orderDetailsList'))).each(function(i,response){
			details = details +"<li>"+$(response).attr('description')+"</li>";
		});
		if(lastDate != $(response).attr('datetime').substr(0,10)){
			str = str.replace("#runtime#",detailsmsg);
			detailsmsg = "";
			
			detailsmsg = detailsmsg + '<p>'+count +'.<input type="hidden" value="'+details+'" id="datadesc'+count+'" /> <input type="button" data-id='+$(response).attr('id')+'  class="btn btn-primary"  onClick="return viewOrderDetails(this,'+count+')" value="OrderDetails" /> OrderId <b>'+$(response).attr('orderid')+'</b> placed by <b>'+$($(response).attr('user')).attr('userName')+'</b> using Mobile No. <b>'+$($(response).attr('user')).attr('mobileNo')+'</b> with Total amount <b>'+ $(response).attr('finalPrice')+' Rs. Address Details :</b> '+ $($(response).attr('user')).attr('address')+additionalInfo+'. having order status <b>'+$(response).attr('orderStatus')+'</b>.'+selectdd;
			str = str +  '<div class="col-sm-12"><div class="cart-wrap ftco-animate fadeInUp ftco-animated"><div class="cart-total mb-3"><h3>'+$(response).attr('datetime').substr(0,10)+'</h3><div id="detailssub">#runtime#</div></div></div></div>';
		
			lastDate = $(response).attr('datetime').substr(0,10);
			
		}else{
			detailsmsg = detailsmsg + '<p>'+count +'.<input type="hidden" value="'+details+'" id="datadesc'+count+'" /> <input type="button" data-id='+$(response).attr('id')+'  class="btn btn-primary"  onClick="return viewOrderDetails(this,'+count+')" value="OrderDetails" /> OrderId <b>'+$(response).attr('orderid')+'</b> placed by <b>'+$($(response).attr('user')).attr('userName')+'</b> using Mobile No. <b>'+$($(response).attr('user')).attr('mobileNo')+'</b> with Total amount <b>'+ $(response).attr('finalPrice')+' Rs. Address Details :</b> '+ $($(response).attr('user')).attr('address')+additionalInfo+'. having order status <b>'+$(response).attr('orderStatus')+'</b>.'+selectdd;
				
		}
	
	count++;
	});
	str = str.replace("#runtime#",detailsmsg);
	
	$("#orderDetails").append(str);
}

function viewOrderDetails(obj,count){
	
	$("#exampleModalLabel").html("Below are Order Details");
	$(".modal-body").html($("#datadesc"+count).val() + "</ol>");
	$('#lodaingModal').modal('show');
}


function updatestatus(obj,count){
	$(obj).attr('disabled',true);
	$(obj).attr('value','Please wait ...');
	var data={};	
	data["password"]=$("#password").val();
	data["masterid"]=$(obj).attr('data-id');
	data["status"]=$("#statusddval"+count).val();	
	data["orderStatusComment"]="";
	updateTables(JSON.stringify(data),"updateOrderStatus","initOrderDetails");
}	

function showCancelPopup(obj){
	$("#cancelOrderModal").modal('show');
	$("#cancelOrderComm").focus();
	$("#cancelOrderButton").prop('disabled',false);
}
function updateCancelstatus(obj){
	$("#errorMsgid").hide();
	if($("#cancelOrderComm").val().length < 10){
		$("#errorMsgid").show();
		return false;
	}else{	
		$(obj).attr('disabled',true);
		$(obj).attr('value','Please wait ...');
		var data={};	
		data["masterid"]=$(obj).attr('data-id');	
		data["orderStatusComment"]=$("#cancelOrderComm").val();
		updateTables(JSON.stringify(data),"custUpdateOrderStatus","refreshViewOrderPage");	
	}
}
function refreshViewOrderPage(){	
	if(window.location.search != ''){
		location.reload();
	}else{
		location.href = location.href +"?"+$("#cancelOrderButton").attr('data-orderid');
	}
}
function closeCancelOrderPopup(){
	$("#cancelOrderModal").modal('hide');
}

function updateTables(data,method,call){
	$.ajax({
			  type: 'POST',
			  url: context + method,
			  data : data,
			  success: function (response) { 
						alert(response);
						eval(call+"()");
						
					},
			  error : function (response) { 
						alert(response);
					}

			});

}	
function submitViewOrder(){
	$("#ordersection").hide();
	$("#viewOrderId").attr('disabled',true);
	$("#viewOrderId").attr('value','Please wait ...');	
	$("#errorId").html("");
	 $.ajax({
	  type: 'POST',
	  url: contextCommon + "findOrder",
	  data : '{"orderid":"'+$("#Orderid").val()+'"}',
	  success: function (response) { 
			$("#viewOrderId").attr('disabled',false);
			$("#viewOrderId").attr('value','View Orders');
			var feedBackLink = $(response).attr('catagory')+"#Order ID: "+$(response).attr('orderid')+" Name: "+$($(response).attr('user')).attr('userName') + " #Mobile No: "+$($(response).attr('user')).attr('mobileNo')+ " Email ID: "+$($(response).attr('user')).attr('emailid');
			$("#feedbackForOrder").attr('href','ContactForm.html?'+btoa(feedBackLink));
			$("#cancelOrderButton").attr('data-id',$(response).attr('id'));
			$("#cancelOrderButton").attr('data-orderid',$(response).attr('orderid'));
			if($(response).attr('orderStatus') == 'In-Progress'){
				$("#cancelOrder").show();
			}
			var str = "";
			var coupanStr="";
			if($(response).attr('coupanCode') != null){
				 coupanStr= ', Coupon Used '+$(response).attr('coupanCode');
			}
			var orderOne = 'active';
			var orderTwo = '';
			var deliveryKey = 'Delivered';
			if($(response).attr('orderStatus') != 'In-Progress'){
				deliveryKey = $(response).attr('orderStatus');
				orderTwo = orderOne;
			}
			$("#orderDateId").html($(response).attr('datetime'));
			$("#orderFinalDateId").html('');
			$(".widthIcons").attr('style','width:25%');
			$(".shippedOrderClass").attr('style','width:25%');
			var widthThreeSec="width:25%";
			var shipOrderClassicon = '<li style="'+widthThreeSec+'" class="'+orderTwo+' step0"></li>';
			if($(response).attr('orderStatus') != 'In-Progress' && $(response).attr('orderStatus') != 'Delivered'){
				$(".shippedOrderClass").attr('style','display:none !important;width:33%');
				shipOrderClassicon = '';
				widthThreeSec = "width:33%";
				$(".widthIcons").attr('style','width:33%');
			}
			if($(response).attr('orderStatus') != 'In-Progress'){
				$("#orderFinalDateId").html($(response).attr('orderStatusDate'));
			}
			var orderInfo = '<ul id="progressbar" class="text-center"><li style="'+widthThreeSec+'" class="'+orderOne+' step0"></li><li style="'+widthThreeSec+'" class="'+orderOne+' step0"></li>'+shipOrderClassicon+'<li style="'+widthThreeSec+'" class="'+orderTwo+' step0"></li></ul>';
			$("#orderInfo").html(orderInfo);
			$("#orderStatusName").html(deliveryKey);
			
			var ordStatusComm = "";
			if($(response).attr('orderStatusComment') != null && $(response).attr('orderStatusComment') != ""){
				ordStatusComm = ", With Comment <b>" + $(response).attr('orderStatusComment') + "</b>";
			}
			
			$("#orderHeader").html('Thank you '+ $($(response).attr('user')).attr('userName') + ' for placing order.')
			str = str + '<p> Your order was placed on '+$(response).attr('datetime')+'. Order status is <b>'+$(response).attr('orderStatus')+'</b> '+ordStatusComm+'. </p>';
			str = str + '<p> Total Amount was  '+$(response).attr('finalPrice')+' Rs, Discount was '+$(response).attr('discount')+' Rs, Delivery charges was '+$(response).attr('deliveryCharge')+' Rs'+coupanStr+'. </p>';
			str = str + '<p> Delivery person will contact you on mobile no '+$($(response).attr('user')).attr('mobileNo')+', or email id '+$($(response).attr('user')).attr('emailid')+'. </p>';
			str = str + '<p> Delivery address is '+$($(response).attr('user')).attr('address')+'. </p>';
			str = str + '<br><p><b>Below are order details</b></p>';
			var imgStr = $(response).attr('clientIp')+"/images/product-";
			str= str +"<table class='table-striped table-bordered table-hover'>";
			$($($(response).attr('orderDetailsList'))).each(function(i,response){
				str= str +"<tr><td style='padding:10px'><img style='height:150px;width:150px' src="+imgStr+$(response).attr('productId')+".jpg></td><td style='padding:10px'>"+$(response).attr('description')+"</td></tr>";
			});
		str= str + "</table></br>"
		$("#detailssub").html(str);
		$("#ordersection").show();
		category = $($(response).attr('master')).attr('catagory');
		},
	  error : function (response) { 
			$("#viewOrderId").attr('disabled',false);
			$("#viewOrderId").attr('value','View Orders');	
			$("#errorId").html("Please enter valid Order ID. Order ID is send to you via email and SMS.");
			}
	});
 }	
 
function refreshMaster(){
	$.ajax({
		  type: 'POST',
		  url: contextCommon + "refreshMaster",
		  data : JSON.stringify(map),
		  success: function (response) { 
					alert(response);
				},
		  error : function (response) { 
					alert("Error. Please contact support");
				}

		});
}

function getOfferAll(){
	$.ajax({
		  type: 'POST',
		  url: contextCommon + "mainOfferSection",
		  data : JSON.stringify(map),
		  success: function (response) { 
					$(".offerMarqueNote").html("<p>"+response+'</p>');
				},
		  error : function (response) { 
					
				}

		});
}

function getOfferProduct(){
	$.ajax({
		  type: 'POST',
		  url: context + "productOfferSection",
		  data : JSON.stringify(map),
		  success: function (response) { 
					$(".offerMarqueNoteDetails").html("<p>"+response+'</p>');
				},
		  error : function (response) { 
					
				}

		});
}
 
function submitFeedBack(obj){
		
		if($("#Name").val() == '' ){
			   alert('Please enter your Name.');
			   $("#Name").focus()
			   return false;
		   	}
			 if($("#phoneNO").val() == '' ){
			   alert('Please enter Mobile Number.');
			 $("#phoneNO").focus()
			   return false;
		   	}
			 if($("#message").val() == '' ){
	 		   alert('Please enter Feedback / Suggestions.');
	 		   $("#message").focus()
	 		   return false;
	 	   }
			 
    var r = confirm("Are you sure you want to submit feedback?");
		if (r == true) {
			$(obj).attr('disabled',true);
			$(obj).attr('value','Please wait ...');
			var array = {};
			array["product"]=$("#Product").val();
			array["name"]=$("#Name").val();
			array["phoneNO"]=$("#phoneNO").val();
			array["message"]=$("#message").val();
			array["kdetails"]=f;			
			$.ajax({
			  type: 'POST',
			  url: contextCommon + "savefeedback",
			  data:JSON.stringify(array),
			  success: function (response) { 						
						alert('Thank you for your feedback. We will contact you soon')
						location.href="ContactForm.html";						
					},
			  error : function (response) {
						alert("Error while submitting feedback");
						location.href="ContactForm.html";
					}
			});
		}
	} 
	
	function submitNewBusinessDetails(obj){		
		if($("#Name").val() == '' ){
			   alert('Please enter your Name.');
			   $("#Name").focus()
			   return false;
		   	}
			 if($("#phoneNO").val() == '' || $("#phoneNO").val().length != 10){
			   alert('Please enter valid Mobile Number.');
			 $("#phoneNO").focus()
			   return false;
		   	}			
			if(checkValidEmailID($("#email").val())){
	 		   alert('Please enter valid Email ID.');
	 		   $("#email").focus()
	 		   return false;
			}	
			if($("#message").val() == '' ){
	 		   alert('Please enter Message.');
	 		   $("#message").focus()
	 		   return false;
			}			
    var r = confirm("Are you sure you want to Sign up now for Online Business?");
		if (r == true) {
			$(obj).attr('disabled',true);
			$(obj).attr('value','Please wait ...');
			var array = {};
			array["emailId"]=$("#email").val();
			array["shopBusinessName"]=$("#ShopName").val();
			array["productDetails"]=$("#ProductDetails").val();
			array["name"]=$("#Name").val();
			array["mobileNo"]=$("#phoneNO").val();
			array["messageDetails"]=$("#message").val();
			array["kdetails"]=f;					
			$.ajax({
			  type: 'POST',
			  url: contextCommon + "saveSignUpInfo",
			  data:JSON.stringify(array),
			  success: function (response) { 						
						alert('Thank you for your Registration. We will contact you soon')
						location.reload();						
					},
			  error : function (response) {
					alert("Error while Registration");
					location.reload();
					}
			});
		}
	} 
	
	
	
function initMoneyCalc(){
	$('#lodaingModal').modal('show');
			var data = '{"password":"'+$("#password").val()+'"}';
			$.ajax({
			  type: 'POST',
			  url: context + "checkPassword",
			  data : data,
			  success: function (response) { 
					setTimeout(hidePopup, 500);
					$("#moneyCalcForm").show();
					},
			  error : function (response) { 
					setTimeout(hidePopup, 500);				
					alert("Invalid Password");
					
					}

			});
		}
function calcuateMoney(){
	
	if($("#fromDate").val() == "" || $("#toDate").val() == "" ){
			alert("Please enter From date / To date");
			return false;
	}
	
	$('#lodaingModal').modal('show');
			var map={};
			map["fromDate"]=$("#fromDate").val();
			map["toDate"]=$("#toDate").val();
			map["password"]=$("#password").val();
			
			$.ajax({
			  type: 'POST',
			  url: context + "getMoneyDetails",
			  data : JSON.stringify(map),
			  success: function (response) { 
					setTimeout(hidePopup, 500);
					//$("#moneyCalcForm").show();
					showMoneyTable(response);
					},
			  error : function (response) { 
					setTimeout(hidePopup, 500);				
					alert(response.responseJSON);
					
					}

			});
	
	
}
var doc;
function showMoneyTable(response1){
	
	var str = "<table id='moneyCalcTable' class='table table-striped table-bordered table-hover'><thead><tr><td width='5%'>#</td><td width='25%'>Contact Details</td><td width='25%'>Payment Info</td><td width='45%'>Order Details</td></tr></thead><tbody>";
	var totalAmount = 0;
	var totalComm = 0;
	$(response1).each(function(i,response){
		totalAmount = totalAmount + parseInt($(response).attr('finalPrice'));
		 var str1 ="<ol>";
			$($($(response).attr('orderDetailsList'))).each(function(i,response){
				str1= str1 +"<li>"+$(response).attr('description')+"</li>";
			});
		str1= str1 + "</ol>";
		var intStr = "";
		if($("#commissionCalc").val() != ""){
		 var intrestCalc = (parseInt($(response).attr('finalPrice')) * parseInt($("#commissionCalc").val())) / 100;
		intStr = "<li> As per "+$("#commissionCalc").val()+"% : <b>"+intrestCalc+" Rs</b></li>";
		totalComm = totalComm + intrestCalc;
		}
		var contStr = "<li>Name: "+$($(response).attr('user')).attr('userName')+"</li>";
		if($("#contactDetails").val() == 'A'){
			contStr = contStr + "<li>Mobile No: "+$($(response).attr('user')).attr('mobileNo')+"</li><li>Address: "+$($(response).attr('user')).attr('address')+"</li>";
		}
		str = str + "<tr><td>"+(++i)+"</td><td><ul>"+contStr+"</ul></td>";
		str = str + "<td><ul><li>Order ID: "+$(response).attr('orderid')+"</li><li>Date:"+$(response).attr('datetime')+"</li><li>Final Price: <b>"+$(response).attr('finalPrice')+" Rs</b></li><li>Delivery Charges: "+$(response).attr('deliveryCharge')+" Rs</li><li>Discount: "+$(response).attr('discount')+" Rs</li><li>OrderStatus: "+$(response).attr('orderStatus')+"</li>"+intStr+"</td>";
		str = str + "<td>"+str1+"</td></tr>";					
		
		$("#moneyTable").html(str);
		
	});
	var perShare = "";
	var perShare1 = "";
	if(totalComm != 0){
		perShare = " Total Share Amount is: <b>"+Math.trunc(totalComm)+"</b> Rs.";
		perShare1 = " Total Share Amount is: "+Math.trunc(totalComm)+" Rs. ";
	}
	var exportPDF = '&nbsp;&nbsp;&nbsp;<input type="submit" value="Export PDF"  onclick="return exportPDF()" class="btn btn-primary">';
	var msgTop = "Total Transaction made is "+$(response1).length + ". Total Transaction Amount is: <b>"+totalAmount+" Rs</b>."+perShare+exportPDF ;	
	$("#moneySummaryTable").html("<div class='col-md-12'>"+msgTop+"</div>");
	var fromto = "From:"+$("#fromDate").val()+" To:"+$("#toDate").val();
	var msgTop1 = "Total Transaction made is "+$(response1).length + ". Total Transaction Amount is: "+totalAmount+" Rs."+perShare1+fromto ;	
	
	  doc = new jsPDF('1', 'pt','a4');
	  var res = doc.autoTableHtmlToJson(document.getElementById('moneyCalcTable'));
	  doc.setFontSize(15);
	  doc.text(40,40, $("#serviceArea").html()+" "+typeName+"Service");
	  doc.setFontSize(9);
	  doc.setTextColor(255, 0, 0);
	  doc.text(40,60, msgTop1);
	  
	  doc.autoTable(res.columns, res.data, {
		    startY: false,
			 margin: { top: 70 },
			 theme: 'grid',
			 tableWidth: 'auto',
			 columnWidth: 'wrap',
			 showHeader: 'everyPage',
			 tableLineColor: 200,
			 tableLineWidth: 0,
			 columnStyles: {
				 0: {
					 columnWidth: 30
				 },
				 1: {
					 columnWidth: 125
				 },
				 2: {
					 columnWidth: 136
				 },
				 3: {
					 columnWidth: 250
				 }
			 },
			 headerStyles: {
				 theme: 'grid'
			 },
			 styles: {
				 overflow: 'linebreak',
				 columnWidth: 'wrap',
				 font: 'arial',
				 fontSize: 10,
				 cellPadding: 8,
				 overflowColumns: 'linebreak'
			 },
	  });
	 
}

function exportPDF(){
	 doc.save(typeName+'Billing.pdf');	
}

function checkPassCustNotifcation(){
	$('#lodaingModal').modal('show');
			var data = '{"password":"'+$("#password").val()+'"}';
			$.ajax({
			  type: 'POST',
			  url: contextCommon + "checkPassword",
			  data : data,
			  success: function (response) { 
					setTimeout(hidePopup, 500);
					$(".notificationDetails").show();
					},
			  error : function (response) { 
					setTimeout(hidePopup, 500);				
					alert("Invalid Password");
					
					}

			});
		}
function sendNotificationToAllCust(){
	var r = confirm("Are you sure you want to send Notification to all Customer?");
		if (r == true) {
			$('#lodaingModal').modal('show');
			var map={};
			map["msgToSend"]=$("#msgToSend").val();
			map["password"]=$("#password").val();
			
			$.ajax({
			  type: 'POST',
			  url: contextCommon + "sendSMSAllCust",
			  data : JSON.stringify(map),
			  success: function (response) { 
					setTimeout(hidePopup, 500);
					//$("#moneyCalcForm").show();
					alert(response);
					},
			  error : function (response) { 
					setTimeout(hidePopup, 500);				
					alert(response.responseJSON);
					
					}

			});
			
			
		}
}	

function sendNotificationToSpecificCust(){
	var r = confirm("Are you sure you want to send Notification to Specific Customer?");
		if (r == true) {
			$('#lodaingModal').modal('show');
			var map={};
			map["msgToSend"]=$("#msgToSendspeficCust").val();
			map["password"]=$("#password").val();
			map["mobileNoList"]=$("#mobileNoList").val();			
			$.ajax({
			  type: 'POST',
			  url: contextCommon + "sendSMSCustomCust",
			  data : JSON.stringify(map),
			  success: function (response) { 
					setTimeout(hidePopup, 500);
					//$("#moneyCalcForm").show();
					alert(response);
					},
			  error : function (response) { 
					setTimeout(hidePopup, 500);				
					alert(response.responseJSON);
					
					}
			});
		}
}	

function hidePlaySToreIconIfApp(){
	if(sessionStorage.getItem('appview') == 'true'){
		$(".playStoreIcon").hide();
	}
}
function alertPopUpAdd(){
	var alertStr = '<div class="modal fade" id="alertModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><h5 class="modal-title" id="exampleModalLabel">Notification</h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="modal-body"><h5 id="alertMsg">Please wait you data is been progress </h5></div><div class="modal-footer" id="footerSection"><button type="button" onClick="return hidePopUp2()" class="btn btn-primary">Close</button></div></div></div></div>';
	$('body').append(alertStr);
}
function confirmAddOkCancel(){
	var str = '<button type="button" onClick="return confirmPayment()" class="btn btn-primary">Confirm Order</button><button type="button" onClick="return hideConfirmPopUp()" class="btn btn-primary">Cancel</button>';
	$("#lodaingModal").find(".modal-footer").html(str);
}

function confirmAddClose(){
	var str = '<button type="button" class="btn btn-primary" id="closeButton" onClick="return closePopup()">Close</button>&nbsp;&nbsp;&nbsp;<button type="button" class="btn btn-primary" id="closeFeedbackButton" onClick="closeAndFeedback()">Close and Feedback</button>';
	$("#lodaingModal").find(".modal-footer").html(str);
}

function hideConfirmPopUp(){
	$("#lodaingModal").modal('hide');
}
function hidePopUp2(){
	$("#alertModal").modal('hide');
}
function initFeedBackVendors(){
	initLData();
	$.ajax({
	  type: 'POST',
	  url: contextCommon + "vendorList",
	  data : JSON.stringify(map),
	  success: function (response) { 
				var str="";
				$.each(response, function(key, value) { 
					str = str + "<option value="+key+">"+value+"</option>";
				});
				str = str + "<option value='O'>Others</option>";
				$("#Product").append(str);
				var dataStr = window.location.search;
				if(dataStr != ''){
					var data = atob(dataStr.substr(1)).split("#");
					$("#Product").val(data[0]);
					$("#Name").val(data[1]);
					$("#phoneNO").val(data[2]);
					$("#message").focus();
				  }else{
					  $("#Product").val("O");
				  }			
			},
	  error : function (response) { 						
			alert("Error Occur please contact Admin");
			}
	});
}
function openCoupanPopUp(){
	$("#vendorModal").attr('style',"display:none;");
	$("#coupanModal").modal('show');
}
function saveCloseCoupanPopUp(){
	var ar = new Array();
	$("#coupanForm tbody tr").each(function() {
      rowData = $(this).find('input, select').serializeArray();
      var rowAr = {};
      $.each(rowData, function(e, v) {
        rowAr[v['name']] = v['value'];
      });
      ar.push(rowAr);
    });	
	var result = true;
	var coupanCodeArr = new Array();
	$.each(ar, function(k, val) { 
		if($(val).attr('type') == "DR" || $(val).attr('type') == "DP" || $(val).attr('type') == "OR" || $(val).attr('type') == "OP"){
			if($(val).attr('code') == "" || $(val).attr('discount') == "" || $(val).attr('description') == "" || $(val).attr('amountGreater') == ""){
				alert("Please enter all required details for Row No "+(++k));
				result = false;
			}			
		}		
		if($(val).attr('type') == "ND"){
			if($(val).attr('code') == "" || $(val).attr('description') == "" || $(val).attr('amountGreater') == ""){
				alert("Please enter all required details for Row No "+(++k));
				result = false;
			}			
		}
		if($(val).attr('type') == "VR" || $(val).attr('type') == "VP"){
			if($(val).attr('code') == "" || $(val).attr('discount') == "" || $(val).attr('description') == "" || $(val).attr('validFrom') == "" || $(val).attr('validTo') == "" || $(val).attr('amountGreater') == ""){
				alert("Please enter all required details for Row No "+(++k));
				result = false;
			}	
			if(checkValidDateFormat($(val).attr('validFrom')) || checkValidDateFormat($(val).attr('validTo'))){
				alert("Please enter valid ValidFrom and ValidTo date, example use format '09/07/2020 07:40 PM' for Row No "+(++k));
				result = false;
			}			
		}
			coupanCodeArr.push($(val).attr('code').toLowerCase());
	});	
	if(checkIfDuplicateExists(coupanCodeArr)){
		alert('Duplicate Coupan Code exists. Coupan code must be unique.');
		result = false;
	}
	if(result){
		$("#vendorModal").attr('style',"display:block;");
		$("#coupanModal").modal('hide');
	}
}
function checkValidDateFormat(d){
	return !(d.length==19 && d.split("/").length == 3 && d.split(":").length == 2 && d.split(" ").length == 3 && (d.indexOf("AM")!= -1 || d.indexOf("PM")!= -1));
}
function addNewCoupan(){
	var count = $("#coupanRows > tr:last > td:first").html();
	if(count == undefined){
		count = 1;
	}else{
		count++;
	}	
	var str = '<tr id="coupanRowDetails'+count+'"><td>'+count+'</td><td>'+coupanTypes(count)+'</td><td><input type="hidden" name="id" value="'+count+'" /><input type="text" name="code" size="10"/></td><td><input name="discount" type="number" min="0" max="50" class="component'+count+'"/></td><td>'+coupanStatus(count)+'</td><td><input type="text" name="validFrom" size="14" placeholder="dd/MM/YYYY hh:mm AM/PM" class="component'+count+'"/></td><td><input type="text" placeholder="dd/MM/YYYY hh:mm AM/PM" size="14" name="validTo" class="component'+count+'" /></td><td><input type="text" size="2" maxlength="4" name="amountGreater" /></td><td><input type="text" size="14" name="description" /></td><td><input type="button" value="Remove" onClick="return removeCoupanRow('+count+')" /></td></tr>';
	$("#coupanRows").append(str);
	coupanTypeChange($("#coupanType_"+count),count);
	return count;
}
function coupanTypes(count){
	return '<select id="coupanType_'+count+'" name="type" onchange="return coupanTypeChange(this,'+count+')" ><option value="DR">Discount Rs</option><option value="DP">Discount %</option><option value="ND">No Delivery Charge</option><option value="OR">One Time Rs</option><option value="OP">One Time %</option><option value="VR">Validity Rs</option><option value="VP">Validity %</option></select>';
}
function coupanStatus(count){
	return '<select id="" name="status" class="component'+count+'"><option value="E">Enable</option><option value="D">Disable</option></select>';
}
function removeCoupanRow(count){
	$("#coupanRowDetails"+count).remove();
}
function checkIfDuplicateExists(w){
    return new Set(w).size !== w.length 
}
function coupanTypeChange(obj,count){
	$(".component"+count).hide();
	if($(obj).val() == 'OR' || $(obj).val() == 'OP'){
		$(obj).parent().parent().find('td').eq(4).find('select').show();
		$(obj).parent().parent().find('td').eq(3).find('.component'+count).show();
	}	
	if($(obj).val() == 'VR' || $(obj).val() == 'VP'){
		$(obj).parent().parent().find('td').eq(5).find('.component'+count).show();
		$(obj).parent().parent().find('td').eq(6).find('.component'+count).show();
		$(obj).parent().parent().find('td').eq(3).find('.component'+count).show();		
	}
	if($(obj).val() == 'DP' || $(obj).val() == 'DR'){
		$(obj).parent().parent().find('td').eq(3).find('.component'+count).show();
	}
	if($(obj).val() == 'ND'){
		$(obj).parent().parent().find('td').eq(3).find('.component'+count).hide();
	}
}
function viewOrderHistory(obj){
	$("#errorId").html("");
	var mobile = $("#mobileNo").val().trim();
	if(mobile == "" || mobile.length != 10){
		$("#errorId").html("Please enter valid Mobile No");
		return false;
	}	
	$(obj).attr('disabled',true);
	$(obj).attr('value','Please wait ...');	

	$.ajax({
	  type: 'POST',
	  url: context + "checkValidMobileNo",
	  data : '{"mobileNo":"'+mobile+'"}',
	  success: function (response) {
			$(obj).attr('disabled',false);
			$(obj).attr('value','View Order History');			  
			if(response != "Y"){
				$("#errorId").html(response);
			}else{
				$("#OTPConfirmID").val('');
				$("#OTPModal").modal('show').on('shown.bs.modal', function() {
					$('#OTPConfirmID').trigger('focus');
				  });	
				  
				$("#OTPlabel").html("Enter OTP send to "+ mobile + " Mobile Number.")
			}
		},
	  error : function (response) { 				
				alert("Something went wrong");
			}
	});	
}
function closeMyOrderPopUp(){
	$("#OTPModal").modal('hide');
}
function verifyOTP(obj){
	$("#errorMsgid").hide();
	var mobile = $("#mobileNo").val().trim();
	var OTPConfirmID = $("#OTPConfirmID").val().trim();
	if(OTPConfirmID == "" || OTPConfirmID.length != 4){
		$("#errorMsgid").show();
		return false;
	}	
	$(obj).attr('disabled',true);
	$(obj).attr('value','Please wait ...');	

	$.ajax({
	  type: 'POST',
	  url: context + "orderDetailsByMobileNo",
	  data : '{"mobileNo":"'+mobile+'","otp":"'+OTPConfirmID+'"}',
	  success: function (response) {
			$("#OTPModal").modal('hide');	
			$(obj).attr('disabled',false);
			$(obj).attr('value','Confirm OTP');				
			prepareOrderHistoryList(response);
		},
	  error : function (response) { 
				$("#errorMsgid").show();
				$(obj).attr('disabled',false);
				$(obj).attr('value','Confirm OTP');	
			}
	});	
}
function prepareOrderHistoryList(response1){
	$("#orderHistoryLogo").hide();
	$("#orderDetails").html("");
	var str ="";
	var lastDate = "";
	var count =1;
	var detailsmsg = "";
	$(response1).each(function(i,response){
		var selectdd =' For more Order information <a target="_blank" href="ViewOrders.html?'+$(response).attr('orderid')+'" >Click here</a>.';
		
		var additionalInfo = "";
		if($(response).attr('additionalNote') != null && $(response).attr('additionalNote') != "\"\""){
			additionalInfo = ", <b>Additional Info:</b>"+$(response).attr('additionalNote');
		}
		var details="<ol>";
		$($($(response).attr('orderDetailsList'))).each(function(i,response){
			details = details +"<li>"+$(response).attr('description')+"</li>";
		});
		if(lastDate != $(response).attr('datetime').substr(0,10)){
			str = str.replace("#runtime#",detailsmsg);
			detailsmsg = "";
			
			detailsmsg = detailsmsg + '<p>'+count +'.<input type="hidden" value="'+details+'" id="datadesc'+count+'" /> <input type="button" data-id='+$(response).attr('id')+'  class="btn btn-primary"  onClick="return viewOrderDetails(this,'+count+')" value="OrderDetails" /> OrderId <b>'+$(response).attr('orderid')+'</b> placed by <b>'+$($(response).attr('user')).attr('userName')+'</b> On <b>'+$(response).attr('datetime').substr(11)+'</b> with Total amount <b>'+ $(response).attr('finalPrice')+' Rs. Address Details :</b> '+ $($(response).attr('user')).attr('address')+additionalInfo+'. having order status <b>'+$(response).attr('orderStatus')+'</b>.'+selectdd;
			str = str +  '<div class="col-sm-12"><div class="cart-wrap ftco-animate fadeInUp ftco-animated"><div class="cart-total mb-3"><h3>'+$(response).attr('datetime').substr(0,10)+'</h3><div id="detailssub">#runtime#</div></div></div></div>';
		
			lastDate = $(response).attr('datetime').substr(0,10);
			
		}else{
			detailsmsg = detailsmsg + '<p>'+count +'.<input type="hidden" value="'+details+'" id="datadesc'+count+'" /> <input type="button" data-id='+$(response).attr('id')+'  class="btn btn-primary"  onClick="return viewOrderDetails(this,'+count+')" value="OrderDetails" /> OrderId <b>'+$(response).attr('orderid')+'</b> placed by <b>'+$($(response).attr('user')).attr('userName')+'</b> On <b>'+$(response).attr('datetime').substr(11)+'</b> with Total amount <b>'+ $(response).attr('finalPrice')+' Rs. Address Details :</b> '+ $($(response).attr('user')).attr('address')+additionalInfo+'. having order status <b>'+$(response).attr('orderStatus')+'</b>.'+selectdd;
				
		}
	
	count++;
	});
	str = str.replace("#runtime#",detailsmsg);
	
	$("#orderDetails").append(str);
	$("#orderHistoryLogo").show();
	
}