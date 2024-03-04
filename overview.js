class Assignment {
    constructor(name, beginDateTime, endDateTime, project) {
        this.id = assignmentIdCounter++;
        this.name = name;
        this.beginDateTime = beginDateTime;
        this.endDateTime = endDateTime;
        this.project = project;
    }
}

let assignmentIdCounter = 1;

let projects = ["Project 1", "Project 2", "Project 3"];
let assignments =
    [new Assignment("Assignment 1", new Date(2024, 3, 3, 23, 0), new Date(2024, 3, 4, 2, 32), "Project 1"),
        new Assignment("Assignment 2", new Date(2021, 9, 30, 10, 0), new Date(2021, 9, 30, 14, 0), "Project 1"),
        new Assignment("Assignment 1", new Date(2021, 9, 20, 10, 0), new Date(2021, 9, 20, 11, 0), "Project 2"),
        new Assignment("Assignment 2", new Date(2021, 9, 24, 10, 0), new Date(2021, 9, 28, 14, 0), "Project 2")];


const projectSelect = document.getElementById("projectSelect");
const totalTimeTodayEl = document.getElementById('totalTimeToday')
const assignmentTable = document.querySelector('#assignmentTable tbody');

const startTimerButton = document.getElementById("startTimerButton");
const stopwatchSpan = document.getElementById("stopwatchTime");
const projectNameInput = document.getElementById("projectNameInput");


let counter = 0;

addProjectsToSelect(projectSelect);


assignments.forEach(assignment => {
    const assignmentRow = createAssignmentRow(assignment);

    assignmentTable.appendChild(assignmentRow);
});

let startDate;
let timerInterval;
startTimerButton.addEventListener('click', startTimer);

getTotalTimeToday();

function startTimer() {
    startDate = new Date();
    timerIntervalHandler()
    timerInterval = setInterval(timerIntervalHandler, 1000);
    startTimerButton.removeEventListener("click", startTimer);
    startTimerButton.addEventListener("click", stopTimer);
}

function timerIntervalHandler() {
    const duration = new Date(new Date().getTime() - startDate.getTime());
    stopwatchSpan.innerText = displayTime(duration);
}

function stopTimer() {
    clearInterval(timerInterval);
    stopwatchSpan.innerText = "00:00:00";
    const assignName = projectNameInput.value ? projectNameInput.value : "Assignment";
    const projectName = projectSelect.options[projectSelect.selectedIndex].text;
    const newAssignment = new Assignment(assignName, startDate, new Date(), projectName);
    assignments.push(newAssignment);
    assignmentTable.appendChild(createAssignmentRow(newAssignment));

    startTimerButton.removeEventListener("click", stopTimer);
    startTimerButton.addEventListener("click", startTimer);
    startDate = null;
    getTotalTimeToday();
}


function createAssignmentRow({id, name, project, beginDateTime, endDateTime}) {

    const assignmentRow = document.createElement("tr");

    assignmentRow.appendChild(createElementWithText("td", name));
    assignmentRow.appendChild(createElementWithText("td", project));
    assignmentRow.appendChild(createElementWithText("td", displayDate(beginDateTime)));
    assignmentRow.appendChild(createElementWithText("td", displayDate(endDateTime)));

    const duration = new Date(endDateTime - beginDateTime);

    assignmentRow.appendChild(createElementWithText("td", displayTime(duration)));

    const deleteTD = document.createElement("td");
    const deleteLink = document.createElement("a");
    deleteLink.innerText = "smazat";
    deleteLink.addEventListener("click", () => {
        assignmentRow.remove();

        assignments = assignments.filter(ass => ass.id !== id);

        getTotalTimeToday()
    });

    deleteTD.appendChild(deleteLink);
    assignmentRow.appendChild(deleteTD);

    return assignmentRow;
}

function createElementWithText(tag, text) {
    const element = document.createElement(tag);
    element.innerText = text;
    return element;
}

function displayDate(date) {
    return `${date.getDate().toString().padStart(2, '0')}.${date.getMonth().toString().padStart(2, '0')}.${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

function displayTime(dateTime) {
    return `${dateTime.getUTCHours().toString().padStart(2, '0')}:${dateTime.getMinutes().toString().padStart(2, '0')}:${dateTime.getSeconds().toString().padStart(2, '0')}`;
}


function getTotalTimeToday() {
    let totalTimeTodayMs = 0;
    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);
    const nextMidnight = new Date(todayMidnight);
    nextMidnight.setDate(nextMidnight.getDate() + 1);

    assignments.forEach(ass => {
        if (!isToday(ass.beginDateTime) && !isToday(ass.endDateTime)) {
            console.log('false');
            return; //acts as continue
        }

        const laterBeginDateTime = ass.beginDateTime > todayMidnight ? ass.beginDateTime : todayMidnight;
        const earlierEndDateTime = ass.endDateTime < nextMidnight ? ass.endDateTime : nextMidnight;

        totalTimeTodayMs += earlierEndDateTime - laterBeginDateTime;
    });
    totalTimeTodayEl.innerText = `${Math.floor((totalTimeTodayMs / (1000 * 60 * 60)) % 24).toString().padStart(2, '0')}:${Math.floor((totalTimeTodayMs / (1000 * 60)) % 60).toString().padStart(2, '0')}:${Math.floor((totalTimeTodayMs / 1000) % 60).toString().padStart(2, '0')}`
}

function isToday(date) {
    const now = new Date();

    const isTodayBool =  now.getUTCFullYear() === date.getUTCFullYear() &&
        now.getUTCMonth() === date.getUTCMonth() &&
        now.getUTCDay() === date.getUTCDay();

    console.log(isTodayBool);
    return isTodayBool;
}

function addProjectsToSelect(select) {
    projects.forEach(project => {
        const option = document.createElement("option");
        option.text = project;
        option.value = counter.toString();
        counter++;
        select.appendChild(option);
    });
}