<?php
include_once ('head.php');
 ?>
<body onload="initEstimate();">
	<?php
	include_once ('navigation.php');
	?>
	<div class="content container">
		<div class="row">
			<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"><h2>Estimate</h2></div>
		</div>


		<div class="row">
			<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
				<div class='directions' style='font-size:11px;font-style:italic;'>
					Add rate per hour,tasks, and materials.
				</div>
			</div>
		</div>

	 

	<div class="row">
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
			<div id='estimateControlHeader' style='margin-top:20px;'>

				<button id='newEstimateFormButton' onclick='openNewEstimateForm();' >
					new estimate
				</button>
				<!-- NEW ESTIMATE FORM -->
				<div id='newEstimateForm' style='display:none;'>

					<table border=1 class="estimatorTable">
						<form type="post" onsubmit="addEstimate(); return false;">
							<tr>
								<th>$/hr</th><th>Name</th><th>New</th>
							</tr>
							<tr>
								<td>$&nbsp;
								<input type="number"  step="any"  id="hrRate" name="hrRate"  style="width:50%;" />
								</td>
								<td>
								<input type="text" id="estimate" name="estimate"  style="width:80%;"  />
								</td>
								<td>
								<input class="addButton" type="submit" value="+"  style="width:100%;"/>
								</td>
							</tr>
						</form>
					</table>
				</div>
				<!-- EXISTING ESTIMATE -->
				<table id="estimateItems" border=1 class="estimatorTable"></table>

			</div>
		</div>
	</div>
<div class="row">
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
			<!-- ESTIMATE SUMMARY -->
		<div id='summaryDiv' >
			<h3>Summary:</h3>
			<table class='summaryTable' border=1 width=100%>
				<tr> <td id='estimateName' class='task_summary_detail_head' colspan='8'></td></tr>
				<tr>
					<td  class='task_summary_detail_key'>tasks:</td><td id='taskCost' class='task_summary_detail_value'></td>
					<td  class='task_summary_detail_key'>materials:</td><td id='materialCost' class='task_summary_detail_value'></td>
					<td  class='task_summary_detail_key'>time:</td><td id='est_time' class='task_summary_detail_value'></td>
					<td  class='task_summary_detail_key'>total:</td><td id='totalCost' style='font-weight:bold;color:green;'></td>
				</tr>
			</table>
		</div>
		</div>
	</div>
	<div class="row">
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
			<div id="estimate_details" >

			<table id="selectedEstimateItem" width=100%;></table>

			<table id="taskItemsForCurrentEstimate" border=1 class="estimatorTable"></table>

			<table id="materialItemsForCurrentEstimate"  border=1 class="estimatorTable"></table>

			<button id='finalize' style='margin-top:20px;font-weight:bold;'  >
				finalize
			</button>
			<button id='save' style='margin-top:20px;font-weight:bold;display:none;'  >
				save
			</button>

			<div id='availableSelections' class='form_row'style='float:left; width:100%;'>
				<h3> Available Tasks: </h3>
				<div class="scrollingContainer">
					<table id="taskItemsForEstimates" border=1 class="estimatorTable"></table>
				</div>

				<h3> Available Materials: </h3>
				<div class="scrollingContainer">
					<table id="materialItemsForEstimates" border=1 class="estimatorTable"></table>
				</div>
			</div>

		</div>
		</div>
	</div>
	<div class="row how-it-works">
	<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
			<p> How it works.</p>
			<ul>
				 
				<li>Click New Estimate</li>
				
				<li>Enter your hourly rate and a job name.</li>
				<li>Click the '+' add buton</a>

				<li>Then you will have a new  estimate.</li>
				<li>Now you need to add 'Tasks' and 'Materials'</li>
				<li>Click either 'tasks' or 'materials' from the menu.</li>
</ul>
			<p> After you return</p>
			<ul>

				
				<li>Once you've created 'tasks' and 'materials' ...</li>
				<li>They are available to add to your estimate.</li> 
				<li>Click 'Select' by the tasks and materials you want to add.</li>
				<li>Then adjust quantities</li>
				 
				<li>Click finalize and see the results.</li>
					 
			</ul> 
		</div>
		</div>



		
		

		

		

		

	</div>

</body>
</html>​

<script>
	$(document).ready(function() {
		console.log("ready!");
		var summaryDiv = document.getElementById('summaryDiv');
		summaryDiv.style.display = "none";
	});

	$("#finalize").click(function() {

		var totalMinutes = 0;
		$.each($(".data_minutes"), function(i, e) {
			totalMinutes = totalMinutes + parseFloat(e.value);
		});
		sessionStorage.totalMinutes = totalMinutes;

		var totalTask = 0;
		$.each($(".data_tasks"), function(i, e) {
			totalTask = totalTask + parseFloat(e.value);
		});
		sessionStorage.totalTask = totalTask;

		var totalMaterial = 0;
		$.each($(".data_materials"), function(i, e) {
			totalMaterial = totalMaterial + parseFloat(e.value);
		});
		sessionStorage.totalMaterial = totalMaterial;

		var totalTasksAndMaterials = totalTask + totalMaterial;
		sessionStorage.totalCost = totalTasksAndMaterials;

		//populate the SUMMARY  with values clear orphans
		$("#estimateName").text(sessionStorage.estimate_name);

		var cleanTaskTotal = Math.round(sessionStorage.totalTask * 100) / 100;
		$("#taskCost").text("$" + cleanTaskTotal);

		var cleanMaterialTotal = Math.round(sessionStorage.totalMaterial * 100) / 100;
		$("#materialCost").text("$" + cleanMaterialTotal);

		var est_hours = Math.round((sessionStorage.totalMinutes / 60) * 100) / 100;
		//alert(est_hours);
		$("#est_time").text(est_hours + "hrs");
		var cleanCostTotal = Math.round(sessionStorage.totalCost * 100) / 100;
		$("#totalCost").text("$" + cleanCostTotal);

		var summaryDiv = document.getElementById('summaryDiv');
		summaryDiv.style.display = "block";

	});

	$("#save").click(function() {

	});

</script>