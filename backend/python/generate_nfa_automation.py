# backend/python/generate_nfa_automation.py
import sys
import os
import re
import json
from openai import OpenAI
from docx import Document
from docx.shared import Inches, Pt
from docx.enum.text import WD_PARAGRAPH_ALIGNMENT
from dotenv import load_dotenv
from datetime import datetime

# Debug Python version
print(f"Python version: {sys.version}", file=sys.stderr)
print(f"Python executable: {sys.executable}", file=sys.stderr)

# ==========================
# Load API Key & Init OpenAI
# ==========================
try:
    load_dotenv()
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("Warning: OPENAI_API_KEY not found", file=sys.stderr)
    else:
        print("OPENAI_API_KEY loaded successfully", file=sys.stderr)
    client = OpenAI(api_key=api_key) if api_key else None
except Exception as e:
    print(f"Error initializing OpenAI client: {e}", file=sys.stderr)
    client = None

# ==========================
# Paths
# ==========================
script_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.dirname(script_dir)
uploads_dir = os.path.join(backend_dir, "uploads")

header_image_path = os.path.join(uploads_dir, "header.png")
signatures_dir = os.path.join(uploads_dir, "signatures")

# Output directory
env_output_dir = os.getenv("OUTPUT_DIR")
if env_output_dir:
    if env_output_dir.startswith("./backend/"):
        env_output_dir = env_output_dir.replace("./backend/", "./")
    base_output_directory = os.path.abspath(os.path.join(backend_dir, env_output_dir.lstrip("./")))
else:
    base_output_directory = os.path.join(uploads_dir, "generated_letters")

output_directory = os.path.join(base_output_directory, "nfa")
os.makedirs(output_directory, exist_ok=True)

print(f"Final output directory: {output_directory}", file=sys.stderr)

# ==========================
# AI Helper
# ==========================
def generate_ai_nfa_from_summary(subject, summary, nfa_type="reimbursement", need_bullets=False, facts_only=False):
    if not client:
        return f"{subject}\n\nRequest for approval regarding {summary}. The above proposal is submitted for approval."

    # Create ultra-concise prompt for single page following strict template
    prompt = f"""
Create an EXCELLENT professional NFA document following this EXACT structure for SINGLE PAGE output:

USER INPUTS:
Subject: {subject}
Summary: {summary}
Type: {nfa_type}
Need Bullets: {need_bullets}

REQUIRED OUTPUT FORMAT (MUST FOLLOW EXACT TEMPLATE WITH EXCELLENT STRUCTURE):
{subject}

Request for approval regarding [specific details from summary]. [Context sentence]. [Objective sentence]."""

    # Add bullet points only if user requested them
    if need_bullets:
        prompt += """

• [Generate 3 unique, specific bullet points based on the subject and summary - each should be 1 sentence, highly relevant to the specific event/request, not generic]
• [Focus on key aspects like: event details, participants, objectives, requirements, or benefits specific to this request]
• [Make each bullet point distinct and valuable, directly related to the subject matter]"""

    prompt += f"""

CRITICAL REQUIREMENTS FOR EXCELLENT CONTENT:
1. First line: ONLY "{subject}" (no prefixes like "Subject:")
2. Empty line
3. Request paragraph: EXACTLY 3-4 sentences starting with "Request for approval regarding" (MUST be based on user's subject and summary)
4. The request paragraph MUST include:
   - First sentence: "Request for approval regarding [specific details from summary]"
   - Second sentence: [Context about the event/activity from summary]
   - Third sentence: [Objective or purpose from summary]
   - Fourth sentence: [Additional relevant details from summary if needed]
5. Empty line"""
    
    if need_bullets:
        prompt += """
6. Exactly 3 bullet points with • symbol (1 sentence each, EXCELLENT and HIGHLY SPECIFIC to the subject and summary - NO generic content)
7. Each bullet point must be unique and directly related to the specific event/request described in the summary
8. Focus on concrete details like: specific participants, exact objectives, particular requirements, or specific benefits
9. Avoid generic phrases like "key requirements" or "important details" - be specific and meaningful"""
    else:
        prompt += """
6. NO bullet points - continue directly to conclusion"""
    
    prompt += f"""
7. Use ONLY user's summary content - NO generic text
8. ULTRA-CONCISE for STRICT single page limit
9. No conclusion paragraph (will be added separately)
10. No markdown formatting
11. Make content EXCELLENT and specific to user's summary only
12. Generate EXCELLENT content based on user inputs
13. Make it professional and specific to the request
14. MAXIMUM CONCISENESS - every word must count
15. EXCELLENT STRUCTURE - well-organized paragraphs and bullet points
16. PERFECT ALIGNMENT with user's subject and summary
17. For bullet points: Extract specific details from the summary like names, dates, locations, objectives, participants, or unique aspects of the request
18. Make bullet points actionable and informative, not just descriptive
19. CRITICAL: The request paragraph MUST start with "Request for approval regarding" and be 3-4 sentences based on the user's subject and summary
20. CRITICAL: Extract specific details from the summary to make the request paragraph meaningful and relevant

Generate ULTRA-CONCISE, EXCELLENT, specific content based ONLY on the user's summary. No generic content. Single page limit is MANDATORY. Make it EXCELLENT.
"""

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are an EXCELLENT professional NFA writer who creates ultra-concise, single-page documents with PERFECT structure. Always generate EXCELLENT, specific content based ONLY on user inputs. For bullet points, extract specific details from the summary like names, dates, locations, objectives, participants, or unique aspects of the request. Make bullet points actionable and informative, not generic. Create well-structured paragraphs, bullet points, and conclusions that perfectly align with the user's subject and summary. Maximum conciseness and excellence required."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=150,  # Increased slightly for better bullet point generation
            temperature=0.1  # Lower for consistency and conciseness
        )
        
        ai_content = response.choices[0].message.content.strip()
        
        # Ensure proper formatting
        lines = ai_content.split('\n')
        formatted_lines = []
        
        for line in lines:
            line = line.strip()
            if line:
                formatted_lines.append(line)
        
        # Join with proper spacing
        formatted_content = '\n\n'.join(formatted_lines)
        
        # Add the conclusion based on NFA type
        if nfa_type == "advance":
            conclusion = "The above proposal is submitted for approval, and the advance amount may kindly be released to the organizing committee to conduct the event smoothly."
        else:  # default = reimbursement
            conclusion = "The above proposal is submitted for approval, and the amount may kindly be reimbursed to the organizing committee after the event upon submission of the online report, receipts, and GST bills."
        
        # Add the conclusion at the end
        final_content = f"{formatted_content}\n\n{conclusion}"
        
        print(f"✅ AI generated content following strict template: {final_content[:200]}...", file=sys.stderr)
        
        return final_content
        
    except Exception as e:
        print(f"⚠️ AI Error: {e}", file=sys.stderr)
        # Create ultra-concise fallback content following strict template
        if need_bullets:
            fallback_content = f"""{subject}

Request for approval regarding {summary}. This proposal requires administrative approval for successful execution. The objective is to ensure proper event management and resource allocation. All necessary arrangements will be made to conduct the event effectively.

• Key requirements must be met for approval
• Important details will be outlined  
• Financial details provided in table"""
        else:
            fallback_content = f"""{subject}

Request for approval regarding {summary}. This proposal requires administrative approval for successful execution. The objective is to ensure proper event management and resource allocation. All necessary arrangements will be made to conduct the event effectively."""
        
        # Add conclusion based on NFA type
        if nfa_type == "advance":
            conclusion = "The above proposal is submitted for approval, and the advance amount may kindly be released to the organizing committee to conduct the event smoothly."
        else:  # default = reimbursement
            conclusion = "The above proposal is submitted for approval, and the amount may kindly be reimbursed to the organizing committee after the event upon submission of the online report, receipts, and GST bills."
        
        final_fallback = f"{fallback_content}\n\n{conclusion}"
        return final_fallback

