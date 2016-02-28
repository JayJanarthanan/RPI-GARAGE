<?php

//echo "Distance is " . $output;
//echo "<br>";
$temp = exec("sudo python /home/pi/tempresult.py");
echo "Temperature is " . $temp . " C"; 

?>