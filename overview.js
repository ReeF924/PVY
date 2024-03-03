class Project {
    constructor(name, assignments) {
        this.name = name;
        this.assignments = assignments;
    }
}

class Assignment {
    constructor(name, beginDateTime, endDateTime, project) {
        this.name = name;
        this.beginDateTime = beginDateTime;
        this.endDateTime = endDateTime;
        this.project = project;
    }
}

const projects = ["Project 1", "Project 2", "Project 3"];
const assignments =
    [new Assignment("Assignment 1", new Date(2021, 9, 20, 10, 0), new Date(2021, 9, 20, 11, 0), "Project 1"),
        new Assignment("Assignment 2", new Date(2021, 9, 30, 10, 0), new Date(2021, 9, 30, 14, 0), "Project 1"),
        new Assignment("Assignment 1", new Date(2021, 9, 20, 10, 0), new Date(2021, 9, 20, 11, 0), "Project 2"),
        new Assignment("Assignment 2", new Date(2021, 9, 24, 10, 0), new Date(2021, 9, 28, 14, 0), "Project 2")];


const projectSelect = document.getElementById("projectSelect");
let counter = 0;
projects.forEach(project => {
    const option = document.createElement("option");
    option.text = project;
    option.value = counter.toString();
    counter++;
    projectSelect.appendChild(option);
});

const assignmentTable = document.querySelector("#assignmentTable tbody");
assignments.forEach(assignment => {
    const assignmentRow = createAssignmentRow(assignment);

    assignmentTable.appendChild(assignmentRow);
});

const startTimerButton = document.getElementById("startTimerButton");
const stopwatchSpan = document.getElementById("stopwatchTime");
const projectNameInput = document.getElementById("projectNameInput");
let startDate;
let timerInterval;
startTimerButton.addEventListener('click', startTimer);

function startTimer() {
    startDate = new Date();
    timerInterval = setInterval(() => {
        const duration = new Date(new Date().getTime() - startDate.getTime());
        stopwatchSpan.innerText = displayTime(duration);

    });
    startTimerButton.removeEventListener("click", startTimer);
    startTimerButton.addEventListener("click", stopTimer);
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
}


function createAssignmentRow({name, project, beginDateTime, endDateTime}) {

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
    return `${dateTime.getHours().toString().padStart(2, '0')}:${dateTime.getMinutes().toString().padStart(2, '0')}:${dateTime.getSeconds().toString().padStart(2, '0')}`;
}

