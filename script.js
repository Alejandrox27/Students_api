async function loaded(){
    await fetch("http://127.0.0.1:8000/students/v1/get-students")
        .then(res => res.json())
        .then(data => localStorage.setItem("Students" ,JSON.stringify(data)))
        .catch((e) => console.log("no data on localStorage"))
}

window.addEventListener("load", loaded, false);