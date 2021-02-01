////////kioskpro_unique_ipad_id.js////////////////////////////////////////////////////////////////////////////////////////////////////////
document.addEventListener( "DOMContentLoaded", updatePage, false ); 
// used to call the rest of the script when page loads 
var CUSTOMER_DIR_NAME = "codigo/GoReporting";
function updatePage()
{
	kp_requestKioskId("kp_requestKioskId_callback");
	console.log('unique_id: updatePage');
}
function kp_requestKioskId_callback(kioskId)
{
	//alert('kp_requestKioskId_callback');
	document.getElementById("unique_ipad_id").value = kioskId;
	console.log('unique_id: callback');
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function ajax_backend_callback(data){
	console.log('fn ajax_backend_callback(data)');
 	console.log(data);
}
function ajax_backend(dataString, URL, callback) {
	console.log('fn ajax_backend(dataString, URL, callback)');
	// POST
	var xmlhttp;
	if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp = new XMLHttpRequest();
	} else {// code for IE6, IE5
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			callback(xmlhttp.responseText);
		};
	};
	xmlhttp.open("POST", URL, true);
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlhttp.send(dataString);
}

function init_brochure(){
	console.log('fn init_backend()');
	///////////////////////////////////////////////////////////////
	// CHANGE PARAMETER: 
	
	var MODAL = false;
	//////////////////////////////////////////////////////////////
	query_brochure(CUSTOMER_DIR_NAME,MODAL);
}
function query_brochure(customer_dir_name,MODAL){
	console.log('fn query_backend()');
	//close the pop up for ALL pages.....'#modal-brochure' 
	if(MODAL){
		document.getElementById('modal-brochure').style.display='none';
	}
	

	var name=null,email=null ;
	var name = document.getElementById('name').value;
	var email = document.getElementById('email').value;
	var info_checkbox = document.getElementById('info_checkbox');
	var unique_ipad_id = document.getElementById('unique_ipad_id').value;
	var page_name = document.getElementById('page_name').value;
	var report_action = document.getElementById('report_action').value;
	var sendInfo = document.getElementById(info_checkbox.id).checked;
	var d = new Date();
	//var date = d.getTime();//in milliseconds
	 
 	var dataString="method=go_reporting&to="+email+"&sendInfo="+sendInfo+"&name="+name+"&unique_ipad_id="+unique_ipad_id+"&page_name="+page_name+"&report_action="+report_action+"&date="+d+"&customer_dir_name="+CUSTOMER_DIR_NAME;
 	var URL = "http://www.gocodigo.com/Customers/"+CUSTOMER_DIR_NAME+"/backend/endpoint.php";
	//console.log(dataString +" and "+ URL);
	ajax_backend(dataString, URL, ajax_backend_callback) ;
}

function report_engaged_DOM(dom_id){
	var d = new Date();
	//var page_name = document.getElementById('page_name').value;
	//var trim_id = dom_id.trim();
	var page_name =  document.getElementsByTagName("body")[0]['id'];
	var unique_ipad_id = document.getElementById('unique_ipad_id').value;
	var dataString="method=go_reporting&type=focus"+"&unique_ipad_id="+unique_ipad_id+"&page_name="+page_name+"&date="+d+"&customer_dir_name="+CUSTOMER_DIR_NAME+"&report_action=focus&dom_id="+dom_id;
 	var URL = "http://www.gocodigo.com/Customers/"+CUSTOMER_DIR_NAME+"/backend/endpoint.php";
	//console.log(dataString +" and "+ URL);
	ajax_backend(dataString, URL, ajax_backend_callback) ;

}