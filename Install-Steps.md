# Foundations

1. Download latest version of Raspbian from Website
2. Format and Install on SD Card
3. Insert into Raspberry Pi and Login
4. Enter Default Credentials
    Username: pi
    Password: raspberry
5.  Setup WiFi
  1. `sudo nano /etc/wpa_supplicant/wpa_supplicant.conf `
  2. Insert Interface Details
`network={ 
 ssid="USERNAME"
 psk="********"
}
`
  3. Visit `sudo nano /usr/local/bin/checkwifi.sh`
  4. Enter the following:
  
  `ping -c4 192.168.1.1 > /dev/null
 
if [ $? != 0 ] 
then
  echo "No network connection, restarting wlan0"
  /sbin/ifdown 'wlan0'
  sleep 5
  /sbin/ifup --force 'wlan0'
fi`
  5. Ensure script can run with this: `sudo chmod 775 /usr/local/bin/checkwifi.sh`
  6. Visit crontab with `crontab -e.`
  7. Add this in crontab and save: `*/5 * * * * /usr/bin/sudo -H /usr/local/bin/checkwifi.sh >> /dev/null 2>&1`

6. Configure Raspberry Pi Settings
  1. `sudo raspi-config`
  2. Enable SSH
  3. Enable Camera
  4. Enable 1-Wire

7. Install Node on the device
  1. `curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash – `
  2. `sudo apt install -y nodejs ` 
  
8. Install other useful packages:
  1. Git: `sudo apt-get install git`
  2. NPM / NodeJS / NodeSemver: `sudo apt-get install nodejs npm node-semver` 
  
9. Clone the github repository
  1. `git clone https://github.com/nzjjay/RPI-GARAGE.git`
  
10. Go into directory 
  1. `cd RPI-GARAGE'`, `cd garage-node`
  
9. Install NPM Modules in the directory
`sudo npm install express async node-datetime child_process fs http python-shell socket.io
sudo npm install pigpio --unsafe-perm --force
sudo npm install -g forever-service
sudo reboot`

10. Ensure 
