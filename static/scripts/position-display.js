const displayElement = document.getElementById("position-display");
const indicatorElement = document.getElementById("position-indicator");

const displayMaxMeters = 10;
const displayMinMeters = 0;
const displayWidthPixels = 750;

displayElement.style.setProperty('--width', `${displayWidthPixels}px`);

function metersToPixels(meters) {
	return ((meters - displayMinMeters) / (displayMaxMeters - displayMinMeters)) * displayWidthPixels;
}

function setIndicatorPosition(positionInMeters) {
    const positionInPixels = metersToPixels(positionInMeters);
    indicatorElement.style.setProperty('--position', `${positionInPixels}px`);
}

export { setIndicatorPosition }