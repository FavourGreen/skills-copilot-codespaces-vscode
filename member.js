function skillsMember() {
    var member = {
        name: "John",
        age: 30,
        skills: ["JavaScript", "HTML", "CSS"],
        salary: 4000
    };
    member.showSkills = function() {
        console.log(this.skills.join(", "));
    };
    member.showSkills();
}

 