# ==========================
# Signature Layout Helper
# ==========================
def get_signature_layout():
    """Get signature layout from JSON database"""
    try:
        import json
        db_path = os.path.join(backend_dir, "database", "signatures.json")
        print(f"Looking for signature database at: {db_path}", file=sys.stderr)
        
        if os.path.exists(db_path):
            print("Signature database file exists", file=sys.stderr)
            with open(db_path, 'r') as f:
                data = json.load(f)
            
            signatures = data.get('signatures', {})
            print(f"Loaded signatures: {signatures}", file=sys.stderr)
            
            # Format signatures for the 2x2 layout
            layout = {
                'top_left': signatures.get('prepared_by', [{}])[0] if signatures.get('prepared_by') else {},
                'top_right': next((s for s in signatures.get('approved_by', []) if s.get('order') == 1), {}),
                'bottom_left': signatures.get('recommended_by', [{}])[0] if signatures.get('recommended_by') else {},
                'bottom_right': next((s for s in signatures.get('approved_by', []) if s.get('order') == 2), {})
            }
            
            print(f"Signature layout: {layout}", file=sys.stderr)
            return layout
        else:
            print("Signature database file does not exist", file=sys.stderr)
    except Exception as e:
        print(f"Error loading signature layout: {e}", file=sys.stderr)
    
    # Return default layout with your specified signatures
    print("Using default signature layout", file=sys.stderr)
    return {
        'top_left': {
            'name': 'Dr Phani Kumar Pullela',
            'designation': 'Dean, Student Affairs'
        },
        'top_right': {
            'name': 'Mr Chandrasekhar KN',
            'designation': 'Head Finance'
        },
        'bottom_left': {
            'name': 'Dr Sahana D Gowda',
            'designation': 'Registrar - RV University'
        },
        'bottom_right': {
            'name': 'Prof (Dr) Dwarika Prasad Uniyal',
            'designation': 'Vice Chancellor (i/c)'
        }
    }

def add_signature_layout(doc, layout):
    """Add signature layout to document with safer approach"""
    try:
        print("Starting to add signature layout", file=sys.stderr)
        
        # Add minimal space before signatures for single page limit
        doc.add_paragraph()
        
        print("Creating first signature table", file=sys.stderr)
        
        # Create first signature table (top row) with 3 columns for spacing
        table = doc.add_table(rows=4, cols=3)
        
        # Set column widths: left signature, spacer, right signature
        try:
            table.columns[0].width = Inches(2.2)  # Left signature
            table.columns[1].width = Inches(1.6)   # Increased spacer column for better gap
            table.columns[2].width = Inches(2.2)  # Right signature
        except Exception as e:
            print(f"Warning: Could not set column widths: {e}", file=sys.stderr)
        
        # Top row - signature lines
        top_left_cell = table.cell(0, 0)
        top_right_cell = table.cell(0, 2)
        
        # Add text safely
        try:
            top_left_cell.text = "_________________"
            top_right_cell.text = "_________________"
        except Exception as e:
            print(f"Warning: Could not set signature lines: {e}", file=sys.stderr)
            # Try alternative approach
            if top_left_cell.paragraphs:
                top_left_cell.paragraphs[0].text = "_________________"
            if top_right_cell.paragraphs:
                top_right_cell.paragraphs[0].text = "_________________"
        
        # Left align the signature lines and reduce font size
        for cell in [top_left_cell, top_right_cell]:
            for paragraph in cell.paragraphs:
                paragraph.alignment = WD_PARAGRAPH_ALIGNMENT.LEFT
                for run in paragraph.runs:
                    run.font.size = Pt(12)  # Consistent font size
                    run.font.name = 'Times New Roman'
        
        # Second row - names
        name_left_cell = table.cell(1, 0)
        name_right_cell = table.cell(1, 2)
        
        # Add names safely
        try:
            left_name = clean_text_content(layout.get('top_left', {}).get('name', 'Dr Phani Kumar Pullela'))
            right_name = clean_text_content(layout.get('top_right', {}).get('name', 'Mr Chandrasekhar KN'))
            
            name_left_cell.text = left_name
            name_right_cell.text = right_name
        except Exception as e:
            print(f"Warning: Could not set names: {e}", file=sys.stderr)
            # Try alternative approach
            if name_left_cell.paragraphs:
                name_left_cell.paragraphs[0].text = "Dr Phani Kumar Pullela"
            if name_right_cell.paragraphs:
                name_right_cell.paragraphs[0].text = "Mr Chandrasekhar KN"
        
        # Apply left alignment to names and set font
        for cell in [name_left_cell, name_right_cell]:
            for paragraph in cell.paragraphs:
                paragraph.alignment = WD_PARAGRAPH_ALIGNMENT.LEFT
                for run in paragraph.runs:
                    run.font.size = Pt(12)  # Consistent font size
                    run.font.name = 'Times New Roman'
        
        # Third row - designations
        desig_left_cell = table.cell(2, 0)
        desig_right_cell = table.cell(2, 2)
        
        desig_left_cell.text = layout.get('top_left', {}).get('designation', 'Dean, Student Affairs')
        desig_right_cell.text = layout.get('top_right', {}).get('designation', 'Head Finance')
        
        # Apply left alignment to designations and set font
        for cell in [desig_left_cell, desig_right_cell]:
            for paragraph in cell.paragraphs:
                paragraph.alignment = WD_PARAGRAPH_ALIGNMENT.LEFT
                for run in paragraph.runs:
                    run.font.size = Pt(12)  # Consistent font size
                    run.font.name = 'Times New Roman'
        
        # Fourth row - signature labels
        label_left_cell = table.cell(3, 0)
        label_right_cell = table.cell(3, 2)
        
        label_left_cell.text = "(Prepared by)"
        label_right_cell.text = "(Approved by)"
        
        # Apply left alignment to labels and set font
        for cell in [label_left_cell, label_right_cell]:
            for paragraph in cell.paragraphs:
                paragraph.alignment = WD_PARAGRAPH_ALIGNMENT.LEFT
                for run in paragraph.runs:
                    run.font.size = Pt(12)  # Consistent font size
                    run.font.name = 'Times New Roman'
        
        print("First signature table created successfully", file=sys.stderr)
        
        # Add proper vertical spacing between signature blocks
        doc.add_paragraph()
        doc.add_paragraph()
        
        print("Creating second signature table", file=sys.stderr)
        
        # Second signature table (bottom row) with 3 columns for spacing
        table2 = doc.add_table(rows=4, cols=3)
        # Remove style assignment to avoid "Table Normal" error
        # table2.style = 'Table Normal'  # No borders
        
        # Set column widths: left signature, spacer, right signature
        table2.columns[0].width = Inches(2.2)  # Left signature
        table2.columns[1].width = Inches(1.6)   # Increased spacer column for better gap
        table2.columns[2].width = Inches(2.2)  # Right signature
        
        # Top row - signature lines
        top_left_cell2 = table2.cell(0, 0)
        top_right_cell2 = table2.cell(0, 2)
        
        top_left_cell2.text = "_________________"
        top_right_cell2.text = "_________________"
        
        # Left align the signature lines and reduce font size
        for cell in [top_left_cell2, top_right_cell2]:
            for paragraph in cell.paragraphs:
                paragraph.alignment = WD_PARAGRAPH_ALIGNMENT.LEFT
                for run in paragraph.runs:
                    run.font.size = Pt(12)  # Consistent font size
                    run.font.name = 'Times New Roman'
        
        # Second row - names
        name_left_cell2 = table2.cell(1, 0)
        name_right_cell2 = table2.cell(1, 2)
        
        name_left_cell2.text = layout.get('bottom_left', {}).get('name', 'Dr Sahana D Gowda')
        name_right_cell2.text = layout.get('bottom_right', {}).get('name', 'Prof (Dr) Dwarika Prasad Uniyal')
        
        # Apply left alignment to names and set font
        for cell in [name_left_cell2, name_right_cell2]:
            for paragraph in cell.paragraphs:
                paragraph.alignment = WD_PARAGRAPH_ALIGNMENT.LEFT
                for run in paragraph.runs:
                    run.font.size = Pt(12)  # Consistent font size
                    run.font.name = 'Times New Roman'
        
        # Third row - designations
        desig_left_cell2 = table2.cell(2, 0)
        desig_right_cell2 = table2.cell(2, 2)
        
        desig_left_cell2.text = layout.get('bottom_left', {}).get('designation', 'Registrar - RV University')
        desig_right_cell2.text = layout.get('bottom_right', {}).get('designation', 'Vice Chancellor (i/c)')
        
        # Apply left alignment to designations and set font
        for cell in [desig_left_cell2, desig_right_cell2]:
            for paragraph in cell.paragraphs:
                paragraph.alignment = WD_PARAGRAPH_ALIGNMENT.LEFT
                for run in paragraph.runs:
                    run.font.size = Pt(12)  # Consistent font size
                    run.font.name = 'Times New Roman'
        
        # Fourth row - signature labels
        label_left_cell2 = table2.cell(3, 0)
        label_right_cell2 = table2.cell(3, 2)
        
        label_left_cell2.text = "(Recommended by)"
        label_right_cell2.text = "(Approved by)"
        
        # Apply left alignment to labels and set font
        for cell in [label_left_cell2, label_right_cell2]:
            for paragraph in cell.paragraphs:
                paragraph.alignment = WD_PARAGRAPH_ALIGNMENT.LEFT
                for run in paragraph.runs:
                    run.font.size = Pt(12)  # Consistent font size
                    run.font.name = 'Times New Roman'
        
        print("✅ Both signature tables created successfully", file=sys.stderr)
        
    except Exception as e:
        print(f"❌ Error adding signature layout: {e}", file=sys.stderr)
        raise e

