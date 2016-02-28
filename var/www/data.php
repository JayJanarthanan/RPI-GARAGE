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

echo '<div id="status" class="status">' . $status .  '</div>'; 
?>