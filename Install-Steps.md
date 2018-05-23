# Foundations

1. Download latest version of Raspbian from Website
2. Format and Install on SD Card
3. Insert into Raspberry Pi and Login
4. Enter Default Credentials
... Username: pi
... Password: raspberry
5.  Setup WiFi
..1. `sudo nano /etc/wpa_supplicant/wpa_supplicant.conf '
`network={ 
 ssid="USERNAME"
 psk="********"
}
`
6. Configure Raspberry Pi Settings
..1. sudo raspi-config
..2. Enable SSH
..3. Enable Camera
..4. Enable 1-Wire