def parse_table_data(table_data_json):
    """Parse table data from JSON string"""
    try:
        import json
        import ast
        print(f"Raw table data JSON: {table_data_json}", file=sys.stderr)
        
        # Try JSON parsing first
        try:
            table_data = json.loads(table_data_json)
        except json.JSONDecodeError:
            # If JSON fails, try ast.literal_eval for Python list syntax
            try:
                table_data = ast.literal_eval(table_data_json)
            except (ValueError, SyntaxError):
                print("Failed to parse table data with both JSON and ast.literal_eval", file=sys.stderr)
                return []
        
        print(f"Parsed table data: {table_data}", file=sys.stderr)
        if isinstance(table_data, list) and len(table_data) > 0:
            print(f"Table data is valid list with {len(table_data)} rows", file=sys.stderr)
            return table_data
        print("Table data is empty or not a list", file=sys.stderr)
        return []
    except Exception as e:
        print(f"Error parsing table data: {e}", file=sys.stderr)
        return []

def add_table_to_document(doc, table_data):
    """Add table data to document with Google Sheets-like formatting"""
    try:
        print(f"add_table_to_document called with: {table_data}", file=sys.stderr)
        if not table_data or len(table_data) == 0:
            print("No table data to add", file=sys.stderr)
            return
        
        print(f"Adding table with {len(table_data)} rows", file=sys.stderr)
        # Add space before table
        doc.add_paragraph()
        doc.add_paragraph()
        
        # Create table
        table = doc.add_table(rows=len(table_data), cols=len(table_data[0]) if table_data else 0)
        
        # Apply Google Sheets-like styling
        table.style = 'Table Grid'  # Enable borders
        
        # Set table properties for better appearance - LEFT ALIGNED as shown in second image
        table.alignment = WD_PARAGRAPH_ALIGNMENT.LEFT
        
        # Add space after table
        table_para = doc.add_paragraph()
        table_para.paragraph_format.space_after = Pt(6)
        
        print(f"Created table with {len(table.rows)} rows and {len(table.columns)} columns", file=sys.stderr)
        
        # Add data to table with validation and formatting
        for row_idx, row_data in enumerate(table_data):
            print(f"Adding row {row_idx}: {row_data}", file=sys.stderr)
            if row_idx < len(table.rows):
                for col_idx, cell_data in enumerate(row_data):
                    if col_idx < len(table.rows[row_idx].cells):
                        # Clean and validate cell data
                        clean_data = str(cell_data).strip() if cell_data is not None else ""
                        # Remove any potentially problematic characters
                        clean_data = clean_data.replace('\x00', '').replace('\r', '').replace('\n', ' ')
                        
                        # Get the cell and its paragraph
                        cell = table.rows[row_idx].cells[col_idx]
                        cell.text = clean_data
                        
                        # Format cell content - LEFT ALIGNED as shown in second image
                        for paragraph in cell.paragraphs:
                            paragraph.alignment = WD_PARAGRAPH_ALIGNMENT.LEFT  # Left align text
                            
                            # Format runs in the paragraph
                            for run in paragraph.runs:
                                run.font.size = Pt(12)  # Consistent font size
                                run.font.name = 'Times New Roman'
                                if row_idx == 0:  # Header row
                                    run.bold = True  # Make header bold
                                    run.font.size = Pt(12)  # Same size for header
        
        # Set column widths for better appearance
        try:
            if len(table.columns) > 0:
                # Calculate column widths based on content
                col_widths = []
                for col_idx in range(len(table.columns)):
                    if col_idx == 0:  # First column (usually sl.no)
                        col_widths.append(Inches(0.8))
                    elif col_idx == len(table.columns) - 1:  # Last column (usually total)
                        col_widths.append(Inches(1.0))
                    else:  # Middle columns
                        col_widths.append(Inches(1.5))
                
                # Apply column widths
                for i, width in enumerate(col_widths):
                    if i < len(table.columns):
                        table.columns[i].width = width
        except Exception as e:
            print(f"Warning: Could not set column widths: {e}", file=sys.stderr)
        
        print(f"✅ Table added to document with {len(table_data)} rows and Google Sheets-like formatting", file=sys.stderr)
        
    except Exception as e:
        print(f"Error adding table to document: {e}", file=sys.stderr)

def clean_text_content(text):
    """Clean text content to prevent DOCX corruption"""
    try:
        if not text:
            return ""
        
        # Remove null characters and other problematic characters
        cleaned = text.replace('\x00', '').replace('\r', '').replace('\x01', '').replace('\x02', '')
        
        # Normalize line endings
        cleaned = cleaned.replace('\n', '\n').replace('\r\n', '\n')
        
        # Remove excessive whitespace
        cleaned = ' '.join(cleaned.split())
        
        return cleaned
        
    except Exception as e:
        print(f"Error cleaning text content: {e}", file=sys.stderr)
        return text

def optimize_for_single_page(doc):
    """Optimize document content to ensure it fits on a single page"""
    try:
        print("🔍 Optimizing document for single page limit...", file=sys.stderr)
        
        # Count total paragraphs and estimate content length
        total_paragraphs = len(doc.paragraphs)
        total_tables = len(doc.tables)
        
        print(f"📊 Document stats: {total_paragraphs} paragraphs, {total_tables} tables", file=sys.stderr)
        
        # AGGRESSIVE SINGLE PAGE OPTIMIZATION - Always apply
        print("⚠️ Applying aggressive single page optimization...", file=sys.stderr)
        
        # Reduce all paragraph spacing to absolute minimum
        for para in doc.paragraphs:
            if hasattr(para, 'paragraph_format'):
                para.paragraph_format.space_after = Pt(0)  # No space after
                para.paragraph_format.space_before = Pt(0)  # No space before
                para.paragraph_format.line_spacing = 1.0  # Single line spacing
        
        # Reduce table cell padding to minimum
        for table in doc.tables:
            for row in table.rows:
                for cell in row.cells:
                    for para in cell.paragraphs:
                        if hasattr(para, 'paragraph_format'):
                            para.paragraph_format.space_after = Pt(0)
                            para.paragraph_format.space_before = Pt(0)
                            para.paragraph_format.line_spacing = 1.0
        
        # Reduce font sizes for better fit
        for para in doc.paragraphs:
            for run in para.runs:
                if run.font.size and run.font.size > Pt(8):
                    run.font.size = Pt(8)  # Standardize to 8pt for single page
        
        # Ensure all paragraphs maintain justified alignment
        for para in doc.paragraphs:
            if para.text.strip():  # Only for non-empty paragraphs
                para.alignment = WD_PARAGRAPH_ALIGNMENT.JUSTIFY
        
        print("✅ Document aggressively optimized for single page", file=sys.stderr)
        return True
        
    except Exception as e:
        print(f"❌ Error optimizing document: {e}", file=sys.stderr)
        return False

