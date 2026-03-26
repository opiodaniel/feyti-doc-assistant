# AI-Powered Document Assistant

A full-stack application that allows users to upload PDF documents and receive an AI-generated summary, identifying the title, author, and key sections using the Google Gemini LLM.

## 🚀 Features
- **PDF Text Extraction:** Uses `pdfminer.six` to process and extract text from uploaded documents.
- **AI Summarization:** Integrates with **Gemini 1.5 Flash** for high-speed, structured document analysis.
- **RESTful API:** Built with Django Rest Framework (DRF).
- **Modern UI:** Built with React.js and Tailwind CSS (Frontend currently in development).

---

## 🛠️ Tech Stack
- **Backend:** Python, Django, Django Rest Framework
- **AI:** Google Generative AI (Gemini API)
- **Frontend:** React.js
- **Environment:** Ubuntu Linux

---

## ⚙️ Setup and Installation

### 1. Clone the Repository
```bash
git clone [https://github.com/opiodaniel/feyti-doc-assistant.git](https://github.com/opiodaniel/feyti-doc-assistant.git)
cd feyti-doc-assistant

2. Backend Setup
   1. Create and activate a virtual environment:
       python3 -m venv venv
       source venv/bin/activate
       
   2. Install dependencies:
        pip install -r requirements.txt
   
   3. Create a .env file in the root directory and add your API key:
        GEMINI_API_KEY=your_google_gemini_api_key_here
        
3. Running the Server
   python manage.py migrate
   python manage.py runserver

The API will be available at http://127.0.0.1:8000/api/analyze/

📂 Project Structure
core/: Project configuration and settings.
analyzer/: Main application logic for file processing and AI integration.
.env: (Ignored) Storage for sensitive API keys.
requirements.txt: Python dependencies.

📝 Author
Opio Daniel - Full Stack Developer

---
### **Push to GitHub**
This is a great moment to show you are thinking about the "Extra Points" mentioned in the assignment.

```bash
git add README.md
git commit -m "Docs: Added comprehensive README with setup instructions"
git push