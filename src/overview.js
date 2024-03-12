// let projects = [new Project("Project 1"),
//     new Project("Project 2"),
//     new Project("Project 3")];
// let assignments =
//
//     [new Assignment("Assignment 1", new Date(2024, 3, 3, 23, 0), new Date(2024, 3, 4, 2, 32), "1"),
//         new Assignment("Assignment 2", new Date(2021, 9, 30, 10, 0), new Date(2021, 9, 30, 14, 0), "1"),
//         new Assignment("Assignment 1", new Date(2021, 9, 20, 10, 0), new Date(2021, 9, 20, 11, 0), "2"),
//         new Assignment("Assignment 2", new Date(Date.now() - 3600000), new Date(), "2")];
//
// saveDataToLocalStorage();
let projects = [];
let assignments = [];

startTimerButton.addEventListener('click', startTimer);

loadData(true);



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

addNewProjectButton.addEventListener('click', (e) => {
    projectEditDialog.show();
    editDialogForm.addEventListener('submit', onSubmitCreateProjectDialog);
});

addNewAssignmentButton.addEventListener('click', () => {
    addAssignmentDialog.show();
    addAssignmentForm.addEventListener('submit', onSubmitAddAssignmentDialog);
});

addAssignmentCloseButton.addEventListener('click', () => {
    closeDialog([addAssignmentDialogInput, addAssignmentDialogDateInput, addAssignmentBeginDateHour, addAssignmentBeginDateMinute, addAssignmentEndDateHour, addAssignmentEndDateMinute], addAssignmentDialog);
});

addAssignmentBeginDateMinute.addEventListener('input', onAddAssignmentInputChanged);
addAssignmentBeginDateHour.addEventListener('input', onAddAssignmentInputChanged);
addAssignmentEndDateHour.addEventListener('input', onAddAssignmentInputChanged);
addAssignmentEndDateMinute.addEventListener('input', onAddAssignmentInputChanged);

function loadData(loadFromLocalStorage = false) {
    removeAllChildren(assignmentTable);
    removeAllChildren(projectsTable);

    if (loadFromLocalStorage) {
        loadDataFromLocalStorage();
    }

    //todo clear the list of children first
    addProjectsToSelect(projectSelect);
    addProjectsToSelect(addAssignmentDialogProjectSelect)

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

    closeEditProjectDialogButton.addEventListener('click', () => {
        editedPrjId = null;
        projectEditDialog.close();
    });
}

function loadDataFromLocalStorage() {
    const projectsString = localStorage.getItem('projects');
    const assignmentsString = localStorage.getItem('assignments');
    const startDateString = localStorage.getItem('startDate');

    if (projectsString) {
        projects = JSON.parse(projectsString);
        projectIdCounter = Math.max(...projects.map(p => p.id)) + 1;
    }

    if (assignmentsString) {
        assignments = JSON.parse(assignmentsString);

        assignments.forEach(ass => {
            ass.beginDateTime = new Date(ass.beginDateTime);
            ass.endDateTime = new Date(ass.endDateTime);
        })
        assignmentIdCounter = Math.max(...assignments.map(a => a.id)) + 1;
    }
    if (startDateString !== null && startDateString  !== "null") {
        startDate = new Date(JSON.parse(startDateString));
        startTimer();
    } else {
        startDate = null;
    }
}

function saveDataToLocalStorage() {
    localStorage.setItem('projects', JSON.stringify(projects));
    localStorage.setItem('assignments', JSON.stringify(assignments));

    if (startDate == null) {
        localStorage.removeItem('startDate')
        return;
    }
    localStorage.setItem('startDate', JSON.stringify(startDate));

}

function removeAllChildren(parent) {
    while (parent.firstChild) {
        parent.firstChild.remove();
    }
}

function startTimer() {
    startDate ??= new Date();
    timerIntervalHandler()
    timerInterval = setInterval(timerIntervalHandler, 1000);
    startTimerButton.removeEventListener("click", startTimer);
    startTimerButton.addEventListener("click", stopTimer);
    localStorage.setItem('startDate', JSON.stringify(startDate));
}

function timerIntervalHandler() {
    const duration = new Date(new Date().getTime() - startDate.getTime());
    stopwatchSpan.innerText = displayTime(duration);
}

function stopTimer() {
    clearInterval(timerInterval);
    stopwatchSpan.innerText = "00:00:00";
    const assignName = assignmentNameInput.value ? assignmentNameInput.value : "Assignment";
    const projectId = projectSelect.options[projectSelect.selectedIndex].value;
    const newAssignment = new Assignment(assignName, startDate, new Date(), projectId);

    assignmentNameInput.value = "";
    assignments.push(newAssignment);
    assignmentTable.appendChild(createAssignmentRow(newAssignment));

    startTimerButton.removeEventListener("click", stopTimer);
    startTimerButton.addEventListener("click", startTimer);
    startDate = null;
    localStorage.removeItem('startDate');
    saveDataToLocalStorage();
    getTotalTimeToday();
}