def validate_document_structure(doc):
    """Validate document structure before saving to prevent XML corruption"""
    try:
        print("🔍 Validating document structure...", file=sys.stderr)
        
        # Check if document has paragraphs
        if len(doc.paragraphs) == 0:
            print("❌ Document has no paragraphs", file=sys.stderr)
            return False
        
        # Check each paragraph for issues
        for i, para in enumerate(doc.paragraphs):
            try:
                # Check if paragraph has runs
                if not para.runs:
                    print(f"⚠️ Paragraph {i} has no runs", file=sys.stderr)
                    continue
                
                # Check each run for issues
                for j, run in enumerate(para.runs):
                    if run.text is None:
                        print(f"⚠️ Run {j} in paragraph {i} has None text", file=sys.stderr)
                        run.text = ""
                    elif '\x00' in run.text:
                        print(f"⚠️ Run {j} in paragraph {i} contains null characters", file=sys.stderr)
                        run.text = run.text.replace('\x00', '')
                
            except Exception as e:
                print(f"❌ Error validating paragraph {i}: {e}", file=sys.stderr)
                return False
        
        # Check tables
        for i, table in enumerate(doc.tables):
            try:
                for row_idx, row in enumerate(table.rows):
                    for cell_idx, cell in enumerate(row.cells):
                        for para in cell.paragraphs:
                            for run in para.runs:
                                if run.text and '\x00' in run.text:
                                    print(f"⚠️ Table {i}, Row {row_idx}, Cell {cell_idx} contains null characters", file=sys.stderr)
                                    run.text = run.text.replace('\x00', '')
            except Exception as e:
                print(f"❌ Error validating table {i}: {e}", file=sys.stderr)
                return False
        
        print("✅ Document structure validation passed", file=sys.stderr)
        return True
        
    except Exception as e:
        print(f"❌ Document validation failed: {e}", file=sys.stderr)
        return False

def format_bullet_points(text):
    """Format text with proper bullet points"""
    try:
        # Clean text first
        text = clean_text_content(text)
        
        lines = text.split('\n')
        formatted_lines = []
        
        for line in lines:
            line = line.strip()
            if line.startswith('•') or line.startswith('-') or line.startswith('*'):
                # Convert any bullet point to circle bullet
                if line.startswith('-'):
                    line = line.replace('-', '•', 1)
                elif line.startswith('*'):
                    line = line.replace('*', '•', 1)
                formatted_lines.append(line)
            elif line and not line.startswith('Subject:') and not line.startswith('Request for approval'):
                # Add circle bullet point if it's a content line
                formatted_lines.append(f"• {line}")
            else:
                formatted_lines.append(line)
        
        return '\n'.join(formatted_lines)
    except Exception as e:
        print(f"Error formatting bullet points: {e}", file=sys.stderr)
        return text

def extract_document_text(doc):
    """Extract text content from document for preview - ONLY main content, no headers or signatures"""
    try:
        text_content = []
        
        # Extract only the main content paragraphs (skip headers and signatures)
        for paragraph in doc.paragraphs:
            text = paragraph.text.strip()
            if text and not text.startswith("Date:") and text != "Note For Approval (NFA)":
                # Skip signature-related content
                if not any(indicator in text.lower() for indicator in [
                    'prepared by', 'approved by', 'recommended by', 
                    'dean', 'registrar', 'vice chancellor',
                    'dr phani', 'mr chandrasekhar', 'dr sahana', 'prof dwarika',
                    '_________________'
                ]):
                    text_content.append(text)
        
        # Extract table content (only data tables, not signature tables)
        for table in doc.tables:
            # Check if this is a signature table by looking for signature indicators
            is_signature_table = False
            for row in table.rows:
                for cell in row.cells:
                    cell_text = cell.text.strip().lower()
                    if any(indicator in cell_text for indicator in ['prepared by', 'approved by', 'recommended by', 'dean', 'registrar', 'vice chancellor']):
                        is_signature_table = True
                        break
                if is_signature_table:
                    break
            
            if not is_signature_table:
                text_content.append("")  # Add spacing before table
                # Remove the table heading line
                
                for row_idx, row in enumerate(table.rows):
                    row_text = []
                    for cell in row.cells:
                        if cell.text.strip():
                            row_text.append(cell.text.strip())
                    if row_text:
                        # Format table rows with proper spacing
                        if row_idx == 0:  # Header row
                            header_line = " | ".join(f" {text:^12} " for text in row_text)
                            text_content.append(header_line)
                            text_content.append("+" + "+".join("-" * 14 for _ in row_text) + "+")
                        else:
                            # Data rows with proper alignment
                            data_line = " | ".join(f" {text:^12} " for text in row_text)
                            text_content.append(data_line)
                
                text_content.append("")  # Add spacing after table
        
        return "\n".join(text_content)
        
    except Exception as e:
        print(f"Error extracting document text: {e}", file=sys.stderr)
        return "Error extracting document content"

# ==========================
# AI Edit Function
# ==========================
def process_ai_edit(original_text, edit_prompt):
    """Process AI edit request on existing NFA content"""
    if not client:
        return f"{original_text}\n\n[AI Edit Applied: {edit_prompt}]"
    
    try:
        # Create AI prompt for editing
        prompt = f"""
You are an expert NFA (Note For Approval) editor. You have been given an existing NFA document and a modification request.

EXISTING NFA CONTENT:
{original_text}

MODIFICATION REQUEST:
{edit_prompt}

CRITICAL REQUIREMENTS:
1. Apply ONLY the requested modification - do not change anything else
2. Maintain the EXACT original structure and format
3. Keep the same subject line, conclusion, and signature sections unchanged
4. Preserve all justified alignment and STRICT single page format
5. Ensure the document remains professional and formal
6. Do not regenerate the entire document - only apply the specific requested changes
7. Keep content ULTRA-CONCISE to maintain single page limit
8. Return the complete modified NFA document with minimal changes
9. Preserve the strict template structure:
   - Subject line (no "Subject:" prefix)
   - Request paragraph starting with "Request for approval regarding"
   - Bullet points (if present) with • symbol
   - Conclusion paragraph
   - Signature block
10. SINGLE PAGE LIMIT IS MANDATORY - every word must count
11. EXCELLENT STRUCTURE - maintain well-organized paragraphs and bullet points
12. PERFECT ALIGNMENT - ensure content perfectly aligns with user's subject and summary

IMPORTANT: Only modify what the user specifically requested. Keep everything else exactly the same. Maintain ULTRA-CONCISE format with EXCELLENCE.

Return the complete modified NFA document with the requested changes applied.
"""

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are an EXCELLENT professional NFA editor who applies specific modifications to existing documents while maintaining their PERFECT structure and format. Always keep changes minimal and preserve single page format. Create EXCELLENT, well-structured content that perfectly aligns with the user's subject and summary. ULTRA-CONCISE editing with EXCELLENCE required."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=200,  # Reduced for single page edits
            temperature=0.1  # Lower for consistency and conciseness
        )
        
        edited_content = response.choices[0].message.content.strip()
        
        print(f"✅ AI edit completed: {edit_prompt}", file=sys.stderr)
        print(f"✅ Edited content length: {len(edited_content)} characters", file=sys.stderr)
        
        return edited_content
        
    except Exception as e:
        print(f"⚠️ AI Edit Error: {e}", file=sys.stderr)
        # Return original text with edit note
        return f"{original_text}\n\n[AI Edit Applied: {edit_prompt}]"

