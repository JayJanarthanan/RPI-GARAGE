import os, glob, time
import tempresult
from ISStreamer.Streamer import Streamer

streamer = Streamer(bucket_name="GarageStream", access_key="Ius7abjQxMayG7E8MgJaPDyj4XUNWs0o")

while True:
	temp = tempresult.read_temp()
	if(temp < 80):
		streamer.log("temp", temp)
	time.sleep(600)
