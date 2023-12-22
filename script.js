const students = [];
const teachers = [];

async function loaded(){
    document.getElementById("select").addEventListener("change", select_func, false);
    document.getElementById("form").addEventListener("submit", (e) => {
        e.preventDefault()

        const role = document.getElementById("select");
        const name = document.getElementById("name").value;
        const age = document.getElementById("age").value;

        if (role.selectedIndex === 1){
            addStudentToFront(role, name, age)


        } else {
            addTeacherToFront(role, name, age)

        }

    }, false);

    await fetch("http://127.0.0.1:8000/students/v1/get-students")
        .then(res => res.json())
        .then(data => localStorage.setItem("Students" ,JSON.stringify(data)))
        .catch((e) => console.log("no data on localStorage"))

    await fetch("http://127.0.0.1:8000/teachers/v1/get-teachers")
        .then(res => res.json())
        .then(data => localStorage.setItem("Teachers", JSON.stringify(data)))
        .catch((e) => console.log("no data on localStorage"))


    showData()

}

async function addStudentToFront(role, name, age){
    const object = await addInDatabase(role.selectedIndex, name, age);

    const student = new Student(name, age, object.id);

    students.push(student);

    Person.showPersonUI(students, "Students");
}

async function addTeacherToFront(role, name, age){
    const subject = document.getElementById("subject").value;

    const teachers = document.getElementsByClassName("teachers")[0];
    const template = document.getElementById("teacher-template");
    const clone = template.content.firstElementChild.cloneNode(true);

    const object = await addInDatabase(role.selectedIndex, name, age, subject);

    clone.querySelector(".teacher h3").textContent = name;
    clone.querySelector(".teacher #area").textContent = subject;
    clone.querySelector(".teacher #age").textContent = age;

    const buttonDelete = clone.querySelector(".delete-teacher");
    buttonDelete.addEventListener("click", deleteTeacher, false);
    buttonDelete.id = object.id;

    teachers.appendChild(clone);
}

async function addInDatabase(role, name, age, subject = "Math"){
    if (role === 1) {

        const data = {
            "id": "",
            "name": name,
            "age": age,
            "grades": [],
            "passed": true
        }

        const response = await fetch("http://127.0.0.1:8000/students/v1/post-student", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        throw new Error("Network response was not ok.");
    }

    const responseData = await response.json(); 
    
    return responseData;

    } else {
        const data = {
            "id": "",
            "name": name,
            "age": age,
            "subject": subject
        }

        const response = await fetch("http://127.0.0.1:8000/teachers/v1/post-teacher", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            },
        });
        if (!response.ok) {
            throw new Error("Network response was not ok.");
        }
    
        const responseData = await response.json();

        return responseData;
    }


}

const select_func = (event) => {
    const input = document.getElementById("subject");
    if (event.target.selectedIndex === 1) {
        input.classList.add("hide");
    } else if (event.target.selectedIndex === 0){
        input.classList.remove("hide");
    }
    input.toggleAttribute("required");
}

const showData = () => {
    const students_data = JSON.parse(localStorage.getItem("Students"));
    const teachers_data = JSON.parse(localStorage.getItem("Teachers"));

    students_data.forEach(element => {
        students.push(new Student(element.name, element.age, element.id, element.grades, element.passed))
    });

    Person.showPersonUI(students, "Students");

    teachers_data.forEach(element => {
        teachers.push(new Teacher(element.name, element.age, element.id, element.subject));
    });

    Person.showPersonUI(teachers, "Teachers");
}

function deleteTeacher(buttonDelete){
    const teacher = buttonDelete.target.parentNode.parentNode;
    teacher.parentNode.removeChild(teacher);

    deleteInDatabase(0, buttonDelete)
}

function deleteStudent(buttonDelete){
    const student = buttonDelete.target.parentNode.parentNode.parentNode.parentNode;
    student.parentNode.removeChild(student);

    deleteInDatabase(1,buttonDelete)
}

async function passStudent(buttonPass){
    const body_t = {
        "id": buttonPass.target.id,
        "passed": "passed"
    }
    await fetch("http://127.0.0.1:8000/students/v1/update-passed", {
        method: "PATCH",
        body: JSON.stringify(body_t),
        headers: {
            "Content-Type": "application/json",
        }
    })

    const parent = buttonPass.target.parentNode.parentNode.parentNode;
    const span = parent.querySelector(".pass-fail p span");
    const h3 = parent.querySelector("h3");
    span.textContent = "Passed";
    span.style.background = "#18AA25";
    h3.style.color = "#18AA25";

    buttonPass.target.disabled = true;

    const buttonFail = parent.querySelector(".buttons .pass-fail-buttons .fail");
    buttonFail.disabled = false;
}

