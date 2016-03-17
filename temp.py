import os, glob, time, sys, datetime

#initiate the temperature sensor in Parasitic mode

os.system('sudo modprobe w1-gpio pullup=1')
os.system('sudo modprobe w1-therm strong_pullup=1')

#set up the location of the sensor in the system

device_folder = glob.glob('/sys/bus/w1/devices/28*')
device_file = [device_folder[0] + '/w1_slave']

def read_temp():
    while True:
        temp = get_temp()
        if(temp != 85):
            return temp
            break
        else:
            continue

def get_temp():
    f = open(device_file[0], 'r')
    line = f.readline()
    crc = line.rsplit(' ',1)
    crc = crc[1].replace('\n', '')
    if crc=='YES':
      line = f.readline() 
      temp_list = line.rsplit('t=',1)
      mytemp = float(temp_list[1]) / 1000
      mytemp = round(mytemp, 4)
    else:
      mytemp = 85
    f.close()
    return float(mytemp)
