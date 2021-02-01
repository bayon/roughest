var materialNameSpace = {};
materialNameSpace.webdb = {};
materialNameSpace.webdb.db = null;

materialNameSpace.webdb.open = function() {
	var dbSize = 5 * 1024 * 1024;
	// 5MB
	materialNameSpace.webdb.db = openDatabase("Task", "1.0", "Task manager", dbSize);
};

materialNameSpace.webdb.createMaterialsTable = function() {
	var db = materialNameSpace.webdb.db;
	db.transaction(function(tx) {
		tx.executeSql("CREATE TABLE IF NOT EXISTS material(ID INTEGER PRIMARY KEY ASC, material TEXT UNIQUE ON CONFLICT REPLACE, cost FLOAT, added_on DATETIME  )", []);
	});
};

materialNameSpace.webdb.addMaterial = function(materialText, materialCostText) {
	var db = materialNameSpace.webdb.db;
	db.transaction(function(tx) {
		var addedOn = new Date();
		var cost = parseFloat(materialCostText);
		tx.executeSql("INSERT INTO material(material, cost, added_on) VALUES (?, ?, ?)", [materialText, cost, addedOn], materialNameSpace.webdb.onMaterialsSuccess, materialNameSpace.webdb.onMaterialsError);
	});
};

materialNameSpace.webdb.onMaterialsError = function(tx, e) {
	/*alert("There has been an error: " + e.message);*/
};

materialNameSpace.webdb.onMaterialsSuccess = function(tx, r) {
	materialNameSpace.webdb.getAllMaterialItems(loadMaterialItems);
};

materialNameSpace.webdb.getAllMaterialItems = function(renderFunc) {
	var db = materialNameSpace.webdb.db;
	db.transaction(function(tx) {
		tx.executeSql("SELECT * FROM material", [], renderFunc, materialNameSpace.webdb.onMaterialsError);
	});
};

materialNameSpace.webdb.deleteMaterial = function(id) {
	var db = materialNameSpace.webdb.db;
	db.transaction(function(tx) {
		tx.executeSql("DELETE FROM material WHERE ID=?", [id], materialNameSpace.webdb.onMaterialsSuccess, materialNameSpace.webdb.onMaterialsError);
	});
};
function loadMaterialItems(tx, rs) {
	var rowOutput = "<tr><th>Material</th><th>Cost</th><th>Action</th></tr>";
	var materialItems = document.getElementById("materialItems");
	for (var i = 0; i < rs.rows.length; i++) {
		rowOutput += renderMaterial(rs.rows.item(i));
	}
	materialItems.innerHTML = rowOutput;
}

function renderMaterial(row) {
	return "<tr><td>" + row.material + "</td><td>$&nbsp;" + row.cost + " </td><td><a href='javascript:void(0);' style='color:red;'  onclick='materialNameSpace.webdb.deleteMaterial(" + row.ID + ");'>X</a></td></tr>";
}

function initMaterials() {
	materialNameSpace.webdb.open();
	materialNameSpace.webdb.createMaterialsTable();
	materialNameSpace.webdb.getAllMaterialItems(loadMaterialItems);
}

function addMaterial() {
	var material = document.getElementById("material");
	var material_cost = document.getElementById("material_cost");
	materialNameSpace.webdb.addMaterial(material.value, material_cost.value);
	material.value = "";
	material_cost.value = "";
}
////////////////GENERAL
function initMaterialsForEstimates() {
	console.log('fn initMaterialsForEstimates');
	materialNameSpace.webdb.open();
	materialNameSpace.webdb.createMaterialTableForEstimates();
	materialNameSpace.webdb.getAllMaterialItemsForEstimates(loadMaterialItemsForEstimates);
}
materialNameSpace.webdb.getAllMaterialItemsForEstimates = function(renderFunc) {
	console.log('fn getAllMaterialItemsForEstimates');
	var db = materialNameSpace.webdb.db;
	db.transaction(function(tx) {
		tx.executeSql("SELECT * FROM material", [], renderFunc, materialNameSpace.webdb.onMaterialError);
	});
};
function loadMaterialItemsForEstimates(tx, rs) {
	console.log('fn loadMaterialItemsForEstimates');
	var rowOutput = "";
	var materialItems = document.getElementById("materialItemsForEstimates");
	for (var i = 0; i < rs.rows.length; i++) {
		rowOutput += renderMaterialForEstimates(rs.rows.item(i));
	}
	materialItems.innerHTML = rowOutput;
}
function renderMaterialForEstimates(row) {
	console.log('fn renderMaterialForEstimates');
	return "<tr><td>" + row.material + "</td><td>$&nbsp;" + row.cost + "</td><td><a href='javascript:void(0);'  onclick='materialNameSpace.webdb.selectMaterial(" + row.ID + ");'>Select</a></td></tr>";
}
materialNameSpace.webdb.selectMaterial = function(id) {
	console.log('fn selectMaterial');
	var db = materialNameSpace.webdb.db;
	db.transaction(function(tx) {
		tx.executeSql("SELECT * FROM material WHERE ID=?", [id], materialNameSpace.webdb.onMaterialSelectSuccess, materialNameSpace.webdb.onMaterialError);
	});
};

