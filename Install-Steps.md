# Foundations

1. Download latest version of Raspbian from Website
2. Format and Install on SD Card
3. Insert into Raspberry Pi and Login
4. Enter Default Credentials  
    Username: pi  
    Password: raspberry
5.  Setup WiFi
   * `sudo nano /etc/wpa_supplicant/wpa_supplicant.conf `  
   * Insert Interface Details  
`network={ 
 ssid="USERNAME"
 psk="********"
}
`
  * Visit `sudo nano /usr/local/bin/checkwifi.sh`  
  * Enter the following:
    
```
ping -c4 192.168.1.1 > /dev/null
if [ $? != 0 ] 
then
  echo "No network connection, restarting wlan0"
  /sbin/ifdown 'wlan0'
  sleep 5
  /sbin/ifup --force 'wlan0'
fi
```
  * Ensure script can run with this: `sudo chmod 775 /usr/local/bin/checkwifi.sh`
  * Visit crontab with `crontab -e.`
  * Add this in crontab and save: `*/5 * * * * /usr/bin/sudo -H /usr/local/bin/checkwifi.sh >> /dev/null 2>&1`
  * Visit `sudo nano /etc/dhcpcd.conf` to setup Static IP (Forced by Raspberry Pi)
  * Enter the following:
  
  ``` interface wlan0

static ip_address=192.168.1.x/24 //The x is the IP you want
static routers=192.168.1.254 //Your Router Gateway
static domain_name_servers=192.168.1.254 //Your Router Gateway
```

6. Configure Raspberry Pi Settings  
  * `sudo raspi-config`
  * Enable SSH
  * Enable Camera
  * Enable 1-Wire

7. Install Node on the device
  * `curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash – `
  * `sudo apt install -y nodejs ` 
  
8. Install other useful packages:
  * Git: `sudo apt-get install git`
  * NPM / NodeJS / NodeSemver: `sudo apt-get install nodejs npm node-semver` 
  
9. Clone the github repository
  * `git clone https://github.com/nzjjay/RPI-GARAGE.git`
  
10. Go into directory 
  * `cd RPI-GARAGE'`, `cd garage-node`
  
9. Install NPM Modules in the directory
```
sudo npm install express async node-datetime child_process fs http python-shell socket.io
sudo npm install pigpio --unsafe-perm --force
sudo npm install -g forever-service
sudo reboot
```

10. Go to directory and run `node app.js`. The app should now start and run.
