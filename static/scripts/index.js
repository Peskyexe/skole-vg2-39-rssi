const rssiValues = [];
const rssiMaxHistory = 8

async function updateRSSI() {
    try {
        const response = await fetch("/rssi");
        const data = await response.json();

        document.getElementById("rssi").textContent = data.rssi + " dBm";

        rssiValues.push(data.rssi);
        if (rssiValues.length > rssiMaxHistory) {
            rssiValues.shift();
        }

        const average = rssiValues.reduce((sum, value) => sum + value, 0) / rssiValues.length;
        const max = Math.max(...rssiValues);
        const min = Math.min(...rssiValues);

        const minmaxGap = max - min;

        document.getElementById("rssi-avg").textContent = average.toFixed(1) + " dBm";
        document.getElementById("minmax-gap").textContent = minmaxGap;
    } catch (error) {
        document.getElementById("rssi").textContent = "Offline";
        document.getElementById("rssi-avg").textContent = "Offline";
        document.getElementById("rssi-avg").textContent = "--";
    }
}

// updateRSSI();
// setInterval(updateRSSI, 500);