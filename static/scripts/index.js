import { setIndicatorPosition } from "./position-display.js";

const distanceElement = document.getElementById("distance");
const distanceAvgElement = document.getElementById("distance-avg");

function rssiToDistance(rssi) {
    const RSSI_1M = -29;
    const PATH_LOSS = 2.1;
    return 10 ** ((RSSI_1M - (-1 * rssi)) / (10 * PATH_LOSS));
}

const rssiElement = document.getElementById("rssi");
const rssiAvgElement = document.getElementById("rssi-avg");

const rssiValues = [];
const rssiMaxHistory = 6;
const minmaxStableThreshold = 2;

async function getRSSI() {
    try {
        const response = await fetch("/rssi");
        const data = await response.json();

        const rssi = data.rssi

        rssiValues.push(rssi);
        if (rssiValues.length > rssiMaxHistory) {
            rssiValues.shift();
        }

        return rssi;
    } catch (error) {
        return null;
    }
}

function getAverageRSSI() {
    const rssiAvg = rssiValues.reduce((sum, value) => sum + value, 0) / rssiValues.length;
    return rssiAvg.toFixed(1);
}

async function updateRSSI() {
    const rssi = await getRSSI();

    if (rssi !== null) {
        const avgRSSI = getAverageRSSI();

        rssiElement.textContent = rssi;
        rssiAvgElement.textContent = avgRSSI;

        const max = Math.max(...rssiValues);
        const min = Math.min(...rssiValues);
        const minmaxGap = max - min;

        if (minmaxGap <= minmaxStableThreshold) {
            rssiAvgElement.classList.add("stable");
            distanceAvgElement.classList.add("stable");
        } else {
            rssiAvgElement.classList.remove("stable");
            distanceAvgElement.classList.remove("stable");
        }

        const distance = rssiToDistance(rssi);
        distanceElement.textContent = distance.toFixed(1);

        const distanceAvg = rssiToDistance(avgRSSI);
        distanceAvgElement.textContent = distanceAvg.toFixed(1);

        setIndicatorPosition(distanceAvg);
    } else if (rssi === null) {
        distanceElement.textContent = "--";
        distanceAvgElement.textContent = "--";
        rssiElement.textContent = "--";
        rssiAvgElement.textContent = "--";
    }
}

updateRSSI();
setInterval(updateRSSI, 1000);