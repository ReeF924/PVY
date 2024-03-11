class Assignment {
    constructor(name, beginDateTime, endDateTime, project) {
        this.id = assignmentIdCounter++;
        this.name = name;
        this.beginDateTime = beginDateTime;
        this.endDateTime = endDateTime;
        this.project = project;
    }
}

class ProjectWithTime {
    constructor(name, totalTimeMs = 0) {
        this.name = name;
        this.totalTimeMs = totalTimeMs;
    }
}
