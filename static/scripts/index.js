import { updateIndicators } from "./position-display.js";


function rssiToDistance(rssi) {
    const RSSI_1M = -29;
    const PATH_LOSS = 2.05;
    return 10 ** ((RSSI_1M - (-1 * rssi)) / (10 * PATH_LOSS));
}

export { rssiToDistance };


const rssiHistory = [];
const maxHistory = 6;

async function getRSSI() {
    try {
        // Bruker Python RSSI API-en
        const response = await fetch("/rssi");
        const data = await response.json();

        const rssi = data.rssi

        // Lagrer en kort historie av RSSI-er
        rssiHistory.push(rssi);
        if (rssiHistory.length > maxHistory) {
            rssiHistory.shift();
        }

        return rssi;
    } catch (error) {
        console.error(error)
    }
}


const avgRssiHistory = [];

function getAverageRSSI() {
    // Regner ut en gjennomsnittling RSSI fra historien 
    const avgRssi = rssiHistory.reduce((sum, value) => sum + value, 0) / rssiHistory.length;

    avgRssiHistory.push(avgRssi);
    if (avgRssiHistory.length > maxHistory) {
        avgRssiHistory.shift()
    }

    return avgRssi.toFixed(1);
}


const minmaxStableThreshold = 3;

function checkIfSignalStable(rssiHistory) {
    // Regner ut forskjellen mellom den laveste RSSI-en og den høyeste RSSI-en fra historien
    const max = Math.max(...rssiHistory);
    const min = Math.min(...rssiHistory);
    const minmaxDifference = max - min;

    // Hvis forskjellen er mindre enn en terskel så regner vi med at signalet er stabilt 
    if (minmaxDifference <= minmaxStableThreshold) {
        rssiAvgElement.classList.add("stable");
        distanceAvgElement.classList.add("stable");
    } else {
        rssiAvgElement.classList.remove("stable");
        distanceAvgElement.classList.remove("stable");
    }
}


const rssiElement = document.getElementById("rssi");
const rssiAvgElement = document.getElementById("rssi-avg");
const distanceElement = document.getElementById("distance");
const distanceAvgElement = document.getElementById("distance-avg");

// Oppdatere alle elementer og visninger.
async function updateAll() {
    const rssi = await getRSSI();

    if (rssi !== null) {
        rssiElement.textContent = `-${rssi}`;

        const avgRssi = getAverageRSSI();
        rssiAvgElement.textContent = `-${avgRssi}`;

        const distance = rssiToDistance(rssi);
        distanceElement.textContent = distance.toFixed(1);

        const distanceAvg = rssiToDistance(avgRssi);
        distanceAvgElement.textContent = distanceAvg.toFixed(1);

        checkIfSignalStable(rssiHistory);
        updateIndicators(avgRssiHistory);
    } else if (rssi === null) {
        // Hvis vi ikke mottar noe RSSI verdi fra serveren så resetter vi alle tekst elementene.
        distanceElement.textContent = "--";
        distanceAvgElement.textContent = "--";
        rssiElement.textContent = "--";
        rssiAvgElement.textContent = "--";
    }
}

updateAll();
setInterval(updateAll, 1000);