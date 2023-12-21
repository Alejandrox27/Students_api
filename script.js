async function loaded(){
    document.getElementById("select").addEventListener("change", select_func, false);
    document.getElementById("form").addEventListener("submit", (e) => {
        e.preventDefault()

        const role = document.getElementById("select");
        const name = document.getElementById("name").value;
        const age = document.getElementById("age").value;

        if (role.selectedIndex === 1){
            const students = document.getElementsByClassName("students")[0];
            const template = document.getElementById("student-template");
            const clone = template.content.firstElementChild.cloneNode(true);

            clone.querySelector(".pass-fail h3").textContent = name;
            clone.querySelector("#age").textContent = age;

            students.appendChild(clone);

            addInDatabase(role.selectedIndex, name, age);

        } else {
            const subject = document.getElementById("subject").value;

            const teachers = document.getElementsByClassName("teachers")[0];
            const template = document.getElementById("teacher-template");
            const clone = template.content.firstElementChild.cloneNode(true);

            clone.querySelector(".teacher h3").textContent = name;
            clone.querySelector(".teacher #area").textContent = subject;
            clone.querySelector(".teacher #age").textContent = age;

            teachers.appendChild(clone);

            addInDatabase(role.selectedIndex, name, age, subject);
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
}

async function addInDatabase(role, name, age, subject = "Math"){
    if (role === 1) {

        const data = {
            "id": "",
            "name": name,
            "age": age,
            "grades": []
        }

        await fetch("http://127.0.0.1:8000/students/v1/post-student", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    })

    } else {
        const data = {
            "id": "",
            "name": name,
            "age": age,
            "subject": subject
        }

        await fetch("http://127.0.0.1:8000/teachers/v1/post-teacher", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            },
        })
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

window.addEventListener("load", loaded, false);