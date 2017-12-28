# RPI-GARAGE
A NodeJS Powered Raspberry Pi system for Garage operations 

## Hardware Used
- Raspberry Pi 2B
- Class 10 16GB MicroSD Card
- 750mA Power Adapter
- USB WiFi Dongle
- $3 Case from Ebay
- HC-SR04 Ultrasonic Sensor
- DS18B20P (Parasitic) Temperature Sensor
- 5V Relay with Octocoupler
- Cabling (any thin sort will work). The DuPont ones are great to work with.
- Raspberry Pi 5MP Camera Module

## Architectural Overview

I've got multiple sensors coming back to the Raspberry Pi, which is managed by a nodeJS module kept running using Forever.

![Screenshot](http://i.imgur.com/h2uK1d1.jpg?raw=true)

## Setting Up Hardware

Plug in your sensors at the start, use diagrams to determine where you want it to go. Install as required. 

## Setting Up Software

Running out of time to finish the documentation, but basically, run the script in setup folder above, and clone this repo into your Pi. Using the forever module will keep it up! Don't forget about the port number.


## Acknowledgements

Why re-invent the wheel? A lot of what I have done here is based on the generous time of people on StackOverflow and the work of many others that have kindly open sourced and freely licensed their code. I am very grateful for this. With that spirit, you are welcome to use my code however you wish under the MIT License. If you need any help, don't hesitate to email me!

