import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  Container,
  Typography,
  Box,
  Paper,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import { Download, Send, Add, Delete, Edit, Settings, CloudUpload, TableChart, FileUpload } from "@mui/icons-material";
import AssignmentIcon from "@mui/icons-material/Assignment";
<<<<<<< HEAD
import NfaPreview from "./NfaPreview";
import { addNfaToHistory } from "../utils/nfaHistory";
=======
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, WidthType, Table as DocxTable, TableRow as DocxTableRow, TableCell as DocxTableCell, ImageRun } from "docx";
import { saveAs } from "file-saver";
>>>>>>> 01c2e338bf6394697bda0e18a8ef44375a469344

const steps = ['Fill Details', 'Configure Financial Table', 'Generate NFA with AI', 'Download'];

function NfaAutomationForm({ onNfaGenerated }) {
  const [formData, setFormData] = useState(() => {
    // Load saved form data from localStorage on component mount
    const saved = localStorage.getItem("nfaFormData");
    
    if (saved) {
      try {
        const parsedData = JSON.parse(saved);
        // Check if the saved data has the old 'title' field and convert it
        if (parsedData.title && !parsedData.subject) {
          console.log("🔍 Converting old 'title' field to 'subject'");
          parsedData.subject = parsedData.title;
          delete parsedData.title;
        }
        // Ensure all required fields exist
        return {
          subject: parsedData.subject || "",
          summary: parsedData.summary || "",
          bulletsRequired: parsedData.bulletsRequired || false,
          nfaType: parsedData.nfaType || "reimbursement",
          proposalLines: parsedData.proposalLines || 3,
          proposalBullets: parsedData.proposalBullets || 2,
          proposalAddHeader: parsedData.proposalAddHeader !== undefined ? parsedData.proposalAddHeader : true,
          proposalWordLimit: parsedData.proposalWordLimit || 150,
          proposalCharLimit: parsedData.proposalCharLimit || 500,
          backgroundLines: parsedData.backgroundLines || 3,
          backgroundBullets: parsedData.backgroundBullets || 2,
          backgroundAddHeader: parsedData.backgroundAddHeader !== undefined ? parsedData.backgroundAddHeader : true,
          backgroundWordLimit: parsedData.backgroundWordLimit || 150,
          backgroundCharLimit: parsedData.backgroundCharLimit || 500,
          recommendationLines: parsedData.recommendationLines || 2,
          recommendationBullets: parsedData.recommendationBullets || 1,
          recommendationAddHeader: parsedData.recommendationAddHeader !== undefined ? parsedData.recommendationAddHeader : true,
          recommendationWordLimit: parsedData.recommendationWordLimit || 100,
          recommendationCharLimit: parsedData.recommendationCharLimit || 300,
          tableHeaders: parsedData.tableHeaders || ["Item", "Quantity", "Unit Cost", "Total Cost"],
          tableRows: parsedData.tableRows || [["Laptops", "10", "₹50,000", "₹5,00,000"], ["Software Licenses", "10", "₹10,000", "₹1,00,000"]]
        };
      } catch (error) {
        console.error("Error parsing saved form data:", error);
        // If parsing fails, start with default data
      }
    }
    
    // Default form data
    return {
      subject: "",
      summary: "",
      bulletsRequired: false,
      nfaType: "reimbursement",
      proposalLines: 3,
      proposalBullets: 2,
      proposalAddHeader: true,
      proposalWordLimit: 150,
      proposalCharLimit: 500,
      backgroundLines: 3,
      backgroundBullets: 2,
      backgroundAddHeader: true,
      backgroundWordLimit: 150,
      backgroundCharLimit: 500,
      recommendationLines: 2,
      recommendationBullets: 1,
      recommendationAddHeader: true,
      recommendationWordLimit: 100,
      recommendationCharLimit: 300,
      tableHeaders: ["Item", "Quantity", "Unit Cost", "Total Cost"],
      tableRows: [["Laptops", "10", "₹50,000", "₹5,00,000"], ["Software Licenses", "10", "₹10,000", "₹1,00,000"]]
    };
  });
  const [downloadLink, setDownloadLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [generatedContent, setGeneratedContent] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [showAiEditor, setShowAiEditor] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [tableDialogOpen, setTableDialogOpen] = useState(false);
  const [editingCell, setEditingCell] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importTab, setImportTab] = useState(0);
  const [sheetsUrl, setSheetsUrl] = useState("");
  const [sheetsData, setSheetsData] = useState([]);
  const [sheetsLoading, setSheetsLoading] = useState(false);
  const [sheetsError, setSheetsError] = useState("");
  // AI Editor state
  const [aiChatMessages, setAiChatMessages] = useState([]);
  const [aiInputText, setAiInputText] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [currentNfaContent, setCurrentNfaContent] = useState("");

  // ✅ ADDED: Server connection check useEffect
  useEffect(() => {
    const checkServerConnection = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/health', {
          timeout: 5000 // 5 second timeout
        });
        console.log('✅ Server connection successful:', response.data);
        setError(''); // Clear any previous connection errors
      } catch (error) {
        console.error('❌ Server connection failed:', error);
        setError('Cannot connect to server. Please make sure the backend server is running on port 5000. Run "npm run server" in a separate terminal.');
      }
    };

    checkServerConnection();
  }, []);

<<<<<<< HEAD











