def user_schema(student) -> dict:
    return {"id": str(student["_id"]),
            "name": student["name"],
            "age": student["age"],
            "grades": student["grades"]}

def users_schema(students) -> list:
    return [user_schema(student) for student in students]