from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import ast

app = Flask(__name__)
CORS(app)

# Configure Gemini API
genai.configure(api_key="AIzaSyDGw_PMvwBXacvyTHWF8JWBk_hL9DSP-vk")  # Replace with your API key or use .env
model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config={
        "temperature": 1,
        "top_p": 0.95,
        "top_k": 40,
        "max_output_tokens": 500,  # Reduced for concise output
        "response_mime_type": "text/plain",
    },
)
chat_session = model.start_chat(history=[])

def check_code(code, language="python"):
    """Check code for errors (Python or JavaScript)."""
    if language == "python":
        try:
            ast.parse(code)
            return []
        except SyntaxError as e:
            return [f"Syntax error: {str(e)}"]
    return []  # JavaScript errors are handled by client-side eval

def get_gemini_feedback(code, error_message, language="javascript"):
    """Get concise feedback from Gemini API."""
    prompt = f"Briefly explain this {language} error and suggest a fix:\nCode:\n{code}\nError:\n{error_message}"
    try:
        response = chat_session.send_message(prompt)
        return response.text.strip()
    except Exception as e:
        return f"Gemini API error: {str(e)}"

@app.route('/check', methods=['POST'])
def check():
    data = request.get_json()
    code = data.get('code')
    language = data.get('language', 'python')

    if not code:
        return jsonify({"error": "Code is empty!"}), 400

    errors = check_code(code, language)
    feedback = get_gemini_feedback(code, errors[0] if errors else "No errors", language) if language == "python" else "Use /check_js for JavaScript"

    return jsonify({"errors": errors, "feedback": feedback})

@app.route('/check_js', methods=['POST'])
def check_js():
    data = request.get_json()
    code = data.get('code')
    error_message = data.get('error')

    if not code or not error_message:
        return jsonify({"error": "Code or error is missing!"}), 400

    feedback = get_gemini_feedback(code, error_message, "javascript")
    return jsonify({"feedback": feedback})

if __name__ == '__main__':
    app.run(debug=True)