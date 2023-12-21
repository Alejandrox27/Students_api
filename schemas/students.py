def student_schema(student) -> dict:
    return {"id": str(student["_id"]),
            "name": student["name"],
            "age": student["age"],
            "grades": student["grades"],
            "passed": student["passed"]}

def students_schema(students) -> list:
    return [student_schema(student) for student in students]