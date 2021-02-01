<?php
/*
 template_php_endpoint.php
 Use this file to receive ajax requests from your kiosk files hosted at http://codigokio.gocodigo.net.
 AN alternative backend server location for Kiosks using PHP and MySql.
 Why?
 1) Either the 'shared' status of the 'content' file or the
 2) settings in Kioware
 are preventing the use of php within it's scope. Serving php as a download instead of running it.
 */
////////////////////////////////////////////////////////////////////////////////////////////////////////
// RESTRICT: server access to URLs ONLY from codigokio.
// KIOWARE SERVER:  header('Access-Control-Allow-Origin: http://codigokio.gocodigo.net', false);
// MARKETING SERVER:
header('Access-Control-Allow-Origin: http://www.gocodigo.com', false);
////////////////////////////////////////////////////////////////////////////////////////////////////////

if (isset($_POST['method'])) {
    switch ($_POST['method']) {
        case 'email_brochure_with_links' :
            $brochure = new Brochure();
            $brochure -> email_brochure_with_links($_POST);
            break;
        case 'go_reporting' :
            $go_reporting = new Go_Reporting();
            $go_reporting -> go_reporting($_POST);
            break;
        default :
            default_method();
            break;
    }
}

class Brochure {

    private $instanceName;
    private $company_admin_email;
    private $company_general_email;
    private $email_subject;

    function __construct() {
        $this -> instanceName = 'default';
        $this -> company_admin_email = 'bayon@gocodigo.com,bayon@forteworks.com';
        $this -> company_general_email = 'bayon@forteworks.com';
        $this -> email_subject = 'Your Company Brochure';
    }

    public function getName() {
        return $this -> instanceName;
    }

    public function setName($nameIn) {
        $this -> instanceName = $nameIn;
    }

    public function email_brochure_with_links($_DATA) {
        $to 		= $_DATA['to'];
        //$from 		= "hardcoded@company.com";
        //$subject 	= "Company Hardcode Brochure";
        $page_name 	= $_DATA['page_name'];
        $headers 	= "From: " . strip_tags($this -> company_general_email) . "\r\n";
        $headers 	.= "Reply-To: " . strip_tags($this -> company_general_email) . "\r\n";
        //$headers 	.= "CC: susan@example.com\r\n";
        $headers 	.= "MIME-Version: 1.0\r\n";
        $headers 	.= "Content-Type: text/html; charset=ISO-8859-1\r\n";
        $brochure 	= "";
        //PDFS required escaping the single quote  "<a href=\'https://www.manasquanbank.com/personal-banking/personal-checking/\'>Manasquan Bank</a>"
        switch ($page_name) {
            case 'checking' :
                $brochure = "<a href=https://www.manasquanbank.com/personal-banking/personal-checking/'>checking</a>";
                break;
            case 'savings' :
                $brochure = "<a href='https://www.manasquanbank.com/personal-banking/personal-savings/'>savings</a>";
                break;
            case 'kasasa' :
                $brochure = "<a href='https://www.manasquanbank.com/personal-banking/personal-checking/'>kasasa</a>";
                break;
            case 'home_lending' :
                $brochure = "<a href='https://www.manasquanbank.com/loans/mortgage-loans/'>home lending</a>";
                break;
            case 'other_loans' :
                $brochure = "<a href='https://www.manasquanbank.com/business-banking/business-lending/'>other loans </a>";
                break;
            case 'business_products' :
                $brochure = "<a href='https://www.manasquanbank.com/business-banking/business-checking/'>business products </a>";
                break;
            case 'business_services' :
                $brochure = "<a href='https://www.manasquanbank.com/business-banking/merchant-services/'>business services</a>";
                break;
            default :
                $brochure = "<a href='https://www.manasquanbank.com/personal-banking/personal-checking/'>Manasquan Bank</a>";
                break;
        }

        $data = array("name" => $_DATA['name'], "brochure" => $brochure);
        $message_html = $this -> buildCustomerEmailView($data);
        mail($to, $this -> email_subject, $message_html, $headers);


        //$company_admin = "bayon@gocodigo.com,bayon@forteworks.com";
        //$company_general_email = "bayon@forteworks.com";
        $to = $this -> company_admin;
        $from = $this -> company_general_email;
        $subject = "Kiosk User Interaction";
        if(!isset($_DATA['customer_dir_name'] )){
            $_DATA['customer_dir_name'] = "Codigo";
        }
        $message = $_DATA['name'] . " from device : " . $_DATA['unique_ipad_id'] . " on the page : " . $_DATA['page_name'] . " , would like to add his or her email :  " . $_DATA['to'] . " to your EMAIL LIST.";
 
        if ($_DATA['sendInfo'] == 'true') {
            $data = array("name" => $_DATA['name'], "unique_ipad_id" => $_DATA['unique_ipad_id'], "page_name" => $_DATA['page_name'], "to" => $_DATA['to'], "email_list" => 'YES', "customer_dir_name" => $_DATA['customer_dir_name']);
        } else {
            $data = array("name" => $_DATA['name'], "unique_ipad_id" => $_DATA['unique_ipad_id'], "page_name" => $_DATA['page_name'], "to" => $_DATA['to'], "email_list" => 'NO', "customer_dir_name" => $_DATA['customer_dir_name']);
        }
        $message_html = $this -> buildAdminEmailView($data);
        $headers = "From: " . strip_tags($from) . "\r\n";
        $headers .= "Reply-To: " . strip_tags($from) . "\r\n";
        //$headers .= "CC: susan@example.com\r\n";
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
        mail($to, $subject, $message_html, $headers);
        // JUST TO SEE THE DATA in the JS console
        echo(json_encode($_DATA));

       // $go_reporting = new Go_Reporting();
       // $go_reporting-> go_reporting($data);
         $sql = "INSERT INTO goreports.testkiosk (id, data) VALUES (NULL, '".json_encode($_DATA)."');";
         echo("<br>SQL:</br>".$sql);
         mysql_connect('localhost','root','MyNewPass');
         mysql_query($sql);
         echo(mysql_error());
        
    }

