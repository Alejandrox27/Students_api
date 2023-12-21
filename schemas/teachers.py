def teacher_schema(teacher) -> dict:
    return {"id": str(teacher["_id"]),
            "name": teacher["name"], 
            "age": teacher["age"],
            "subject": teacher["subject"]}

def teachers_schema(teachers) -> list:
    return [teacher_schema(teacher) for teacher in teachers]