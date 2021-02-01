	App.webdb.createThingTable = function() {
	var db = App.webdb.db;
	db.transaction(function(tx) {
		tx.executeSql("CREATE TABLE IF NOT EXISTS thing(ID INTEGER PRIMARY KEY ASC, thing TEXT, numberOf INTEGER, cost FLOAT, added_on DATETIME)", []);
	});
};

App.webdb.addThing = function(thingText,costText) {
	 
	var db = App.webdb.db;
	db.transaction(function(tx) {
		var addedOn = new Date();
		var numberOf = 1;
		 var cost = parseFloat(costText);
		 
		tx.executeSql("INSERT INTO thing(thing,numberOf,cost, added_on) VALUES (?,?,?,?)", [thingText, numberOf, cost, addedOn], App.webdb.onThingSuccess, App.webdb.onThingError);
	});
};
//get form values
function addThing() {
	var thing = document.getElementById("thing");
	var cost = document.getElementById("cost_each");
	//pass form values to asynch fn
	App.webdb.addThing(thing.value,cost.value);
	thing.value = "";
}






App.webdb.onThingError = function(tx, e) {
	alert("There has been an error: " + e.message);
};

App.webdb.onThingSuccess = function(tx, r) {
	// re-render the data.
	//call asynch fn with a callback function as parameter.
	App.webdb.getAllThingItems(loadThingItems);
};

App.webdb.getAllThingItems = function(renderFunc) {
	//perform sql and either success follows to callback fn, or error to error fn.
	var db = App.webdb.db;
	db.transaction(function(tx) {
		tx.executeSql("SELECT * FROM thing", [], renderFunc, App.webdb.onThingError);
	});
};

 
function loadThingItems(tx, rs) {
	var rowOutput = "<tr><th colspan=5>Items:</th></tr><tr><th>Item</th><th>Number</th><th>Cost Each</th><th>Action</th><th>Action</th></tr>";
	var thingItems = document.getElementById("thingItems");
	for (var i = 0; i < rs.rows.length; i++) {
		//place rows of data into formatted html
		rowOutput += renderThing(rs.rows.item(i));
	}

	thingItems.innerHTML = rowOutput;
	 
}





App.webdb.deleteThing = function(id) {
	var db = App.webdb.db;
	db.transaction(function(tx) {
		tx.executeSql("DELETE FROM thing WHERE ID=?", [id], App.webdb.onThingSuccess, App.webdb.onThingError);
	});
};
App.webdb.increaseNumberOf = function(id, numberOf) {
	//alert('update id and numberOf:'+id+'---'+numberOf);
	var db = App.webdb.db;
	db.transaction(function(tx) {
		var additionalTime = numberOf + 1;
		
		tx.executeSql("Update thing SET numberOf = ? WHERE ID=?", [additionalTime, id], App.webdb.onThingSuccess, App.webdb.onThingError);
	});
};
App.webdb.decreaseNumberOf = function(id, numberOf) {
	//alert('update id and numberOf:'+id+'---'+numberOf);
	var db = App.webdb.db;
	db.transaction(function(tx) {
		var decreasedTime = numberOf - 1;
		tx.executeSql("Update thing SET numberOf = ? WHERE ID=?", [decreasedTime, id], App.webdb.onThingSuccess, App.webdb.onThingError);
	});
};

function renderThing(row) {
	 
	return "<tr><td>" + row.thing + "</td><td>" + row.numberOf + "</td><td>" + row.cost + " </td>"
	+"<td>[<a href='javascript:void(0);'  class='plusMinus' onclick='App.webdb.increaseNumberOf(" + row.ID + "," + row.numberOf + ");'>+</a>]"
	+"[<a href='javascript:void(0);' class='plusMinus'  onclick='App.webdb.decreaseNumberOf(" + row.ID + "," + row.numberOf + ");'>-</a>]</td>"
	+"<td> [<a href='javascript:void(0);'  onclick='App.webdb.deleteThing(" + row.ID + ");'>Delete</a>]</td>"
	+"</tr>";
}
//////////////////////////////////////////////
App.webdb.getThingSubtotals = function(renderFunc){
	//foo
	var db = App.webdb.db;
	 db.transaction(function(tx) {
		tx.executeSql("SELECT  thing as thing,numberOf *cost as subtotal FROM thing", [], renderFunc, App.webdb.onError);

	});
};
function getThingSubtotals(){
	App.webdb.getThingSubtotals(loadThingSubtotals);
}

function loadThingSubtotals(tx, rs) {
	var rowOutput = "<tr><th>thing</th><th>subtotal cost</th></tr>";
	var subtotal = document.getElementById("thingSubtotals");
	for (var i = 0; i < rs.rows.length; i++) {
		rowOutput += renderThingSubtotal(rs.rows.item(i));
	}
	subtotal.innerHTML = rowOutput;
}

function renderThingSubtotal(row) {
	return   "<tr><td> " + row.thing + "</td><td>" + row.subtotal + "</td></tr>" ;
}

////////////////////////////////////