    ///////////////////////////////////
    public function buildAdminEmailView($data) {
        //      $data = array("name"=>$_DATA['name'],"unique_ipad_id"=>$_DATA['unique_ipad_id'],"page_name"=>$_DATA['page_name'],"to"=>$_DATA['to']);
        //logo_brand_329x39.png
        $html = "<html>";
        $html .= "<body>";
        $html .= "<style>";
        $html .= "body{font-family:arial,sans serif;}";
        $html .= "table th{text-align:left;padding:5px;}";
        $html .= "table td{text-align:left;padding:5px;}";
        $html .= "</style>";
        $html .= "<h1>Customer Kiosk Interaction</h1>";
        //$html .= "<p>'-I'd like to join the Manasquan Bank email list and receive additional information, announcemnets, and special offers.'</p>";
        $html .= "<table border=0 cellspacing=0 cellpadding=0 width=80% style='background-color:#fff;margin-top:30px;border-collpase:collapse;'>";

        $html .= "<tr>";
        $html .= "<td colspan=5 style='background-color:#1e284c; ' >";
        $html .= "<img src='http://www.gocodigo.com/Customers/" . $data['customer_dir_name'] . "/backend/logo_brand_329x39.png' width=329px  height=39px  style='color:#fff;font-size:18px;' alt='Customer Bank'>";
        $html .= "</td>";
        $html .= "</tr>";

        $html .= "<tr style='background-color:#eee;' >";
        //---------------------headers
        $html .= "<th>";
        $html .= "Name:";
        $html .= "</th>";

        $html .= "<th>";
        $html .= "Kiosk Id:";
        $html .= "</th>";

        $html .= "<th>";
        $html .= "Web Page:";
        $html .= "</th>";

        $html .= "<th>";
        $html .= "Customer Email:";
        $html .= "</th>";

        $html .= "<th>";
        $html .= "Checked Email List:";
        $html .= "</th>";

        $html .= "</tr>";
        //------------------------rows
        $html .= "<tr>";

        $html .= "<td>";
        $html .= "<p style='color:blue;' >" . $data['name'] . "</p>";
        $html .= "</td>";

        $html .= "<td>";
        $html .= "<p style='color:blue;' >" . $data['unique_ipad_id'] . "</p>";
        $html .= "</td>";

        $html .= "<td>";
        $html .= "<p style='color:blue;' >" . $data['page_name'] . "</p>";
        $html .= "</td>";

        $html .= "<td>";
        $html .= "<p style='color:blue;' >" . $data['to'] . "</p>";
        $html .= "</td>";

        $html .= "<td>";
        $html .= "<p style='color:blue;' >" . $data['email_list'] . "</p>";
        $html .= "</td>";

        $html .= "</tr>";

        $html .= "<tr>";
        $html .= "<td colspan=5  >";
        $html .= "<img src='http://www.gocodigo.com/Customers/" . $data['customer_dir_name'] . "/backend/codigo-logo.png' width=109px  height=45px  style='color:#fff;font-size:18px;' alt='Go Codigo!'>";
        $html .= "</td>";
        $html .= "</tr>";
        $html .= "";
        $html .= "";
        $html .= "</table>";

        $html .= "</body>";
        $html .= "</html>";
        return $html;
    }

