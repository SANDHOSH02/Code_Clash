from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import subprocess
import tempfile
import os
import google.generativeai as genai

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

@app.post("/api/code/run")
async def run_code(data: dict):
    code = data.get("code")
    if not code:
        raise HTTPException(status_code=400, detail="No code provided")
    with tempfile.NamedTemporaryFile(mode="w", suffix=".py", delete=False) as f:
        f.write(code)
        temp_file_name = f.name
    try:
        result = subprocess.run(
            ["python", temp_file_name],
            capture_output=True,
            text=True,
            timeout=5
        )
        output = result.stdout.splitlines()
        error = result.stderr
        if error:
            return {"error": error}
        return {"output": output or ["Code executed successfully!"]}
    except subprocess.TimeoutExpired:
        return {"error": "Code execution timed out"}
    except Exception as e:
        return {"error": str(e)}
    finally:
        os.unlink(temp_file_name)

@app.post("/api/code/suggest")
async def suggest_code(data: dict):
    code = data.get("code")
    language = data.get("language")
    if not code:
        raise HTTPException(status_code=400, detail="No code provided")

    try:
        # Create a prompt for Gemini API
        prompt = f"""
        You are a coding assistant. Analyze the following {language} code and provide specific, actionable suggestions to improve it (e.g., optimize performance, follow best practices, or fix potential issues). Return a list of suggestions, each starting with 'Line X:' if applicable, or general advice if not line-specific. If no improvements are needed, return ['No suggestions available for this code.'].

        Code:
        ```{language}
        {code}
        ```
        """
        response = model.generate_content(prompt)
        suggestions = response.text.strip().split("\n")
        
        suggestions = [s.strip().replace("```", "") for s in suggestions if s.strip()]
        return {"message": suggestions or ["No suggestions available for this code."]}
    except Exception as e:
        return {"error": f"Failed to get AI suggestion: {str(e)}"}