# ==========================
# Generate DOCX from Edited Text
# ==========================
def generate_docx_from_text(edited_text, subject, summary, nfa_type, table_data=None):
    """Generate DOCX document from edited text content with original formatting"""
    try:
        print(f"generate_docx_from_text called with subject: {subject}", file=sys.stderr)
        
        # Create output directory if it doesn't exist
        output_dir = os.path.join(os.path.dirname(__file__), "..", "generated_letters", "nfa")
        os.makedirs(output_dir, exist_ok=True)
        
        # Generate unique filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"edited_nfa_{timestamp}.docx"
        filepath = os.path.join(output_dir, filename)
        
        print(f"Creating document: {filepath}", file=sys.stderr)
        
        # Create new document
        doc = Document()
        
        # Set page margins - EXTREME OPTIMIZATION for single page limit
        for section in doc.sections:
            section.top_margin = Inches(0.2)      # Extreme reduction for single page
            section.bottom_margin = Inches(0.2)   # Extreme reduction for single page
            section.left_margin = Inches(0.4)     # Extreme reduction for single page
            section.right_margin = Inches(0.4)    # Extreme reduction for single page
        
        # Add header image if exists - FIXED PATH
        if os.path.exists(header_image_path):
            # Calculate full page width (page width - left margin - right margin)
            page_width = Inches(8.5) - Inches(0.75) - Inches(0.75)  # Full page minus margins
            doc.add_picture(header_image_path, width=page_width)
            print("✅ Header image added successfully", file=sys.stderr)
        else:
            print(f"⚠️ Header image not found at: {header_image_path}", file=sys.stderr)
            # Try alternative path
            alt_header_path = os.path.join(uploads_dir, "header.png")
            if os.path.exists(alt_header_path):
                page_width = Inches(8.5) - Inches(0.75) - Inches(0.75)
                doc.add_picture(alt_header_path, width=page_width)
                print("✅ Header image added from alternative path", file=sys.stderr)
            else:
                print(f"⚠️ Header image not found at alternative path: {alt_header_path}", file=sys.stderr)
        
        # Add date - positioned on the right side (matching preview)
        date_text = f"Date: {datetime.now().strftime('%d-%m-%Y')}"
        date_para = doc.add_paragraph()
        date_run = date_para.add_run(clean_text_content(date_text))
        date_para.alignment = WD_PARAGRAPH_ALIGNMENT.RIGHT
        date_run.font.size = Pt(12)
        date_run.font.name = 'Times New Roman'
        date_para.paragraph_format.space_after = Pt(6)
        
        # Add empty line
        doc.add_paragraph()
        
        # Add title - CENTERED (matching preview)
        title_para = doc.add_paragraph()
        title_run = title_para.add_run("Note For Approval (NFA)")
        title_para.alignment = WD_PARAGRAPH_ALIGNMENT.CENTER
        title_run.bold = True
        title_run.font.size = Pt(14)  # Slightly larger font
        title_run.font.name = 'Times New Roman'
        title_para.paragraph_format.space_after = Pt(6)
        
        # Add empty line
        doc.add_paragraph()
        
        # Add subject - LEFT ALIGNED (matching preview, NO DUPLICATE)
        subj_para = doc.add_paragraph()
        subj_run1 = subj_para.add_run("Subject: ")
        subj_run1.bold = True
        subj_run1.font.size = Pt(12)
        subj_run1.font.name = 'Times New Roman'
        
        clean_subject = clean_text_content(subject)
        subj_run2 = subj_para.add_run(clean_subject)
        subj_run2.font.size = Pt(12)
        subj_run2.font.name = 'Times New Roman'
        
        subj_para.alignment = WD_PARAGRAPH_ALIGNMENT.LEFT
        subj_para.paragraph_format.space_after = Pt(6)
        
        # Add empty line
        doc.add_paragraph()
        
        # Parse content exactly like the preview component
        def parse_content_like_preview(content):
            if not content:
                return {'subject': '', 'body': '', 'conclusion': ''}
            
            lines = content.split('\n')
            filtered_lines = [line.strip() for line in lines if line.strip()]
            
            subject = ''
            body = ''
            conclusion = ''
            
            # Find subject (first line that doesn't start with "Request for approval" or bullet points)
            subject_index = -1
            for i, line in enumerate(filtered_lines):
                if (not line.lower().startswith('request for approval') and 
                    not line.startswith('•') and 
                    not line.startswith('-') and 
                    not line.startswith('*')):
                    subject_index = i
                    break
            
            if subject_index != -1:
                subject = filtered_lines[subject_index].replace('Subject:', '').strip()
                # Only take the first line as subject - split by newline and take first part
                subject = subject.split('\n')[0].strip()
            
            # Find conclusion (usually contains "proposal is submitted")
            conclusion_index = -1
            for i, line in enumerate(filtered_lines):
                if ('proposal is submitted' in line.lower() or 
                    'kindly be released' in line.lower() or 
                    'kindly be reimbursed' in line.lower()):
                    conclusion_index = i
                    break
            
            if conclusion_index != -1:
                conclusion = filtered_lines[conclusion_index]
            
            # Body is everything between subject and conclusion
            body_start = subject_index + 1 if subject_index != -1 else 0
            body_end = conclusion_index if conclusion_index != -1 else len(filtered_lines)
            body_lines = filtered_lines[body_start:body_end]
            body = '\n'.join(body_lines)
            
            return {'subject': subject, 'body': body, 'conclusion': conclusion}
        
        # Parse body content to separate request paragraph and bullet points
        def parse_body_content_like_preview(body):
            if not body:
                return {'request_paragraph': '', 'bullet_points': []}
            
            lines = body.split('\n')
            filtered_lines = [line.strip() for line in lines if line.strip()]
            
            request_paragraph = ''
            bullet_points = []
            
            for line in filtered_lines:
                if line.lower().startswith('request for approval'):
                    request_paragraph = line
                elif line.startswith('•') or line.startswith('-') or line.startswith('*'):
                    bullet_text = line[1:].strip() if line.startswith(('•', '-', '*')) else line
                    bullet_points.append(bullet_text)
            
            return {'request_paragraph': request_paragraph, 'bullet_points': bullet_points}
        
        # Use the subject parameter directly instead of parsing
        print(f"Using subject parameter directly: {subject}", file=sys.stderr)
        
        # Parse the edited text to extract body content
        # First, replace \n\n with actual newlines to handle the input format
        processed_text = edited_text.replace('\\n\\n', '\n\n').replace('\\n', '\n')
        lines = processed_text.split('\n')
        filtered_lines = [line.strip() for line in lines if line.strip()]
        
        request_paragraph = ''
        bullet_points = []
        conclusion = ''
        
        print(f"Processing {len(filtered_lines)} lines from edited text", file=sys.stderr)
        for i, line in enumerate(filtered_lines):
            print(f"Line {i}: {line[:100]}...", file=sys.stderr)
        
        # Find request paragraph (starts with "Request for approval")
        for line in filtered_lines:
            if line.lower().startswith('request for approval'):
                request_paragraph = line
                break
        
        # Find bullet points (lines starting with • or lines that are bullet points without the symbol)
        for i, line in enumerate(filtered_lines):
            if line.startswith('•'):
                bullet_text = line[1:].strip()
                bullet_points.append(bullet_text)
            elif (i > 0 and i < len(filtered_lines) - 1 and 
                  not line.lower().startswith('request for approval') and 
                  not 'proposal is submitted' in line.lower() and
                  not line.startswith('Alumni Meet')):
                # This is likely a bullet point without the • symbol
                bullet_points.append(line)
        
        # Find conclusion (contains "proposal is submitted")
        for line in filtered_lines:
            if 'proposal is submitted' in line.lower():
                conclusion = line
                break
        
        print(f"Request paragraph: {request_paragraph[:100]}...", file=sys.stderr)
        print(f"Bullet points: {len(bullet_points)}", file=sys.stderr)
        print(f"Conclusion: {conclusion[:100]}...", file=sys.stderr)
        
        # Add request paragraph
        if request_paragraph:
            para = doc.add_paragraph()
            para.alignment = WD_PARAGRAPH_ALIGNMENT.JUSTIFY
            run = para.add_run(clean_text_content(request_paragraph))
            run.font.size = Pt(12)
            run.font.name = 'Times New Roman'
            para.paragraph_format.space_after = Pt(6)
            print(f"Added request paragraph: {request_paragraph[:50]}...", file=sys.stderr)
        
        # Add bullet points
        for bullet_text in bullet_points:
            para = doc.add_paragraph()
            para.alignment = WD_PARAGRAPH_ALIGNMENT.JUSTIFY
            para.paragraph_format.space_after = Pt(3)
            
            bullet_run = para.add_run("• ")
            bullet_run.font.size = Pt(12)
            bullet_run.font.name = 'Times New Roman'
            
            text_run = para.add_run(clean_text_content(bullet_text))
            text_run.font.size = Pt(12)
            text_run.font.name = 'Times New Roman'
            print(f"Added bullet point: {bullet_text[:50]}...", file=sys.stderr)
        
        # Table data will be added by the main function, not here
        print("Table data will be added by main function", file=sys.stderr)
        
        # Add table data if provided (BEFORE conclusion)
        if table_data and len(table_data) > 0:
            print(f"Adding table data with {len(table_data)} rows", file=sys.stderr)
            add_table_to_document(doc, table_data)
        else:
            print("No table data to add", file=sys.stderr)
        
        # Add conclusion after table (matching preview structure) - ONLY ONCE
        # Use the nfa_type parameter to determine the correct conclusion
        if nfa_type == "advance":
            conclusion_text = "The above proposal is submitted for approval, and the advance amount may kindly be released to the organizing committee to conduct the event smoothly."
        else:  # default = reimbursement
            conclusion_text = "The above proposal is submitted for approval, and the amount may kindly be reimbursed to the organizing committee after the event upon submission of the online report, receipts, and GST bills."
        
        # Add conclusion paragraph (only once, after table)
        conclusion_para = doc.add_paragraph()
        conclusion_para.alignment = WD_PARAGRAPH_ALIGNMENT.JUSTIFY
        conclusion_para.paragraph_format.space_after = Pt(6)
        
        conclusion_run = conclusion_para.add_run(clean_text_content(conclusion_text))
        conclusion_run.font.size = Pt(12)
        conclusion_run.font.name = 'Times New Roman'
        
        # Add signature layout with default layout
        default_signature_layout = {
            'top_left': {
                'name': 'Dr Phani Kumar Pullela',
                'designation': 'Dean, Student Affairs',
                'label': '(Prepared by)'
            },
            'top_right': {
                'name': 'Mr Chandrasekhar',
                'designation': 'Head Finance',
                'label': '(Approved by)'
            },
            'bottom_left': {
                'name': 'Dr Sahana D Gowda',
                'designation': 'Registrar - RV University (i/c)',
                'label': '(Recommended by)'
            },
            'bottom_right': {
                'name': 'Prof (Dr) Dwarika Prasad Uniyal',
                'designation': 'Vice Chancellor (i/c)',
                'label': '(Approved by)'
            }
        }
        
        add_signature_layout(doc, default_signature_layout)
        
        # Optimize document for single page limit
        optimize_for_single_page(doc)
        
        # Save document
        doc.save(filepath)
        
        print(f"✅ DOCX generated successfully: {filepath}", file=sys.stderr)
        print(f"📁 Full file path: {filepath}", file=sys.stderr)
        print(f"📄 File exists: {os.path.exists(filepath)}", file=sys.stderr)
        print(f"📊 File size: {os.path.getsize(filepath) if os.path.exists(filepath) else 'N/A'} bytes", file=sys.stderr)
        
        return f"/generated_letters/nfa/{filename}", filename
        
    except Exception as e:
        print(f"❌ Error generating DOCX: {e}", file=sys.stderr)
        raise e