async function failStudent(buttonFail){
    const body_t = {
        "id": buttonFail.target.id,
        "passed": "failed"
    };
    await fetch("http://127.0.0.1:8000/students/v1/update-passed", {
        method: "PATCH",
        body: JSON.stringify(body_t),
        headers: {
            "Content-Type": "application/json",
        }
    });

    const parent = buttonFail.target.parentNode.parentNode.parentNode;
    const span = parent.querySelector(".pass-fail p span");
    const h3 = parent.querySelector("h3");
    span.textContent = "Failed";
    span.style.background = "#c2271c";
    h3.style.color = "#c2271c";

    buttonFail.target.disabled = true;

    const buttonPass = parent.querySelector(".buttons .pass-fail-buttons .pass");
    buttonPass.disabled = false;

}

async function deleteInDatabase(role, buttonDelete) {
    if(role === 0){
        await fetch(`http://127.0.0.1:8000/teachers/v1/delete_teacher?id=${buttonDelete.target.id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        })
    } else if (role === 1){
        await fetch(`http://127.0.0.1:8000/students/v1/delete-student?id=${buttonDelete.target.id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        })
    }
}

class Person{
    constructor(name, age, uid){
        this.name = name;
        this.age = age;
        this.uid = uid;
    }

    static showPersonUI(persons, tipe){
        if (tipe === "Students"){
            const students = document.getElementsByClassName("students")[0];
            students.textContent = "";

            const fragment = document.createDocumentFragment()

            persons.forEach(item => {
                fragment.appendChild(item.addNewStudent());
            })

            students.appendChild(fragment);
        };

        if (tipe === "Teachers"){
            const teachers = document.getElementsByClassName("teachers")[0];
            teachers.textContent = "";

            const fragment = document.createDocumentFragment();

            persons.forEach(item => {
                fragment.appendChild(item.addNewTeacher());
            })

            teachers.appendChild(fragment);
        }
    }
}

class Student extends Person {
    #passed = true;
    #grades = [];

    constructor(name, age, uid, grades = [], passed = true){
        super(name, age);
        this.uid = uid;
        this.#grades = grades;
        this.#passed = passed;
    }

    set setStatus(passed){
        this.#passed = passed;
    }

    addNewStudent(){
        const template = document.getElementById("student-template");
        const clone = template.content.firstElementChild.cloneNode(true);

        clone.querySelector(".pass-fail h3 .name").textContent = this.name;
        clone.querySelector("#age").textContent = this.age;
        clone.querySelector("#grades").textContent += this.#grades.join(", ");

        if (this.#passed){
            clone.querySelector(".pass-fail h3 .passed").style.background = "#18AA25";
            clone.querySelector(".pass-fail h3 .name").style.color = "#18AA25";

        } else {
            clone.querySelector(".pass-fail h3 .passed").style.background = "#c2271c";
            clone.querySelector(".pass-fail h3 .name").style.color = "#c2271c";
        }
        clone.querySelector(".pass-fail h3 .passed").textContent = this.#passed ? "Passed": "Failed";

        const buttonDelete = clone.querySelector(".delete-student");
        buttonDelete.addEventListener("click", deleteStudent, false);
        buttonDelete.id = this.uid;

        const buttonPass = clone.querySelector(".pass");
        buttonPass.id = this.uid;
        buttonPass.addEventListener("click", passStudent, false);
        buttonPass.disabled = this.#passed;

        const buttonFail = clone.querySelector(".fail");
        buttonFail.id = this.uid;
        buttonFail.addEventListener("click", failStudent, false);
        buttonFail.disabled = !this.#passed;

        return clone;
    }

}

class Teacher extends Person {
    constructor(name, age, uid, subject = ""){
        super(name, age, uid);
        this.subject = subject
    }

    addNewTeacher(){
        const template = document.getElementById("teacher-template");
        const clone = template.content.firstElementChild.cloneNode(true);

        clone.querySelector(".teacher h3").textContent = this.name;
        clone.querySelector(".teacher #area").textContent = this.subject;
        clone.querySelector(".teacher #age").textContent = this.age;

        const buttonDelete = clone.querySelector(".delete-teacher");
        buttonDelete.addEventListener("click", deleteTeacher, false);
        buttonDelete.id = this.uid;

        return clone;
    }
}

window.addEventListener("load", loaded, false);