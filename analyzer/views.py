import os
import google.generativeai as genai
from dotenv import load_dotenv
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from pdfminer.high_level import extract_text as extract_pdf_text
from docx import Document  # For Word files
import io
import json
import re

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


class DocumentAnalyzeView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        file_obj = request.data.get('file')

        if not file_obj:
            return Response({"error": "No file uploaded."}, status=400)

        # --- Error Handling: File Type Validation ---
        file_name = file_obj.name.lower()
        if not (file_name.endswith('.pdf') or file_name.endswith('.docx')):
            return Response({
                "error": "Invalid file type. Please upload a PDF or Word (.docx) document."
            }, status=400)

        try:
            text = ""
            # --- Handle PDF ---
            if file_name.endswith('.pdf'):
                pdf_content = file_obj.read()
                text = extract_pdf_text(io.BytesIO(pdf_content))

            # --- Handle Word (.docx) ---
            elif file_name.endswith('.docx'):
                doc = Document(file_obj)
                full_text = []
                for para in doc.paragraphs:
                    full_text.append(para.text)
                text = '\n'.join(full_text)

            if not text.strip():
                return Response({"error": "The document appears to be empty."}, status=400)

            clean_text = text[:8000]

            # 2. Call Gemini (Using your confirmed working model)
            model = genai.GenerativeModel('gemini-2.5-flash')
            prompt = f"Analyze this text and return ONLY a JSON object with keys: title, author, summary, key_points. Text: {clean_text}"

            response = model.generate_content(prompt)

            # 3. Clean and Parse JSON
            res_text = response.text
            json_match = re.search(r'```json\s*(.*?)\s*```', res_text, re.DOTALL)
            content = json_match.group(1) if json_match else res_text.strip()
            final_json = json.loads(content)

            return Response(final_json)

        except Exception as e:
            return Response({"error": f"Analysis failed: {str(e)}"}, status=500)