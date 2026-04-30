import sys
import markdown
from docx import Document
from htmldocx import HtmlToDocx

def convert(md_path, docx_path):
    with open(md_path, 'r', encoding='utf-8') as f:
        md_text = f.read()

    # Convert markdown to HTML including tables support
    html_content = markdown.markdown(md_text, extensions=['tables'])

    document = Document()
    new_parser = HtmlToDocx()
    
    # Optional styling
    document.add_heading('Milestone 2 Report', 0)
    
    new_parser.add_html_to_document(html_content, document)
    document.save(docx_path)
    print(f"Successfully saved to {docx_path}")

if __name__ == "__main__":
    convert(sys.argv[1], sys.argv[2])
