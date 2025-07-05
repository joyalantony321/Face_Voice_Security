from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from add_delete import add_user, delete_user, load_db, save_db
from test_login import test_login
import json

app = FastAPI()

# Allow frontend access (adjust in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/python/authenticate")
async def authenticate():
    db = load_db()
    result = test_login(db, interactive=False)
    return result

@app.post("/api/python/add-user")
async def add_user_endpoint(request: Request):
    body = await request.json()
    user_name = body.get("userName")
    db = load_db()
    updated_db = add_user(db, name=user_name)
    save_db(updated_db)
    return {"success": True, "debug": f"User {user_name} added"}

@app.post("/api/python/delete-user")
async def delete_user_endpoint(request: Request):
    body = await request.json()
    user_name = body.get("userName")
    db = load_db()
    updated_db = delete_user(db, name=user_name)
    save_db(updated_db)
    return {"success": True, "debug": f"User {user_name} deleted"}
