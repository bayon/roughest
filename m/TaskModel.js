function Task(id, task,minutes,added_on) {
	this.id = id;
	this.task = task;
	this.minutes = minutes;
	this.added_on = added_on;
	 
}

Task.prototype.id = '';
Task.prototype.task = '';
Task.prototype.minutes = '';
Task.prototype.added_on = '';

Task.prototype.reveal = function() {
	alert(this.id + " | task:" + this.task+ " | minutes:" + this.minutes+ " | added_on:" + this.added_on);
};
 
 