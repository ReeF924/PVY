
//DOM elements
const projectSelect = document.getElementById("projectSelect");
const totalTimeTodayEl = document.getElementById('totalTimeToday')
const assignmentTable = document.querySelector('#assignmentTable tbody');

const startTimerButton = document.getElementById("startTimerButton");
const stopwatchSpan = document.getElementById("stopwatchTime");
const assignmentNameInput = document.getElementById("assignmentNameInput");
const addNewProjectButton = document.getElementById("new-project-button");
const addNewAssignmentButton = document.getElementById("addAssignmentButton");

//projectEdit elements
const projectEditDialog = document.getElementById('project-edit-dialog');
const editDialogForm = document.getElementById('edit-dialog-form');
const projectEditDialogInput = document.getElementById('project-edit-dialog-input');
const closeEditProjectDialogButton = document.getElementById('close-edit-project-dialog');

//addAssignment elements
const addAssignmentDialog = document.getElementById('addAssignmentDialog');
const addAssignmentForm = document.getElementById('addAssignmentDialogForm');
const addAssignmentDialogProjectSelect = document.getElementById('addAssignmentProjectSelect');
const addAssignmentDialogInput = document.getElementById('addAssignmentNameInput');
const addAssignmentDialogDateInput = document.getElementById('addAssignmentDateInput');
const addAssignmentCloseButton = document.getElementById('addAssignmentCloseButton');
const totalTimeAddAssignmentDialog = document.getElementById('totalTimeAddAssignmentDialog');

const addAssignmentBeginDateHour = document.getElementById('addAssignmentBeginDateHour');
const addAssignmentBeginDateMinute = document.getElementById('addAssignmentBeginDateMinute');
const addAssignmentEndDateHour = document.getElementById('addAssignmentEndDateHour');
const addAssignmentEndDateMinute = document.getElementById('addAssignmentEndDateMinute');

const overviewLayout = document.getElementById('overview-layout');
const projectsLayout = document.getElementById('projects-layout');

const projectsTable = document.querySelector('#projectsTable tbody');

const overViewLayoutButton = document.getElementById('overviewLayoutButton');
const projectsLayoutButton = document.getElementById('projectsLayoutButton');


//variables

let isSelectedOverview = true;
let startDate = null;
let timerInterval;
let assignmentIdCounter = 1;
let projectIdCounter = 1;

let editedPrjId = null;