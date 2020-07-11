var myCurrentReq = document.getElementById("myscriptLib").getAttribute("myCustomAttrib");
var map = {};
var dm = "https://eqqkv4vbgf.execute-api.ap-south-1.amazonaws.com/";
var context = dm + "dev/"+myCurrentReq+"/";
var contextCommon = dm + "dev/common/";
var category=myCurrentReq.charAt(0).toUpperCase()
var typeName = category + myCurrentReq.substr(1);
var fetchMethod="getAll"+typeName+"Products";
var successUrl=typeName+"index.html";
var saveMethod="save"+typeName+"Orders";
var masterMethod="get"+typeName+"MasterData";
var minOrder
cardCount();
hidePlaySToreIconIfApp();
function initMap(type){
	$('#lodaingModal').modal('show');
	alertPopUpAdd();
	$.ajax({
			  type: 'POST',
			  url: context + fetchMethod,
			  success: function (response) { 
				
					$(response).each(function(){
							//map[$(this).attr('id')]=$(this).attr('productName')+","+$(this).attr('maxPrice')+","+$(this).attr('minPrice')+","+$(this).attr('discount')+","+$(this).attr('productDesc')+","+$(this).attr('stockStatus');
							map[$(this).attr('productId')]=$(this).attr('productName')+","+$(this).attr('stockStatus')+","+JSON.stringify($(this).attr('productDetailsList'));
							
					})
						if(type == 'H'){
							generateProduct();
							
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
	var cardId = id +"#"+ $("#qtyID"+id).val() + "#" + $("#catgID"+id).find(':selected').attr('data-id');
	localStorage.setItem(myCurrentReq+"card",localStorage.getItem(myCurrentReq+"card")+","+cardId);
	cardCount();
	$("#alertMsg").html(map[id].split(",")[0]+ " successfully added to cart.");
	$("#alertModal").modal('show');
	return false;
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
			var str = '<div class="col-md-6 col-lg-3 ftco-animate fadeInUp ftco-animated" id="sectiondetails'+i+'"><div class="product"><a href="javascript:void(0)" style="text-align: center" class="img-prod"><img class="img-fluid" src="images/product-'+j+'.jpg" alt="Colorlib Template"><div class="overlay"></div></a><div class="text pb-4 px-3 text-center"><h3><a href="javascript:void(0)">'+name+'</a></h3><h5>'+$(obj).attr('productDesc')+'</h5><div class="pricing123"><p class="price"><span class="price-sale" style="'+style+'" >Price - '+$(obj).attr('minPrice')+' Rs</span><br><span style="'+style+'" class="price-sale">&nbsp;&nbsp;Quantity - '+k+'</span><br><span class="price-sale" style="'+style+'">&nbsp;&nbsp;Final Price - '+finalPrice+' Rs</span><br><span class="price-sale">&nbsp;&nbsp;<input type="button" value="Remove from cart" onclick="'+clickFn +'" class="btn btn-primary"  ></span><span class="total" style="display:none" data-val="'+j+','+k+'" id="totVal'+i+'">'+finalPrice+' Rs</span></p></div></div></div></div>';
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

function generateProduct(){
	
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
		if(desc.length == 1){
			hideSelect = hideSelect + "style=display:none;"
			descDesc = descDesc + ": <a href='javascript:void(0)' style='color: black;'>"+$(desc).eq(0).attr('productDesc')+"</a>";
		}
		descDesc = descDesc + "<select id='catgID"+key+"' onchange='return calcPrice(this,"+key+")' "+hideSelect+">";
		var q=0;
		$(desc).each(function(){
				if($(this).attr('stockStatus') != 'D'){
					descDesc = descDesc + "<option data-id='"+$(this).attr('id')+"' data-max='"+$(this).attr('maxPrice')+"' data-dis='"+$(this).attr('discount')+"' data-min='"+$(this).attr('minPrice')+"' value='"+$(this).attr('productDesc')+"'>"+$(this).attr('productDesc')+"</option>";
					if(q == 0){
						minPrice = $(this).attr('minPrice');
						maxPrice = $(this).attr('maxPrice');
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
		var ourProducts = '<div class="col-md-6 col-lg-3 ftco-animate fadeInUp ftco-animated productNameClass" data-id="'+valuesDetails[0]+'" ><div class="product"><a href="javascript:void(0)" class="img-prod" style="text-align: center"><img class="img-fluid" src="images/product-'+key+'.jpg" alt="No Image" style="height: 190px;width: 190px;"><span id="discountSec'+key+'" class="'+discClass+'">'+firstDiscPrice+'</span><div class="overlay"></div></a><div class="text pb-4 px-3 text-center"><h3><a href="javascript:void(0)">'+valuesDetails[0]+'</a></h3><div class=""><div class="pricing123"><p class="price"  ><span id="priceSection'+key+'">'+getAmountDesc(maxPrice,minPrice,disc,key)+'</span><span class="price-sale" >'+descDesc+'</span>'+outOfStock+'</p></div></div></div></div></div>';
		$("#productDetails").append(ourProducts);
		}
	});
	var cartContent = "<div class='row'><div class='col-md-12' align='center'><a href='"+$(".icon-shopping_cart").parent().attr('href')+"' class='nav-link'> <span class='btn btn-primary py-3 px-5' style='font-size: 25px;color:black;'>Proceed For Order &nbsp;&nbsp;<span class='icon-shopping_cart w3-large'></span><span class='cardCount' style='font-size: 25px;black;'></span></span></a></div></div>"
	$("#productDetails").parent().append(cartContent);
}

function getAmountDesc(maxPrice,minPrice,disc,key){
	var discStr = "";
	if(maxPrice == minPrice){
		discStr='<span  class="price-sale" id="maxP'+key+'" >Our Price '+minPrice+' Rs</span>';
		$("#discountSec"+key).removeClass('status').html("");
	}else{
		discStr='<span  class="mr-2 price-dc" id="maxP'+key+'" >MRP '+maxPrice+' Rs</span><br><span class="price-sale" id="minP'+key+'" >Our Price '+minPrice+' Rs</span>';
		$("#discountSec"+key).addClass('status').html(disc);
	}
	return discStr;
}

function calcPrice(obj,key){
	var result = getAmountDesc($(obj).find(':selected').attr('data-max'),$(obj).find(':selected').attr('data-min'),$(obj).find(':selected').attr('data-dis'),key);
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
		 if($("#emailid").val() == '' ){
			$("#alertMsg").html("Please enter emailid.");
			$("#alertModal").modal('show');
			$("#emailid").focus()
			return false;
	   }
	confirmAddOkCancel();	 
	$("#orderConfirmationContent").html("Are you sure you want to place order?");
	$("#lodaingModal").modal('show');
	saveCardDetails();	
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
	var str = "<input type='button' onclick='return displayProfile();' value='View Update Profile' class='btn btn-primary' />";
	str = str + "<table><tr><th>ID</th><th>Product Name</th><th>Status</th><th>Product Description</th><th>Min Price</th><th>Max Price</th><th>Status</th><th>Update</th></tr>";
	var nextid = 1;
	$(response1).each(function(i,response){
		str = str + '<tr data-id="'+i+'"><td><input type="text" size="1" data-id="'+$(response).attr('id')+'" id="productId'+i+'" readonly value="'+$(response).attr('productId')+'"></td><td><input id="productName'+i+'" type="text" value="'+$(response).attr('productName')+'"></td><td><input type="text" size="2" id="stockStatusM'+i+'" value="'+$(response).attr("stockStatus")+'"></td><td></td><td></td><td></td><td></td><td><input type="button" class="btn btn-primary" onClick="return updateRow('+i+')" value="Update" /><input type="button" class="btn btn-primary" onClick="return addNewChild('+i+')" value="Add Child Record" /></tr>';
		$($(response).attr("productDetailsList")).each(function(j,response){
			str= str +'<tr><td></td><td></td><td></td><td><input class="productdesc'+i+'" type="text" value="'+$(this).attr('productDesc')+'"></td><td><input type="text" class="minVal'+i+'" size="2" value="'+$(this).attr("minPrice")+'"></td><td><input class="maxVal'+i+'" type="text" size="2" value="'+$(this).attr("maxPrice")+'"></td><td><input type="text" size="2" class="stockStatus'+i+'" value="'+$(this).attr("stockStatus")+'"></td></tr>';
		})
		nextid = $(response).attr('productId');
	});
	$("#orderDetails").html(addNewRow(str,++nextid));

}

function addNewRow(str,i){
	str = str + '<tr><td><input type="text" size="1" data-id="" id="productId'+i+'" value="'+i+'"></td><td><input id="productName'+i+'" type="text"></td><td><input type="text" size="2" id="stockStatusM'+i+'" ></td><td></td><td></td><td></td><td></td><td><input type="button" class="btn btn-primary" onClick="return updateRow('+i+')" value="Add New Record" /><input type="button" class="btn btn-primary" onClick="return addNewChild('+i+')" value="Add Child Record" /></td></tr>';
	str = str + '<tr data-id="'+i+'"><td></td><td></td><td></td><td><input class="productdesc'+i+'" type="text" ></td><td><input type="text" class="minVal'+i+'" size="2" ></td><td><input class="maxVal'+i+'" type="text" size="2" ></td><td><input type="text" size="2" class="stockStatus'+i+'" ></td></tr></table>';
	return str;
}

function addNewChild(i){
	var str ='<tr><td></td><td></td><td></td><td><input class="productdesc'+i+'" type="text" ></td><td><input type="text" class="minVal'+i+'" size="2" ></td><td><input class="maxVal'+i+'" type="text" size="2" ></td><td><input type="text" size="2" class="stockStatus'+i+'" ></td></tr></table>';
	$('table > tbody ').find("[data-id='"+i+"']").after(str);
}


function updateRow(i){
	$('#lodaingModal').modal('show');
	var map={};
	map["password"]=$("#password").val();
	
	var j=0;
	var str = "";
	$(".productdesc"+i).each(function(){
		
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
			str =  str + $(".minVal"+i).eq(j).val() + "#"+$(".maxVal"+i).eq(j).val() + "#"+$(".stockStatus"+i).eq(j).val() + "#"+disCal+ "#"+$(this).val() +","
		}
	   j++;
	  });
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
	map["id"]=$("#productId"+i).attr("data-id");
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
	var data={};
	data["category"]=category;
	data["password"]=$("#password").val();
	data["masterid"]=$(obj).attr('data-id');
	data["status"]=$("#statusddval"+count).val();
	data["name"]=$(obj).attr('data-name');
	data["emailid"]=$(obj).attr('data-emailid');
	updateTables(JSON.stringify(data),"updateOrderStatus","initOrderDetails");
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
			
			 $.ajax({
			  type: 'POST',
			  url: contextCommon + "findOrder",
			  data : '{"orderid":"'+$("#Orderid").val()+'"}',
			  success: function (response) { 
					var str = "";
					var coupanStr="";
					if($(response).attr('coupanCode') != null){
						 coupanStr= ', Coupon Used '+$(response).attr('coupanCode');
					}
					$("#orderHeader").html('Thank you '+ $($(response).attr('user')).attr('userName') + ' for placing order.')
					str = str + '<p> Your order was placed on '+$(response).attr('datetime')+'. Order status is <b>'+$(response).attr('orderStatus')+'</b>. </p>';
					str = str + '<p> Total Amount was  '+$(response).attr('finalPrice')+' Rs, Discount was '+$(response).attr('discount')+' Rs, Delivery charges was '+$(response).attr('deliveryCharge')+' Rs'+coupanStr+'. </p>';
					str = str + '<p> Delivery person will contact you on mobile no '+$($(response).attr('user')).attr('mobileNo')+', or email id '+$($(response).attr('user')).attr('emailid')+'. </p>';
					str = str + '<p> Delivery address is '+$($(response).attr('user')).attr('address')+'. </p>';
					str = str + '<br><p><b>Below are order details</b></p>';
			
				 str= str +"<ol>";
					$($($(response).attr('orderDetailsList'))).each(function(i,response){
						str= str +"<li>"+$(response).attr('description')+"</li>";
					});
				str= str + "</ol></br>"
				$("#detailssub").html(str);
				$("#ordersection").show();
				category = $($(response).attr('master')).attr('catagory');
				},
			  error : function (response) { 						
					
					alert("Please enter valid Order ID. Order ID is send to you via email and SMS.");
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
 
function submitFeedBack(){
		
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
			var array = {};
			array["product"]=$("#Product").val();
			array["name"]=$("#Name").val();
			array["phoneNO"]=$("#phoneNO").val();
			array["message"]=$("#message").val();
			
			$.ajax({
			  type: 'POST',
			  url: contextCommon + "savefeedback",
			  data:JSON.stringify(array),
			  success: function (response) { 
						
						alert('Thank you for your feedback. We will contact you soon')
						location.reload();
						
					},
			  error : function (response) { 						
					
					alert("Error while submitting feedback");
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
		str = str + "<tr><td>"+(++i)+"</td><td><ul><li>Name: "+$($(response).attr('user')).attr('userName')+"</li><li>Mobile No: "+$($(response).attr('user')).attr('mobileNo')+"</li><li>Address: "+$($(response).attr('user')).attr('address')+"</li></td>";
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
	var str = '<button type="button" class="btn btn-primary" id="closeButton" onClick="return closePopup()">Close</button>';
	$("#lodaingModal").find(".modal-footer").html(str);
}

function hideConfirmPopUp(){
	$("#lodaingModal").modal('hide');
}
function hidePopUp2(){
	$("#alertModal").modal('hide');
}
function initFeedBackVendors(){
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