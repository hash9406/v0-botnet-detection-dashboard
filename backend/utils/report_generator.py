from fpdf import FPDF
import json
from datetime import datetime

class PDFReport(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 12)
        self.cell(0, 10, 'Botnet Detection Report', 0, 1, 'C')

    def footer(self):
        self.set_y(-15)
        self.set_font('Arial', 'I', 8)
        self.cell(0, 10, f'Page {self.page_no()}', 0, 0, 'C')

def generate_pdf_report(results, filename='report.pdf'):
    pdf = PDFReport()
    pdf.add_page()
    pdf.set_font('Arial', '', 12)

    pdf.cell(0, 10, f'Report Generated: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}', 0, 1)
    pdf.ln(10)

    for key, value in results.items():
        pdf.cell(0, 10, f'{key}: {value}', 0, 1)

    pdf.output(filename)
    return filename

def generate_text_report(results):
    report = f"Botnet Detection Report\nGenerated: {datetime.now()}\n\n"
    for key, value in results.items():
        report += f"{key}: {value}\n"
    return report
