# (c) Jay Janarthanan 2015.
# http://jay.appavate.com
# You can use the code below freely under a GNU license.
import os, glob, time, sys, datetime
#initiate the temperature sensor in Parasitic mode
os.system('sudo modprobe w1-gpio pullup=1')
os.system('sudo modprobe w1-therm strong_pullup=1')

#set up the location of the sensor in the system
device_folder = glob.glob('/sys/bus/w1/devices/28*')
device_file = [device_folder[0] + '/w1_slave']


def read_temp():
 f = open(device_file[0], 'r')
 line = f.readline()
 crc = line.rsplit(' ',1)
 crc = crc[1].replace('\n', '')
 if crc=='YES':
   line = f.readline() 
   temp_line = line.rsplit('t=',1)
   mytemp = float(temp_linepp[1]) / 1000
 else:
   mytemp = 99999
   f.close()
 return mytemp


#Remove when using for a POST call
while True:
    temp = read_temp() 
    print(temp)
    if(temp == "99999" or temp == "85000"):
        print("ERROR: Please check your sensor")
    time.sleep(1) #wait 1 minutes