=======
  // Handle NFA download with client-side DOCX generation
  const handleDownloadNFA = async () => {
    try {
      console.log("📥 Download NFA button clicked - using Python script");
      setLoading(true);
      
      // Generate and download DOCX using Python script
      await generateDocxWithPython();
      
    } catch (error) {
      console.error("❌ Download error:", error);
      setError("Failed to download NFA document. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Generate DOCX using Python script
  const generateDocxWithPython = async () => {
    try {
      console.log("🐍 Generating DOCX using Python script...");
      
      const content = editedContent || generatedContent;
      if (!content) {
        throw new Error("No content available for download");
      }
      
      // Prepare table data for Python script
      const tableData = formData.tableHeaders && formData.tableHeaders.length > 0 
        ? [formData.tableHeaders, ...formData.tableRows]
        : [];
      
      const requestData = {
        editedText: content,
        subject: formData.subject || "NFA Request",
        summary: formData.summary || "NFA Request Summary",
        nfaType: formData.nfaType || "reimbursement",
        tableData: tableData
      };
      
      console.log("📤 Sending request to Python script:", requestData);
      
      const response = await fetch('http://localhost:5000/api/download-edited-nfa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log("📥 Python script response:", result);
      
      if (result.success) {
        // Check if it's fallback mode (no file available)
        if (result.filePath && result.fileName) {
          // Download the generated file
          await downloadFile(result.filePath, result.fileName);
        } else {
          // Fallback mode - generate DOCX using client-side library
          console.log("📄 Fallback mode: Generating DOCX using client-side library");
          alert(`Download Info:\n${result.message}\n\nGenerating DOCX using client-side library...`);
          
          // Generate DOCX using client-side library as fallback
          await generateClientSideDocx();
        }
      } else {
        throw new Error(result.error || "Python script failed to generate DOCX");
      }
      
    } catch (error) {
      console.error("❌ Error generating DOCX with Python:", error);
      setError(`Failed to generate document: ${error.message}`);
      throw error;
    }
  };

  // Generate DOCX document from preview content - Exact Template Structure
  const generateClientSideDocx = async () => {
    try {
      console.log("📝 Generating template DOCX document with header image...");
      
      // Get the current preview content
      const content = editedContent || generatedContent;
      console.log("📄 Content available:", !!content);
      
      if (!content) {
        throw new Error("No content available for download");
      }
      
      // Clean and validate content - more aggressive cleaning for XML safety
      const cleanContent = content
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control characters
        .replace(/[^\x20-\x7E\u00A0-\uFFFF]/g, '') // Keep only printable characters
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();
      
      console.log("🧹 Content cleaned, length:", cleanContent.length);
      
      if (!cleanContent) {
        throw new Error("Content is empty after cleaning");
      }
      
      // Create document with exact template structure
      const doc = new Document({
        sections: [{
          properties: {
            page: {
              size: {
                orientation: "portrait",
                width: 595,
                height: 842,
              },
              margin: {
                top: 720,
                right: 720,
                bottom: 720,
                left: 720,
              },
            },
          },
          children: [
            // Header with Image
            ...(await createHeaderWithImage()),
            
            // Date - Right aligned
            new Paragraph({
              children: [
            new TextRun({
              text: `Date: ${new Date().toLocaleDateString('en-GB').replace(/[^\x20-\x7E]/g, '')}`,
              size: 20,
              font: "Arial",
            }),
              ],
              alignment: AlignmentType.RIGHT,
              spacing: { after: 300 },
            }),
            
            // NFA Title - Centered
            new Paragraph({
              children: [
                new TextRun({
                  text: "Note For Approval (NFA)",
                  bold: true,
                  size: 22,
                  font: "Arial",
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 300 },
            }),
            
            // Content paragraphs
            ...createTemplateParagraphs(cleanContent),
            
            // Table if exists - Proper table structure
            ...(formData.tableHeaders && formData.tableHeaders.length > 0 ? createProperTable() : []),
            
            // Conclusion
            new Paragraph({
              children: [
                new TextRun({
                  text: (formData.nfaType === "advance" 
                    ? "The above proposal is submitted for approval, and the advance amount may kindly be released to the organizing committee to conduct the event smoothly."
                    : "The above proposal is submitted for approval, and the amount may kindly be reimbursed to the organizing committee after the event upon submission of the online report, receipts, and GST bills.").replace(/[^\x20-\x7E]/g, ''),
                  size: 20,
                  font: "Arial",
                }),
              ],
              alignment: AlignmentType.JUSTIFY,
              spacing: {
                before: 300,
                after: 300,
              },
            }),
            
            // Signature layout - 2x2 grid
            ...createSignatureGrid(),
          ],
        }],
      });
      
      console.log("📝 Document structure created successfully");
      
      // Generate and download the document
      console.log("🔄 Converting document to blob...");
      const blob = await Packer.toBlob(doc);
      console.log("📦 Blob created, size:", blob.size);
      
      const fileName = `nfa_output_${new Date().toISOString().slice(0, 10)}.docx`;
      console.log("💾 Downloading file:", fileName);
      
      saveAs(blob, fileName);
      
      console.log("✅ Template DOCX generated and downloaded successfully");
      setSuccess("NFA document downloaded successfully!");
      
    } catch (error) {
      console.error("❌ Error generating template DOCX:", error);
      console.error("❌ Error details:", error.stack);
      setError(`Failed to generate document: ${error.message}`);
      throw error;
    }
  };

  // Create template paragraphs for DOCX matching template structure
  const createTemplateParagraphs = (content) => {
    if (!content) return [];
    
    const paragraphs = [];
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (!line) {
        // Empty line
        paragraphs.push(new Paragraph({
          children: [new TextRun({ text: " ", size: 20, font: "Arial" })],
          spacing: { after: 200 },
        }));
        continue;
      }
      
      // Clean the line to remove any problematic characters - more aggressive cleaning
      const cleanLine = line
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control characters
        .replace(/[^\x20-\x7E\u00A0-\uFFFF]/g, '') // Keep only printable characters
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();
      if (!cleanLine) continue;
      
      // Subject line
      if (cleanLine.toLowerCase().startsWith('subject:')) {
        const subjectText = cleanLine.substring(8).trim();
        paragraphs.push(new Paragraph({
          children: [
            new TextRun({
              text: "Subject: ",
              bold: true,
              size: 20,
              font: "Arial",
            }),
            new TextRun({
              text: subjectText.replace(/[^\x20-\x7E]/g, ''),
              size: 20,
              font: "Arial",
            }),
          ],
          alignment: AlignmentType.JUSTIFY,
          spacing: { after: 200 },
        }));
        continue;
      }
      
      // Bullet points
      if (cleanLine.startsWith('•')) {
        const bulletText = cleanLine.substring(1).trim();
        paragraphs.push(new Paragraph({
          children: [
            new TextRun({
              text: "• ",
              size: 20,
              font: "Arial",
            }),
            new TextRun({
              text: bulletText.replace(/[^\x20-\x7E]/g, ''),
              size: 20,
              font: "Arial",
            }),
          ],
          alignment: AlignmentType.JUSTIFY,
          spacing: { after: 200 },
        }));
        continue;
      }
      
      // Regular paragraphs
        paragraphs.push(new Paragraph({
          children: [
            new TextRun({
              text: cleanLine.replace(/[^\x20-\x7E]/g, ''),
              size: 20,
              font: "Arial",
            }),
          ],
          alignment: AlignmentType.JUSTIFY,
        spacing: { after: 200 },
      }));
    }
    
    return paragraphs;
  };



  // Create simple signatures without complex table structure
  const createSimpleSignatures = () => {
    const signatureElements = [];
    
    const signatures = [
      { name: "Dr Phani Kumar Pullela", designation: "Dean, Student Affairs", label: "(Prepared by)" },
      { name: "Mr Chandrasekhar KN", designation: "Head Finance", label: "(Approved by)" },
      { name: "Dr Sahana D Gowda", designation: "Registrar - RV University", label: "(Recommended by)" },
      { name: "Prof (Dr) Dwarika Prasad Uniyal", designation: "Vice Chancellor (i/c)", label: "(Approved by)" }
    ];
    
    signatures.forEach((sig, index) => {
      // Add spacing between signature groups
      if (index === 2) {
        signatureElements.push(new Paragraph({
          children: [new TextRun({ text: " ", size: 20, font: "Arial" })],
          spacing: { after: 200 },
        }));
      }
      
      // Signature line
      signatureElements.push(new Paragraph({
        children: [
          new TextRun({
            text: "_________________",
            size: 20,
            font: "Arial",
          }),
        ],
        alignment: AlignmentType.JUSTIFY,
        spacing: { after: 100 },
      }));
      
      // Name
      signatureElements.push(new Paragraph({
        children: [
          new TextRun({
            text: sig.name,
            size: 20,
            font: "Arial",
          }),
        ],
        alignment: AlignmentType.JUSTIFY,
        spacing: { after: 100 },
      }));
      
      // Designation
      signatureElements.push(new Paragraph({
        children: [
          new TextRun({
            text: sig.designation,
            size: 20,
            font: "Arial",
          }),
        ],
        alignment: AlignmentType.JUSTIFY,
        spacing: { after: 100 },
      }));
      
      // Label
      signatureElements.push(new Paragraph({
        children: [
          new TextRun({
            text: sig.label,
            size: 20,
            font: "Arial",
          }),
        ],
        alignment: AlignmentType.JUSTIFY,
        spacing: { after: 200 },
      }));
    });
    
    return signatureElements;
  };

  // Create header with image
  const createHeaderWithImage = async () => {
    try {
      // Try to load header image
      const response = await fetch('/header.png');
      if (response.ok) {
        const imageBuffer = await response.arrayBuffer();
        return [
          new Paragraph({
            children: [
              new ImageRun({
                data: imageBuffer,
                transformation: {
                  width: 400,
                  height: 100,
                },
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),
        ];
      } else {
        console.log("Header image not found, using text header");
        return createTextHeader();
      }
    } catch (error) {
      console.log("Error loading header image, using text header:", error);
      return createTextHeader();
    }
  };

  // Create text-based header as fallback
  const createTextHeader = () => {
    return [
      new Paragraph({
        children: [
          new TextRun({
            text: "RV UNIVERSITY",
            bold: true,
            size: 24,
            font: "Arial",
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "Go, change the world",
            size: 18,
            font: "Arial",
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "An initiative of RV Educational Institutions",
            size: 16,
            font: "Arial",
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "RV Vidyaniketan, 8th Mile, Mysuru Road, Bengaluru, 560059 India",
            size: 16,
            font: "Arial",
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "+91 80 68199900 | www.rvu.edu.in",
            size: 16,
            font: "Arial",
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 },
      }),
    ];
  };

  // Create proper table structure
  const createProperTable = () => {
    if (!formData.tableHeaders || formData.tableHeaders.length === 0) {
      return [];
    }
    
    try {
      const tableRows = [];
      
      // Header row
      const headerRow = new DocxTableRow({
        children: formData.tableHeaders.map(header => 
          new DocxTableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: (header || " ").toString().replace(/[^\x20-\x7E]/g, ''),
                    bold: true,
                    size: 20,
                    font: "Arial",
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          })
        ),
      });
      tableRows.push(headerRow);
      
      // Data rows
      formData.tableRows.forEach(row => {
        const dataRow = new DocxTableRow({
          children: row.map(cell => 
            new DocxTableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: (cell || "").toString().replace(/[^\x20-\x7E]/g, ''),
                      size: 20,
                      font: "Arial",
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
            })
          ),
        });
        tableRows.push(dataRow);
      });
      
      return [
        new Paragraph({
          children: [
            new TextRun({
              text: "Financial/Resource Implications Table:".replace(/[^\x20-\x7E]/g, ''),
              bold: true,
              size: 24,
              font: "Arial",
            }),
          ],
          spacing: {
            before: 400,
            after: 200,
          },
        }),
        new DocxTable({
          rows: tableRows,
          width: {
            size: 100,
            type: WidthType.PERCENTAGE,
          },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 1 },
            bottom: { style: BorderStyle.SINGLE, size: 1 },
            left: { style: BorderStyle.SINGLE, size: 1 },
            right: { style: BorderStyle.SINGLE, size: 1 },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
            insideVertical: { style: BorderStyle.SINGLE, size: 1 },
          },
        }),
      ];
    } catch (error) {
      console.error("Error creating table:", error);
      return [
        new Paragraph({
          children: [
            new TextRun({
              text: "Financial/Resource Implications Table:".replace(/[^\x20-\x7E]/g, ''),
              bold: true,
              size: 24,
              font: "Arial",
            }),
          ],
          spacing: {
            before: 400,
            after: 200,
          },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "Table data could not be formatted.",
              size: 20,
              font: "Arial",
            }),
          ],
        }),
      ];
    }
  };

  // Create signature grid layout
  const createSignatureGrid = () => {
    try {
      // Create 2x2 signature table
      const signatureTable = new DocxTable({
        rows: [
          // First row
          new DocxTableRow({
            children: [
              // Left column
              new DocxTableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "_________________",
                        size: 20,
                        font: "Arial",
                      }),
                    ],
                    alignment: AlignmentType.JUSTIFY,
                    spacing: { after: 100 },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "Dr Phani Kumar Pullela".replace(/[^\x20-\x7E]/g, ''),
                        size: 20,
                        font: "Arial",
                      }),
                    ],
                    alignment: AlignmentType.JUSTIFY,
                    spacing: { after: 100 },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "Dean, Student Affairs",
                        size: 20,
                        font: "Arial",
                      }),
                    ],
                    alignment: AlignmentType.JUSTIFY,
                    spacing: { after: 100 },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "(Prepared by)",
                        size: 20,
                        font: "Arial",
                      }),
                    ],
                    alignment: AlignmentType.JUSTIFY,
                    spacing: { after: 200 },
                  }),
                ],
              }),
              // Right column
              new DocxTableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "_________________",
                        size: 20,
                        font: "Arial",
                      }),
                    ],
                    alignment: AlignmentType.JUSTIFY,
                    spacing: { after: 100 },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "Mr Chandrasekhar KN".replace(/[^\x20-\x7E]/g, ''),
                        size: 20,
                        font: "Arial",
                      }),
                    ],
                    alignment: AlignmentType.JUSTIFY,
                    spacing: { after: 100 },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "Head Finance",
                        size: 20,
                        font: "Arial",
                      }),
                    ],
                    alignment: AlignmentType.JUSTIFY,
                    spacing: { after: 100 },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "(Approved by)",
                        size: 20,
                        font: "Arial",
                      }),
                    ],
                    alignment: AlignmentType.JUSTIFY,
                    spacing: { after: 200 },
                  }),
                ],
              }),
            ],
          }),
          // Second row
          new DocxTableRow({
            children: [
              // Left column
              new DocxTableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "_________________",
                        size: 20,
                        font: "Arial",
                      }),
                    ],
                    alignment: AlignmentType.JUSTIFY,
                    spacing: { after: 100 },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "Dr Sahana D Gowda".replace(/[^\x20-\x7E]/g, ''),
                        size: 20,
                        font: "Arial",
                      }),
                    ],
                    alignment: AlignmentType.JUSTIFY,
                    spacing: { after: 100 },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "Registrar - RV University",
                        size: 20,
                        font: "Arial",
                      }),
                    ],
                    alignment: AlignmentType.JUSTIFY,
                    spacing: { after: 100 },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "(Recommended by)",
                        size: 20,
                        font: "Arial",
                      }),
                    ],
                    alignment: AlignmentType.JUSTIFY,
                    spacing: { after: 200 },
                  }),
                ],
              }),
              // Right column
              new DocxTableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "_________________",
                        size: 20,
                        font: "Arial",
                      }),
                    ],
                    alignment: AlignmentType.JUSTIFY,
                    spacing: { after: 100 },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "Prof (Dr) Dwarika Prasad Uniyal".replace(/[^\x20-\x7E]/g, ''),
                        size: 20,
                        font: "Arial",
                      }),
                    ],
                    alignment: AlignmentType.JUSTIFY,
                    spacing: { after: 100 },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "Vice Chancellor (i/c)",
                        size: 20,
                        font: "Arial",
                      }),
                    ],
                    alignment: AlignmentType.JUSTIFY,
                    spacing: { after: 100 },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "(Approved by)",
                        size: 20,
                        font: "Arial",
                      }),
                    ],
                    alignment: AlignmentType.JUSTIFY,
                    spacing: { after: 200 },
                  }),
                ],
              }),
            ],
          }),
        ],
        width: {
          size: 100,
          type: WidthType.PERCENTAGE,
        },
        borders: {
          top: { style: BorderStyle.NONE, size: 0 },
          bottom: { style: BorderStyle.NONE, size: 0 },
          left: { style: BorderStyle.NONE, size: 0 },
          right: { style: BorderStyle.NONE, size: 0 },
          insideHorizontal: { style: BorderStyle.NONE, size: 0 },
          insideVertical: { style: BorderStyle.NONE, size: 0 },
        },
      });
      
      return [signatureTable];
      
    } catch (error) {
      console.error("Error creating signature grid:", error);
      
      // Fallback to simple signatures
      const signatures = [
        { name: "Dr Phani Kumar Pullela", designation: "Dean, Student Affairs", label: "(Prepared by)" },
        { name: "Mr Chandrasekhar KN", designation: "Head Finance", label: "(Approved by)" },
        { name: "Dr Sahana D Gowda", designation: "Registrar - RV University", label: "(Recommended by)" },
        { name: "Prof (Dr) Dwarika Prasad Uniyal", designation: "Vice Chancellor (i/c)", label: "(Approved by)" }
      ];
      
      const signatureElements = [];
      signatures.forEach((sig, index) => {
        // Add spacing between signature groups
        if (index === 2) {
          signatureElements.push(new Paragraph({
            children: [new TextRun({ text: " ", size: 20, font: "Arial" })],
            spacing: { after: 200 },
          }));
        }
        
        // Signature line
        signatureElements.push(new Paragraph({
          children: [
            new TextRun({
              text: "_________________",
              size: 20,
              font: "Arial",
            }),
          ],
          alignment: AlignmentType.JUSTIFY,
          spacing: { after: 100 },
        }));
        
        // Name
        signatureElements.push(new Paragraph({
          children: [
            new TextRun({
              text: sig.name,
              size: 20,
              font: "Arial",
            }),
          ],
          alignment: AlignmentType.JUSTIFY,
          spacing: { after: 100 },
        }));
        
        // Designation
        signatureElements.push(new Paragraph({
          children: [
            new TextRun({
              text: sig.designation,
              size: 20,
              font: "Arial",
            }),
          ],
          alignment: AlignmentType.JUSTIFY,
          spacing: { after: 100 },
        }));
        
        // Label
        signatureElements.push(new Paragraph({
          children: [
            new TextRun({
              text: sig.label,
              size: 20,
              font: "Arial",
            }),
          ],
          alignment: AlignmentType.JUSTIFY,
          spacing: { after: 200 },
        }));
      });
      
      return signatureElements;
    }
  };

  // Enhanced download function with multiple fallback methods
  const downloadFile = async (filePath, fileName = null) => {
    try {
      const downloadUrl = `http://localhost:5000${filePath}`;
      console.log("🔗 Download URL:", downloadUrl);
      
      // Ensure fileName has .docx extension
      const finalFileName = fileName && fileName.endsWith('.docx') 
        ? fileName 
        : `${fileName || `NFA_${formData.subject.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}`}.docx`;
      
      console.log("📄 Final filename:", finalFileName);
      
      // Method 1: Try fetch and blob download with proper MIME type
      try {
        console.log("🔄 Fetching file from server...");
        const response = await fetch(downloadUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Get the blob and ensure it's treated as a DOCX file
        const blob = await response.blob();
        console.log("📦 Blob received, size:", blob.size, "type:", blob.type);
        
        // Create a new blob with the correct MIME type for DOCX
        const docxBlob = new Blob([blob], { 
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
        });
        
        // Create download URL
        const url = window.URL.createObjectURL(docxBlob);
        
        // Create download link
        const link = document.createElement('a');
        link.href = url;
        link.download = finalFileName;
        link.style.display = 'none';
        
        // Add to DOM, click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the blob URL
        window.URL.revokeObjectURL(url);
        
        console.log("✅ DOCX file downloaded successfully");
        setSuccess("NFA document downloaded successfully as DOCX!");
        return;
      } catch (fetchError) {
        console.warn("⚠️ Fetch download failed, trying direct link method:", fetchError);
      }
      
      // Method 2: Try direct link download as fallback
      try {
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = finalFileName;
        link.target = '_blank';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log("✅ Direct download initiated");
        setSuccess("NFA document download initiated!");
        return;
      } catch (directError) {
        console.warn("⚠️ Direct download failed, trying window.open method:", directError);
      }
      
      // Method 3: Try window.open as last resort
      try {
        window.open(downloadUrl, '_blank');
        console.log("✅ Window.open download initiated");
        setSuccess("NFA document opened in new tab for download!");
        return;
      } catch (windowError) {
        console.error("❌ All download methods failed:", windowError);
        throw new Error("All download methods failed. Please try right-clicking the link and saving the file.");
      }
      
    } catch (error) {
      console.error("❌ Download file error:", error);
      setError(`Download failed: ${error.message}. Please try right-clicking the link and saving manually.`);
      throw error;
    }
  };
>>>>>>> 01c2e338bf6394697bda0e18a8ef44375a469344

  // Function to process content for preview display with proper bullet formatting
  const processContentForPreview = (content) => {
    if (!content) return "";
    
    const lines = content.split('\n');
    const processedLines = [];
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Handle bullet points - ensure they start with •
      if (trimmedLine.startsWith('•')) {
        processedLines.push(trimmedLine);
      } else if (trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
        // Convert other bullet styles to •
        const bulletText = trimmedLine.substring(1).trim();
        processedLines.push(`• ${bulletText}`);
      } else if (trimmedLine && !trimmedLine.toLowerCase().startsWith('subject:') && 
                 !trimmedLine.toLowerCase().startsWith('request for approval') &&
                 !trimmedLine.toLowerCase().includes('proposal is submitted for approval')) {
        // This might be a bullet point without a bullet symbol
        // Check if it looks like a bullet point (short, specific content)
        if (trimmedLine.length < 100 && 
            (trimmedLine.includes('will') || trimmedLine.includes('should') || 
             trimmedLine.includes('must') || trimmedLine.includes('requires'))) {
          processedLines.push(`• ${trimmedLine}`);
        } else {
          processedLines.push(trimmedLine);
        }
      } else {
        processedLines.push(trimmedLine);
      }
    }
    
    return processedLines.join('\n');
  };

  // Function to format NFA content for proper preview display
  const formatNfaContent = (content) => {
    if (!content) return "";
    
    console.log("🔍 formatNfaContent received:", content.substring(0, 200) + "...");
    
<<<<<<< HEAD
    // The content from Python already includes the complete NFA structure
    // Just return it as-is since it's already properly formatted
    return content;
=======
    // The content from Python already includes the full NFA structure
    // We just need to add the header section and return the content as-is
    const formattedLines = [];
    
    // Add header section (matching your template)
    formattedLines.push("RV UNIVERSITY");
    formattedLines.push("Go, change the world");
    formattedLines.push("An initiative of RV Educational Institutions");
    formattedLines.push("");
    formattedLines.push("RV Vidyaniketan, 8th Mile, Mysuru Road, Bengaluru, 560059 India");
    formattedLines.push("+91 80 68199900 | www.rvu.edu.in");
    formattedLines.push("");
    formattedLines.push(`Date: ${new Date().toLocaleDateString('en-GB')}`);
    formattedLines.push("");
    formattedLines.push("Note For Approval (NFA)");
    formattedLines.push("");
    
    // Check if content already has a subject line (from AI edit)
    if (content.toLowerCase().includes('subject:')) {
      // Content already includes subject, process it to ensure proper bullet formatting
      const processedContent = processContentForPreview(content);
      formattedLines.push(processedContent);
    } else {
      // Add subject line from form data
      formattedLines.push(`Subject: ${formData.subject}`);
      formattedLines.push("");
      const processedContent = processContentForPreview(content);
      formattedLines.push(processedContent);
    }
    
    // Add table if table data exists
    if (formData.tableHeaders && formData.tableHeaders.length > 0 && formData.tableRows && formData.tableRows.length > 0) {
      formattedLines.push("");
      formattedLines.push("Financial/Resource Implications Table:");
      formattedLines.push("");
      
      // Add table headers
      const headerRow = formData.tableHeaders.join("\t");
      formattedLines.push(headerRow);
      
      // Add table rows
      formData.tableRows.forEach(row => {
        const dataRow = row.join("\t");
        formattedLines.push(dataRow);
      });
      
      formattedLines.push("");
      formattedLines.push("The above proposal is submitted for approval.");
    }
    
    // Add signature section (matching your template)
    formattedLines.push("");
    formattedLines.push('_________________                    _________________');
    formattedLines.push('Dr Phani Kumar Pullela              Mr Chandrasekhar KN');
    formattedLines.push('Dean, Student Affairs                Head Finance');
    formattedLines.push('(Prepared by)                        (Approved by)');
    formattedLines.push('');
    formattedLines.push('_________________                    _________________');
    formattedLines.push('Dr Sahana D Gowda                    Prof (Dr) Dwarika Prasad Uniyal');
    formattedLines.push('Registrar - RV University             Vice Chancellor (i/c)');
    formattedLines.push('(Recommended by)                    (Approved by)');
    
    const result = formattedLines.join('\n');
    console.log("🔍 formatNfaContent result:", result.substring(0, 200) + "...");
    
    return result;
>>>>>>> 01c2e338bf6394697bda0e18a8ef44375a469344
  };

  // Replace the generateNfaWithAI function with this corrected version
  const generateNfaWithAI = useCallback(async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Prepare table data as array of arrays (including headers as first row)
      const tableData = [
        formData.tableHeaders, // First row is headers
        ...formData.tableRows  // Rest are data rows
      ];

      const requestData = {
        subject: formData.subject,
        summary: formData.summary,
        bulletsRequired: formData.bulletsRequired,
        nfaType: formData.nfaType,
        proposalWordLimit: formData.proposalWordLimit,
        backgroundWordLimit: formData.backgroundWordLimit,
        recommendationWordLimit: formData.recommendationWordLimit,
        tableData: tableData
      };

      console.log("🔍 Sending request data to generate-nfa:", requestData);
      
      const response = await axios.post(
        "http://localhost:5000/api/generate-nfa",
        requestData
      );

      console.log("✅ Backend response:", response.data);
      
      if (response.data.success) {
        console.log("🔍 Setting state with response data:", {
          file: response.data.file,
<<<<<<< HEAD
          nfaText: response.data.nfa_text?.substring(0, 200) + "...",
          hasNfaText: !!response.data.nfa_text
        });
        
        const nfaText = response.data.nfa_text || "NFA generated successfully";
=======
          nfaText: response.data.nfaText?.substring(0, 200) + "...",
          hasNfaText: !!response.data.nfaText
        });
        
        setDownloadLink(response.data.file);
        const nfaText = response.data.nfaText || "NFA generated successfully";
