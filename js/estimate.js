var estimateNameSpace = {};
estimateNameSpace.webdb = {};
estimateNameSpace.webdb.db = null;

estimateNameSpace.webdb.open = function() {
	console.log('asfn open');
	var dbSize = 5 * 1024 * 1024;
	// 5MB
	estimateNameSpace.webdb.db = openDatabase("Task", "1.0", "Task manager", dbSize);
};

function initEstimate() {
	console.log('fn initEstimate');
	estimateNameSpace.webdb.open();
	estimateNameSpace.webdb.createEstimateTable();//creates a table then no navigation.
	estimateNameSpace.webdb.getAllEstimateItems(loadEstimateItems);//querys estimates then navigates to loadEstimateItems()
	//final calculations display
	var totalCost = document.getElementById('totalCost');
		if(sessionStorage.totalCost > 0){
			totalCost.value=sessionStorage.totalCost;
		}else{
			totalCost.value=0;
		}
}
function openNewEstimateForm(){
	 console.log('fn openNewEstimateForm');
		var newEstimateForm = document.getElementById('newEstimateForm');
		newEstimateForm.style.display="block";
		var summaryDiv = document.getElementById('summaryDiv');
		summaryDiv.style.display="none";
		estimateNameSpace.webdb.deleteEstimate(sessionStorage.est_id);
}
estimateNameSpace.webdb.deleteEstimate = function(id) {
	console.log('asfn deleteEstimate');
	var db = estimateNameSpace.webdb.db;
	db.transaction(function(tx) {
		tx.executeSql("DELETE FROM estimate WHERE ID = ?", [id], estimateNameSpace.webdb.onEstimateDeleteSuccess, estimateNameSpace.webdb.onEstimateError);
	});
};
function deleteEstimate(){
	console.log('fn deleteEstimate');
	estimateNameSpace.webdb.deleteAllTasksForEstimate(sessionStorage.est_id);
	estimateNameSpace.webdb.deleteAllMaterialsForEstimate(sessionStorage.est_id);
	estimateNameSpace.webdb.deleteEstimate(sessionStorage.est_id);
}

estimateNameSpace.webdb.createEstimateTable = function() {
	console.log('asfn createEstimateTable');
	var db = estimateNameSpace.webdb.db;
	db.transaction(function(tx) {
		tx.executeSql("CREATE TABLE IF NOT EXISTS estimate(ID INTEGER PRIMARY KEY ASC, estimate TEXT  UNIQUE ON CONFLICT REPLACE,hrRate FLOAT,rate_per_minute FLOAT, added_on DATETIME)", []);
	});
};

function addEstimate() {
	console.log('fn addEstimate');
	// delete previous estimate
	deleteEstimate();
	var estimate = document.getElementById("estimate");
	sessionStorage.estimate_name = estimate.value;
	var hrRate = document.getElementById("hrRate");
	var rate_per_hour = parseFloat(hrRate.value);
	sessionStorage.rate_per_hour = rate_per_hour;
	var rate_per_minute = (rate_per_hour/60).toFixed(2);
	sessionStorage.rate_per_min = rate_per_minute;
	estimateNameSpace.webdb.addEstimate(estimate.value,rate_per_hour,rate_per_minute);
	//CLEAR THESE ,we only added an estimate we did NOT select it yet.
	estimate.value = "";
	hrRate.value = "";
	sessionStorage.estimate_name ="";
	sessionStorage.rate_per_hour =0;
	sessionStorage.rate_per_min=0;
}
estimateNameSpace.webdb.addEstimate = function(estimateText,hrRate,rate_per_minute) {
	console.log('asfn addEstimate');
	var db = estimateNameSpace.webdb.db;
	db.transaction(function(tx) {
		var addedOn = new Date();
		tx.executeSql("INSERT INTO estimate(estimate, hrRate,rate_per_minute, added_on) VALUES (?,?,?,?)", [estimateText,hrRate,rate_per_minute, addedOn], estimateNameSpace.webdb.onEstimateSuccess, estimateNameSpace.webdb.onEstimateError);
	});
};

estimateNameSpace.webdb.onEstimateError = function(tx, e) {
	console.log('asfn onEstimateError');
	/*alert("There has been an error: " + e.message);*/
};

estimateNameSpace.webdb.onEstimateSuccess = function(tx, r) {
	console.log('asfn onEstimateSuccess');
	estimateNameSpace.webdb.getAllEstimateItems(loadEstimateItems);
};


estimateNameSpace.webdb.onEstimateDeleteSuccess = function(tx, r) {
	console.log('asfn onEstimateDeleteSuccess ');
	//   C L E A R   U I      
	var estimate_details = document.getElementById('estimate_details');
	estimate_details.style.display = "none";
	sessionStorage.est_id = 0;
	sessionStorage.rate_per_hour=0;
	sessionStorage.rate_per_min = 0;
	sessionStorage.estimate_name="";
	initMaterialsForEstimateID();
	initTasksForEstimateID();
	estimateNameSpace.webdb.getAllEstimateItems(loadEstimateItems);
};
//-------------------------
estimateNameSpace.webdb.deleteAllTasksForEstimate = function(id) {
	console.log("asfn EST deleteAllTasksForEstimate");
	var db = estimateNameSpace.webdb.db;
	db.transaction(function(tx) {
		//delete ALL 
			tx.executeSql("DELETE FROM taskForEstimate", [], estimateNameSpace.webdb.onTaskDeleteSuccess, estimateNameSpace.webdb.onTaskError);
	});
};
estimateNameSpace.webdb.onTaskDeleteSuccess = function(tx, r) {
	console.log("asfn EST onTaskDeleteSuccess");
};

