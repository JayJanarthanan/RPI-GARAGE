#!/usr/bin/python   
# Import required Python libraries   
import RPi.GPIO as GPIO   
import time   
# Use BM GPIO references instead of physical pin numbers   
GPIO.setmode(GPIO.BOARD)   

GaragePin = 11
GPIO.setup(GaragePin, GPIO.OUT)   
GPIO.output(GaragePin, GPIO.HIGH)   
def trigger():  
	GPIO.output(GaragePin, GPIO.LOW)  
	time.sleep(0.5)  
	GPIO.output(GaragePin, GPIO.HIGH)  
	GPIO.cleanup()   
try:   
  trigger()   
except KeyboardInterrupt:   
  print " Quit" # Reset GPIO settings  
