import { rssiToDistance } from './index.js';


const displayElement = document.getElementById("position-display");

const displayMaxMeters = displayElement.dataset.maxMeters;
const displayMinMeters = displayElement.dataset.minMeters;

const displayWidthPixels = displayElement.dataset.widthPx;
displayElement.style.setProperty('--width', `${displayWidthPixels}px`);

function metersToPixelsBounded(meters) {
    // Passer på at meter verdien ikke er mer- eller mindre en min og max verdien til displayet
    const boundedMeters = Math.min(Math.max(meters, displayMinMeters), displayMaxMeters);

    // Konverterer meter til pixler 
	return ((boundedMeters - displayMinMeters) / (displayMaxMeters - displayMinMeters)) * displayWidthPixels;
}


// Henter inn alle indikatorene fra posisjon displayet. 
const indicators = document.querySelectorAll('.position-indicator');

// Oppdaterer alle indikatorene sin posisjon 
function updateIndicators(rssiHistory) {
    const setIndicatorPosition = (indicator, distance) => {
        const position = metersToPixelsBounded(distance);
        indicator.style.setProperty('--position', `${position}px`);
    }

    // De nyeste RSSI oppdateringene ligger bakerst, så vi flipper historien for å få de nyeste først.
    // Istedet for Eldste -> Nyeste så blir det Nyeste -> Eldste
    const flippedRssiHistory = rssiHistory.toReversed();

    indicators.forEach(indicator => {
        const rssi = flippedRssiHistory.shift();
        const distance = rssiToDistance(rssi);
        setIndicatorPosition(indicator, distance)
    });
}

export { updateIndicators }