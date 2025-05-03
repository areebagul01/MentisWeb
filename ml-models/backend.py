from collections import OrderedDict
import json
import os
import random
import re
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import numpy as np
import torch
from transformers import BartForConditionalGeneration, BartTokenizer
from transformers import T5ForConditionalGeneration, T5Tokenizer
import datetime

# ----------------------------------------------------------------------------------------------------- SETUP

# Load the ADHD diagnosis model
diagnosis_model = joblib.load("top_features_model.pkl")  # Ensure this file is in the same directory

model_path = "./t5_adhd_tasks"

if model_path == "./bart_adhd_tasks":
    task_generator_model = BartForConditionalGeneration.from_pretrained(model_path)
    task_tokenizer = BartTokenizer.from_pretrained(model_path)
elif model_path == "./t5_adhd_tasks":
    task_tokenizer = T5Tokenizer.from_pretrained(model_path)
    task_generator_model = T5ForConditionalGeneration.from_pretrained(model_path)

# print("Tokenizer vocab size:", task_tokenizer.vocab_size)
# print("Model loaded successfully!")

# Initialize FastAPI
app = FastAPI()

# Ensure model is on CPU
device = torch.device("cpu")
task_generator_model.to(device)
task_generator_model.eval()

# ----------------------------------------------------------------------------------------------------- DIAGNOSIS

# Define input schema for ADHD diagnosis
class ModelInput(BaseModel):
    dob: str
    answers: dict  # Accept answers as a dictionary

def preprocess_data(input_data):
    #Preprocesses input data for the diagnosis model.
    current_year = datetime.date.today().year
    age = current_year - int(input_data["dob"].split("-")[0])  # Replace 2025 with current year
    feature_order = [19, 11, 12, 8, 22, 0, 6, 5, 9, 1, 10, 14, 4, 7, 3, 15, 2, 13, 17, 20, 18, 21, 24, 16, 23]
    answers = [input_data["answers"].get(str(i), 0) for i in feature_order]
    age_index = feature_order.index(0)
    answers[age_index] = age
    return np.array(answers)

@app.post("/predict")
def predict(input_data: ModelInput):
    #Predict ADHD type based on user input.
    try:
        print(f"data received ${input_data}")
        processed_data = preprocess_data(input_data.dict())
        prediction = diagnosis_model.predict([processed_data])
        result = int(prediction[0])
        return {"result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ----------------------------------------------------------------------------------------------------- TASKS GENERATION

# Define input schema for ADHD task generation
class TaskGenerationInput(BaseModel):
    adhd_type: str
    interest: str
    email: str

def generate_tasks_t5(adhd_type: str, interest: str, num_tasks: int = 5):
    prompt = f"Generate a new ADHD-friendly task based on the following:\nADHD Subtype: {adhd_type}\nInterest Type: {interest}"
    
    inputs = task_tokenizer(prompt, return_tensors="pt", padding=True, truncation=True).to("cpu")  # Ensure it's on CPU

    # print(f"📝 Input Prompt: {prompt}")

    outputs = task_generator_model.generate(
        inputs.input_ids,
        attention_mask=inputs.attention_mask,
        max_new_tokens=50,  # Reduce to match Colab
        pad_token_id=task_tokenizer.eos_token_id,
        do_sample=True,
        temperature=0.85,
        top_p=0.92,
        top_k=50,
        repetition_penalty=1.7,
        no_repeat_ngram_size=3,
        num_return_sequences= num_tasks
    )

    # print(f"📝 Raw Output: {outputs}")

    # Fix decoding issue
    generated_tasks = [
        task_tokenizer.decode(o, skip_special_tokens=True, clean_up_tokenization_spaces=True).strip()
        for o in outputs
    ]

    # print(f"📌 Decoded Tasks: {generated_tasks}")

    return list(OrderedDict.fromkeys(generated_tasks))[:num_tasks]  # Remove duplicates

def generate_tasks_bart(adhd_type: str, interest: str, num_tasks: int = 5, temperature: float = 0.85):
    """Generates ADHD-friendly tasks based on user input."""
    prompt = f"<ADHD>{adhd_type}</ADHD> <INTEREST>{interest}</INTEREST>"
    inputs = task_tokenizer(prompt, return_tensors="pt", max_length=64, truncation=True)

    outputs = task_generator_model.generate(
        inputs.input_ids,
        max_length=128,
        temperature=temperature,
        top_k=50,
        top_p=0.95,
        do_sample=True,
        num_beams=1,
        no_repeat_ngram_size=2,
        repetition_penalty=1.2,
        num_return_sequences=num_tasks * 5
    )

    # Extract tasks from generated outputs
    generated = [
        re.search(r"<TASK>(.*?)</.*?>", task_tokenizer.decode(o, skip_special_tokens=True))
        for o in outputs
    ]

    # Filter out None values and clean tasks
    generated_tasks = [match.group(1).strip() for match in generated if match]

    # Maintain order and remove duplicates
    unique_tasks = list(OrderedDict.fromkeys(generated_tasks))[:num_tasks]
    return unique_tasks

# ----------------------------------------------------------------------------------------------------- DAILY TASKS

def update_daily_tasks(request_data: dict):
    """Generates and returns new daily ADHD-friendly tasks based on user input."""

    # Extract user data
    email = request_data.get("email")
    adhd_type = request_data.get("adhd_type")
    interests = request_data.get("interests")

    if not email:
        return {"error": "User email is required."}, 400
    if not adhd_type:
        return {"error": "User ADHD type not found"}, 400
    if not interests:
        return {"error": "No interests provided."}, 400

    # Generate tasks
    num_tasks = 5
    chosen_interest = random.choice(interests)
    print(f"Interest Chosen: {chosen_interest}")

    if model_path == "./t5_adhd_tasks":
        print("running generate tasks t5")
        daily_tasks = generate_tasks_t5(adhd_type, chosen_interest, num_tasks)
    elif model_path == "./bart_adhd_tasks":
        print("running generate tasks bart")
        daily_tasks = generate_tasks_bart(adhd_type, chosen_interest, num_tasks)
    else:
        return {"error": "Invalid model path"}, 400

    today = datetime.datetime.now().strftime("%Y-%m-%d")

    # ✅ Send tasks directly to frontend (no more JSON storage)
    return {
        "email": email,
        "date": today,
        "daily_tasks": daily_tasks,
        "selected_interest": chosen_interest
    }

@app.post("/daily_tasks")
def get_daily_tasks(request_data: dict):
    """Returns the current day's generated tasks for a user."""
    return update_daily_tasks(request_data)  # ✅ Always return fresh data

# ----------------------------------------------------------------------------------------------------- WEEKLY TASKS