>>>>>>> 01c2e338bf6394697bda0e18a8ef44375a469344
        setGeneratedContent(nfaText);
        setEditedContent(nfaText);
        setCurrentNfaContent(nfaText);
        setSuccess("NFA generated successfully");
        
        console.log("🔍 State set - generatedContent:", nfaText.substring(0, 200) + "...");
        
        // Initialize AI Editor with welcome message
        setAiChatMessages([
          {
            id: 1,
            type: 'ai',
            message: 'Welcome to the AI Editor! I can help you modify your NFA document. You can ask me to make any changes you need - I\'ll apply them while maintaining the document structure and keeping it to one page.'
          }
        ]);
        
        setShowPreview(true);
        setActiveStep(3);
      } else {
        setError(response.data.error || "Failed to generate NFA");
      }
    } catch (err) {
      console.error("❌ API call failed:", err);
      setError(err.response?.data?.error || "Failed to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newFormData = { 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    };
    setFormData(newFormData);

    // Save to localStorage for persistence
    localStorage.setItem("nfaFormData", JSON.stringify(newFormData));

    // Clear validation error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleTableHeaderChange = (index, value) => {
    const newHeaders = [...formData.tableHeaders];
    newHeaders[index] = value;
    const newFormData = { ...formData, tableHeaders: newHeaders };
    setFormData(newFormData);
    localStorage.setItem("nfaFormData", JSON.stringify(newFormData));
  };

  const handleTableRowChange = (rowIndex, colIndex, value) => {
    const newRows = [...formData.tableRows];
    newRows[rowIndex][colIndex] = value;
    const newFormData = { ...formData, tableRows: newRows };
    setFormData(newFormData);
    localStorage.setItem("nfaFormData", JSON.stringify(newFormData));
  };

  const addTableRow = () => {
    const newRow = new Array(formData.tableHeaders.length).fill("");
    const newFormData = { 
      ...formData, 
      tableRows: [...formData.tableRows, newRow] 
    };
    setFormData(newFormData);
    localStorage.setItem("nfaFormData", JSON.stringify(newFormData));
  };

  const removeTableRow = (index) => {
    const newRows = formData.tableRows.filter((_, i) => i !== index);
    const newFormData = { ...formData, tableRows: newRows };
    setFormData(newFormData);
    localStorage.setItem("nfaFormData", JSON.stringify(newFormData));
  };

  const addTableColumn = () => {
    const newHeaders = [...formData.tableHeaders, `Column ${formData.tableHeaders.length + 1}`];
    const newRows = formData.tableRows.map(row => [...row, ""]);
    const newFormData = { ...formData, tableHeaders: newHeaders, tableRows: newRows };
    setFormData(newFormData);
    localStorage.setItem("nfaFormData", JSON.stringify(newFormData));
  };

  const removeTableColumn = (index) => {
    const newHeaders = formData.tableHeaders.filter((_, i) => i !== index);
    const newRows = formData.tableRows.map(row => row.filter((_, i) => i !== index));
    const newFormData = { ...formData, tableHeaders: newHeaders, tableRows: newRows };
    setFormData(newFormData);
    localStorage.setItem("nfaFormData", JSON.stringify(newFormData));
  };
  // Google Sheets Integration Functions
  const extractSheetIdFromUrl = (url) => {
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
  };

  const fetchGoogleSheetsData = async () => {
    if (!sheetsUrl.trim()) {
      setSheetsError("Please provide a Google Sheets URL");
      return;
    }

    const sheetId = extractSheetIdFromUrl(sheetsUrl);
    if (!sheetId) {
      setSheetsError("Invalid Google Sheets URL. Please provide a valid URL like: ://docs.google.com/spreadsheets/d/SHEET_ID/edit");
      return;
    }

    setSheetsLoading(true);
    setSheetsError("");

    try {
      // For public sheets, we can use the CSV export URL
      const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`;
      
      const response = await axios.get(csvUrl);
      
      // Parse CSV data
      const lines = response.data.split('\n');
      const data = lines.map(line => {
        // Simple CSV parsing - handles basic cases
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        result.push(current.trim());
        return result;
      }).filter(row => row.some(cell => cell.trim() !== ''));
      
      if (data.length > 0) {
        setSheetsData(data);
        setSheetsError("");
      } else {
        setSheetsError("No data found in the Google Sheet");
      }
    } catch (error) {
      console.error("Error fetching Google Sheets data:", error);
      setSheetsError("Failed to fetch data. Make sure the Google Sheet is published to the web (File > Share > Publish to web)");
    } finally {
      setSheetsLoading(false);
    }
  };

  const importSheetsDataToTable = () => {
    if (sheetsData.length === 0) {
      setSheetsError("No data to import");
      return;
    }

    // Use first row as headers, rest as data
    const headers = sheetsData[0] || [];
    const rows = sheetsData.slice(1) || [];

    const newFormData = {
      ...formData,
      tableHeaders: headers,
      tableRows: rows
    };

    setFormData(newFormData);
    localStorage.setItem("nfaFormData", JSON.stringify(newFormData));
    setImportDialogOpen(false);
    setSheetsError("");
  };

  // Excel File Upload Functions
  const handleExcelUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        // For .xlsx files, we need to parse them differently
        if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
          // For now, show a message to convert to CSV
          setSheetsError("Please save your Excel file as CSV format (.csv) and try again. Excel parsing will be enhanced in the next update.");
          return;
        }
        
        // Handle CSV files
        const text = e.target.result;
        const lines = text.split('\n');
        const data = lines.map(line => {
          // Enhanced CSV parsing
          const result = [];
          let current = '';
          let inQuotes = false;
          
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              result.push(current.trim().replace(/"/g, ''));
              current = '';
            } else {
              current += char;
            }
          }
          result.push(current.trim().replace(/"/g, ''));
          return result;
        }).filter(row => row.some(cell => cell.trim() !== ''));
        
        if (data.length > 0) {
          const headers = data[0] || [];
          const rows = data.slice(1) || [];
          
          const newFormData = {
            ...formData,
            tableHeaders: headers,
            tableRows: rows
          };

          setFormData(newFormData);
          localStorage.setItem("nfaFormData", JSON.stringify(newFormData));
          setImportDialogOpen(false);
          setSheetsError("");
        }
      } catch (error) {
        console.error("Error parsing file:", error);
        setSheetsError("Error parsing file. Please ensure it's a valid CSV format.");
      }
    };
    
    if (file.name.endsWith('.csv')) {
      reader.readAsText(file);
    } else {
      reader.readAsText(file); // Will show error message for non-CSV files
    }
  };

<<<<<<< HEAD
  const calculateTotalAmount = () => {
    try {
      if (!formData.tableRows || formData.tableRows.length === 0) {
        return '₹0';
      }
      
      // Find the last column index (assuming it's the total column)
      const totalColumnIndex = formData.tableHeaders.length - 1;
      
      // Calculate sum of all values in the total column
      let total = 0;
      formData.tableRows.forEach(row => {
        const value = row[totalColumnIndex];
        if (value && !isNaN(parseFloat(value))) {
          total += parseFloat(value);
        }
      });
      
      return `₹${total.toLocaleString('en-IN')}`;
    } catch (error) {
      console.error('Error calculating total amount:', error);
      return '₹0';
    }
  };

=======
>>>>>>> 01c2e338bf6394697bda0e18a8ef44375a469344
  const validateForm = () => {
    const newErrors = {};

    console.log("🔍 Validating form data:", formData);
    console.log("🔍 Subject:", formData.subject);
    console.log("🔍 Summary:", formData.summary);

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.summary.trim()) {
      newErrors.summary = "Summary is required";
    } else if (formData.summary.trim().length < 50) {
      newErrors.summary = "Summary should be at least 50 characters";
    }

    console.log("🔍 Validation errors:", newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    console.log("🔍 HandleSubmit called");
    console.log("🔍 Form data before validation:", formData);
    
    if (!validateForm()) {
      console.log("❌ Validation failed in handleSubmit, not proceeding");
      return;
    }

    console.log("✅ Validation passed in handleSubmit, proceeding with API call");
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Prepare table data as array of arrays (including headers as first row)
      const tableData = [
        formData.tableHeaders, // First row is headers
        ...formData.tableRows  // Rest are data rows
      ];

      const requestData = {
        subject: formData.subject,
        summary: formData.summary,
        bulletsRequired: formData.bulletsRequired,
        nfaType: formData.nfaType,
        proposalWordLimit: formData.proposalWordLimit,
        backgroundWordLimit: formData.backgroundWordLimit,
        recommendationWordLimit: formData.recommendationWordLimit,
        tableData: tableData
      };

      console.log("🔍 Sending request data:", requestData);
      console.log("🔍 Subject:", formData.subject);
      console.log("🔍 Summary:", formData.summary);

      const response = await axios.post("http://localhost:5000/api/generate-nfa", requestData);

      if (response.data.success) {
<<<<<<< HEAD
        setGeneratedContent(response.data.nfa_text || "NFA document generated successfully!");
        setEditedContent(response.data.nfa_text || "NFA document generated successfully!");
        setCurrentNfaContent(response.data.nfa_text || "NFA document generated successfully!");
        setDownloadLink(response.data.file);
=======
        setDownloadLink(response.data.file);
        setGeneratedContent(response.data.nfaText || "NFA document generated successfully!");
        setEditedContent(response.data.nfaText || "NFA document generated successfully!");
        setCurrentNfaContent(response.data.nfaText || "NFA document generated successfully!");
>>>>>>> 01c2e338bf6394697bda0e18a8ef44375a469344
        setSuccess("NFA document generated successfully!");
        setShowPreview(true);
        setActiveStep(3);
        
<<<<<<< HEAD
        // Add NFA to history
        const nfaHistoryData = {
          subject: formData.subject,
          type: formData.nfaType,
          status: 'pending',
          date: new Date().toISOString().split('T')[0],
          amount: calculateTotalAmount(),
          createdBy: 'Current User', // You can get this from user context
          description: formData.summary.substring(0, 100) + (formData.summary.length > 100 ? '...' : ''),
          filePath: response.data.file,
          nfaText: response.data.nfa_text
        };
        
        addNfaToHistory(nfaHistoryData);
        
=======
>>>>>>> 01c2e338bf6394697bda0e18a8ef44375a469344
        // Initialize AI Editor with welcome message
        setAiChatMessages([
          {
            id: 1,
            type: 'ai',
            message: 'Welcome to the AI Editor! I can help you modify your NFA document. You can ask me to make any changes you need - I\'ll apply them while maintaining the document structure and keeping it to one page.'
          }
        ]);
        
        // Refresh the history section
        if (onNfaGenerated) {
          onNfaGenerated();
        }
      } else {
        setError(response.data.error || "Failed to generate NFA");
      }
    } catch (err) {
      console.error("Error generating NFA:", err);
      setError(err.response?.data?.error || "Failed to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    console.log("🔍 HandleNext called for step:", activeStep);
    console.log("🔍 Current form data:", formData);
    
    if (activeStep === 0) {
      console.log("🔍 Validating Page 1 before proceeding to Page 2");
      if (validateForm()) {
        console.log("✅ Validation passed, proceeding to Page 2");
        setActiveStep(1);
      } else {
        console.log("❌ Validation failed, staying on Page 1");
      }
    } else if (activeStep === 1) {
      console.log("🔍 Moving from Page 2 to Page 3 and generating NFA with AI");
      setActiveStep(2);
      generateNfaWithAI(); // Call the corrected function
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleReset = () => {
    console.log("🔍 Resetting form data");
    setFormData({
      subject: "",
      summary: "",
      bulletsRequired: false,
      nfaType: "reimbursement",
      proposalBullets: 2,
      proposalAddHeader: true,
      proposalWordLimit: 150,
      backgroundBullets: 2,
      backgroundAddHeader: true,
      backgroundWordLimit: 150,
      recommendationBullets: 1,
      recommendationAddHeader: true,
      recommendationWordLimit: 100,
      tableHeaders: ["Item", "Quantity", "Unit Cost", "Total Cost"],
      tableRows: [["Laptops", "10", "₹50,000", "₹5,00,000"], ["Software Licenses", "10", "₹10,000", "₹1,00,000"]]
    });
<<<<<<< HEAD
    setError("");
    setSuccess("");
    setActiveStep(0);
    setDownloadLink("");
=======
    setDownloadLink("");
    setError("");
    setSuccess("");
    setActiveStep(0);
>>>>>>> 01c2e338bf6394697bda0e18a8ef44375a469344
    setErrors({});
    localStorage.removeItem("nfaFormData");
    setGeneratedContent("");
    setEditedContent("");
    setCurrentNfaContent("");
    setShowPreview(false);
    setShowAiEditor(false);
    setAiChatMessages([]);
    setAiInputText("");
    console.log("✅ Form reset complete");
  };

  const handleAiEdit = async () => {
    if (!aiInputText.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: aiInputText.trim(),
      timestamp: new Date().toLocaleTimeString()
    };
    
    // Add user message to chat
    setAiChatMessages(prev => [...prev, userMessage]);
    setAiLoading(true);
    setAiInputText("");
    
    try {
      const response = await axios.post("http://localhost:5000/api/edit-nfa", {
        text: currentNfaContent,
        prompt: aiInputText.trim(),
        subject: formData.subject,
        summary: formData.summary,
        nfaType: formData.nfaType,
        bulletsRequired: formData.bulletsRequired,
        tableData: [
          formData.tableHeaders,
          ...formData.tableRows
        ]
      });

      if (response.data.success) {
        const updatedContent = response.data.editedText;
        setEditedContent(updatedContent);
        setCurrentNfaContent(updatedContent);
        
        // Check if subject was changed and update form data
        const subjectMatch = updatedContent.match(/Subject:\s*([^\n]+)/i);
        if (subjectMatch && subjectMatch[1]) {
          const newSubject = subjectMatch[1].trim();
          if (newSubject !== formData.subject) {
            setFormData(prev => ({
              ...prev,
              subject: newSubject
            }));
            console.log("🔄 Subject updated from", formData.subject, "to", newSubject);
          }
        }
        
        // Add AI response to chat
        const aiMessage = {
          id: Date.now() + 1,
          type: 'ai',
          message: 'I\'ve updated your NFA document based on your request. The changes have been applied to the preview on the left.',
          timestamp: new Date().toLocaleTimeString()
        };
        
        setAiChatMessages(prev => [...prev, aiMessage]);
        setSuccess("AI edit applied successfully!");
      } else {
        const errorMessage = {
          id: Date.now() + 1,
          type: 'ai',
          message: `Sorry, I couldn't process your request: ${response.data.error || "Unknown error"}`,
          timestamp: new Date().toLocaleTimeString(),
          isError: true
        };
        
        setAiChatMessages(prev => [...prev, errorMessage]);
        setError(response.data.error || "Failed to apply AI edit");
      }
    } catch (error) {
      console.error("Error in AI edit:", error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        message: "Sorry, I encountered an error while processing your request. Please try again.",
        timestamp: new Date().toLocaleTimeString(),
        isError: true
      };
      
      setAiChatMessages(prev => [...prev, errorMessage]);
      setError("Failed to apply AI edit");
    } finally {
      setAiLoading(false);
    }
  };

