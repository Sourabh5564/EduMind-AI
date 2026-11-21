import re
import os
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def set_table_borders(table, color="D3D3D3", sz="4", val="single"):
    tblPr = table._tbl.tblPr
    borders = parse_xml(f'<w:tblBorders {nsdecls("w")}><w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/><w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/><w:left w:val="none"/><w:right w:val="none"/><w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/><w:insideV w:val="none"/></w:tblBorders>')
    tblPr.append(borders)

def format_inline_runs(paragraph, text, base_font_name="Calibri", base_size=11, base_color=(51, 51, 51), is_italic=False):
    # Regex to extract bold (**...**), inline code (`...`), italic (*...*)
    tokens = re.split(r'(\*\*.*?\*\*|`.*?`|\*.*?\*)', text)
    for token in tokens:
        if not token:
            continue
        if token.startswith('**') and token.endswith('**') and len(token) >= 4:
            run = paragraph.add_run(token[2:-2])
            run.bold = True
            run.font.name = base_font_name
            run.font.size = Pt(base_size)
            run.font.color.rgb = RGBColor(17, 24, 39)
        elif token.startswith('`') and token.endswith('`') and len(token) >= 2:
            run = paragraph.add_run(token[1:-1])
            run.font.name = "Consolas"
            run.font.size = Pt(base_size - 1)
            run.font.color.rgb = RGBColor(124, 58, 237)
        elif token.startswith('*') and token.endswith('*') and len(token) >= 2:
            run = paragraph.add_run(token[1:-1])
            run.italic = True
            run.font.name = base_font_name
            run.font.size = Pt(base_size)
            run.font.color.rgb = RGBColor(*base_color)
        else:
            run = paragraph.add_run(token)
            run.font.name = base_font_name
            run.font.size = Pt(base_size)
            run.font.color.rgb = RGBColor(*base_color)
            if is_italic:
                run.italic = True