function createAssignmentRow({id, name, projectId, beginDateTime, endDateTime}) {

    const assignmentRow = document.createElement("tr");
    const project = projects.find(proj => proj.id === parseInt(projectId));

    //todo get rid of the substrings
    assignmentRow.appendChild(createElementWithText("td", name.substring(0, 20)));
    assignmentRow.appendChild(createElementWithText("td", project.name.substring(0, 20)));
    assignmentRow.appendChild(createElementWithText("td", displayDate(beginDateTime)));
    assignmentRow.appendChild(createElementWithText("td", displayDate(endDateTime)));

    const duration = new Date(endDateTime - beginDateTime);

    assignmentRow.appendChild(createElementWithText("td", displayTime(duration)));

    const assignment = assignments.find(id => id === id);
    assignment.row = assignmentRow;

    const tdElement = document.createElement("td");
    tdElement.classList.add('row-links');

    const deleteLink = document.createElement("a");
    deleteLink.innerText = "Smazat";
    deleteLink.addEventListener("click", () => {

        assignments = assignments.filter(ass => ass.id !== id);

        saveDataToLocalStorage();
        getTotalTimeToday();
        loadData();
    });

    tdElement.appendChild(deleteLink);
    assignmentRow.appendChild(tdElement);

    return assignmentRow;
}

function createProjectRow({id, name, totalTimeMs}) {

    const projectRow = document.createElement('tr');
    projectRow.appendChild(createElementWithText('td', name));
    projectRow.appendChild(createElementWithText('td', formatDateFromMs(totalTimeMs)));

    const tdElement = document.createElement('td');

    //@todo duplicate code, maybe make a function?
    tdElement.classList.add('row-links');

    const editLink = document.createElement('a');
    editLink.innerText = 'Upravit';

    editLink.addEventListener('click', () => {
        console.log('clickEdit');
        editedPrjId = id;
        console.log(editedPrjId);
        projectEditDialog.show();
        editDialogForm.addEventListener('submit', onSubmitEditDialogForm);
    });

    tdElement.appendChild(editLink);


    const deleteLink = document.createElement("a");
    deleteLink.innerText = "Smazat";

    deleteLink.addEventListener('click', () => {
        if (projects.length === 1) return;

        projectRow.remove();

        projects = projects.filter(prj => prj.id !== id);

        assignments = assignments.filter(ass => ass.projectId != id);

        saveDataToLocalStorage();
        loadData();
    });


    tdElement.appendChild(deleteLink);
    projectRow.appendChild(tdElement);


    return projectRow;
}

function onSubmitEditDialogForm(e) {
    e.preventDefault();
    if (editedPrjId === null) closeDialog();

    const input = projectEditDialogInput.value;

    if (!input || /^\s*$/.test(input)) return;

    const project = projects.find(prj => prj.id === editedPrjId);
    project.name = input;
    editedPrjId = null;
    closeDialog([projectEditDialogInput], projectEditDialog);
    editDialogForm.removeEventListener('submit', onSubmitEditDialogForm);
    saveDataToLocalStorage();
    loadData();
}

function onSubmitCreateProjectDialog(e) {
    e.preventDefault();

    const input = projectEditDialogInput.value;
    if (!input || /^\s*$/.test(input)) return;

    const project = new Project(input);


    closeDialog([projectEditDialogInput], projectEditDialog);
    editDialogForm.removeEventListener('submit', onSubmitEditDialogForm);

    saveDataToLocalStorage();
    loadData();
}