<<<<<<< HEAD
  // Handle NFA download using Python script
  const handleDownloadNFA = async () => {
    try {
      console.log("📥 Download NFA button clicked - using Python script");
      console.log("🔍 Current state:", {
        editedContent: editedContent ? editedContent.substring(0, 100) + "..." : "null",
        generatedContent: generatedContent ? generatedContent.substring(0, 100) + "..." : "null",
        formData: {
          subject: formData.subject,
          summary: formData.summary,
          nfaType: formData.nfaType,
          tableHeaders: formData.tableHeaders,
          tableRows: formData.tableRows
        }
      });
      
      setLoading(true);
      setError(""); // Clear any previous errors
      
      const content = editedContent || generatedContent;
      if (!content) {
        console.error("❌ No content available for download");
        throw new Error("No content available for download. Please generate an NFA first.");
      }
      
      // Prepare table data for Python script
      const tableData = formData.tableHeaders && formData.tableHeaders.length > 0 
        ? [formData.tableHeaders, ...formData.tableRows]
        : [];
      
      const requestData = {
        editedText: content,
        subject: formData.subject || "NFA Request",
        summary: formData.summary || "NFA Request Summary",
        nfaType: formData.nfaType || "reimbursement",
        tableData: tableData
      };
      
      console.log("📤 Sending request to Python script:", {
        ...requestData,
        editedText: requestData.editedText.substring(0, 200) + "..."
      });
      
      // Check if backend server is running
      try {
        const healthCheck = await fetch('http://localhost:5000/api/health', {
          method: 'GET',
          timeout: 5000
        });
        console.log("✅ Backend server is running");
      } catch (healthError) {
        console.warn("⚠️ Backend health check failed:", healthError);
      }
      
      const response = await fetch('http://localhost:5000/api/download-edited-nfa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      console.log("📡 Response status:", response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ HTTP error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log("📥 Python script response:", result);
      
             if (result.success) {
               // Download the generated file
               if (result.filePath && result.fileName) {
                 console.log("✅ File generated successfully, starting download...");
                 console.log("📁 File path:", result.filePath);
                 console.log("📄 File name:", result.fileName);
                 await downloadFile(result.filePath, result.fileName);
               } else if (result.file_path && result.file_name) {
                 // Handle alternative field names from Python script
                 console.log("✅ File generated successfully (alt fields), starting download...");
                 console.log("📁 File path:", result.file_path);
                 console.log("📄 File name:", result.file_name);
                 await downloadFile(result.file_path, result.file_name);
               } else {
                 console.error("❌ No file path returned from server:", result);
                 console.error("❌ Available properties:", Object.keys(result));
                 throw new Error(`No file path returned from server. Response: ${JSON.stringify(result)}`);
               }
      } else {
        console.error("❌ Python script failed:", result.error);
        throw new Error(result.error || "Python script failed to generate DOCX");
      }
      
    } catch (error) {
      console.error("❌ Download error:", error);
      console.error("❌ Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      setError(`Failed to download NFA document: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced download function with multiple fallback methods
  const downloadFile = async (filePath, fileName = null) => {
    try {
      const downloadUrl = `http://localhost:5000${filePath}`;
      console.log("🔗 Download URL:", downloadUrl);
      console.log("📄 Original filename:", fileName);
      
      // Ensure fileName has .docx extension
      const finalFileName = fileName && fileName.endsWith('.docx') 
        ? fileName 
        : `${fileName || `NFA_${formData.subject.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}`}.docx`;
      
      console.log("📄 Final filename:", finalFileName);
      
      // Method 1: Try fetch and blob download with proper MIME type
      try {
        console.log("🔄 Method 1: Fetching file from server...");
        const response = await fetch(downloadUrl);
        console.log("📡 File fetch response status:", response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Get the blob and ensure it's treated as a DOCX file
        const blob = await response.blob();
        console.log("📦 Blob received, size:", blob.size, "type:", blob.type);
        
        if (blob.size === 0) {
          throw new Error("Downloaded file is empty");
        }
        
        // Create a new blob with the correct MIME type for DOCX
        const docxBlob = new Blob([blob], { 
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
        });
        
        // Create download URL
        const url = window.URL.createObjectURL(docxBlob);
        console.log("🔗 Created blob URL:", url);
        
        // Create download link
        const link = document.createElement('a');
        link.href = url;
        link.download = finalFileName;
        link.style.display = 'none';
        
        // Add to DOM, click, and remove
        document.body.appendChild(link);
        console.log("🖱️ Triggering download...");
        link.click();
        document.body.removeChild(link);
        
        // Clean up the blob URL
        window.URL.revokeObjectURL(url);
        
        console.log("✅ DOCX file downloaded successfully");
        setSuccess("NFA document downloaded successfully as DOCX!");
        return;
      } catch (fetchError) {
        console.warn("⚠️ Method 1 failed, trying Method 2:", fetchError);
      }
      
      // Method 2: Try direct link download as fallback
      try {
        console.log("🔄 Method 2: Direct link download...");
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = finalFileName;
        link.target = '_blank';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log("✅ Direct download initiated");
        setSuccess("NFA document download initiated!");
        return;
      } catch (directError) {
        console.warn("⚠️ Method 2 failed, trying Method 3:", directError);
      }
      
      // Method 3: Try window.open as last resort
      try {
        console.log("🔄 Method 3: Window.open download...");
        window.open(downloadUrl, '_blank');
        console.log("✅ Window.open download initiated");
        setSuccess("NFA document opened in new tab for download!");
        return;
      } catch (windowError) {
        console.error("❌ All download methods failed:", windowError);
        throw new Error("All download methods failed. Please try right-clicking the link and saving the file.");
      }
      
    } catch (error) {
      console.error("❌ Download file error:", error);
      setError(`Download failed: ${error.message}. Please try right-clicking the link and saving manually.`);
      throw error;
    }
  };




=======
  const handleDownloadEdited = async () => {
    try {
      console.log("🔄 Starting download request...", {
        editedTextLength: currentNfaContent?.length,
        subject: formData.subject,
        summary: formData.summary,
        nfaType: formData.nfaType
      });

      // Prepare table data as array of arrays (including headers as first row)
      const tableData = [
        formData.tableHeaders, // First row is headers
        ...formData.tableRows  // Rest are data rows
      ];

      const response = await axios.post("http://localhost:5000/api/download-edited-nfa", {
        editedText: currentNfaContent,
        subject: formData.subject,
        summary: formData.summary,
        nfaType: formData.nfaType,
        tableData: tableData
      });

      console.log("📥 Download response:", response.data);

      if (response.data.success) {
        // Download the edited document
        const link = document.createElement('a');
        link.href = `http://localhost:5000${response.data.file}`;
        link.download = response.data.fileName || 'edited-nfa.docx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setSuccess("Edited NFA document downloaded successfully!");
        console.log("✅ Download completed successfully");
      } else {
        console.error("❌ Download failed:", response.data.error);
        setError(response.data.error || "Failed to download edited document");
      }
    } catch (error) {
      console.error("❌ Error downloading edited document:", error);
      console.error("❌ Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setError(`Failed to download edited document: ${error.response?.data?.error || error.message}`);
    }
  };

>>>>>>> 01c2e338bf6394697bda0e18a8ef44375a469344
  const handleSuggestionClick = (suggestion) => {
    setAiInputText(suggestion);
  };

<<<<<<< HEAD

=======
>>>>>>> 01c2e338bf6394697bda0e18a8ef44375a469344
  return (
    <Container maxWidth="lg">
      {/* Stepper */}
      <Box sx={{ mb: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      {/* Form Content */}
      <Paper sx={{ p: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
        {activeStep === 0 && (
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", color: "#1976d2", mb: 3 }}>
              NFA Details
            </Typography>

            <TextField
              fullWidth
              label="Subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              margin="normal"
              error={!!errors.subject}
              helperText={errors.subject}
              placeholder="Enter the subject of the NFA (e.g., Approval for Procurement of Office Equipment)"
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Summary"
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={4}
              error={!!errors.summary}
              helperText={errors.summary || "Provide a detailed summary of your project. This will be used by AI to generate the proposal and background content for your NFA document (minimum 50 characters)"}
              placeholder="Describe your project details, objectives, current situation, challenges, and why this approval is needed. AI will use this to generate professional proposal and background content..."
              sx={{ mb: 3 }}
            />

            <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold", color: "#1976d2" }}>
                  Bullets Required
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <input
                    type="checkbox"
                    id="bulletsRequired"
                    name="bulletsRequired"
                    checked={formData.bulletsRequired}
                    onChange={handleChange}
                    style={{ marginRight: "8px", transform: "scale(1.2)" }}
                  />
                  <label htmlFor="bulletsRequired" style={{ fontSize: "0.875rem", color: "#666" }}>
                    Include bullet points in the NFA content
                  </label>
                </Box>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold", color: "#1976d2" }}>
                  NFA Type
                </Typography>
                <select
                  name="nfaType"
                  value={formData.nfaType}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    fontSize: "0.875rem",
                    backgroundColor: "white"
                  }}
                >
                  <option value="reimbursement">Reimbursement</option>
                  <option value="advance">Advance</option>
                </select>
              </Box>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3, mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1976d2" }}>
                AI Content Settings
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Settings />}
                onClick={() => setSettingsOpen(true)}
                sx={{
                  borderRadius: "20px",
                  borderColor: "#1976d2",
                  color: "#1976d2",
                  "&:hover": {
                    borderColor: "#1565c0",
                    backgroundColor: "rgba(25, 118, 210, 0.04)"
                  }
                }}
              >
                Configure AI Settings
              </Button>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={loading}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: "25px",
                  background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 25px rgba(25, 118, 210, 0.3)"
                  },
                  transition: "all 0.3s ease"
                }}
              >
                Configure Financial Table
                <Add sx={{ ml: 1 }} />
              </Button>
            </Box>
          </Box>
        )}

        {activeStep === 1 && (
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", color: "#1976d2", mb: 3 }}>
              Financial/Resource Implications Table
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Configure your financial impact table. This will be included in the "Financial/Resource Implications" section of your NFA. 
              You can add/remove rows and columns as needed to detail all costs and resources.
            </Typography>

            {/* Table Controls */}
            <Box sx={{ 
              mb: 3, 
              display: "flex", 
              gap: 2, 
              flexWrap: "wrap",
              p: 2,
              backgroundColor: "#f8f9fa",
              borderRadius: 2,
              border: "1px solid #e0e0e0"
            }}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={addTableRow}
                sx={{ 
                  borderRadius: "25px",
                  background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                  "&:hover": {
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)"
                  },
                  transition: "all 0.3s ease"
                }}
              >
                Add Row
              </Button>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={addTableColumn}
                sx={{ 
                  borderRadius: "25px",
                  background: "linear-gradient(135deg, #4caf50 0%, #45a049 100%)",
                  "&:hover": {
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)"
                  },
                  transition: "all 0.3s ease"
                }}
              >
                Add Column
              </Button>
              <Button
                variant="outlined"
                startIcon={<CloudUpload />}
                onClick={() => setImportDialogOpen(true)}
                sx={{ 
                  borderRadius: "25px",
                  borderColor: "#ff9800",
                  color: "#ff9800",
                  "&:hover": {
                    borderColor: "#f57c00",
                    backgroundColor: "rgba(255, 152, 0, 0.04)",
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 12px rgba(255, 152, 0, 0.3)"
                  },
                  transition: "all 0.3s ease"
                }}
              >
                Import Data
              </Button>
            </Box>

            {/* Table */}
            <TableContainer 
              component={Paper} 
              sx={{ 
                mb: 3,
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                border: "1px solid #e0e0e0",
                overflow: "hidden"
              }}
            >
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#1976d2" }}>
                    {formData.tableHeaders.map((header, index) => (
                      <TableCell 
                        key={index} 
                        sx={{ 
                          fontWeight: "bold", 
                          backgroundColor: "#1976d2",
                          color: "white",
                          borderRight: index < formData.tableHeaders.length - 1 ? "1px solid rgba(255,255,255,0.2)" : "none",
                          position: "relative"
                        }}
                      >
                        <TextField
                          value={header}
                          onChange={(e) => handleTableHeaderChange(index, e.target.value)}
                          variant="standard"
                          size="small"
                          sx={{ 
                            minWidth: 120,
                            "& .MuiInputBase-root": {
                              color: "white",
                              "&:before": { borderColor: "rgba(255,255,255,0.3)" },
                              "&:after": { borderColor: "white" },
                              "&:hover:before": { borderColor: "rgba(255,255,255,0.5)" }
                            },
                            "& .MuiInputBase-input": {
                              color: "white",
                              fontWeight: "bold",
                              fontSize: "0.95rem"
                            }
                          }}
                          placeholder="Header"
                        />
                        <IconButton
                          size="small"
                          onClick={() => removeTableColumn(index)}
                          sx={{ 
                            ml: 1,
                            color: "white",
                            "&:hover": {
                              backgroundColor: "rgba(255,255,255,0.1)",
                              transform: "scale(1.1)"
                            },
                            transition: "all 0.2s ease"
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    ))}
                    <TableCell 
                      sx={{ 
                        backgroundColor: "#1976d2",
                        color: "white",
                        fontWeight: "bold",
                        textAlign: "center",
                        minWidth: 60
                      }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formData.tableRows.map((row, rowIndex) => (
                    <TableRow 
                      key={rowIndex}
                      sx={{ 
                        "&:nth-of-type(odd)": { backgroundColor: "#fafafa" },
                        "&:hover": { 
                          backgroundColor: "#f0f8ff",
                          transform: "scale(1.001)",
                          transition: "all 0.2s ease"
                        }
                      }}
                    >
                      {row.map((cell, colIndex) => (
                        <TableCell 
                          key={colIndex}
                          sx={{ 
                            borderRight: colIndex < row.length - 1 ? "1px solid #e0e0e0" : "none",
                            padding: "8px 12px"
                          }}
                        >
                          <TextField
                            value={cell}
                            onChange={(e) => handleTableRowChange(rowIndex, colIndex, e.target.value)}
                            variant="outlined"
                            size="small"
                            sx={{ 
                              minWidth: 120,
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                                "&:hover": {
                                  "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#1976d2"
                                  }
                                },
                                "&.Mui-focused": {
                                  "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#1976d2",
                                    borderWidth: 2
                                  }
                                }
                              },
                              "& .MuiInputBase-input": {
                                padding: "8px 12px",
                                fontSize: "0.9rem"
                              }
                            }}
                            placeholder={`Enter ${formData.tableHeaders[colIndex] || 'value'}`}
                          />
                        </TableCell>
                      ))}
                      <TableCell sx={{ textAlign: "center", padding: "8px" }}>
                        <IconButton
                          size="small"
                          onClick={() => removeTableRow(rowIndex)}
                          sx={{ 
                            color: "#d32f2f",
                            "&:hover": {
                              backgroundColor: "rgba(211, 47, 47, 0.1)",
                              transform: "scale(1.1)"
                            },
                            transition: "all 0.2s ease"
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                variant="outlined"
                onClick={handleBack}
                sx={{ borderRadius: "20px" }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={loading}
                startIcon={<AssignmentIcon />}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: "25px",
                  background: "linear-gradient(135deg, #4caf50 0%, #45a049 100%)",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 25px rgba(76, 175, 80, 0.3)"
                  },
                  transition: "all 0.3s ease"
                }}
              >
                Generate NFA with AI
                <Send sx={{ ml: 1 }} />
              </Button>
            </Box>
          </Box>
        )}

        {activeStep === 2 && (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <CircularProgress size={60} sx={{ color: "#1976d2", mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Generating Your NFA Document with AI
            </Typography>
            <Typography color="text.secondary">
              AI is generating professional proposal and background content, creating your complete Note for Approval document...
            </Typography>
          </Box>
        )}

        {activeStep === 3 && showPreview && (
          <Box sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ textAlign: "center", fontWeight: "bold", color: "#1976d2", mb: 3 }}>
              NFA Document Preview
            </Typography>
            
            {/* Preview Content */}
<<<<<<< HEAD
            <Box sx={{ mb: 3 }}>
              <NfaPreview 
                content={editedContent || generatedContent}
                tableData={[
                  formData.tableHeaders,
                  ...formData.tableRows
                ]}
              />
            </Box>
=======
            <Paper sx={{ p: 3, mb: 3, minHeight: "400px", backgroundColor: "#fafafa" }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                Preview of Generated NFA Document
              </Typography>
              <Box sx={{ 
                backgroundColor: "white", 
                p: 3, 
                borderRadius: 2, 
                border: "1px solid #e0e0e0",
                fontFamily: "Arial, sans-serif",
                whiteSpace: "pre-wrap",
                maxHeight: "500px",
                overflowY: "auto",
                lineHeight: 1.6,
                textAlign: "justify"
              }}>
                {formatNfaContent(editedContent || generatedContent)}
              </Box>
            </Paper>
>>>>>>> 01c2e338bf6394697bda0e18a8ef44375a469344

            {/* Action Buttons */}
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
              <Button
                variant="contained"
                color="success"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Download />}
                onClick={handleDownloadNFA}
                disabled={loading}
                sx={{ 
                  borderRadius: "20px", 
                  px: 3,
                  background: "linear-gradient(135deg, #4caf50 0%, #45a049 100%)",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 25px rgba(76, 175, 80, 0.3)"
                  },
                  "&:disabled": {
                    background: "#ccc",
                    transform: "none"
                  },
                  transition: "all 0.3s ease"
                }}
              >
                {loading ? "Generating..." : "Download NFA"}
              </Button>

              <Button
                variant="contained"
                color="primary"
                startIcon={<Edit />}
                onClick={() => setShowAiEditor(true)}
                sx={{ borderRadius: "20px", px: 3 }}
              >
                AI Editor
              </Button>

              <Button
                variant="outlined"
                color="secondary"
                startIcon={<Add />}
                onClick={handleReset}
                sx={{ borderRadius: "20px", px: 3 }}
              >
                Create Another NFA
              </Button>
<<<<<<< HEAD

=======
>>>>>>> 01c2e338bf6394697bda0e18a8ef44375a469344
            </Box>
          </Box>
        )}

        {/* AI Editor */}
        {showAiEditor && (
          <Box sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ textAlign: "center", fontWeight: "bold", color: "#1976d2", mb: 3 }}>
              AI Editor
            </Typography>
            
            <Box sx={{ display: "flex", gap: 3, height: "75vh", minHeight: "650px" }}>
              {/* Left Side - NFA Preview */}
              <Box sx={{ flex: 1.2 }}>
                <Paper sx={{ p: 3, height: "100%", backgroundColor: "#fafafa", display: "flex", flexDirection: "column", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", mb: 2, color: "#1976d2", display: "flex", alignItems: "center", gap: 1 }}>
                    📄 Live Preview
                    <Box sx={{ 
                      backgroundColor: "#4caf50", 
                      color: "white", 
                      px: 1, 
                      py: 0.5, 
                      borderRadius: 1, 
                      fontSize: "0.7rem",
                      fontWeight: "bold"
                    }}>
                      LIVE
                    </Box>
                  </Typography>
                  <Box sx={{ 
                    backgroundColor: "white", 
                    p: 3, 
                    borderRadius: 2, 
                    border: "2px solid #e0e0e0",
                    fontFamily: "Arial, sans-serif",
                    whiteSpace: "pre-wrap",
                    flex: 1,
                    overflowY: "auto",
                    fontSize: "0.9rem",
                    lineHeight: 1.6,
                    textAlign: "justify",
                    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)"
                  }}>
                    {formatNfaContent(currentNfaContent || editedContent)}
                  </Box>
                </Paper>
              </Box>

              {/* Right Side - AI Chatbox */}
              <Box sx={{ flex: 1 }}>
                <Paper sx={{ p: 3, height: "100%", backgroundColor: "#fafafa", display: "flex", flexDirection: "column", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", mb: 2, color: "#1976d2", display: "flex", alignItems: "center", gap: 1 }}>
                    🤖 AI Chatbox
                    <Box sx={{ 
                      backgroundColor: "#ff9800", 
                      color: "white", 
                      px: 1, 
                      py: 0.5, 
                      borderRadius: 1, 
                      fontSize: "0.7rem",
                      fontWeight: "bold"
                    }}>
                      SMART
                    </Box>
                  </Typography>
                  
                  {/* Chat Messages */}
                  <Box sx={{ 
                    flex: 1, 
                    backgroundColor: "white", 
                    borderRadius: 2, 
                    border: "1px solid #e0e0e0",
                    p: 2,
                    mb: 2,
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2
                  }}>
                    {aiChatMessages.map((message) => (
                      <Box key={message.id} sx={{ 
                        display: "flex", 
                        flexDirection: "column",
                        alignItems: message.type === 'user' ? 'flex-end' : 'flex-start'
                      }}>
                        <Box sx={{
                          maxWidth: "85%",
                          p: 2,
                          borderRadius: 2,
                          backgroundColor: message.type === 'user' ? "#1976d2" : message.isError ? "#ffebee" : "#f5f5f5",
                          color: message.type === 'user' ? "white" : message.isError ? "#d32f2f" : "black",
                          fontSize: "0.9rem",
                          lineHeight: 1.5,
                          wordWrap: "break-word"
                        }}>
                          {message.message}
                        </Box>
                        <Typography variant="caption" sx={{ 
                          color: "text.secondary", 
                          mt: 0.5,
                          fontSize: "0.7rem"
                        }}>
                          {message.timestamp}
                        </Typography>
                      </Box>
                    ))}
                    
                    {aiLoading && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, p: 2 }}>
                        <CircularProgress size={16} />
                        <Typography variant="body2" color="text.secondary">
                          AI is processing your request...
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  {/* Input Area */}
                  <Box sx={{ display: "flex", gap: 2, alignItems: "flex-end" }}>
                    <TextField
                      fullWidth
                      placeholder="Ask AI to modify your NFA document... (Ctrl+Enter to send)"
                      variant="outlined"
                      size="small"
                      multiline
                      rows={3}
                      value={aiInputText}
                      onChange={(e) => setAiInputText(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.ctrlKey) {
                          handleAiEdit();
                        }
                      }}
                      disabled={aiLoading}
                      sx={{ 
                        flex: 1,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          backgroundColor: "white",
                          "&:hover": {
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#1976d2"
                            }
                          },
                          "&.Mui-focused": {
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#1976d2",
                              borderWidth: 2
                            }
                          }
                        }
                      }}
                    />
                    <Button
                      variant="contained"
                      onClick={handleAiEdit}
                      disabled={aiLoading || !aiInputText.trim()}
                      sx={{ 
                        alignSelf: "flex-end",
                        borderRadius: 2,
                        minWidth: "auto",
                        px: 3,
                        py: 1.5,
                        backgroundColor: "#1976d2",
                        "&:hover": {
                          backgroundColor: "#1565c0"
                        },
                        "&:disabled": {
                          backgroundColor: "#e0e0e0",
                          color: "#9e9e9e"
                        }
                      }}
                    >
                      <Send />
                    </Button>
                  </Box>
                </Paper>
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: "flex", gap: 3, justifyContent: "center", mt: 4 }}>
              <Button
                variant="contained"
                color="success"
