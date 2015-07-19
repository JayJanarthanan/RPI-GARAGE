
<head>
<meta charset="UTF-8" http-equiv="refresh" content="15" />
<title>Garage Operator</title>
<link rel="stylesheet" type="text/css" href="style.css" media="screen" />
</head>


<?php
if (isset($_POST['OPEN']))
{
exec("sudo python /home/pi/door.py");
}

?>


<h1 class="h1"> Welcome to Jay's Garage. </h1>
<p class="body" value="$status"> </p>

<?php

$output = exec("sudo python /home/pi/usonic.py");
$status;

//If the door is more than 50cm, then there is no door up, so must be closed
if($output > 50)
{
$status = "CLOSED";
}
// for some reason the door fluctuates between these values when moving
elseif ($output < 15)
{
$status = "MOVING";
}
// The garage is definetely open when it is between 16 and 20cm open
elseif( $output < 20)
{
$status = "OPEN";
}

else
{
$status = "UNKNOWN";
}

?>

<p style="status"> <?php echo '<div id="status" class="status">' . $status .  '</div>'; ?> </p>


<form method="post">
<button class="button" name="OPEN">OPEN / CLOSE</button><br>
<button class="button" name="STATUS">Refresh Status</button><br>
</form>

<p style="body"> <?php echo "Distance is " . $output; ?> </p>

</html>


