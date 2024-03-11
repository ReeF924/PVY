
//DOM elements
const projectSelect = document.getElementById("projectSelect");
const totalTimeTodayEl = document.getElementById('totalTimeToday')
const assignmentTable = document.querySelector('#assignmentTable tbody');

const startTimerButton = document.getElementById("startTimerButton");
const stopwatchSpan = document.getElementById("stopwatchTime");
const projectNameInput = document.getElementById("projectNameInput");

//projectEdit elements
const projectEditDialog = document.getElementById('project-edit-dialog');
const projectEditDialogButton = document.getElementById('project-edit-dialog-button');
const projectEditDialogInput = document.getElementById('project-edit-dialog-input');

const overviewLayout = document.getElementById('overview-layout');
const projectsLayout = document.getElementById('projects-layout');

const projectsTable = document.querySelector('#projectsTable tbody');

const overViewLayoutButton = document.getElementById('overviewLayoutButton');
const projectsLayoutButton = document.getElementById('projectsLayoutButton');

const closeEditProjectDialogButton = document.getElementById('close-edit-project-dialog');

//variables

let isSelectedOverview = true;
let startDate;
let timerInterval;
