from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
import torch
import datetime
from transformers import T5ForConditionalGeneration, T5Tokenizer
from collections import OrderedDict
import re
import random

# Initialize FastAPI
app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------------------------------------------------------------------------------
# MODEL SETUP
# -----------------------------------------------------------------------------------------------------

# Load diagnosis model
diagnosis_model = joblib.load("top_features_model.pkl")

# Load task generation model
model_path = "./t5_adhd_tasks"
task_tokenizer = T5Tokenizer.from_pretrained(model_path)
task_generator_model = T5ForConditionalGeneration.from_pretrained(model_path)

# Device configuration
device = torch.device("cpu")
task_generator_model.to(device)
task_generator_model.eval()

# -----------------------------------------------------------------------------------------------------
# SCHEMAS
# -----------------------------------------------------------------------------------------------------

class DiagnosisInput(BaseModel):
    dob: str  # Date of birth in YYYY-MM-DD format
    answers: dict

class TaskGenerationInput(BaseModel):
    email: str
    adhd_type: str
    interests: list[str]

# -----------------------------------------------------------------------------------------------------
# DIAGNOSIS ENDPOINTS
# -----------------------------------------------------------------------------------------------------

def calculate_age(dob: str) -> int:
    birth_year = int(dob.split("-")[0])
    current_year = datetime.date.today().year
    return current_year - birth_year

@app.post("/predict")
async def predict_adhd(input_data: DiagnosisInput):
    try:
        # Preprocess input data
        age = calculate_age(input_data.dob)
        feature_order = [19, 11, 12, 8, 22, 0, 6, 5, 9, 1, 10, 14, 4, 7, 3, 15, 2, 13, 17, 20, 18, 21, 24, 16, 23]
        
        # Prepare feature array
        answers = [input_data.answers.get(str(i), 0) for i in feature_order]
        age_index = feature_order.index(0)
        answers[age_index] = age
        
        # Make prediction
        processed_data = np.array(answers)
        prediction = diagnosis_model.predict([processed_data])
        probabilities = diagnosis_model.predict_proba([processed_data])[0]
        
        return {
            "prediction": int(prediction[0]),
            "type": {
                0: "Combined ADHD",
                1: "No ADHD",
                2: "Hyperactive-Impulsive ADHD",
                3: "Inattentive ADHD"
            }[prediction[0]],
            "confidence": float(np.max(probabilities)),
            "probabilities": probabilities.tolist()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# -----------------------------------------------------------------------------------------------------
# TASK GENERATION ENDPOINTS
# -----------------------------------------------------------------------------------------------------

def generate_tasks(adhd_type: str, interest: str, num_tasks: int = 5):
    try:
        prompt = f"Generate ADHD-friendly tasks for {adhd_type} subtype focusing on {interest}:"
        
        inputs = task_tokenizer(
            prompt, 
            return_tensors="pt", 
            max_length=512, 
            truncation=True
        ).to(device)
        
        outputs = task_generator_model.generate(
            inputs.input_ids,
            attention_mask=inputs.attention_mask,
            max_new_tokens=100,
            do_sample=True,
            temperature=0.85,
            top_p=0.92,
            num_return_sequences=num_tasks
        )
        
        decoded_tasks = [
            task_tokenizer.decode(o, skip_special_tokens=True, clean_up_tokenization_spaces=True).strip()
            for o in outputs
        ]
        
        # Remove duplicates while preserving order
        unique_tasks = list(OrderedDict.fromkeys(decoded_tasks))
        return unique_tasks[:num_tasks]
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Task generation failed: {str(e)}")

@app.post("/daily-tasks")
async def generate_daily_tasks(request: TaskGenerationInput):
    try:
        # Validate input
        if not request.interests:
            raise HTTPException(status_code=400, detail="At least one interest required")
        
        # Select random interest
        selected_interest = random.choice(request.interests)
        
        # Generate tasks
        tasks = generate_tasks(
            adhd_type=request.adhd_type,
            interest=selected_interest,
            num_tasks=5
        )
        
        return {
            "email": request.email,
            "date": datetime.datetime.now().isoformat(),
            "adhd_type": request.adhd_type,
            "selected_interest": selected_interest,
            "tasks": tasks
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# -----------------------------------------------------------------------------------------------------
# HEALTH CHECK
# -----------------------------------------------------------------------------------------------------

@app.get("/health")
async def health_check():
    return {
        "status": "OK",
        "model_loaded": True,
        "timestamp": datetime.datetime.now().isoformat()
    }

# Add this below your existing code
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)