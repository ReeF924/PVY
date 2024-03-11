let projects = [new Project("Project 1"),
    new Project("Project 2"),
    new Project("Project 3")];
let assignments =

    [new Assignment("Assignment 1", new Date(2024, 3, 3, 23, 0), new Date(2024, 3, 4, 2, 32), "1"),
        new Assignment("Assignment 2", new Date(2021, 9, 30, 10, 0), new Date(2021, 9, 30, 14, 0), "1"),
        new Assignment("Assignment 1", new Date(2021, 9, 20, 10, 0), new Date(2021, 9, 20, 11, 0), "2"),
        new Assignment("Assignment 2", new Date(Date.now() - 3600000), new Date(), "2")];


let counter = 0;

LoadData();

startTimerButton.addEventListener('click', startTimer);

overViewLayoutButton.addEventListener('click', () => {
    if (isSelectedOverview)
        return;

    overViewLayoutButton.classList.add('selected');
    projectsLayoutButton.classList.remove('selected');

    projectsLayout.classList.add('d-none');
    overviewLayout.classList.remove('d-none');

    isSelectedOverview = true;
});

projectsLayoutButton.addEventListener('click', () => {

    if (!isSelectedOverview)
        return;

    overViewLayoutButton.classList.remove('selected');
    projectsLayoutButton.classList.add('selected');

    projectsLayout.classList.remove('d-none');
    overviewLayout.classList.add('d-none');

    isSelectedOverview = false;
});

closeEditProjectDialogButton.addEventListener('click', () => {
    closeDialog([projectEditDialogInput], projectEditDialog);
});


function LoadData() {
    console.log('loadData');
    removeAllChildren(assignmentTable);
    removeAllChildren(projectsTable);

    console.log(assignmentTable.children);
    console.log(projects.children);

    counter++;
    //todo clear the list of children first
    addProjectsToSelect(projectSelect);

    assignments.forEach(assignment => {
        const assignmentRow = createAssignmentRow(assignment);

        assignmentTable.appendChild(assignmentRow);
    });

    getTotalTimeToday();

    //set up projects in layout
    getTotalTimePerProject(projects);

    projects.forEach(project => {
        projectsTable.appendChild(createProjectRow(project));
    });


}

function removeAllChildren(parent) {
    while (parent.firstChild) {
        parent.firstChild.remove();
    }
}

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


function createAssignmentRow({id, name, projectId, beginDateTime, endDateTime}) {

    const assignmentRow = document.createElement("tr");

    const project = projects.find(proj => proj.id === parseInt(projectId));

    assignmentRow.appendChild(createElementWithText("td", name));
    assignmentRow.appendChild(createElementWithText("td", project.name));
    assignmentRow.appendChild(createElementWithText("td", displayDate(beginDateTime)));
    assignmentRow.appendChild(createElementWithText("td", displayDate(endDateTime)));

    const duration = new Date(endDateTime - beginDateTime);

    assignmentRow.appendChild(createElementWithText("td", displayTime(duration)));

    const assignment = assignments.find(id => id === id);
    assignment.row = assignmentRow;

    const tdElement = document.createElement("td");

    tdElement.classList.add('row-links');
    const editLink = document.createElement('a');
    editLink.innerText = 'Upravit';


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

function createProjectRow({id, name, totalTimeMs}) {

    console.log(id);
    const projectRow = document.createElement('tr');
    projectRow.appendChild(createElementWithText('td', name));
    projectRow.appendChild(createElementWithText('td', formatDateFromMs(totalTimeMs)));

    const tdElement = document.createElement('td');

    //@todo duplicate code, maybe make a function?
    tdElement.classList.add('row-links');

    const editLink = document.createElement('a');
    editLink.innerText = 'Upravit';

    const editEventListener = onClickEdit(id);

    editLink.addEventListener('click', editEventListener);


    editDialogForm.addEventListener('submit', editEventListener);

    tdElement.appendChild(editLink);

    const deleteLink = document.createElement("a");
    deleteLink.innerText = "Smazat";

    deleteLink.addEventListener("click", () => {
        projectRow.remove();

        projects = projects.filter(prj => prj.id !== id);

        assignments.filter(ass => ass.projectId !== id);

        LoadData();
    });



    tdElement.appendChild(deleteLink);
    projectRow.appendChild(tdElement);


    return projectRow;
}

function onClickEdit(projectId) {
    return (e) => {
        console.log('in');
        projectEditDialog.show();

        console.log('inSubmit');
        e.preventDefault();

        const newName = projectEditDialogInput.value;

        const project = projects.find(proj => proj.id === projectId);
        console.log(project);
        project.name = newName;

        closeDialog([projectEditDialogInput], projectEditDialog);
        LoadData();
        console.log('endRemove');

        editDialogForm.removeEventListener('submit', onClickEdit())


    };

}

function closeDialog(clearElements, dialog) {
    clearElements.forEach(el => {
        el.value = "";
        dialog.close();
    })
}

function filterAssignments(assignments, projectId) {
    const output = [];

    assignments.forEach(ass => {

        if (projectId !== ass.projectId) {
            output.push(ass);
            return;
        }

        assignments.row.remove();
    });
    return output;
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


function getTotalTimePerProject(projects) {
    projects.forEach(prj => {

        assignments.forEach(ass => {
            if (ass.projectId == prj.id) {
                prj.totalTimeMs += getTimeFromAssignment(ass);
            }
        });
    });
}

function getTimeFromAssignment(assignment) {
    // if (!isToday(assignment.beginDateTime) && !isToday(assignment.endDateTime)) {
    //     return 0;
    // }

    // const laterBeginDateTime = assignment.beginDateTime > todayMidnight ? assignment.beginDateTime : todayMidnight;
    // const earlierEndDateTime = assignment.endDateTime < nextMidnight ? assignment.endDateTime : nextMidnight;

    return assignment.endDateTime - assignment.beginDateTime;
}

function formatDateFromMs(totalTimeMs) {
    return `${Math.floor((totalTimeMs / (1000 * 60 * 60)) % 24).toString().padStart(2, '0')}:${Math.floor((totalTimeMs / (1000 * 60)) % 60).toString().padStart(2, '0')}:${Math.floor((totalTimeMs / 1000) % 60).toString().padStart(2, '0')}`
}

function isToday(date) {
    const now = new Date();

    return now.getUTCFullYear() === date.getUTCFullYear() &&
        now.getUTCMonth() === date.getUTCMonth() &&
        now.getUTCDay() === date.getUTCDay();

}

function addProjectsToSelect(select) {
    removeAllChildren(select);

    projects.forEach(project => {
        const option = document.createElement("option");
        option.text = project;
        option.value = counter.toString();
        counter++;
        select.appendChild(option);
    });
}