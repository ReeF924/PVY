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
        new Assignment("Assignment 2", new Date(Date.now() - 3600000), new Date(), "Project 2")];



let counter = 0;
addProjectsToSelect(projectSelect);


//set up overview layout
assignments.forEach(assignment => {
    const assignmentRow = createAssignmentRow(assignment);

    assignmentTable.appendChild(assignmentRow);
});

let startDate;
let timerInterval;
startTimerButton.addEventListener('click', startTimer);



getTotalTimeToday();

//set up projects layout

const projectsWithTime = getTotalTimePerProject(projects);

projectsWithTime.forEach(project => {
    projectsTable.appendChild(createProjectRow(project));
});

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

    const tdElement = document.createElement("td");

    tdElement.classList.add('row-links');
    const editLink = document.createElement('a');
    editLink.innerText = 'Upravit';

    editLink.addEventListener('click', editProjectNameHandler);

    tdElement.appendChild(editLink);

    const deleteLink = document.createElement("a");
    deleteLink.innerText = "Smazat";
    deleteLink.addEventListener("click", () => {
        assignmentRow.remove();

        assignments = assignments.filter(ass => ass.id !== id);

        getTotalTimeToday()
    });

    tdElement.appendChild(deleteLink);
    assignmentRow.appendChild(tdElement);

    return assignmentRow;
}

// @todo use this during init
function createProjectRow({name, totalTimeMs}){
    const projectRow = document.createElement('tr');
    projectRow.appendChild(createElementWithText('td', name));
    projectRow.appendChild(createElementWithText('td', formatDateFromMs(totalTimeMs)));

    const tdElement = document.createElement('td');

    //@todo duplicate code, maybe make a function?
    tdElement.classList.add('row-links');

    const editLink = document.createElement('a');
    editLink.innerText = 'Upravit';
    editLink.addEventListener('click', editProjectNameHandler);


    tdElement.appendChild(editLink);

    const deleteLink = document.createElement("a");
    deleteLink.innerText = "Smazat";
    deleteLink.addEventListener("click", () => {
        projectRow.remove();

        projects = projects.filter(proj => proj !== name);
    });

    tdElement.appendChild(deleteLink);
    projectRow.appendChild(tdElement);

    return projectRow;
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
        totalTimeTodayMs += getTimeFromAssignment(ass, todayMidnight, nextMidnight);
    });

    totalTimeTodayEl.innerText = formatDateFromMs(totalTimeTodayMs);
}

class ProjectWithTime {
    constructor(name, totalTimeMs = 0) {
        this.name = name;
        this.totalTimeMs = totalTimeMs;
    }
}

function getTotalTimePerProject(projects) {
    const output = [];

    projects.forEach(projectName => {
        const prj = new ProjectWithTime();

        assignments.forEach(ass => {
           if(ass.project === prj.name){
               prj.totalTimeMs += getTimeFromAssignment(ass);
           }
        });

        output.push(prj);
    })

    return output;
}

function getTimeFromAssignment(assignment){
    if (!isToday(assignment.beginDateTime) && !isToday(assignment.endDateTime)) {
        return 0;
    }

    // const laterBeginDateTime = assignment.beginDateTime > todayMidnight ? assignment.beginDateTime : todayMidnight;
    // const earlierEndDateTime = assignment.endDateTime < nextMidnight ? assignment.endDateTime : nextMidnight;

    return assignment.endDateTime - assignment.beginDateTime;
}

function formatDateFromMs(timeInMs){
    return `${Math.floor((totalTimeTodayMs / (1000 * 60 * 60)) % 24).toString().padStart(2, '0')}:${Math.floor((totalTimeTodayMs / (1000 * 60)) % 60).toString().padStart(2, '0')}:${Math.floor((totalTimeTodayMs / 1000) % 60).toString().padStart(2, '0')}`
}

function isToday(date) {
    const now = new Date();

    return now.getUTCFullYear() === date.getUTCFullYear() &&
        now.getUTCMonth() === date.getUTCMonth() &&
        now.getUTCDay() === date.getUTCDay();

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

function changeLayoutWindow() {
overviewLayout.classList.toggle('d-none');
projectsLayout.classList.toggle('d-none');
}

//@todo not completed
function editProjectNameHandler(){

    projectEditDialog.show();

    projectEditDialogButton.addEventListener('click', () => {
        const name = projectEditDialogInput.value;

        if(!name)
            return;




        projectEditDialog.close();
    });



}