    public function buildCustomerEmailView($data) {
        //      $data = array("name"=>$_DATA['name'],"unique_ipad_id"=>$_DATA['unique_ipad_id'],"page_name"=>$_DATA['page_name'],"to"=>$_DATA['to']);
        //logo_brand_329x39.png
        $html = "<html>";
        $html .= "<body>";
        $html .= "<style>";
        $html .= "body{font-family:arial;}";
        $html .= "table th{text-align:left;padding:5px;}";
        $html .= "table td{text-align:left;padding:5px;}";
        $html .= "</style>";
        $html .= "<h1>Customer  Brochure</h1>";
        //$html .= "<p>'-I'd like to join the Manasquan Bank email list and receive additional information, announcemnets, and special offers.'</p>";
        $html .= "<table border=0 cellspacing=0 cellpadding=0 width=80% style='background-color:#fff;margin-top:30px;border-collpase:collapse;'>";

        $html .= "<tr>";
        $html .= "<td colspan=5 style='background-color:#1e284c; ' >";
        $html .= "<img src='http://www.gocodigo.com/Customers/" . $data['customer_dir_name'] . "/backend/logo_brand_329x39.png' width=329px  height=39px  style='color:#fff;font-size:18px;' alt='Customer Bank'>";
        $html .= "</td>";
        $html .= "</tr>";

        $html .= "<tr style='background-color:#eee;' >";
        //---------------------headers
        $html .= "<th>";
        $html .= "Name:";
        $html .= "</th>";

        $html .= "<th>";
        $html .= "Brochure:";
        $html .= "</th>";

        $html .= "</tr>";
        //------------------------rows
        $html .= "<tr>";

        $html .= "<td>";
        $html .= "<p style='color:blue;' >" . $data['name'] . "</p>";
        $html .= "</td>";
        $html .= "<td>";
        $html .= "<p style='color:blue;' >" . $data['brochure'] . "</p>";
        $html .= "</td>";

        $html .= "</tr>";

        $html .= "</table>";

        $html .= "</body>";
        $html .= "</html>";
        return $html;
    }
    
    ////////////////////////////////////

}
 /////////////////////////////////////////////////////////////////////////////////////////////////////

class Go_Reporting {

    private $instanceName;
    private $company_admin_email;
    private $company_general_email;
    private $email_subject;

    function __construct() {
        $this -> instanceName = 'default';
        $this -> company_admin_email = 'bayon@gocodigo.com,bayon@forteworks.com';
        $this -> company_general_email = 'bayon@forteworks.com';
        $this -> email_subject = 'Your Company Brochure';
    }

    public function getName() {
        return $this -> instanceName;
    }
    public function setName($nameIn) {
        $this -> instanceName = $nameIn;
    }
    public function go_reporting($_DATA) {
       /* $to         = $_DATA['to'];
        $page_name  = $_DATA['page_name'];
        $data = array("name" => $_DATA['name'], "brochure" => $brochure);
        if(!isset($_DATA['customer_dir_name'] )){
            $_DATA['customer_dir_name'] = "Codigo/GoReporting";
        }
        if ($_DATA['sendInfo'] == 'true') {
            $data = array("name" => $_DATA['name'], "unique_ipad_id" => $_DATA['unique_ipad_id'], "page_name" => $_DATA['page_name'], "to" => $_DATA['to'], "email_list" => 'YES', "customer_dir_name" => $_DATA['customer_dir_name']);
        } else {
            $data = array("name" => $_DATA['name'], "unique_ipad_id" => $_DATA['unique_ipad_id'], "page_name" => $_DATA['page_name'], "to" => $_DATA['to'], "email_list" => 'NO', "customer_dir_name" => $_DATA['customer_dir_name']);
        }*/
        /////////////////////////////////////////////
         $sql = "INSERT INTO goreports.testkiosk (id, data) VALUES (NULL, '".json_encode($_DATA)."');";
         echo("<br>SQL:</br>".$sql);
         mysql_connect('localhost','root','MyNewPass');
         mysql_query($sql);
         echo(mysql_error());
    }
    ////////////////////////////////////

}
 


function default_method() {
    echo("<br>DEFAULT METHOD:</br>");
    echo(__FILE__);
    echo("<pre>");
    print_r($_POST);
    echo("</pre>");
}
?>