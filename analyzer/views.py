from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from pdfminer.high_level import extract_text
import io


class DocumentAnalyzeView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        file_obj = request.data.get('file')

        if not file_obj:
            return Response({"error": "No file uploaded"}, status=400)

        # Extract text from the uploaded PDF
        try:
            pdf_content = file_obj.read()
            text = extract_text(io.BytesIO(pdf_content))

            # For now, just return the first 500 characters to prove it works
            return Response({
                "message": "Text extracted successfully",
                "preview": text[:500]
            })
        except Exception as e:
            return Response({"error": str(e)}, status=500)