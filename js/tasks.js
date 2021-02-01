var taskNameSpace = {};
taskNameSpace.webdb = {};
taskNameSpace.webdb.db = null;

taskNameSpace.webdb.open = function() {
	var dbSize = 5 * 1024 * 1024;
	// 5MB
	taskNameSpace.webdb.db = openDatabase("Task", "1.0", "Task manager", dbSize);
};

taskNameSpace.webdb.createTaskTable = function() {
	var db = taskNameSpace.webdb.db;
	db.transaction(function(tx) {
		tx.executeSql("CREATE TABLE IF NOT EXISTS task(ID INTEGER PRIMARY KEY ASC, task TEXT  UNIQUE ON CONFLICT REPLACE, minutes INTEGER, added_on DATETIME)", []);
	});
};

taskNameSpace.webdb.addTask = function(taskText, minutesText) {
	var db = taskNameSpace.webdb.db;
	db.transaction(function(tx) {
		var addedOn = new Date();
		var minutes = parseInt(minutesText);
		tx.executeSql("INSERT INTO task(task, minutes, added_on) VALUES (?,?,?)", [taskText, minutes, addedOn], taskNameSpace.webdb.onTaskSuccess, taskNameSpace.webdb.onTaskError);
	});
};

taskNameSpace.webdb.onTaskError = function(tx, e) {
	/*alert("There has been an error: " + e.message);*/
};

taskNameSpace.webdb.onTaskSuccess = function(tx, r) {
	taskNameSpace.webdb.getAllTaskItems(loadTaskItems);
};

taskNameSpace.webdb.getAllTaskItems = function(renderFunc) {
	var db = taskNameSpace.webdb.db;
	db.transaction(function(tx) {
		tx.executeSql("SELECT * FROM task", [], renderFunc, taskNameSpace.webdb.onTaskError);
	});
};

taskNameSpace.webdb.deleteTask = function(id) {
	var db = taskNameSpace.webdb.db;
	db.transaction(function(tx) {
		tx.executeSql("DELETE FROM task WHERE ID=?", [id], taskNameSpace.webdb.onTaskSuccess, taskNameSpace.webdb.onTaskError);
	});
};
function loadTaskItems(tx, rs) {
	var rowOutput = "<tr><th>Task</th><th title='Time to complete once.'>Minutes</th><th>Action</th></tr>";
	var taskItems = document.getElementById("taskItems");
	for (var i = 0; i < rs.rows.length; i++) {
		rowOutput += renderTask(rs.rows.item(i));
	}
	taskItems.innerHTML = rowOutput;
}

function renderTask(row) {
	return "<tr> <td>" + row.task + "</td><td>" + row.minutes + " </td><td><a href='javascript:void(0);' style='color:red;'  onclick='taskNameSpace.webdb.deleteTask(" + row.ID + ");'>X</a></td></tr>";
}

function initTasks() {
	taskNameSpace.webdb.open();
	taskNameSpace.webdb.createTaskTable();
	taskNameSpace.webdb.getAllTaskItems(loadTaskItems);
}

function addTask() {
	var task = document.getElementById("task");
	var minutes = document.getElementById("minutes");
	taskNameSpace.webdb.addTask(task.value, minutes.value);
	//clear form values
	task.value = "";
	minutes.value = "";
}
////////////////
function initTasksForEstimates() {
	taskNameSpace.webdb.open();
	taskNameSpace.webdb.createTaskTable();
	taskNameSpace.webdb.getAllTaskItemsForEstimates(loadTaskItemsForEstimates);

}

taskNameSpace.webdb.getAllTaskItemsForEstimates = function(renderFunc) {
	var db = taskNameSpace.webdb.db;
	db.transaction(function(tx) {
		tx.executeSql("SELECT * FROM task", [], renderFunc, taskNameSpace.webdb.onTaskError);
	});
};
function loadTaskItemsForEstimates(tx, rs) {
	var rowOutput = "";
	var taskItems = document.getElementById("taskItemsForEstimates");
	for (var i = 0; i < rs.rows.length; i++) {
		rowOutput += renderTaskForEstimates(rs.rows.item(i));
	}
	taskItems.innerHTML = rowOutput;
}

function renderTaskForEstimates(row) {
	console.log("fn renderTaskForEstimates");
	return "<tr><td>" + row.task + "</td><td>" + row.minutes + "&nbsp;min </td><td><a href='javascript:void(0);'  onclick='taskNameSpace.webdb.selectTask(" + row.ID + ");'>Select</a></td></tr>";
}

taskNameSpace.webdb.selectTask = function(id) {
	console.log("fn selectTask" + id);
	var db = taskNameSpace.webdb.db;
	db.transaction(function(tx) {
		tx.executeSql("SELECT * FROM task WHERE ID=?", [id], taskNameSpace.webdb.onTaskSelectSuccess, taskNameSpace.webdb.onTaskError);
	});
};

