class Assignment {
    constructor(name, beginDateTime, endDateTime, projectId) {
        this.id = assignmentIdCounter++;
        this.name = name;
        this.beginDateTime = beginDateTime;
        this.endDateTime = endDateTime;
        this.projectId = projectId;
        this.row = null;
    }
}

class Project {
    constructor(name, totalTimeMs = 0) {
        this.id = projectIdCounter++;
        this.name = name;
        this.totalTimeMs = totalTimeMs;
    }
}
