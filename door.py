 #!/usr/bin/python   
 # Import required Python libraries   
 import RPi.GPIO as GPIO   
 import time   
 # Use BM GPIO references instead of physical pin numbers   
 GPIO.setmode(GPIO.BOARD)   
 # init list with pin numbers   
 pinList = [2]   
 # loop through pins and set mode and state to 'low'   
 for i in pinList:   
      GPIO.setup(11, GPIO.OUT)   
      GPIO.output(11, GPIO.HIGH)   
 def trigger():  
       for i in pinList:  
            GPIO.output(11, GPIO.LOW)  
            time.sleep(0.5)  
            GPIO.output(11, GPIO.HIGH)  
            GPIO.cleanup()   
 try:   
      trigger()   
 except KeyboardInterrupt:   
      print " Quit" # Reset GPIO settings  
