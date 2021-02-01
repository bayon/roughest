 <div>
 	<p>Supplies</p>
	
	<form type="post" onsubmit="addThing(); return false;">
		<div><label>item:</label><input type="text" id="thing" name="thing"   /></div>
		<div><label>cost:</label><input type="text" id="cost_each" name="cost_each"   /></div>
		<div style='float:right;'><input type="submit" value="Add Thing"/></div>
	</form>
	<table id="thingItems" border=1 width=90%></table>
	
	<form type="post" onsubmit="getThingSubtotals();return false; ">
		<input type="submit" value="subtotal"/>
	</form>
	<table id="thingSubtotals" border=1 width=90% ></table>
	
</div>
 