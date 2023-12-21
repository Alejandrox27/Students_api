async function loaded(){
    document.getElementById("select").addEventListener("change", select_func, false);
    document.getElementById("form").addEventListener("submit", (e) => {
        e.preventDefault()

        const role = document.getElementById("select");
        const name = document.getElementById("name").value;
        const age = document.getElementById("age").value;

        if (role.selectedIndex === 1){
            addStudentToDatabase(role, name, age)


        } else {
            addTeacherToDatabase(role, name, age)

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

async function addStudentToDatabase(role, name, age){
    const object = await addInDatabase(role.selectedIndex, name, age);

    const students = document.getElementsByClassName("students")[0];
    const template = document.getElementById("student-template");
    const clone = template.content.firstElementChild.cloneNode(true);

    clone.querySelector(".pass-fail h3").textContent = name;
    clone.querySelector("#age").textContent = age;

    const buttonDelete = clone.querySelector(".delete-student");
    buttonDelete.addEventListener("click", deleteStudent, false)
    buttonDelete.id = object.id;

    students.appendChild(clone);
}

async function addTeacherToDatabase(role, name, age){
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
            "passed": "passed"
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
        const students = document.getElementsByClassName("students")[0];
        const template = document.getElementById("student-template");
        const clone = template.content.firstElementChild.cloneNode(true);

        clone.querySelector(".pass-fail h3").textContent = element.name;
        clone.querySelector("#age").textContent = element.age;
        clone.querySelector("#grades").textContent += element.grades.join(", ");

        const buttonDelete = clone.querySelector(".delete-student");
        buttonDelete.addEventListener("click", deleteStudent, false);
        buttonDelete.id = element.id;

        const buttonPass = clone.querySelector(".pass");
        buttonPass.addEventListener("click", (e) => {
            return;
        }, false);

        students.appendChild(clone);
    });

    teachers_data.forEach(element => {
        const teachers = document.getElementsByClassName("teachers")[0];
        const template = document.getElementById("teacher-template");
        const clone = template.content.firstElementChild.cloneNode(true);

        clone.querySelector(".teacher h3").textContent = element.name;
        clone.querySelector(".teacher #area").textContent = element.subject;
        clone.querySelector(".teacher #age").textContent = element.age;

        const buttonDelete = clone.querySelector(".delete-teacher");
        buttonDelete.addEventListener("click", deleteTeacher, false);
        buttonDelete.id = element.id;

        teachers.appendChild(clone);
    })
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

async function deleteInDatabase(role,buttonDelete) {
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

window.addEventListener("load", loaded, false);