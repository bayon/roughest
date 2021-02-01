function Estimate(id, arrayOfTasks, arrayOfMaterials) {
	this.id = id;
	this.arrayOfTasks = arrayOfTasks;
	this.arrayOfMaterials = arrayOfMaterials;
}

Estimate.prototype.id = '';
Estimate.prototype.arrayOfTasks = '';
Estimate.prototype.arrayOfMaterials = '';

Estimate.prototype.reveal = function() {

	alert(this.id + " | array of tasks:" + this.arrayOfTasks+ " | array of materials:" + this.arrayOfMaterials);
};
Estimate.prototype.addTaskElement = function(element) {

	this.arrayOfTasks.push(element);
}; 
Estimate.prototype.addMaterialElement = function(element) {

	this.arrayOfMaterials.push(element);
}; 