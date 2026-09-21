const rssiElement = document.getElementById("rssi");
const rssiAvgElement = document.getElementById("rssi-avg");
const minmaxElement = document.getElementById("minmax-gap");

const rssiValues = [];
const rssiMaxHistory = 8;
const minmaxStableThreshold = 2;

async function updateRSSI() {
    try {
        const response = await fetch("/rssi");
        const data = await response.json();

        rssiElement.textContent = data.rssi;

        rssiValues.push(data.rssi);
        if (rssiValues.length > rssiMaxHistory) {
            rssiValues.shift();
        }

        const average = rssiValues.reduce((sum, value) => sum + value, 0) / rssiValues.length;
        rssiAvgElement.textContent = average.toFixed(1);

        const max = Math.max(...rssiValues);
        const min = Math.min(...rssiValues);
        const minmaxGap = max - min;

        minmaxElement.textContent = minmaxGap;

        if (minmaxGap <= minmaxStableThreshold) {
            rssiAvgElement.classList.add("stable");
        } else {
            rssiAvgElement.classList.remove("stable");
        }

    } catch (error) {
        rssiElement.textContent = "--";
        rssiAvgElement.textContent = "--";
        minmaxElement.textContent = "--";
    }
}

updateRSSI();
setInterval(updateRSSI, 500);