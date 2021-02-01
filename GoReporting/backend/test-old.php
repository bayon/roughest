<?php
/*
  $sql = "INSERT INTO goreports.testkiosk (id, data) VALUES (NULL, '".json_encode($_DATA)."');";
         echo("<br>SQL:</br>".$sql);
         mysql_connect('localhost','root','MyNewPass');
         mysql_query($sql);
         echo(mysql_error());


         tidy($json, $config = null)
*/
         include_once('tidyJSON.php');
          mysql_connect('localhost','root','MyNewPass');
          $sql = "SELECT * FROM goreports.testkiosk";
        $res =  mysql_query($sql);
         echo(mysql_error());

         while($row = mysql_fetch_assoc($res)){
         	$data[] = $row;
         }
         //echo("<pre>");
       // print_r($data);
         
         //echo("</pre>");

         $tidyJSON = new TidyJson;
         $json = json_encode($data);
         $cleanJson = $tidyJSON->tidy($json);
        // echo("<hr>");
        // echo($cleanJson);


         echo("
<script>
var data = ". $cleanJson."; 
</script>
         	");
?>
<html>
<head>
<title>Reporting</title>
<script src='jquery-1.11.2.min.js'></script>
</head>
<h3>Reporting</h3>
<table id='table' width='90%' border='1' >
<thead>
<tr><th>ID</th><th>customer_dir_name</th><th>date</th><th>method</th><th>name</th><th>page_name</th><th>report_action</th><th>sendInfo</th><th>to</th><th>unique_ipad_id</th></tr>
</thead>
<tbody id='tbody' >
</tbody>
</table>
<script>
//console.log('test.php');
console.log(data);
 for(var i=0; i < data.length;i++){
 	console.log(data[i]['id']);
 	console.log(JSON.parse(data[i]['data']));
 	var row = JSON.parse(data[i]['data']);
 	var rowHTML = "<tr><td>"+data[i]['id']+"</td>";
 	rowHTML += "<td>"+row.customer_dir_name+"</td>";
 	rowHTML += "<td>"+row.date+"</td>";
 	rowHTML += "<td>"+row.method+"</td>";
 	rowHTML += "<td>"+row.name+"</td>";
 	rowHTML += "<td>"+row.page_name+"</td>";
 	rowHTML += "<td>"+row.report_action+"</td>";
 	rowHTML += "<td>"+row.sendInfo+"</td>";
 	rowHTML += "<td>"+row.to+"</td>";
 	rowHTML += "<td>"+row.unique_ipad_id+"</td>";

 	rowHTML += "</tr>";
 	 $('#tbody').append(rowHTML);
 	/*
 	if in milliseconds.....something like this to convert 
var date = new Date(time);
alert(date.toString());
 	*/
 }


</script>
</html>