function onSubmitAddAssignmentDialog(e) {
    e.preventDefault();

    const name = addAssignmentDialogInput.value ? addAssignmentDialogInput.value : "Assignment";
    const date = new Date(addAssignmentDialogDateInput.value);

    const beginDateTimeHour = addAssignmentBeginDateHour.value;
    const beginDateTimeMinute = addAssignmentBeginDateMinute.value;
    const endDateTimeHour = addAssignmentEndDateHour.value;
    const endDateTimeMinute = addAssignmentEndDateMinute.value;

    const beginDate = new Date(date);
    beginDate.setHours(beginDateTimeHour, beginDateTimeMinute, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(endDateTimeHour, endDateTimeMinute, 0, 0);

    if (endDate < beginDate) {
        return;
    }

    const assignment = new Assignment(name, beginDate, endDate, addAssignmentDialogProjectSelect.value);
    assignments.push(assignment);

    createAssignmentRow(assignment);

    saveDataToLocalStorage();
    closeDialog([addAssignmentDialogInput, addAssignmentDialogDateInput, addAssignmentBeginDateHour, addAssignmentBeginDateMinute, addAssignmentEndDateHour, addAssignmentEndDateMinute], addAssignmentDialog);
    loadData();
    addAssignmentForm.removeEventListener('submit', onSubmitAddAssignmentDialog);
}

function closeDialog(clearElements, dialog) {
    clearElements.forEach(el => {
        el.value = "";
        dialog.close();
    })
}

function createElementWithText(tag, text) {
    const element = document.createElement(tag);
    element.innerText = text;
    return element;
}

function displayDate(date) {
    date = new Date(date);

    return `${date.getDate().toString().padStart(2, '0')}.${date.getMonth().toString().padStart(2, '0')}.${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

function displayTime(dateTime) {
    return `${dateTime.getUTCHours().toString().padStart(2, '0')}:${dateTime.getMinutes().toString().padStart(2, '0')}:${dateTime.getSeconds().toString().padStart(2, '0')}`;
}


function getTotalTimeToday() {
    let totalTimeTodayMs = 0;


    assignments.forEach(ass => {
        totalTimeTodayMs += getTimeFromAssignmentToday(ass);
    });

    totalTimeTodayEl.innerText = formatDateFromMs(totalTimeTodayMs);
}


function getTotalTimePerProject(projects) {
    projects.forEach(prj => {
        prj.totalTimeMs = 0;
        assignments.forEach(ass => {
            if (ass.projectId == prj.id) {
                prj.totalTimeMs += getTimeFromAssignment(ass);
            }
        });
    });
}

function getTimeFromAssignment(assignment) {


    return assignment.endDateTime - assignment.beginDateTime;
}

function getTimeFromAssignmentToday(assignment) {
    if (!isToday(assignment.beginDateTime) && !isToday(assignment.endDateTime)) {
        return 0;
    }

    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);
    const nextMidnight = new Date(todayMidnight);
    nextMidnight.setDate(nextMidnight.getDate() + 1);

    const laterBeginDateTime = assignment.beginDateTime > todayMidnight ? assignment.beginDateTime : todayMidnight;
    const earlierEndDateTime = assignment.endDateTime < nextMidnight ? assignment.endDateTime : nextMidnight;

    return earlierEndDateTime - laterBeginDateTime;
}

function formatDateFromMs(totalTimeMs) {
    return `${Math.floor((totalTimeMs / (1000 * 60 * 60)) % 24).toString().padStart(2, '0')}:${Math.floor((totalTimeMs / (1000 * 60)) % 60).toString().padStart(2, '0')}:${Math.floor((totalTimeMs / 1000) % 60).toString().padStart(2, '0')}`
}

function isToday(date) {
    const now = new Date();

    return now.getFullYear() === date.getFullYear() &&
        now.getMonth() === date.getMonth() &&
        now.getDate() === date.getDate();
}

function addProjectsToSelect(select) {
    removeAllChildren(select);

    projects.forEach(project => {
        const option = document.createElement("option");
        option.text = project.name;
        option.value = project.id.toString();
        select.appendChild(option);
    });
}

function onAddAssignmentInputChanged() {
    console.log('onChanged');

    const beginDateTimeHour = addAssignmentBeginDateHour.value;
    const beginDateTimeMinute = addAssignmentBeginDateMinute.value;
    const endDateTimeHour = addAssignmentEndDateHour.value;
    const endDateTimeMinute = addAssignmentEndDateMinute.value;

    if ((isNaN(parseInt(beginDateTimeHour)) || isNaN(parseInt(beginDateTimeMinute)) || isNaN(parseInt(endDateTimeHour)) || isNaN(parseInt(endDateTimeMinute)))) {
        console.log('not a number');
        totalTimeAddAssignmentDialog.innerText = '00:00';
        return;
    }


    const beginDate = new Date(0);
    beginDate.setHours(beginDateTimeHour, beginDateTimeMinute, 0, 0);

    const endDate = new Date(0);
    endDate.setHours(endDateTimeHour, endDateTimeMinute, 0, 0);

    const totalTime = getTimeFromAssignment(new Assignment("", beginDate, endDate, 0));
    console.log('totalTime ' + totalTime);

    if (totalTime < 0) {
        totalTimeAddAssignmentDialog.innerText = '00:00';
        return;
    }

    totalTimeAddAssignmentDialog.innerText = `${Math.floor((totalTime / (1000 * 60 * 60)) % 24).toString().padStart(2, '0')}:${Math.floor((totalTime / (1000 * 60)) % 60).toString().padStart(2, '0')}`;
}