taskNameSpace.webdb.createTaskTableForEstimates = function() {
	console.log('fn createTaskTableForEstimates');
	var db = taskNameSpace.webdb.db;
	db.transaction(function(tx) {
		tx.executeSql("CREATE TABLE IF NOT EXISTS taskForEstimate(ID INTEGER PRIMARY KEY ASC, est_id INTEGER, task TEXT UNIQUE ON CONFLICT REPLACE, minutes INTEGER, repititions INTEGER,totalMinutes INTEGER,totalCost FLOAT, added_on DATETIME)", []);
	});
};
taskNameSpace.webdb.onTaskSelectSuccess = function(tx, rs) {
	console.log("fn onTaskSelectSuccess");
	task = new Task(rs.rows.item(0).ID, rs.rows.item(0).task, rs.rows.item(0).minutes, rs.rows.item(0).added_on);
	var est_id = sessionStorage.est_id;
	var db = taskNameSpace.webdb.db;
	db.transaction(function(tx) {
		tx.executeSql("INSERT INTO taskForEstimate(ID, est_id, task , minutes , repititions, added_on ) VALUES (NULL,'" + est_id + "','" + task.task + "','" + task.minutes + "', 1, '" + task.added_on + "');", [], taskNameSpace.webdb.onTaskInsertSuccess, taskNameSpace.webdb.onTaskError );
	});
};
////////////////////////////////
///-------------------------------------------
function initTasksForEstimateID() {
	console.log("fn initTasksForEstimateID");
	taskNameSpace.webdb.open();
	taskNameSpace.webdb.getAllTaskItemsForEstimateID(loadTaskItemsForEstimateID);//getAllTaskItemsForEstimateID(loadTaskItemsForEstimateID)
}
taskNameSpace.webdb.getAllTaskItemsForEstimateID = function(renderFunc) {
	console.log("fn getAllTaskItemsForEstimateID");
	var db = taskNameSpace.webdb.db;
	var est_id = sessionStorage.est_id;	 
	db.transaction(function(tx) {
		tx.executeSql("SELECT * FROM taskForEstimate WHERE est_id = "+est_id+"", [], renderFunc, taskNameSpace.webdb.onTaskError);
	});
};
 function loadTaskItemsForEstimateID(tx, rs) {
 	console.log("fn loadTaskItemsForEstimateID"); 
	var rowOutput = "<tr><th>Current Tasks</th><th title='Number of times this task will be performed.'>#</th><th>each</th><th>total</th><th>subtotal</th><th colspan=3>action</th></tr>";
	var taskItems = document.getElementById("taskItemsForCurrentEstimate");
	for (var i = 0; i < rs.rows.length; i++) {
		rowOutput += renderTaskForCurrentEstimate(rs.rows.item(i));
	}
	taskItems.innerHTML = rowOutput;
}

///-------------------------------------------//selectTask sessionStorage.est_id Available Tasks alert
/////>>>>>>>>>>>>>>>>>>
function renderTaskForCurrentEstimate(row) {
	var rpm = sessionStorage.rate_per_min;
	//alert(rpm);
	 console.log("fn renderTaskForCurrentEstimate");
	return "<tr><td>" + row.task + "</td><td>" + row.repititions + "</td> <td>" + row.minutes + "&nbsp;min</td>"+    " <td><input type='text' id='data_minutes' class='data_minutes' name='data_minutes' value='" + row.minutes*row.repititions + "' />&nbsp;min </td>" +     "<td>$&nbsp;<input type='text' class='data_tasks' name='data_tasks' id ='data_tasks' value='" + Math.round(row.minutes*row.repititions*rpm*100)/100 + "'/></td>"
	+"<td><a href='javascript:void(0);'  class='plusMinus' onclick='taskNameSpace.webdb.increaseNumberOf(" + row.ID + "," + row.repititions + ");'>+</a></td>"
	+"<td><a href='javascript:void(0);' class='plusMinus'  onclick='taskNameSpace.webdb.decreaseNumberOf(" + row.ID + "," + row.repititions + ");'>-</a></td>"
	+"<td> <a href='javascript:void(0);'  onclick='taskNameSpace.webdb.deleteAllTasksForEstimate(" + row.ID + ");' style='color:red;'>x</a></td>"
	+"</tr>";
}
taskNameSpace.webdb.increaseNumberOf = function(id, numberOf) {
	 console.log("fn increaseNumberOf");
	var db = taskNameSpace.webdb.db;
	db.transaction(function(tx) {
		var additionalTime = numberOf + 1;
		tx.executeSql("Update taskForEstimate SET repititions = ? WHERE ID=?", [additionalTime, id], taskNameSpace.webdb.changeNumberOfSuccess, taskNameSpace.webdb.onTaskError);
	});
};
taskNameSpace.webdb.decreaseNumberOf = function(id, numberOf) {
	 console.log("fn decreaseNumberOf");
	var db = taskNameSpace.webdb.db;
	db.transaction(function(tx) {
		var decreasedTime = numberOf - 1;
		tx.executeSql("Update taskForEstimate SET repititions = ? WHERE ID=?", [decreasedTime, id], taskNameSpace.webdb.changeNumberOfSuccess, taskNameSpace.webdb.onTaskError);
	});
};
taskNameSpace.webdb.changeNumberOfSuccess = function(tx, r) {
	console.log("fn changeNumberOfSuccess");
	taskNameSpace.webdb.getAllTaskItemsForEstimateID(loadTaskItemsForEstimateID);
};
taskNameSpace.webdb.deleteAllTasksForEstimate = function(id) {
	console.log("fn deleteAllTasksForEstimate");
	var db = taskNameSpace.webdb.db;
	db.transaction(function(tx) {
		tx.executeSql("DELETE FROM taskForEstimate WHERE ID=?", [id], taskNameSpace.webdb.onTaskDeleteSuccess, taskNameSpace.webdb.onTaskError);
	});
};
taskNameSpace.webdb.onTaskDeleteSuccess = function(tx, r) {
	console.log("fn onTaskDeleteSuccess");
	startEstimation(sessionStorage.est_id);
};
taskNameSpace.webdb.onTaskInsertSuccess = function(tx, r) {
	console.log("fn onTaskInsertSuccess");
	startEstimation(sessionStorage.est_id);
};
/////>>>>>>>>>>>>>>>>>>
