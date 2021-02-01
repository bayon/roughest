<?php include_once ('head.php'); ?>
<body onload="initTasks();">
	<?php include_once ('navigation.php');
	?>
	<div class="content container">
	<div class="row">
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"><h3>Tasks</h3></div>
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"><div class='directions' style='font-size:11px;font-style:italic;'>
			A general list of tasks.
		</div></div>
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"><table border=1 class="estimatorTable">
			<form type="post" onsubmit="addTask(); return false;">
				<tr>
					<td>task</td><td>
					<input type="text" id="task" name="task"    />
					</td>
				</tr>
				<tr>
					<td>min</td><td>
					<input type="number"  step="any" id="minutes" name="minutes"    />
					&nbsp;min</td>
				</tr>
				<tr>
					<td>&nbsp;</td><td>
					<input class="addButton" type="submit" value="+"/>
					</td>
				</tr>
			</form>
		</table></div>
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
		<table id="taskItems" border=1 class="estimatorTable"></table>
		</div>

		
		
		
		
		</div>
		<div class="row how-it-works">
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
			<p> How it works.</p>
			<ul>
				 
				 

				<li>Create a task or tasks with a name and how long they take in minutes.</li>
				<li>Create a material or materials and how much it will cost each.</li>
				
				<li>Go back to Your 'estimate'</li>
				 
			</ul> 
		</div>
		</div>
	</div>
</body>
</html>​ 