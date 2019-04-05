var firstFloor = document.getElementById("floor1");
var secondFloor = document.getElementById("floor2");
var modal = document.querySelector('.modal');
var modalOverlay = document.querySelector('.modal-overlay');

var events = [];

// An AJAX request to get the data from the event-data.json file and parsing it
$.getJSON({
    url: "./event-data.json",
    async: false
}, function(data) {
    events = data;

    // Transforming the start and end times into date objects
    for (event of events) {
        var eventStartTime = event.startTime;
        var eventEndTime = event.endTime;
        event.startTime = new Date(eventStartTime);
        event.endTime = new Date(eventEndTime);
    }

    events = events.sort(function(a, b){return a.startTime - b.startTime})

    console.log(events)
});

var rooms = [
    {
        "number": 103,
        "name": "",
        "floor": 1,
        "image": ""
    },
    {
        "number": 105,
        "name": "",
        "floor": 1,
        "image": ""
    },
    {
        "number": 109,
        "name": "",
        "floor": 1,
        "image": ""
    },
    {
        "number": 111,
        "name": "",
        "floor": 1,
        "image": ""
    },
    {
        "number": 115,
        "name": "",
        "floor": 1,
        "image": ""
    },
    {
        "number": 205,
        "name": "",
        "floor": 2,
        "image": ""
    },
    {
        "number": 209,
        "name": "",
        "floor": 2,
        "image": ""
    },
    {
        "number": 211,
        "name": "",
        "floor": 2,
        "image": ""
    },
    {
        "number": 215,
        "name": "",
        "floor": 2,
        "image": ""
    }
]

function addPinToLoc(roomNumber) {
    // adds a location pin for the specified room number in the map

    var stringRoomNumber = String(roomNumber);
    var floorNumber = parseInt(stringRoomNumber.charAt(0));
    var floorElement = floorNumber == 2 ? secondFloor : firstFloor;
    floorElement.addEventListener("load", () => {
        var svgDOM = floorElement.contentDocument.children[0]
        var matchingTextNodes = Array.from(svgDOM.querySelectorAll('text'))
            .find(el => el.textContent.trim() === stringRoomNumber.trim());
        // x offset +4
        // y offset -25
        var xpos = matchingTextNodes.getAttribute("x") - -4;
        // I know this looks weird, but javascript is more weird
        // if i do xpos + 4, it just doesnt work, but - works
        var ypos = matchingTextNodes.getAttribute("y") - 40;
        var pin = createPin(roomNumber, location);
        var pins = document.getElementById("pins");
        pins.appendChild(pin);
        pin.addEventListener("load", () => {
            pinDOM = pin.contentDocument.children[0];
            pinDOM.setAttribute("x", xpos);
            pinDOM.setAttribute("y", ypos);
            svgDOM.appendChild(pinDOM);
            pinDOM.id = "room-" + roomNumber;
            pinDOM.addEventListener("click", function(e) {
                var clickedElement = getTopLevelOfPin(e.target);
                var clickedElementGroup = clickedElement.getElementsByTagName('g')[0];

                if (clickedElementGroup.classList.contains('pin-selected')) {
                    clickedElementGroup.classList.remove('pin-selected');
                    removeModal();
                } else {
                    var selectedPins = svgDOM.querySelectorAll('.pin-selected');
                    for (var i = 0; i < selectedPins.length; i++) {
                        selectedPins[i].classList.remove('pin-selected');
                    }
                    clickedElementGroup.classList.add('pin-selected');
                    showModal(clickedElement.id);
                }

            })
        }, false);
    }, false);
}




function tog1() {
    firstFloor.style.display = "block";
    secondFloor.style.display = "none";
    addLocationPins(1);
}

function tog2() {
    firstFloor.style.display = "none";
    secondFloor.style.display = "block";
    var element = document.getElementById("removeactive");
    element.classList.remove("active");
    addLocationPins(2);
}
<<<<<<< HEAD
=======

function updateUpcomingEvents() {
    var now = new Date(Date.now());
    var oneHourFromNow = new Date(now.getTime() + 3600000);
    var eventsRightNow = events.filter(event => event.startTime < now && event.endTime > now); // All events happening right now
    var eventsInNextHour = events.filter(event => event.startTime > now && event.startTime < oneHourFromNow); // All events whose start times are within an hour from when the pin is clicked
    var eventDisplay = document.querySelector("#current-event");
    var upcomingEventsDisplay = document.querySelector("#upcoming-events");

    if (eventsRightNow.length === 0) {
        eventDisplay.textContent = "None right now";
    } else {
        for (event of eventsRightNow) {
            eventStartTimeString = event.startTime.toLocaleTimeString("en-us", { hour: "numeric", minute: "2-digit" });
            eventDisplay.textContent += "- " + event.name + " (" + eventStartTimeString + ")";
            eventDisplay.textContent += "\n";
        }
    }

    if (eventsInNextHour.length === 0) {
        upcomingEventsDisplay.textContent = "None in the next hour. Stay tuned!";
    } else {
        upcomingEventsDisplay.textContent = "";

        for (event of eventsInNextHour) {
            eventStartTimeString = event.startTime.toLocaleTimeString("en-us", { hour: "numeric", minute: "2-digit" });
            upcomingEventsDisplay.textContent += "- " + event.name + " (" + eventStartTimeString + ")";
            upcomingEventsDisplay.textContent += "\n";
        }
    }

    modal.classList.remove("show-modal");
}

function showModal(id) {
    // This is hacky as heck but hopefully it'll do for now
    var roomNumber = id.replace(/\D/g, ""); // Stripping the text and leaving only the room number from the HTML element ID passed into this method
    var eventsInRoom = events.filter(event => event.location === roomNumber);
    var now = new Date(Date.now());
    var oneHourFromNow = new Date(now.getTime() + 3600000);
    var eventsRightNow = eventsInRoom.filter(event => event.startTime < now && event.endTime > now); // All events happening right now
    var eventsInNextHour = eventsInRoom.filter(event => event.startTime > now && event.startTime < oneHourFromNow); // All events whose start times are within an hour from when the pin is clicked
    var eventDisplay = document.querySelector("#current-event");
    var upcomingEventsDisplay = document.querySelector("#upcoming-events");

    if (eventsRightNow.length === 0) {
        eventDisplay.textContent = "None right now";
    } else {
        eventDisplay.textContent = "- " + eventsRightNow[0].name;
    }

    if (eventsInNextHour.length === 0) {
        upcomingEventsDisplay.textContent = "None in the next hour. Stay tuned!";
    } else {
        upcomingEventsDisplay.textContent = "";

        for (event of eventsInNextHour) {
            eventStartTimeString = event.startTime.toLocaleTimeString("en-us", { hour: "numeric", minute: "2-digit" });
            upcomingEventsDisplay.textContent += "- " + event.name + " (" + eventStartTimeString + ")";
            upcomingEventsDisplay.textContent += "\n";
        }
    }

    modal.classList.remove("show-modal");
}

function removeModal() {
    modal.classList.add("show-modal");
}

window.onclick = function() {
    removeModal();
}

function dispModal() {
    toggleSelectedPin();
    toggleModal();
}

function toggleSelectedPin() {
}

addLocationPins(1);

updateUpcomingEvents()
setInterval(updateUpcomingEvents, 5 * 60 * 1000)
>>>>>>> 86f6284b6b0416fc11364b8545ae3cd7e84ba18d
