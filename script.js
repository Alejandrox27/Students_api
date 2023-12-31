const students = [];
const teachers = [];

async function loaded(){
    document.getElementById("select").addEventListener("change", select_func, false);
    document.getElementById("form").addEventListener("submit", (e) => {
        e.preventDefault()

        document.getElementsByClassName("alert")[0].classList.add("hide");
        const form = document.getElementById("form");

        const data = new FormData(form);
        const [role, name, age, subject] = [...data.values()]

        if (!name.trim() || !age.trim()){
            document.getElementsByClassName("alert")[0].classList.remove("hide");
            return;
        }

        if (role === "student"){
            addStudentToFront(role, name, age)
        };

        if (role === "teacher") {
            addTeacherToFront(role, name, age, subject)
        };

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
    const object = await addInDatabase(role, name, age);

    const student = new Student(name, age, object.id);

    students.push(student);

    Person.showPersonUI(students, "Students");
}

async function addTeacherToFront(role, name, age, subject){
    const object = await addInDatabase(role, name, age, subject);

    const teacher = new Teacher(name, age, object.id, subject);

    teachers.push(teacher);

    Person.showPersonUI(teachers, "Teachers")
}

async function addInDatabase(role, name, age, subject = "Math"){
    if (role === "student") {

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

    };
     
    if (role === "teacher"){
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

const deleteTeacher = (buttonDelete) => {
    const teacher = buttonDelete.target.parentNode.parentNode;
    teacher.parentNode.removeChild(teacher);

    deleteInDatabase(0, buttonDelete)
}

const deleteStudent = (buttonDelete) => {
    const student = buttonDelete.target.parentNode.parentNode.parentNode.parentNode;
    student.parentNode.removeChild(student);

    deleteInDatabase(1,buttonDelete)
}

async function statusStudent(button){
    const body_t = {
        "id": button.target.dataset.uid,
        "passed": button.target.dataset.passed === "true"
    };
    await fetch("http://127.0.0.1:8000/students/v1/update-passed", {
        method: "PATCH",
        body: JSON.stringify(body_t),
        headers: {
            "Content-Type": "application/json",
        }
    });

    students.map(item => {
        if (item.uid === body_t.id){
            item.setStatus = button.target.dataset.passed === "true";
        }
    });
    Person.showPersonUI(students, "Students");

}

async function addGrades(id){
    let grade = "";
    let grades = [];
    
    await Swal.fire({
        title: "Insert a grade for the student",
        input: "text",
        inputAttributes: {
          autocapitalize: "off"
        },
        showCancelButton: true,
        confirmButtonText: "Confirm",
        showLoaderOnConfirm: true,
        preConfirm: async (grade) => {
          try {
            return parseFloat(grade);
          } catch (error) {
            Swal.showValidationMessage(`
              failed: ${error}
            `);
          }
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then(res => grade = res);

    if (isNaN(grade.value) || grade.value === ""){
        return;
    }

    students.map(item => {
        if (item.uid === id){
            item.setGrade = grade.value;
            grades = item.getGrades;
        }
    });

    console.log(grades);


    await fetch("http://127.0.0.1:8000/students/v1/update-grades", {
        method: "PATCH",
        body: JSON.stringify({
            "id": id,
            "grades": grades
        }),
        headers: {
            "Content-Type": "application/json",
        }
    });

    Person.showPersonUI(students, "Students");

}

async function deleteInDatabase(role, buttonDelete) {
    if(role === 0){
        await fetch(`http://127.0.0.1:8000/teachers/v1/delete_teacher?id=${buttonDelete.target.dataset.uid}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        })

        teachers.forEach((e,i) => {
            if (e.uid === buttonDelete.target.dataset.uid){
                teachers.splice(i,1);
            }
        })

    } else if (role === 1){
        await fetch(`http://127.0.0.1:8000/students/v1/delete-student?id=${buttonDelete.target.dataset.uid}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        })

        students.forEach((e,i) => {
            if (e.uid === buttonDelete.target.dataset.uid){
                students.splice(i,1);
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

    set setGrade(grade){
        this.#grades.push(grade);
    }

    get getGrades(){
        return this.#grades;
    }

    addNewStudent(){
        let prom = ""
        if (this.#grades.length != 0){
            prom = (this.#grades.reduce((redx, item) => item + redx) / this.#grades.length).toFixed(2);
        }
        const template = document.getElementById("student-template");
        const clone = template.content.firstElementChild.cloneNode(true);

        clone.querySelector(".pass-fail h3 .name").textContent = this.name;
        clone.querySelector(".age").textContent = this.age;
        clone.querySelector(".grades").textContent = "Grades: " + this.#grades.join(", ");
        clone.querySelector(".prom").textContent = "PROM: " + prom;

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
        buttonDelete.dataset.uid = this.uid;

        const buttonPass = clone.querySelector(".pass");
        buttonPass.dataset.uid = this.uid;
        buttonPass.addEventListener("click", statusStudent, false);
        buttonPass.disabled = this.#passed;

        const buttonFail = clone.querySelector(".fail");
        buttonFail.dataset.uid = this.uid;
        buttonFail.addEventListener("click", statusStudent, false);
        buttonFail.disabled = !this.#passed;

        const buttonAdd = clone.querySelector(".add-grade");
        buttonAdd.dataset.uid = this.uid;
        buttonAdd.addEventListener("click", () => {addGrades(this.uid)}, false);

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
        buttonDelete.dataset.uid = this.uid;

        return clone;
    }
}

window.addEventListener("load", loaded, false);