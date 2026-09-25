import subprocess
import re

def get_rssi():
    # Kjører en linux kommando for å få info om PC-en sine WiFi tilkoblinger
    result = subprocess.run(["iwconfig"], capture_output=True, text=True)
    
    if result.stdout:
        # Bruker RegEx til å hente ut RSSI verdien fra kommandoen.
        match = re.search(r"(?<=Signal level=-)\d+", result.stdout)
        
        if match.group():
            return int(match.group())