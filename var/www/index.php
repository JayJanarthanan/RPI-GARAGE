<!-- Can be found as /var/www/index.php -->
<head>
<meta charset="UTF-8"/>
<title>Garage Operator</title>
<link rel="stylesheet" type="text/css" href="style.css"/>
<!--  <link rel="icon" type="image/png" href="/favicon.ico" /> -->
<script src="http://code.jquery.com/jquery-latest.min.js" type="text/javascript"></script>

<script>

var timeout = setInterval(reloadInfo, 5000);    
function reloadInfo () {
 $('#mainStatus').load('data.php');
 $('#stats').load('stats.php');
}
</script>

</head>


<?php
if (isset($_POST['OPEN']))
{
exec("sudo python /home/pi/door.py");
}
?>

<h1 class="h1"> Welcome to Jay's Garage. </h1>

<div  id='mainStatus'>

<?php include 'data.php';?>

</div>


<form method="post">
	<button class="button" name="OPEN">OPEN / CLOSE</button>
</form>


<div  id='stats'>
<?php include 'stats.php';?>
</div>

</p>
<p>Build 1.17. RPi-Garage last updated 1:44pm 28/02/2016. </p>
 
</div>




</html>