<<<<<<< HEAD
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Download />}
                onClick={handleDownloadNFA}
                disabled={loading}
=======
                startIcon={<Download />}
                onClick={handleDownloadEdited}
>>>>>>> 01c2e338bf6394697bda0e18a8ef44375a469344
                sx={{ 
                  borderRadius: "25px", 
                  px: 4, 
                  py: 1.5,
                  fontSize: "1rem",
                  fontWeight: "bold",
                  boxShadow: "0 4px 15px rgba(76, 175, 80, 0.3)",
                  "&:hover": {
                    boxShadow: "0 6px 20px rgba(76, 175, 80, 0.4)",
                    transform: "translateY(-2px)"
                  },
                  transition: "all 0.3s ease"
                }}
              >
                📥 Download Updated NFA (DOCX)
              </Button>

              <Button
                variant="outlined"
                onClick={() => setShowAiEditor(false)}
                sx={{ 
                  borderRadius: "25px", 
                  px: 4, 
                  py: 1.5,
                  fontSize: "1rem",
                  fontWeight: "bold",
                  borderColor: "#1976d2",
                  color: "#1976d2",
                  "&:hover": {
                    backgroundColor: "#1976d2",
                    color: "white",
                    transform: "translateY(-2px)"
                  },
                  transition: "all 0.3s ease"
                }}
              >
                ← Back to Preview
              </Button>
            </Box>
          </Box>
        )}
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {/* Success Alert */}
      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {success}
        </Alert>
      )}

      {/* Settings Dialog */}
      <Dialog 
        open={settingsOpen} 
        onClose={() => setSettingsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          backgroundColor: "#1976d2", 
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <Typography variant="h6">AI Content Configuration</Typography>
          <IconButton onClick={() => setSettingsOpen(false)} sx={{ color: "white" }}>
            <Delete />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Configure bullet points, headers, and word limits for AI-generated content. These settings will be saved for future use.
          </Typography>

          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 3 }}>
            {/* Proposal Section */}
            <Paper sx={{ p: 3, border: "1px solid #e0e0e0", borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: "#1976d2", mb: 2 }}>
                Proposal Section
              </Typography>
              
              <TextField
                fullWidth
                label="Number of Bullet Points"
                name="proposalBullets"
                type="number"
                value={formData.proposalBullets}
                onChange={handleChange}
                size="small"
                sx={{ mb: 2 }}
                inputProps={{ min: 0, max: 5 }}
                helperText="Number of bullet points to include"
              />

              <TextField
                fullWidth
                label="Word Limit"
                name="proposalWordLimit"
                type="number"
                value={formData.proposalWordLimit}
                onChange={handleChange}
                size="small"
                sx={{ mb: 2 }}
                inputProps={{ min: 50, max: 500 }}
                helperText="Maximum number of words for proposal content"
              />

              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <input
                  type="checkbox"
                  id="proposalAddHeader"
                  name="proposalAddHeader"
                  checked={formData.proposalAddHeader}
                  onChange={(e) => handleChange({ target: { name: "proposalAddHeader", value: e.target.checked } })}
                  style={{ marginRight: "8px" }}
                />
                <label htmlFor="proposalAddHeader" style={{ fontSize: "0.875rem" }}>
                  Add header for bullet points
                </label>
              </Box>
            </Paper>

            {/* Background Section */}
            <Paper sx={{ p: 3, border: "1px solid #e0e0e0", borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: "#1976d2", mb: 2 }}>
                Background Section
              </Typography>
              
              <TextField
                fullWidth
                label="Number of Bullet Points"
                name="backgroundBullets"
                type="number"
                value={formData.backgroundBullets}
                onChange={handleChange}
                size="small"
                sx={{ mb: 2 }}
                inputProps={{ min: 0, max: 5 }}
                helperText="Number of bullet points to include"
              />

              <TextField
                fullWidth
                label="Word Limit"
                name="backgroundWordLimit"
                type="number"
                value={formData.backgroundWordLimit}
                onChange={handleChange}
                size="small"
                sx={{ mb: 2 }}
                inputProps={{ min: 50, max: 500 }}
                helperText="Maximum number of words for background content"
              />

              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <input
                  type="checkbox"
                  id="backgroundAddHeader"
                  name="backgroundAddHeader"
                  checked={formData.backgroundAddHeader}
                  onChange={(e) => handleChange({ target: { name: "backgroundAddHeader", value: e.target.checked } })}
                  style={{ marginRight: "8px" }}
                />
                <label htmlFor="backgroundAddHeader" style={{ fontSize: "0.875rem" }}>
                  Add header for bullet points
                </label>
              </Box>
            </Paper>

            {/* Recommendation Section */}
            <Paper sx={{ p: 3, border: "1px solid #e0e0e0", borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: "#1976d2", mb: 2 }}>
                Recommendation Section
              </Typography>
              
              <TextField
                fullWidth
                label="Number of Bullet Points"
                name="recommendationBullets"
                type="number"
                value={formData.recommendationBullets}
                onChange={handleChange}
                size="small"
                sx={{ mb: 2 }}
                inputProps={{ min: 0, max: 3 }}
                helperText="Number of bullet points to include"
              />

              <TextField
                fullWidth
                label="Word Limit"
                name="recommendationWordLimit"
                type="number"
                value={formData.recommendationWordLimit}
                onChange={handleChange}
                size="small"
                sx={{ mb: 2 }}
                inputProps={{ min: 30, max: 300 }}
                helperText="Maximum number of words for recommendation content"
              />

              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <input
                  type="checkbox"
                  id="recommendationAddHeader"
                  name="recommendationAddHeader"
                  checked={formData.recommendationAddHeader}
                  onChange={(e) => handleChange({ target: { name: "recommendationAddHeader", value: e.target.checked } })}
                  style={{ marginRight: "8px" }}
                />
                <label htmlFor="recommendationAddHeader" style={{ fontSize: "0.875rem" }}>
                  Add header for bullet points
                </label>
              </Box>
            </Paper>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setSettingsOpen(false)}
            variant="outlined"
            sx={{ borderRadius: "20px" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Import Data Dialog */}
      <Dialog 
        open={importDialogOpen} 
        onClose={() => setImportDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          backgroundColor: "#ff9800", 
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <Typography variant="h6">Import Table Data</Typography>
          <IconButton onClick={() => setImportDialogOpen(false)} sx={{ color: "white" }}>
            <Delete />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Tabs value={importTab} onChange={(e, newValue) => setImportTab(newValue)} sx={{ mb: 3 }}>
            <Tab label="Google Sheets" icon={<CloudUpload />} />
            <Tab label="Excel/CSV File" icon={<FileUpload />} />
          </Tabs>

          {importTab === 0 && (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Import data directly from Google Sheets. Just paste the Google Sheets URL and we'll fetch the data automatically.
              </Typography>

              <TextField
                fullWidth
                label="Google Sheets URL"
                value={sheetsUrl}
                onChange={(e) => setSheetsUrl(e.target.value)}
                margin="normal"
                helperText="Paste your Google Sheets URL here. Make sure the sheet is published to the web (File > Share > Publish to web)"
                placeholder="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit"
              />

              <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                <Button
                  variant="contained"
                  onClick={fetchGoogleSheetsData}
                  disabled={sheetsLoading || !sheetsUrl.trim()}
                  startIcon={sheetsLoading ? <CircularProgress size={20} /> : <CloudUpload />}
                  sx={{ borderRadius: "20px" }}
                >
                  {sheetsLoading ? "Fetching..." : "Fetch Data"}
                </Button>
                
                {sheetsData.length > 0 && (
                  <Button
                    variant="contained"
                    color="success"
                    onClick={importSheetsDataToTable}
                    sx={{ borderRadius: "20px" }}
                  >
                    Import to Table
                  </Button>
                )}
              </Box>

              {sheetsError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {sheetsError}
                </Alert>
              )}

              {sheetsData.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "bold" }}>
                    Preview Data ({sheetsData.length} rows):
                  </Typography>
                  <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          {sheetsData[0]?.map((header, index) => (
                            <TableCell key={index} sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}>
                              {header}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {sheetsData.slice(0, 5).map((row, rowIndex) => (
                          <TableRow key={rowIndex}>
                            {row.map((cell, colIndex) => (
                              <TableCell key={colIndex}>{cell}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {sheetsData.length > 5 && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                      Showing first 5 rows of {sheetsData.length} total rows
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          )}

          {importTab === 1 && (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Upload a CSV file (.csv) to import table data. The first row should contain headers.
                For Excel files (.xlsx), please save as CSV format first.
              </Typography>

              <Box sx={{ 
                border: "2px dashed #ccc", 
                borderRadius: 2, 
                p: 4, 
                textAlign: "center",
                backgroundColor: "#fafafa"
              }}>
                <FileUpload sx={{ fontSize: "3rem", color: "#666", mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Choose CSV File
                </Typography>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleExcelUpload}
                  style={{ display: "none" }}
                  id="csv-upload"
                />
                <label htmlFor="csv-upload">
                  <Button
                    variant="contained"
                    component="span"
                    startIcon={<FileUpload />}
                    sx={{ borderRadius: "20px" }}
                  >
                    Select CSV File
                  </Button>
                </label>
                <Typography variant="caption" display="block" sx={{ mt: 2, color: "#666" }}>
                  Supported format: .csv (For Excel files, save as CSV first)
                </Typography>
              </Box>

              {sheetsError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {sheetsError}
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setImportDialogOpen(false)}
            variant="outlined"
            sx={{ borderRadius: "20px" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default NfaAutomationForm;