import os
import google.generativeai as genai
from dotenv import load_dotenv
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from pdfminer.high_level import extract_text
import io
import json

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


class DocumentAnalyzeView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        file_obj = request.data.get('file')
        if not file_obj:
            return Response({"error": "No file uploaded"}, status=400)

        try:
            # 1. Extract Text
            pdf_content = file_obj.read()
            text = extract_text(io.BytesIO(pdf_content))

            # Limit text size to avoid token limits for this assignment
            clean_text = text[:10000]

            # 2. Call Gemini AI
            model = genai.GenerativeModel('gemini-1.5-flash')
            prompt = f"""
            Analyze the following text from a document. 
            Return the response strictly as a JSON object with the following keys:
            "title", "author", "summary", and "key_points".

            Text: {clean_text}
            """

            response = model.generate_content(prompt)

            # 3. Parse AI response
            # We strip any markdown formatting the AI might include
            raw_data = response.text.replace('```json', '').replace('```', '').strip()
            structured_data = json.loads(raw_data)

            return Response(structured_data)

        except Exception as e:
            return Response({"error": str(e)}, status=500)