from fastapi import FastAPI, HTTPException
from typing import Optional, List
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

 
app = FastAPI()

class Fruit(BaseModel): 
    name: str


class Fruits(BaseModel):
    fruits : List[Fruit]


origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers=["*"],
)


memory_db = {"fruits" : []}

@app.get("/fruits", response_model=Fruits)
def get_fruits():
    return Fruits(fruits=memory_db["fruits"])


@app.post("/fruits", response_model=Fruit)
def add_fruit(fruit: Fruit):
    memory_db["fruits"].append(fruit)
    return fruit


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)