# ==========================
# Main Function
# ==========================
def main():
    # Check if this is download mode
    if len(sys.argv) > 1 and sys.argv[1] == "--download-mode":
        if len(sys.argv) < 6:
            print(json.dumps({
                "success": False,
                "error": "Download mode requires: --download-mode, editedText, subject, summary, nfaType"
            }))
            sys.exit(1)
        
        edited_text = sys.argv[2]
        subject = sys.argv[3]
        summary = sys.argv[4]
        nfa_type = sys.argv[5]
        table_data_json = sys.argv[6] if len(sys.argv) > 6 else "[]"
        
        # Parse table data
        table_data = parse_table_data(table_data_json)
        
        # Generate DOCX from edited text
        try:
            file_path, file_name = generate_docx_from_text(edited_text, subject, summary, nfa_type, table_data)
            print(json.dumps({
                "success": True,
                "filePath": file_path,
                "fileName": file_name,
                "message": "Edited NFA document generated successfully"
            }))
        except Exception as e:
            print(json.dumps({
                "success": False,
                "error": f"Failed to generate DOCX: {str(e)}"
            }))
        return
    
    # Check if this is edit mode
    if len(sys.argv) > 1 and sys.argv[1] == "--edit-mode":
        if len(sys.argv) < 4:
            print(json.dumps({
                "success": False,
                "error": "Edit mode requires: --edit-mode, text, prompt"
            }))
            sys.exit(1)
        
        original_text = sys.argv[2]
        edit_prompt = sys.argv[3]
        
        # Process AI edit
        edited_text = process_ai_edit(original_text, edit_prompt)
        
        print(json.dumps({
            "success": True,
            "editedText": edited_text,
            "message": "NFA text edited successfully"
        }))
        return
    
    # Arguments from Node.js for normal generation
    if len(sys.argv) < 4:
        print("Usage: generate_nfa_automation.py <subject> <summary> <nfa_type> [bullets] [table_data]", file=sys.stderr)
        sys.exit(1)

    subject = sys.argv[1]
    summary = sys.argv[2]
    nfa_type = sys.argv[3].lower()
    need_bullets = sys.argv[4].lower() in ("yes", "y", "true", "1") if len(sys.argv) > 4 else False
    table_data_json = sys.argv[5] if len(sys.argv) > 5 else "[]"

    print(f"Inputs -> Subject: {subject}, Type: {nfa_type}, Bullets: {need_bullets}", file=sys.stderr)

    # Parse table data
    table_data = parse_table_data(table_data_json)
    print(f"Table data parsed: {len(table_data)} rows", file=sys.stderr)

    # Generate NFA with structured format (use actual need_bullets parameter)
    nfa_text = generate_ai_nfa_from_summary(subject, summary, nfa_type, need_bullets=need_bullets, facts_only=False)

    # Parse AI output for structured format with robust error handling
    print(f"Raw AI output: {nfa_text[:300]}...", file=sys.stderr)
    
    # Split by double newlines to get sections
    sections = [section.strip() for section in nfa_text.split('\n\n') if section.strip()]
    
    print(f"Parsed sections: {len(sections)}", file=sys.stderr)
    for i, section in enumerate(sections):
        print(f"Section {i}: {section[:100]}...", file=sys.stderr)
    
    # Extract subject (first section) - but use original subject to avoid duplication
    # The AI output may contain the subject, but we'll use the original subject parameter
    subject_line = subject  # Use the original subject parameter, not from AI output
    print(f"✅ Using original subject: {subject_line}", file=sys.stderr)
    
    # Extract conclusion (last section that contains conclusion keywords)
    closing_line = "The above proposal is submitted for approval."
    for section in reversed(sections):
        if any(keyword in section.lower() for keyword in ["proposal is submitted", "request your approval", "kindly be released", "kindly be reimbursed"]):
            closing_line = section
            break
    
    # Extract body content (everything except subject and conclusion)
    body_sections = []
    for i, section in enumerate(sections):
        # Skip the first section if it's just the subject (to avoid duplication)
        if i == 0 and (section.lower().strip() == subject.lower().strip() or 
                      section.lower().startswith("subject:")):
            continue
        if section == closing_line:  # Skip conclusion
            continue
        body_sections.append(section)
    
    body_text = "\n\n".join(body_sections).strip()
    
    # If body is empty or malformed, create ultra-concise fallback
    if not body_text or len(body_sections) < 2:
        print("⚠️ Body content is malformed, creating ultra-concise fallback", file=sys.stderr)
        if need_bullets:
            body_text = f"Request for approval regarding {summary}. This proposal requires administrative approval for successful execution. The objective is to ensure proper event management and resource allocation. All necessary arrangements will be made to conduct the event effectively.\n\n• Key requirements must be met for approval\n• Important details will be outlined\n• Financial details provided in table"
        else:
            body_text = f"Request for approval regarding {summary}. This proposal requires administrative approval for successful execution. The objective is to ensure proper event management and resource allocation. All necessary arrangements will be made to conduct the event effectively."
    
    print(f"✅ Structured content parsed - Subject: {subject_line}", file=sys.stderr)
    print(f"✅ Body sections: {len(body_sections)}", file=sys.stderr)
    print(f"✅ Closing line: {closing_line}", file=sys.stderr)
    print(f"✅ Body text length: {len(body_text)} characters", file=sys.stderr)

    # Filename
    sanitized_subject = re.sub(r'[\\/:*?"<>|]', '_', subject_line.replace(' ', '_')[:60])
    filename = os.path.join(output_directory, f"NFA_{nfa_type}_{sanitized_subject}.docx")

    print(f"Creating document: {filename}", file=sys.stderr)

    # Create docx with proper initialization and template
    try:
        # Create a new document with explicit template
        from docx import Document
        from docx.shared import Inches, Pt
        from docx.enum.text import WD_PARAGRAPH_ALIGNMENT
        
        doc = Document()
        
        # Ensure document has proper structure
        if not hasattr(doc, 'paragraphs'):
            raise Exception("Document does not have paragraphs attribute")
        
        print("✅ Document created successfully", file=sys.stderr)
    except Exception as e:
        print(f"❌ Error creating document: {e}", file=sys.stderr)
        raise

    # Set page margins - EXTREME OPTIMIZATION for single page limit
    try:
        doc_sections = doc.sections
        for doc_section in doc_sections:
            doc_section.top_margin = Inches(0.2)      # Extreme reduction for single page
            doc_section.bottom_margin = Inches(0.2)   # Extreme reduction for single page
            doc_section.left_margin = Inches(0.4)     # Extreme reduction for single page
            doc_section.right_margin = Inches(0.4)    # Extreme reduction for single page
        print("✅ Page margins set successfully", file=sys.stderr)
    except Exception as e:
        print(f"❌ Error setting margins: {e}", file=sys.stderr)
        raise

    # Add header image - FIXED PATH
    if os.path.exists(header_image_path):
        # Calculate full page width (page width - left margin - right margin)
        page_width = Inches(8.5) - Inches(0.75) - Inches(0.75)  # Full page minus margins
        doc.add_picture(header_image_path, width=page_width)
        print("✅ Header image added successfully", file=sys.stderr)
    else:
        print(f"⚠️ Header image not found at: {header_image_path}", file=sys.stderr)
        # Try alternative path
        alt_header_path = os.path.join(uploads_dir, "header.png")
        if os.path.exists(alt_header_path):
            page_width = Inches(8.5) - Inches(0.75) - Inches(0.75)
            doc.add_picture(alt_header_path, width=page_width)
            print("✅ Header image added from alternative path", file=sys.stderr)
        else:
            print(f"⚠️ Header image not found at alternative path: {alt_header_path}", file=sys.stderr)

    # Add content step by step with comprehensive validation
    try:
        # Add date - positioned on the right side (matching preview)
        date_text = f"Date: {datetime.now().strftime('%d-%m-%Y')}"
        date_par = doc.add_paragraph()
        date_run = date_par.add_run(clean_text_content(date_text))
        date_par.alignment = WD_PARAGRAPH_ALIGNMENT.RIGHT
        date_run.font.size = Pt(12)
        date_run.font.name = 'Times New Roman'
        date_par.paragraph_format.space_after = Pt(6)
        print("✅ Date paragraph added (right-aligned)", file=sys.stderr)
        
        
        # Add empty line
        doc.add_paragraph()
        
        # Add title - CENTERED (matching preview)
        title_par = doc.add_paragraph()
        title_run = title_par.add_run("Note For Approval (NFA)")
        title_par.alignment = WD_PARAGRAPH_ALIGNMENT.CENTER
        title_run.bold = True
        title_run.font.size = Pt(14)  # Slightly larger font
        title_run.font.name = 'Times New Roman'
        title_par.paragraph_format.space_after = Pt(6)
        print("✅ Title paragraph added (CENTERED)", file=sys.stderr)
        
        # Add empty line
        doc.add_paragraph()
        
        # Add subject - LEFT ALIGNED (matching preview, NO DUPLICATE)
        subj_par = doc.add_paragraph()
        subj_run1 = subj_par.add_run("Subject: ")
        subj_run1.bold = True
        subj_run1.font.size = Pt(12)
        subj_run1.font.name = 'Times New Roman'
        
        clean_subject = clean_text_content(subject_line)
        subj_run2 = subj_par.add_run(clean_subject)
        subj_run2.font.size = Pt(12)
        subj_run2.font.name = 'Times New Roman'
        
        subj_par.alignment = WD_PARAGRAPH_ALIGNMENT.LEFT
        subj_par.paragraph_format.space_after = Pt(6)
        print("✅ Subject paragraph added (LEFT ALIGNED, NO DUPLICATE)", file=sys.stderr)
        
        # Add empty line
        doc.add_paragraph()
        
    except Exception as e:
        print(f"❌ Error adding basic content: {e}", file=sys.stderr)
        raise

    # Add body content with safer approach
    try:
        print(f"Processing structured body text: {body_text[:200]}...", file=sys.stderr)
        
        # Split by double newlines to get sections (Request paragraph + Bullet points)
        sections = [section.strip() for section in body_text.split('\n\n') if section.strip()]
        
        print(f"Body sections to process: {len(sections)}", file=sys.stderr)
        
        for i, section in enumerate(sections):
            print(f"Processing section {i+1}: {section[:100]}...", file=sys.stderr)
            
            # Skip sections that contain subject, conclusion, or title
            if any(skip_word in section.lower() for skip_word in ['subject:', 'proposal is submitted', 'title']):
                print(f"Skipping section with subject/conclusion/title: {section[:50]}...", file=sys.stderr)
                continue
                
            # Check if this section contains bullet points
            if '•' in section:
                # This is the bullet points section
                lines = [line.strip() for line in section.split('\n') if line.strip()]
                bullet_count = 0
                
                for line in lines:
                    if line.startswith('•'):
                        # Remove bullet symbol and add as Word bullet
                        clean_text = line[1:].strip()
                        if clean_text:
                            # Clean bullet text content
                            clean_bullet_text = clean_text_content(clean_text)
                            
                            # Create paragraph manually to avoid style issues
                            para = doc.add_paragraph()
                            para.alignment = WD_PARAGRAPH_ALIGNMENT.JUSTIFY
                            para.paragraph_format.space_after = Pt(3)  # Proper spacing
                    
                            # Add bullet manually
                            run = para.add_run("• ")
                            run.font.size = Pt(12)
                            run.font.name = 'Times New Roman'
                            
                            # Add text
                            text_run = para.add_run(clean_bullet_text)
                            text_run.font.size = Pt(12)
                            text_run.font.name = 'Times New Roman'
                            
                            bullet_count += 1
                            print(f"Added bullet point {bullet_count}: {clean_bullet_text[:50]}...", file=sys.stderr)
                    else:
                        # Regular text line (shouldn't happen in bullet section)
                        if line and not line.startswith('•'):
                            para = doc.add_paragraph()
                            para.alignment = WD_PARAGRAPH_ALIGNMENT.JUSTIFY
                            run = para.add_run(clean_text_content(line))
                            run.font.size = Pt(12)
                            run.font.name = 'Times New Roman'
                            print(f"Added regular line in bullet section: {line[:50]}...", file=sys.stderr)
                
                print(f"✅ Added {bullet_count} bullet points", file=sys.stderr)
            else:
                # This is the "Request for approval" paragraph
                if section:
                    # Clean section content before adding
                    clean_section = clean_text_content(section)
                    
                    para = doc.add_paragraph()
                    para.alignment = WD_PARAGRAPH_ALIGNMENT.JUSTIFY
                    para.paragraph_format.space_after = Pt(6)  # Proper spacing
                    
                    run = para.add_run(clean_section)
                    run.font.size = Pt(12)
                    run.font.name = 'Times New Roman'
                    
                    print(f"Added request paragraph: {clean_section[:50]}...", file=sys.stderr)
        
        print("✅ Body content added successfully", file=sys.stderr)
        
    except Exception as e:
        print(f"❌ Error adding body content: {e}", file=sys.stderr)
        # Add fallback content
        fallback_para = doc.add_paragraph()
        fallback_para.alignment = WD_PARAGRAPH_ALIGNMENT.JUSTIFY
        fallback_run = fallback_para.add_run(f"Request for approval regarding {clean_text_content(summary)}. This proposal requires administrative approval for successful execution. The objective is to ensure proper event management and resource allocation. All necessary arrangements will be made to conduct the event effectively.")
        fallback_run.font.size = Pt(12)
        fallback_run.font.name = 'Times New Roman'
        print("✅ Fallback content added", file=sys.stderr)
    
    # Add table data if provided (BEFORE conclusion)
    if table_data and len(table_data) > 0:
        print(f"Adding table data with {len(table_data)} rows", file=sys.stderr)
        add_table_to_document(doc, table_data)
    else:
        print("No table data to add", file=sys.stderr)
    
        # Add conclusion line AFTER table (matching preview structure)
        try:
            conclusion_para = doc.add_paragraph()
            conclusion_para.alignment = WD_PARAGRAPH_ALIGNMENT.JUSTIFY  # Justified like preview
            conclusion_para.paragraph_format.space_after = Pt(6)
            
            # Use nfa_type to determine the correct conclusion
            if nfa_type == "advance":
                conclusion_text = "The above proposal is submitted for approval, and the advance amount may kindly be released to the organizing committee to conduct the event smoothly."
            else:  # default = reimbursement
                conclusion_text = "The above proposal is submitted for approval, and the amount may kindly be reimbursed to the organizing committee after the event upon submission of the online report, receipts, and GST bills."
            conclusion_run = conclusion_para.add_run(clean_text_content(conclusion_text))
            conclusion_run.font.size = Pt(12)
            conclusion_run.font.name = 'Times New Roman'
            
            print(f"✅ Conclusion added successfully AFTER table: {conclusion_text[:50]}...", file=sys.stderr)
        except Exception as e:
            print(f"❌ Error adding conclusion: {e}", file=sys.stderr)
            # Add fallback conclusion based on nfa_type
            fallback_conclusion = doc.add_paragraph()
            fallback_conclusion.alignment = WD_PARAGRAPH_ALIGNMENT.JUSTIFY
            if nfa_type == "advance":
                fallback_text = "The above proposal is submitted for approval, and the advance amount may kindly be released to the organizing committee to conduct the event smoothly."
            else:
                fallback_text = "The above proposal is submitted for approval, and the amount may kindly be reimbursed to the organizing committee after the event upon submission of the online report, receipts, and GST bills."
            fallback_run = fallback_conclusion.add_run(fallback_text)
            fallback_run.font.size = Pt(12)
            fallback_run.font.name = 'Times New Roman'

    # Add signature layout - ALWAYS add signatures
    print("Getting signature layout", file=sys.stderr)
    signature_layout = get_signature_layout()
    print(f"Signature layout retrieved: {signature_layout}", file=sys.stderr)
    print("Adding signature layout to document", file=sys.stderr)
    
    # Force add signatures - try structured layout first, then fallback
    signatures_added = False
    
    try:
        if signature_layout and len(signature_layout) > 0:
            add_signature_layout(doc, signature_layout)
            print("✅ Structured signature layout added successfully", file=sys.stderr)
            signatures_added = True
        else:
            print("⚠️ No signature layout data, using fallback", file=sys.stderr)
            raise Exception("No signature data")
    except Exception as e:
        print(f"❌ Error adding structured signature layout: {e}", file=sys.stderr)
        print("Using fallback signature section", file=sys.stderr)
    
    # If structured layout failed, add simple fallback with left alignment
    if not signatures_added:
        try:
            doc.add_paragraph()  # Reduced spacing for single page limit
            
            # First signature row with proper spacing
            sig1_para = doc.add_paragraph("_________________                    _________________")
            sig1_para.alignment = WD_PARAGRAPH_ALIGNMENT.LEFT
            for run in sig1_para.runs:
                run.font.size = Pt(10)
            
            name1_para = doc.add_paragraph("Dr Phani Kumar Pullela              Mr Chandrasekhar KN")
            name1_para.alignment = WD_PARAGRAPH_ALIGNMENT.LEFT
            for run in name1_para.runs:
                run.font.size = Pt(10)
            
            title1_para = doc.add_paragraph("Dean, Student Affairs                Head Finance")
            title1_para.alignment = WD_PARAGRAPH_ALIGNMENT.LEFT
            for run in title1_para.runs:
                run.font.size = Pt(10)
            
            role1_para = doc.add_paragraph("(Prepared by)                        (Approved by)")
            role1_para.alignment = WD_PARAGRAPH_ALIGNMENT.LEFT
            for run in role1_para.runs:
                run.font.size = Pt(10)
            
            # Add vertical spacing between signature rows
            doc.add_paragraph()
            
            # Second signature row with proper spacing
            sig2_para = doc.add_paragraph("_________________                    _________________")
            sig2_para.alignment = WD_PARAGRAPH_ALIGNMENT.LEFT
            for run in sig2_para.runs:
                run.font.size = Pt(10)
            
            name2_para = doc.add_paragraph("Dr Sahana D Gowda                    Prof (Dr) Dwarika Prasad Uniyal")
            name2_para.alignment = WD_PARAGRAPH_ALIGNMENT.LEFT
            for run in name2_para.runs:
                run.font.size = Pt(10)
            
            title2_para = doc.add_paragraph("Registrar - RV University             Vice Chancellor (i/c)")
            title2_para.alignment = WD_PARAGRAPH_ALIGNMENT.LEFT
            for run in title2_para.runs:
                run.font.size = Pt(10)
            
            role2_para = doc.add_paragraph("(Recommended by)                    (Approved by)")
            role2_para.alignment = WD_PARAGRAPH_ALIGNMENT.LEFT
            for run in role2_para.runs:
                run.font.size = Pt(10)
            
            print("✅ Fallback signatures added successfully with left alignment", file=sys.stderr)
        except Exception as fallback_error:
            print(f"❌ Even fallback signatures failed: {fallback_error}", file=sys.stderr)

    # Initialize nfa_text_content
    nfa_text_content = ""
    
    try:
        # Optimize document for single page limit
        optimize_for_single_page(doc)
        
        # Validate document structure before saving
        if not validate_document_structure(doc):
            print("❌ Document validation failed, attempting to fix...", file=sys.stderr)
            # Try to fix common issues
            for para in doc.paragraphs:
                for run in para.runs:
                    if run.text and '\x00' in run.text:
                        run.text = run.text.replace('\x00', '')
        
        # Save document with error handling
        doc.save(filename)
        print(f"Document saved successfully: {filename}", file=sys.stderr)
        
        # Verify file was created and is readable
        if os.path.exists(filename):
            file_size = os.path.getsize(filename)
            print(f"File created successfully, size: {file_size} bytes", file=sys.stderr)
            if file_size == 0:
                print("Warning: File is empty!", file=sys.stderr)
        else:
            print("Error: File was not created!", file=sys.stderr)
            raise Exception("Document file was not created")
        
        # Extract text content for preview
        nfa_text_content = extract_document_text(doc)
        print(f"NFA text content extracted: {len(nfa_text_content)} characters", file=sys.stderr)
        
    except Exception as e:
        print(f"Error saving document: {e}", file=sys.stderr)
        print(f"Document validation failed for file: {filename}", file=sys.stderr)
        raise

    # Print relative path and text content for Node.js
    relative_path = os.path.relpath(filename, backend_dir)
    
    # Output structured JSON result
    result = {
        "success": True,
        "file_path": relative_path,
        "nfa_text": nfa_text_content,
        "file_name": os.path.basename(filename)
    }
    print(json.dumps(result))

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        error_result = {
            "success": False,
            "error": str(e),
            "error_type": type(e).__name__
        }
        print(json.dumps(error_result))
        print(f"Script failed: {e}", file=sys.stderr)
        sys.exit(1)