def build_docx(markdown_path, output_docx_path):
    with open(markdown_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    doc = Document()

    # Set page margins (1 inch)
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)

    # Base styles
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Calibri'
    normal_style.font.size = Pt(11)
    normal_style.font.color.rgb = RGBColor(40, 40, 40)

    i = 0
    total_lines = len(lines)

    is_in_code_block = False
    code_block_lines = []

    is_in_table = False
    table_rows = []

    def flush_table():
        nonlocal is_in_table, table_rows
        if not table_rows:
            is_in_table = False
            return
        
        # Calculate max columns
        num_cols = max(len(row) for row in table_rows)
        if num_cols == 0:
            is_in_table = False
            table_rows = []
            return
        
        # Create table
        table = doc.add_table(rows=len(table_rows), cols=num_cols)
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        table.autofit = True
        set_table_borders(table)

        for r_idx, row_data in enumerate(table_rows):
            is_header = (r_idx == 0)
            for c_idx in range(num_cols):
                cell_text = row_data[c_idx] if c_idx < len(row_data) else ""
                cell = table.cell(r_idx, c_idx)
                cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
                set_cell_margins(cell, top=120, bottom=120, left=160, right=160)
                
                if is_header:
                    set_cell_background(cell, "EDE9FE")  # Soft purple header
                else:
                    if r_idx % 2 == 1:
                        set_cell_background(cell, "F9FAFB")  # Subtle alternating light row
                    else:
                        set_cell_background(cell, "FFFFFF")

                p = cell.paragraphs[0]
                p.paragraph_format.space_before = Pt(2)
                p.paragraph_format.space_after = Pt(2)
                p.paragraph_format.line_spacing = 1.15
                if is_header:
                    run = p.add_run(cell_text.strip())
                    run.bold = True
                    run.font.name = "Calibri"
                    run.font.size = Pt(10)
                    run.font.color.rgb = RGBColor(76, 29, 149)
                else:
                    format_inline_runs(p, cell_text.strip(), base_size=9.5)

        p_after = doc.add_paragraph()
        p_after.paragraph_format.space_before = Pt(0)
        p_after.paragraph_format.space_after = Pt(6)
        
        is_in_table = False
        table_rows = []

    def flush_code_block():
        nonlocal is_in_code_block, code_block_lines
        if not code_block_lines:
            is_in_code_block = False
            return

        text = "".join(code_block_lines).rstrip()
        
        # Create a single-cell callout table for code
        tbl = doc.add_table(rows=1, cols=1)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        cell = tbl.cell(0, 0)
        set_cell_background(cell, "F3F4F6")
        set_cell_margins(cell, top=140, bottom=140, left=200, right=200)
        
        tcPr = cell._tc.get_or_add_tcPr()
        borders = parse_xml(f'<w:tcBorders {nsdecls("w")}><w:top w:val="none"/><w:left w:val="single" w:sz="24" w:space="0" w:color="7C3AED"/><w:bottom w:val="none"/><w:right w:val="none"/></w:tcBorders>')
        tcPr.append(borders)

        cp = cell.paragraphs[0]
        cp.paragraph_format.space_before = Pt(2)
        cp.paragraph_format.space_after = Pt(2)
        cp.paragraph_format.line_spacing = 1.1
        run = cp.add_run(text)
        run.font.name = "Consolas"
        run.font.size = Pt(8.5)
        run.font.color.rgb = RGBColor(31, 41, 55)

        p_after = doc.add_paragraph()
        p_after.paragraph_format.space_before = Pt(0)
        p_after.paragraph_format.space_after = Pt(6)

        is_in_code_block = False
        code_block_lines = []

    while i < total_lines:
        line = lines[i]
        stripped = line.strip()

        # Handle code blocks
        if stripped.startswith('```'):
            if is_in_code_block:
                flush_code_block()
            else:
                if is_in_table:
                    flush_table()
                is_in_code_block = True
                code_block_lines = []
            i += 1
            continue

        if is_in_code_block:
            code_block_lines.append(line)
            i += 1
            continue

        # Handle markdown tables
        if stripped.startswith('|') and stripped.endswith('|'):
            # Check if it's separator row |---|---|
            if re.match(r'^\|[\s\-:|]+\|$', stripped):
                i += 1
                continue
            is_in_table = True
            cols = [c.strip() for c in stripped[1:-1].split('|')]
            table_rows.append(cols)
            i += 1
            continue
        elif is_in_table:
            flush_table()

        # Horizontal rule or Page breaks
        if stripped in ('---', '***', '___'):
            doc.add_page_break()
            i += 1
            continue

        # Headings
        if stripped.startswith('# '):
            heading_text = stripped[2:].strip()
            # If start of chapter or major division, add page break if not first
            if heading_text.startswith("CHAPTER") or heading_text.startswith("BONAFIDE") or heading_text.startswith("TABLE OF") or heading_text.startswith("REFERENCES") or heading_text.startswith("APPENDICES"):
                if len(doc.paragraphs) > 5:
                    doc.add_page_break()

            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(16)
            p.paragraph_format.space_after = Pt(8)
            p.paragraph_format.keep_with_next = True
            run = p.add_run(heading_text)
            run.font.name = "Calibri"
            run.font.size = Pt(18)
            run.bold = True
            run.font.color.rgb = RGBColor(30, 27, 75) # Deep navy
            i += 1
            continue

        if stripped.startswith('## '):
            heading_text = stripped[3:].strip()
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(14)
            p.paragraph_format.space_after = Pt(6)
            p.paragraph_format.keep_with_next = True
            run = p.add_run(heading_text)
            run.font.name = "Calibri"
            run.font.size = Pt(14)
            run.bold = True
            run.font.color.rgb = RGBColor(67, 24, 138) # Dark purple
            i += 1
            continue

        if stripped.startswith('### '):
            heading_text = stripped[4:].strip()
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(10)
            p.paragraph_format.space_after = Pt(4)
            p.paragraph_format.keep_with_next = True
            run = p.add_run(heading_text)
            run.font.name = "Calibri"
            run.font.size = Pt(12)
            run.bold = True
            run.font.color.rgb = RGBColor(88, 28, 135)
            i += 1
            continue

        # Blockquote (> ...)
        if stripped.startswith('> '):
            quote_text = stripped[2:].strip()
            tbl = doc.add_table(rows=1, cols=1)
            tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
            cell = tbl.cell(0, 0)
            set_cell_background(cell, "FAF5FF")
            set_cell_margins(cell, top=100, bottom=100, left=160, right=160)
            tcPr = cell._tc.get_or_add_tcPr()
            borders = parse_xml(f'<w:tcBorders {nsdecls("w")}><w:top w:val="none"/><w:left w:val="single" w:sz="24" w:space="0" w:color="9333EA"/><w:bottom w:val="none"/><w:right w:val="none"/></w:tcBorders>')
            tcPr.append(borders)
            qp = cell.paragraphs[0]
            qp.paragraph_format.space_before = Pt(2)
            qp.paragraph_format.space_after = Pt(2)
            format_inline_runs(qp, quote_text, base_size=10.5, is_italic=True, base_color=(88, 28, 135))
            i += 1
            continue

        # Bullet point (* or -)
        if stripped.startswith('* ') or stripped.startswith('- '):
            bullet_text = stripped[2:].strip()
            p = doc.add_paragraph(style='List Bullet')
            p.paragraph_format.space_before = Pt(1)
            p.paragraph_format.space_after = Pt(2)
            p.paragraph_format.line_spacing = 1.15
            format_inline_runs(p, bullet_text, base_size=11)
            i += 1
            continue

        # Numbered list (e.g. 1. 2. 3.)
        num_match = re.match(r'^(\d+)\.\s+(.*)', stripped)
        if num_match:
            num_idx = num_match.group(1)
            num_text = num_match.group(2)
            p = doc.add_paragraph()
            p.paragraph_format.left_indent = Inches(0.25)
            p.paragraph_format.space_before = Pt(1)
            p.paragraph_format.space_after = Pt(2)
            p.paragraph_format.line_spacing = 1.15
            run_num = p.add_run(f"{num_idx}. ")
            run_num.bold = True
            run_num.font.color.rgb = RGBColor(67, 24, 138)
            format_inline_runs(p, num_text, base_size=11)
            i += 1
            continue

        # HTML-like center tags or plain text
        clean_text = stripped.replace('<p align="center">', '').replace('</p>', '').replace('<br>', '').replace('<strong>', '').replace('</strong>', '')
        if clean_text:
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(2)
            p.paragraph_format.space_after = Pt(4)
            p.paragraph_format.line_spacing = 1.15

            # Center alignment for title page text
            if 'Chandigarh University' in clean_text or 'AN INDUSTRIAL PROJECT REPORT' in clean_text or 'BACHELOR OF ENGINEERING' in clean_text or 'SOURAV SHARMA' in clean_text:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER

            format_inline_runs(p, clean_text, base_size=11)

        i += 1

    if is_in_table:
        flush_table()
    if is_in_code_block:
        flush_code_block()

    doc.save(output_docx_path)
    print(f"Successfully generated Word document: {output_docx_path}")

if __name__ == "__main__":
    src = "/Users/sourav/Desktop/Azure_AI _901_project/PROJECT_REPORT.md"
    dst = "/Users/sourav/Desktop/Azure_AI _901_project/EduMind_AI_Project_Report.docx"
    build_docx(src, dst)
