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
projects.forEach(project => {
    const option = document.createElement("option");
    option.text = project;
    projectSelect.appendChild(option);
});

const assignmentTable = document.querySelector("#assignmentTable tbody");
assignments.forEach(assignment => {
    const assignmentRow = document.createElement("tr");

    assignmentRow.appendChild(createElementWithText("td", assignment.name));
    assignmentRow.appendChild(createElementWithText("td", assignment.project));
    assignmentRow.appendChild(createElementWithText("td", displayDate(assignment.beginDateTime)));
    assignmentRow.appendChild(createElementWithText("td", displayDate(assignment.endDateTime)));

    const duration = new Date(assignment.endDateTime - assignment.beginDateTime);


    assignmentRow.appendChild(createElementWithText("td", displayTime(duration)));

    const deleteTD = document.createElement("td");
    const deleteLink = document.createElement("a");
    deleteLink.innerText = "smazat";
    deleteLink.addEventListener("click", () => {
        assignmentRow.remove();
    });

    deleteTD.appendChild(deleteLink);
    assignmentRow.appendChild(deleteTD);

    console.log(assignmentRow);
    assignmentTable.appendChild(assignmentRow);
});

const startTimerButton = document.getElementById("startTimerButton");
const stopwatchSpan = document.getElementById("stopwatchTime");
let startDate;
let timerInterval;
startTimerButton.addEventListener("click", (e) => {
startDate = new Date();
timerInterval = setInterval(() => {
    const duration = new Date(new Date().getTime() - startDate.getTime());
    stopwatchSpan.innerText = displayTime(duration);

}, 1000);
});


function createElementWithText(tag, text) {
    const element = document.createElement(tag);
    element.innerText = text;
    return element;
}
function displayDate(date){
    return `${date.getDate().toString().padStart(2, '0')}.${date.getMonth().toString().padStart(2, '0')}.${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}
function  displayTime(dateTime){
    return `${dateTime.getHours().toString().padStart(2, '0')}:${dateTime.getMinutes().toString().padStart(2, '0')}:${dateTime.getSeconds().toString().padStart(2, '0')}`;
}

