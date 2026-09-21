import subprocess
import re
import time

def get_rssi():
    result = subprocess.run(["iwconfig"], capture_output=True, text=True)
    
    if result.stdout:
        match = re.search(r"(?<=Signal level=-)\d+", result.stdout)
        
        if match.group():
            return int(match.group())

def get_avg_rssi(test_time: int, test_samples: int):
    time_per_sample = test_time / test_samples
    
    samples = []
    for i in range(test_samples):
        samples.append(get_rssi())
        time.sleep(time_per_sample)
        
    avg_rssi = round(sum(samples) / len(samples), 2)
    return avg_rssi


avg_signal_strength = get_avg_rssi(6, 12)
print(f"Avg Signal Strength: -{avg_signal_strength} dBm")