estimateNameSpace.webdb.deleteAllMaterialsForEstimate = function(id) {
	console.log("asfn EST deleteAllMaterialsForEstimate");
	var db = estimateNameSpace.webdb.db;
	db.transaction(function(tx) {
		tx.executeSql("DELETE FROM materialForEstimates", [], estimateNameSpace.webdb.onMaterialDeleteSuccess, estimateNameSpace.webdb.onMaterialError);
	});
};
estimateNameSpace.webdb.onMaterialDeleteSuccess = function(tx, r) {
	console.log("asfn EST onMaterialDeleteSuccess");
};
//-----------------------
estimateNameSpace.webdb.getAllEstimateItems = function(renderFunc) {
	console.log('asfn getAllEstimateItems');
	var db = estimateNameSpace.webdb.db;
	db.transaction(function(tx) {
		tx.executeSql("SELECT * FROM estimate", [], renderFunc, estimateNameSpace.webdb.onEstimateError);
	});
};

function loadEstimateItems(tx, rs) {
	console.log('fn loadEstimateItems');
	var db = estimateNameSpace.webdb.db;
	//loops through query results , builds ui in render function and returns ui html to main view.
	var rowOutput = "<tr><th colspan=3>Estimate</th></tr>";
	var estimateItems = document.getElementById("estimateItems");
	for (var i = 0; i < rs.rows.length; i++) {
		rowOutput += renderEstimate(rs.rows.item(i));
	}
//the rowOutput contains the "details" and "delete" calls for the estimate.
	estimateItems.innerHTML = rowOutput;
}

function renderEstimate(row) {
	console.log('fn renderEstimate');
	return "<tr><td>" + row.estimate + "</td><td style='width:15%;'><a href='javascript:void(0);'  onclick='estimateNameSpace.webdb.selectEstimate(" + row.ID + ");'>Details</a></td><td style='width:15%;'><a href='javascript:void(0);'  style='color:red;' onclick='estimateNameSpace.webdb.deleteEstimate(" + row.ID + ");'>X</a></td></tr>";
}

estimateNameSpace.webdb.selectEstimate = function(id) {
	console.log('asfn selectEstimate');
	//clear summary
	var summaryView = document.getElementById('summaryDiv');
	summaryView.style.display = "none";
	$( "#taskCost" ).text( "0");
	$( "#materialCost" ).text("0" );
	$( "#totalCost" ).text( "0");
	// clear old estimate data here.
	console.log('clear UI ');
	sessionStorage.est_id = 0;
	sessionStorage.rate_per_hour=0;
	sessionStorage.rate_per_min = 0;
	sessionStorage.estimate_name="";
	//clear total
	sessionStorage.totalCost=0;
	sessionStorage.totalMaterial=0;
	sessionStorage.totalTask=0;
	sessionStorage.totalMinutes=0;
	//set new estimate session variables(est_id,estimate_name,rate_per_our IN RENDER METHOD
	var estimateControlHeader = document.getElementById('estimateControlHeader');
	estimateControlHeader.style.display="none";
	var estimate_details = document.getElementById('estimate_details');
	estimate_details.style.display = "block";
	var db = estimateNameSpace.webdb.db;
	db.transaction(function(tx) {
		tx.executeSql("SELECT * FROM estimate WHERE ID=?", [id], estimateNameSpace.webdb.onEstimateSelectSuccess, estimateNameSpace.webdb.onEstimateError);
	});
};

estimateNameSpace.webdb.onEstimateSelectSuccess = function(tx, r) {
console.log('asfn onEstimateSelectSuccess');
	var rowOutput = "";
	var estimateItems = document.getElementById("selectedEstimateItem");
	for (var i = 0; i < r.rows.length; i++) {
		rowOutput += renderSelectedEstimate(r.rows.item(i));
	}
	estimateItems.innerHTML = rowOutput;
};

function renderSelectedEstimate(row) {
	console.log('fn renderSelectedEstimate');
	sessionStorage.est_id=row.ID;
	sessionStorage.estimate_name=row.estimate;
	sessionStorage.rate_per_hour=row.hrRate;
	sessionStorage.rate_per_min=row.rate_per_minute;
	$( "#estimateName" ).text( row.estimate );//for summary display
	return "<tr><td style='font-weight:bold;'>" + row.estimate + "</td><td>$"+row.hrRate+"p/hr</td><td>$"+row.rate_per_minute+"p/min</td><td>" + " <input type='hidden' id='selectedEstimate' value='" + row.ID + "'/>  " + "<button onclick='startEstimation(" + row.ID + ");' >open</button></td></tr>";
}

function startEstimation(id) {
	 console.log('fn startEstimation');
	// SET CURRENT ESTIMATE ID
	sessionStorage.est_id = id;
	taskNameSpace.webdb.open();
	taskNameSpace.webdb.createTaskTableForEstimates();
	refreshEstimation(id);
	//INIT "AVAILABLE" TASKS AND MATERIALS
	initTasksForEstimates();
	initMaterialsForEstimates();
	//INIT "CURRENT" ESTIMATE's TASKS AND MATERIALS
	initTasksForEstimateID();
	initMaterialsForEstimateID();
	
}
function refreshEstimation(id){
	 console.log('fn refreshEstimation');
	//INIT ALL AVAILABLE TASKS AND MATERIALS
	initTasksForEstimates();
	initMaterialsForEstimates();
	//INIT CURRENT ESTIMATE TASKS AND MATERIALS
	initTasksForEstimateID();
	initMaterialsForEstimateID();
}


	