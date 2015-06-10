<html>   
 <head>  
 <meta charset="UTF-8" I>   
 <title>Garage Operator</title>   
 </head>   
 <?php   
 if (isset($_POST[‘OPEN’]))  
 {  
 exec("sudo python /home/pi/door.py”);   
 }  
 ?>   
 <form method=”post”>   
 <button name=”0PEN”> Door</button><br>   
 </form>  
 </html>   
