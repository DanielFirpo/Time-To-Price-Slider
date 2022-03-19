const radioButtons = document.querySelectorAll('.radio-input-checkbox');
const time = document.querySelector('#time');
const price = document.querySelector('#price');
const slider = document.querySelector('#time-slider');

const EARLIEST_TICKET_AVAILABLE = 540; //offest from midnight in minutes. This is when the earlist ticket is available
const LATEST_TICKET_AVAILABLE = 900; //amount of minutes after midnight that tickets are still available

const MOST_EXPENSIVE_TICKET = 99; //in dollars
const CHEAPEST_TICKET = 69; //in dollars

slider.min = EARLIEST_TICKET_AVAILABLE;
slider.max = LATEST_TICKET_AVAILABLE;
slider.value = EARLIEST_TICKET_AVAILABLE;

let sliderTimeDivision = "minute";

updateTimePriceDisplay(EARLIEST_TICKET_AVAILABLE);

radioButtons.forEach(button => {
    button.addEventListener("click", (e) => {

        sliderTimeDivision = e.target.value; 

        if (sliderTimeDivision === "minute") {
            slider.min = EARLIEST_TICKET_AVAILABLE;
            slider.max = LATEST_TICKET_AVAILABLE;
            slider.value = EARLIEST_TICKET_AVAILABLE;
        }
        else if (sliderTimeDivision === "half-hour") {
            slider.min = EARLIEST_TICKET_AVAILABLE / 30;
            slider.max = LATEST_TICKET_AVAILABLE / 30;
            slider.value = EARLIEST_TICKET_AVAILABLE / 30;
        }
        else {
            slider.min = EARLIEST_TICKET_AVAILABLE / 60;
            slider.max = LATEST_TICKET_AVAILABLE / 60;
            slider.value = EARLIEST_TICKET_AVAILABLE / 60;
        }

        updateTimePriceDisplay(slider.value);

    })
})

slider.addEventListener("input", (e) => {
    updateTimePriceDisplay(e.target.value);
})

//make the value to be between 0-1, depending on where it is between min and max
function normalizeRangeValue(value, min, max) {
    return (value - min) / (max - min);
}

function lerp(value1, value2, amount) {
    return value1 * (1 - amount) + value2 * amount;
}

function formatDollars(value) {
    let formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    })
    return formatter.format(value);
}

function formatTime(totalMinutesAfterMidnight) {

    let hours = Math.floor(totalMinutesAfterMidnight / 60);

    let minutes = totalMinutesAfterMidnight % 60;

    return (hours > 12 ? hours - 12 : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + (hours >= 12 ? "pm" : "am");

}

function updateTimePriceDisplay(sliderValue) {

    if (sliderTimeDivision === "half-hour") {
        sliderValue *= 30;
    }
    else if (sliderTimeDivision === "hour") {
        sliderValue *= 60;
    }

    let normalizedProgressThroughTicketTimes = normalizeRangeValue(sliderValue, EARLIEST_TICKET_AVAILABLE, LATEST_TICKET_AVAILABLE);
    let dollars = lerp(MOST_EXPENSIVE_TICKET, CHEAPEST_TICKET, normalizedProgressThroughTicketTimes);
    price.innerHTML = formatDollars(dollars);
    time.innerHTML = formatTime(sliderValue);
}

