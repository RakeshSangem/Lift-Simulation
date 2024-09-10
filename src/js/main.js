let lifts = [];
const LIFT_MOVE_SPEED = 2;
const LIFT_DOOR_SPEED = 2.5;

const form = document.getElementById("form");
const testBtn = document.getElementById("test-button");
const floorsContainer = document.querySelector(".floors-container");

form.addEventListener("submit", handleFormSubmit);
testBtn.addEventListener("click", testLifts);

function handleFormSubmit(event) {
  event.preventDefault();
  const noOfLifts = Number(event.target.nooflifts.value);
  const noOfFloors = Number(event.target.nooffloors.value);
  console.log(noOfLifts, noOfFloors);

  generateFloors(noOfFloors);
  generateLifts(noOfLifts);
}

function generateFloors(floorsCount) {
  console.log(typeof floorsCount);
  floorsContainer.innerHTML = "";

  for (let i = floorsCount; i > 0; i--) {
    const floor = createFloorElement(i);
    floorsContainer.appendChild(floor);
  }
}

function createFloorElement(floorNumber) {
  const floor = document.createElement("div");
  floor.classList.add("floor", `floor_${floorNumber}`);
  floor.setAttribute("data-floor", floorNumber);

  const floorInfo = document.createElement("div");
  floorInfo.classList.add("floor-info");

  const floorLabel = document.createElement("h2");
  floorLabel.classList.add("floor-number");
  floorLabel.innerText = `Floor ${floorNumber}`;

  const upButton = createButton(
    "control-button",
    `upbutton_${floorNumber}`,
    "U"
  );
  const downButton = createButton(
    "control-button",
    `downbutton_${floorNumber}`,
    "D"
  );

  // Event listeners for the buttons
  upButton.addEventListener("click", () => requestLift(floorNumber, "up"));
  downButton.addEventListener("click", () => requestLift(floorNumber, "down"));

  floorInfo.append(floorLabel, upButton, downButton);
  floor.appendChild(floorInfo);

  return floor;
}

function createButton(baseClass, additionalClass, text) {
  const button = document.createElement("button");
  button.classList.add(baseClass, additionalClass);

  const img = document.createElement("img");
  img.classList.add("button-icon");

  if (text === "D") {
    button.innerHTML = `<span class="bxs--down-arrow"></span>`;
    button.title = "Down Button";
  } else if (text === "U") {
    button.innerHTML = `<span class="bxs--up-arrow"></span>`;
    button.title = "Up Button";
  }

  // button.appendChild(img);
  return button;
}

function generateLifts(liftsCount) {
  const firstFloor = document.querySelector(".floor_1");

  lifts = [];

  for (let i = liftsCount; i > 0; i--) {
    const lift = createLiftElement(i);
    firstFloor.appendChild(lift);

    lifts.push({
      id: i,
      lift,
      currentFloor: 1,
      idle: true,
    });
  }
}

function createLiftElement(liftNumber) {
  const lift = document.createElement("div");
  lift.classList.add("lift", `lift_${liftNumber}`);

  const leftDoor = createLiftDoor("left-door");
  const rightDoor = createLiftDoor("right-door");

  lift.append(leftDoor, rightDoor);

  return lift;
}

function createLiftDoor(doorClass) {
  const door = document.createElement("div");
  door.classList.add("lift-door", doorClass);
  return door;
}

function requestLift(requestedFloor, direction) {
  const availableLift = findAvailableLift();

  if (availableLift) {
    moveLiftToFloor(availableLift, requestedFloor);
  } else {
    console.log("All lifts are busy, please wait.");
  }
}

function findAvailableLift() {
  return lifts.find((lift) => lift.idle);
}

function moveLiftToFloor(liftObj, requestedFloor) {
  const { lift, currentFloor } = liftObj;
  liftObj.idle = false;

  const distance = Math.abs(requestedFloor - currentFloor);
  const travelTime = distance * LIFT_MOVE_SPEED;

  return new Promise((resolve) => {
    lift.style.transform = `translateY(-${(requestedFloor - 1) * 150}px)`;
    lift.style.transition = `transform ${travelTime}s ease-in-out`;

    setTimeout(() => {
      openLiftDoors(lift).then(() => {
        setTimeout(() => {
          closeLiftDoors(lift).then(() => {
            liftObj.idle = true;
            liftObj.currentFloor = requestedFloor;
            console.log(`Lift has reached floor ${requestedFloor}`);
            resolve();
          });
        }, LIFT_DOOR_SPEED * 1000);
      });
    }, travelTime * 1000);
  });
}

function openLiftDoors(lift) {
  return new Promise((resolve) => {
    const leftDoor = lift.querySelector(".left-door");
    const rightDoor = lift.querySelector(".right-door");

    leftDoor.style.transform = `translateX(-100%)`;
    rightDoor.style.transform = `translateX(100%)`;
    leftDoor.style.transition = `transform ${LIFT_DOOR_SPEED}s ease-in-out`;
    rightDoor.style.transition = `transform ${LIFT_DOOR_SPEED}s ease-in-out`;

    setTimeout(() => resolve(), LIFT_DOOR_SPEED * 1000);
  });
}

function closeLiftDoors(lift) {
  return new Promise((resolve) => {
    const leftDoor = lift.querySelector(".left-door");
    const rightDoor = lift.querySelector(".right-door");

    leftDoor.style.transform = "translateX(0)";
    rightDoor.style.transform = "translateX(0)";
    leftDoor.style.transition = `transform ${LIFT_DOOR_SPEED}s ease-in-out`;
    rightDoor.style.transition = `transform ${LIFT_DOOR_SPEED}s ease-in-out`;

    setTimeout(() => resolve(), LIFT_DOOR_SPEED * 1000);
  });
}

function testLifts() {
  const lifts = document.querySelectorAll(".lift");

  lifts.forEach((lift) => {
    const randomFloor = Math.floor(Math.random() * 3) + 1;
    moveLiftToFloor({ lift, currentFloor: 1, idle: false }, randomFloor);
  });
}
