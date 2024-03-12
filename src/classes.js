class Assignment {
    constructor(name, beginDateTime, endDateTime, projectId) {
        this.id = assignmentIdCounter++;
        this.name = name;
        this.beginDateTime = beginDateTime;
        this.endDateTime = endDateTime;
        this.projectId = projectId;
        this.row = null;

        console.log('new Ass with Id: ' + this.id);
    }
}

class Project {
    constructor(name, totalTimeMs = 0) {
        this.id = projectIdCounter++;
        this.name = name;
        this.totalTimeMs = totalTimeMs;
        console.log('new Prj with Id: ' + this.id);
    }
}
