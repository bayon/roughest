<?php
include_once ('head.php');
?>
<body onload="initMaterials();">
	<?php
	include_once ('navigation.php');
	?>
	<div class="content">

		<h3>Materials</h3>
		<div class='directions' style='font-size:11px;font-style:italic;'>
			A general list of materials.
		</div>

		<table border=1 class="estimatorTable">
			<form type="post" onsubmit="addMaterial(); return false;">

				<tr>
					<td>material:</td><td>
					<input type="text" id="material" name="material"    />
					</td>
				</tr>
				<tr>
					<td>cost:</td><td>$&nbsp;
					<input type="number"  step="any" id="material_cost" name="material_cost"    />
					</td>
				</tr>
				<tr>
					<td>&nbsp;</td><td>
					<input class="addButton" type="submit" value="+"/>
					</td>
				</tr>

			</form>
		</table>
		<table id="materialItems" border=1 class="estimatorTable"></table>
		<div class="row how-it-works">
			<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
				<p> How it works.</p>
				<ul>
					
					<li>Create a task or tasks with a name and how long they take in minutes.</li>
					<li>Create a material or materials and how much it will cost each.</li>
					
					<li>Go back to Your 'estimate'</li>
					<li>Now these are available to add to your estimate.</li> 
					
					 
				</ul> 
			</div>
		</div>
	</div>
		
	 
</body>
</html>​

