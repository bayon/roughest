<?php
 
include_once('tidyJSON.php');
mysql_connect('localhost','root','MyNewPass');
$sql = "SELECT * FROM goreports.testkiosk";
$res =  mysql_query($sql);
echo(mysql_error());

 while($row = mysql_fetch_assoc($res)){
    $data[] = $row;
 }
 
 $tidyJSON = new TidyJson;
 $json = json_encode($data);
 $cleanJson = $tidyJSON->tidy($json);
       
echo("
<script>
var data = ". $cleanJson."; 
</script>
");

?>
<html>
<head>
<title>Reporting</title>
<style>
#tcontainer{
    overflow-y:scroll;
    height:200px;
    max-height:200px;
}
.report_type_link{
    font-weight:bold;
    margin-right:25px;

}
</style>
<script src='jquery-1.11.2.min.js'></script>

<!-- FLOT -->
<script src='flot/jquery.flot.js'></script>
<script src='flot/jquery.flot.categories.js'></script>
   
<!-- end FLOT -->
</head>
<h3>Reporting</h3>
<a href="http://www.gocodigo.com/customers/codigo/GoReporting/kiosk/build/#" >BACK</a></br>
<div id='tcontainer'>
<table id='table' width='90%' border='1' >
<thead>
<tr><th>ID</th><th>customer_dir_name</th><th>date</th><th>method</th><th>name</th><th>dom id</th><th>page_name</th><th>report_action</th><th>sendInfo</th><th>to</th><th>unique_ipad_id</th></tr>
</thead>
<tbody id='tbody' >
</tbody>
</table>

</div>
<div id='report_type_menu'>
<h4>Report Types</h4>
<a href="#" onclick="page_report();" class='report_type_link'>page views</a>
<a href="#" onclick="focus_report();" class='report_type_link'>focus</a>
</div>

<div id='report_visual'>
</div>
<div id="placeholder" class="demo-placeholder" style='height:300px;width:800px;'></div>
</div>
 


<script>
var pages = ['home_page','page_one','PAGE_TWO'];
var num_brochureANdReporting = null;
var num_page_one = null;
var num_PAGE_TWO = null;

var focuses = ['modal-link-1','brochure_photo','PHP_info','see_monkeys','brochure_submit'];
var num_modal_link_1 = null;
var num_brochure_photo = null;
var num_PHP_info = null;
var num_see_monkeys  = null;
var num_brochure_submit = null;

//console.log('test.php');
console.log(data);
 for(var i=0; i < data.length;i++){
    console.log(data[i]['id']);
    console.log(JSON.parse(data[i]['data']));
    var row = JSON.parse(data[i]['data']);
    var rowHTML = "<tr>";
    rowHTML += "<td>"+checkUndefined(data[i]['id'])+"</td>";
    rowHTML += "<td>"+checkUndefined(row.customer_dir_name)+"</td>";
    rowHTML += "<td>"+checkUndefined(row.date)+"</td>";
    rowHTML += "<td>"+checkUndefined(row.method)+"</td>";

    
    rowHTML += "<td>"+checkUndefined(row.name)+"</td>";

     rowHTML += "<td>"+checkUndefined(row.dom_id)+"</td>";
     //gather focuses info
     console.log('--------------------------------------------------------------------------');
     console.log(focuses);
     console.log(row.dom_id);
      console.log(typeof row.dom_id);
     switch(row.dom_id) {
         
            case focuses[0]:
                num_modal_link_1++;
                break;
            case focuses[1]:
                num_brochure_photo++;
                break;
            case focuses[2]:
                num_PHP_info ++;
                break;
            case focuses[3]:
                num_see_monkeys ++;
                break;
            case focuses[4]:
                num_brochure_submit ++;
                break;
            default:
                //default code block
        }
    
    rowHTML += "<td>"+checkUndefined(row.page_name)+"</td>";
    /// gather page data
        switch(row.page_name) {
            case pages[0]:
                //code block
                num_brochureANdReporting++;
                break;
            case pages[1]:
                //code block
                num_page_one++;
                break;
            case pages[2]:
                //code block
                num_PAGE_TWO ++;
                break;
            default:
                //default code block
        }

    rowHTML += "<td>"+checkUndefined(row.report_action)+"</td>";
    rowHTML += "<td>"+checkUndefined(row.sendInfo)+"</td>";
    rowHTML += "<td>"+checkUndefined(row.to)+"</td>";
    rowHTML += "<td>"+checkUndefined(row.unique_ipad_id)+"</td>";

    rowHTML += "</tr>";
     $('#tbody').append(rowHTML);
    /*
    if in milliseconds.....something like this to convert 
var date = new Date(time);
alert(date.toString());
    */
 }
function checkUndefined(arg){
    console.log(arg);
    console.log(typeof arg);
  if(typeof arg == 'undefined'){arg='-';}
  return arg;
}
function page_report(){
    console.log('This is page report');
      var data = [ ["Index", num_brochureANdReporting], ["page_one", num_page_one], ["Page_TWO", num_PAGE_TWO]  ];

        $.plot("#placeholder", [ data ], {
            series: {
                bars: {
                    show: true,
                    barWidth: 0.6,
                    align: "center"
                }
            },
            xaxis: {
                mode: "categories",
                tickLength: 0
            }
        });
    $('#report_visual').html('chart or graph...');

}
function focus_report(){
    console.log('This is focus report');
    //var focuses = ['modal-link-1','brochure_photo','PHP_info','see_monkeys','brochure_submit'];
    console.log(num_modal_link_1);
      var data = [ ["modal_link_1", num_modal_link_1], ["brochure_photo", num_brochure_photo], ["PHP_info", num_PHP_info] , ["see_monkeys", num_see_monkeys], ["brochure_submit", num_brochure_submit] ];

        $.plot("#placeholder", [ data ], {
            series: {
                bars: {
                    show: true,
                    barWidth: 0.2,
                    align: "center"
                }
            },
            xaxis: {
                mode: "categories",
                tickLength: 0
            }
        });
    $('#report_visual').html('chart or graph...');

}
</script>
</html>