materialNameSpace.webdb.createMaterialTableForEstimates = function() {
	console.log('fn createMaterialTableForEstimates');
	var db = materialNameSpace.webdb.db;
	db.transaction(function(tx) {
		tx.executeSql("CREATE TABLE IF NOT EXISTS materialForEstimates(ID INTEGER PRIMARY KEY ASC, est_id INTEGER, material TEXT  UNIQUE ON CONFLICT REPLACE, cost INTEGER, numberOf INTEGER, added_on DATETIME )", []);
	});
};
materialNameSpace.webdb.onMaterialSelectSuccess = function(tx, rs) {
	console.log("fn onMaterialSelectSuccess");
	material = new Material(rs.rows.item(0).ID,rs.rows.item(0).material,rs.rows.item(0).cost,rs.rows.item(0).numberOf,rs.rows.item(0).added_on);
	var db = materialNameSpace.webdb.db;
	var est_id = sessionStorage.est_id;
	var addedOn = new Date();
	db.transaction(function(tx) {
		tx.executeSql("INSERT INTO materialForEstimates(ID, est_id, material , cost , numberOf, added_on ) VALUES (NULL,'"+est_id+"','"+material.material+"','"+material.cost+"',1,'"+addedOn+"');", [], materialNameSpace.webdb.onMaterialInsertSuccess, materialNameSpace.webdb.onMaterialError);
	});
	//refresh the ui
	startEstimation(sessionStorage.est_id);
};

////////////////////////////////
///-------------------------------------------CURRENT
function initMaterialsForEstimateID() {
	console.log("fn initMaterialsForEstimateID");
	materialNameSpace.webdb.open();
	materialNameSpace.webdb.getAllMaterialItemsForEstimateID(loadMaterialItemsForEstimateID);//getAllMaterialItemsForEstimateID(loadMaterialItemsForEstimateID)
}
materialNameSpace.webdb.getAllMaterialItemsForEstimateID = function(renderFunc) {
	console.log("fn getAllMaterialItemsForEstimateID");
	var db = materialNameSpace.webdb.db;
	var est_id = sessionStorage.est_id;
	
	db.transaction(function(tx) {
		tx.executeSql("SELECT * FROM materialForEstimates WHERE est_id = "+est_id+"", [], renderFunc, materialNameSpace.webdb.onTaskError);
	});
};
 function loadMaterialItemsForEstimateID(tx, rs) {
 	console.log("fn loadMaterialItemsForEstimateID"); 
	var rowOutput = "<tr><th>Current Materials</th><th title='Number of these items needed.'>#</th><th>each</th><th title='Cost each times how many needed.'>subtotal</th><th colspan=3>action</th></tr>";
	var materialItems = document.getElementById("materialItemsForCurrentEstimate");
	for (var i = 0; i < rs.rows.length; i++) {
		rowOutput += renderMaterialForCurrentEstimate(rs.rows.item(i));
	}
	materialItems.innerHTML = rowOutput;
}

///------------------------------------------- 
/////>>>>>>>>>>>>>>>>>>
function renderMaterialForCurrentEstimate(row) {
	 console.log("fn renderMaterialForCurrentEstimate");
	return "<tr><td>" + row.material + "</td><td>" + row.numberOf + "</td><td>$&nbsp;" + row.cost + " </td><td>$&nbsp;<input class='data_materials' name='data_materials' id='data_materials' value='" + Math.round(row.cost*row.numberOf*100)/100 + "'/> </td>"
	+"<td><a href='javascript:void(0);'  class='plusMinus' onclick='materialNameSpace.webdb.increaseNumberOf(" + row.ID + "," + row.numberOf + ");'>+</a></td>"
	+"<td><a href='javascript:void(0);' class='plusMinus'  onclick='materialNameSpace.webdb.decreaseNumberOf(" + row.ID + "," + row.numberOf + ");'>-</a></td>"
	+"<td> <a href='javascript:void(0);'  onclick='materialNameSpace.webdb.deleteAllMaterialsForEstimate(" + row.ID + ");' style='color:red;' >x</a></td>"
	+"</tr>";
}
materialNameSpace.webdb.increaseNumberOf = function(id, numberOf) {
	 console.log("fn increaseNumberOf");
	var db = materialNameSpace.webdb.db;
	db.transaction(function(tx) {
		var additionalTime = numberOf + 1;
		tx.executeSql("Update materialForEstimates SET numberOf = ? WHERE ID=?", [additionalTime, id], materialNameSpace.webdb.changeNumberOfSuccess, materialNameSpace.webdb.onMaterialError);
	});
};
materialNameSpace.webdb.decreaseNumberOf = function(id, numberOf) {
	 console.log("fn decreaseNumberOf");
	var db = materialNameSpace.webdb.db;
	db.transaction(function(tx) {
		var decreasedTime = numberOf - 1;
		tx.executeSql("Update materialForEstimates SET numberOf = ? WHERE ID=?", [decreasedTime, id], materialNameSpace.webdb.changeNumberOfSuccess, materialNameSpace.webdb.onMaterialError);
	});
};
materialNameSpace.webdb.changeNumberOfSuccess = function(tx, r) {
	console.log("fn changeNumberOfSuccess");
	materialNameSpace.webdb.getAllMaterialItemsForEstimateID(loadMaterialItemsForEstimateID);
};

materialNameSpace.webdb.deleteAllMaterialsForEstimate = function(id) {
	console.log("fn deleteAllMaterialsForEstimate");
	var db = materialNameSpace.webdb.db;
	db.transaction(function(tx) {
		tx.executeSql("DELETE FROM materialForEstimates WHERE est_id=?", [id], materialNameSpace.webdb.onMaterialDeleteSuccess, materialNameSpace.webdb.onMaterialError);
	});
};
materialNameSpace.webdb.onMaterialDeleteSuccess = function(tx, r) {
	console.log("fn onMaterialDeleteSuccess");
	startEstimation(sessionStorage.est_id);
};
materialNameSpace.webdb.onMaterialInsertSuccess = function(tx, r) {
	console.log("fn onMaterialInsertSuccess");
	startEstimation(sessionStorage.est_id);
};
/////>>>>>>>>>>>>>>>>>>

