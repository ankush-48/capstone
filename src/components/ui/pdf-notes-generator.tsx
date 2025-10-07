import React from 'react';
import { CourseContent } from '@/entities/coursecontent';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';

interface PDFNotesGeneratorProps {
  content: CourseContent;
  courseName?: string;
  onDownload?: () => void;
}

export function PDFNotesGenerator({ content, courseName, onDownload }: PDFNotesGeneratorProps) {
  const generatePDFNotes = () => {
    try {
      // Parse content data
      const learningObjectives = content.learningObjectives ? JSON.parse(content.learningObjectives) : [];
      const keyTakeaways = content.keyTakeaways ? JSON.parse(content.keyTakeaways) : [];
      const interactiveElements = content.interactiveElements ? JSON.parse(content.interactiveElements) : [];

      // Create HTML content for PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>${content.title || 'Module Notes'}</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 40px 20px;
            }
            .header {
              text-align: center;
              border-bottom: 3px solid #64FFDA;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .course-name {
              color: #666;
              font-size: 14px;
              margin-bottom: 10px;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .module-title {
              color: #1a1a1a;
              font-size: 28px;
              font-weight: bold;
              margin: 0;
            }
            .module-description {
              color: #666;
              font-size: 16px;
              margin-top: 10px;
              font-style: italic;
            }
            .section {
              margin: 30px 0;
              page-break-inside: avoid;
            }
            .section-title {
              color: #64FFDA;
              font-size: 20px;
              font-weight: bold;
              margin-bottom: 15px;
              padding-bottom: 5px;
              border-bottom: 2px solid #64FFDA;
            }
            .objectives-list, .takeaways-list {
              list-style: none;
              padding: 0;
            }
            .objectives-list li, .takeaways-list li {
              background: #f8f9fa;
              margin: 10px 0;
              padding: 15px;
              border-left: 4px solid #64FFDA;
              border-radius: 4px;
            }
            .objectives-list li:before {
              content: "✓ ";
              color: #64FFDA;
              font-weight: bold;
              margin-right: 8px;
            }
            .takeaways-list li:before {
              content: "💡 ";
              margin-right: 8px;
            }
            .interactive-element {
              background: #f0f9ff;
              border: 1px solid #64FFDA;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
              page-break-inside: avoid;
            }
            .element-title {
              color: #1a1a1a;
              font-weight: bold;
              font-size: 16px;
              margin-bottom: 10px;
            }
            .element-type {
              background: #64FFDA;
              color: white;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 12px;
              text-transform: uppercase;
              display: inline-block;
              margin-bottom: 10px;
            }
            .content-text {
              line-height: 1.8;
              margin: 20px 0;
            }
            .content-text h3 {
              color: #64FFDA;
              font-size: 18px;
              margin: 25px 0 15px 0;
            }
            .content-text p {
              margin: 15px 0;
              text-align: justify;
            }
            .footer {
              margin-top: 50px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              text-align: center;
              color: #666;
              font-size: 12px;
            }
            .notes-section {
              margin-top: 40px;
              padding: 20px;
              background: #f8f9fa;
              border-radius: 8px;
            }
            .notes-title {
              color: #1a1a1a;
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 15px;
            }
            .notes-lines {
              border-bottom: 1px solid #ddd;
              height: 25px;
              margin: 10px 0;
            }
            @media print {
              body { margin: 0; padding: 20px; }
              .section { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            ${courseName ? `<div class="course-name">${courseName}</div>` : ''}
            <h1 class="module-title">${content.title || 'Learning Module'}</h1>
            ${content.description ? `<div class="module-description">${content.description}</div>` : ''}
          </div>

          ${learningObjectives.length > 0 ? `
          <div class="section">
            <h2 class="section-title">Learning Objectives</h2>
            <ul class="objectives-list">
              ${learningObjectives.map((obj: any) => `<li>${obj.text}</li>`).join('')}
            </ul>
          </div>
          ` : ''}

          ${content.moduleContent ? `
          <div class="section">
            <h2 class="section-title">Module Content</h2>
            <div class="content-text">
              ${content.moduleContent.replace(/class="/g, 'style="').replace(/text-primary/g, 'color: #64FFDA;')}
            </div>
          </div>
          ` : ''}

          ${interactiveElements.length > 0 ? `
          <div class="section">
            <h2 class="section-title">Key Concepts & Interactive Elements</h2>
            ${interactiveElements.map((element: any) => `
              <div class="interactive-element">
                <div class="element-type">${element.type}</div>
                ${element.title ? `<div class="element-title">${element.title}</div>` : ''}
                <div>${element.content}</div>
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${keyTakeaways.length > 0 ? `
          <div class="section">
            <h2 class="section-title">Key Takeaways</h2>
            <ul class="takeaways-list">
              ${keyTakeaways.map((takeaway: any) => `<li>${takeaway.text}</li>`).join('')}
            </ul>
          </div>
          ` : ''}

          <div class="section notes-section">
            <h2 class="notes-title">Personal Notes</h2>
            <p style="color: #666; margin-bottom: 20px;">Use this space to write your own notes and reflections:</p>
            ${Array.from({ length: 15 }, () => '<div class="notes-lines"></div>').join('')}
          </div>

          <div class="footer">
            <p>Generated on ${new Date().toLocaleDateString()} | LearnHub Learning Platform</p>
            ${content.estimatedDurationMinutes ? `<p>Estimated Duration: ${content.estimatedDurationMinutes} minutes</p>` : ''}
          </div>
        </body>
        </html>
      `;

      // Create and download PDF
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      // Create a temporary iframe for printing
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      
      iframe.onload = () => {
        iframe.contentWindow?.print();
        setTimeout(() => {
          document.body.removeChild(iframe);
          URL.revokeObjectURL(url);
        }, 1000);
      };
      
      iframe.src = url;

      // Alternative: Direct download as HTML file that can be converted to PDF
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = `${(content.title || 'module-notes').replace(/[^a-z0-9]/gi, '-').toLowerCase()}.html`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      onDownload?.();
    } catch (error) {
      console.error('Error generating PDF notes:', error);
      alert('Error generating PDF notes. Please try again.');
    }
  };

  const generateSimplePDFNotes = () => {
    try {
      // Create a simple text-based notes file
      const learningObjectives = content.learningObjectives ? JSON.parse(content.learningObjectives) : [];
      const keyTakeaways = content.keyTakeaways ? JSON.parse(content.keyTakeaways) : [];
      const interactiveElements = content.interactiveElements ? JSON.parse(content.interactiveElements) : [];

      let notesContent = '';
      
      // Header
      notesContent += `${courseName ? courseName + '\n' : ''}`;
      notesContent += `${content.title || 'Learning Module'}\n`;
      notesContent += `${'='.repeat(50)}\n\n`;
      
      if (content.description) {
        notesContent += `Description: ${content.description}\n\n`;
      }

      // Learning Objectives
      if (learningObjectives.length > 0) {
        notesContent += `LEARNING OBJECTIVES:\n`;
        notesContent += `${'-'.repeat(20)}\n`;
        learningObjectives.forEach((obj: any, index: number) => {
          notesContent += `${index + 1}. ${obj.text}\n`;
        });
        notesContent += '\n';
      }

      // Module Content (simplified)
      if (content.moduleContent) {
        notesContent += `MODULE CONTENT:\n`;
        notesContent += `${'-'.repeat(15)}\n`;
        // Strip HTML tags for plain text
        const plainText = content.moduleContent.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
        notesContent += `${plainText}\n\n`;
      }

      // Interactive Elements
      if (interactiveElements.length > 0) {
        notesContent += `KEY CONCEPTS & INTERACTIVE ELEMENTS:\n`;
        notesContent += `${'-'.repeat(35)}\n`;
        interactiveElements.forEach((element: any, index: number) => {
          notesContent += `${index + 1}. [${element.type.toUpperCase()}] ${element.title || 'Key Point'}\n`;
          notesContent += `   ${element.content}\n\n`;
        });
      }

      // Key Takeaways
      if (keyTakeaways.length > 0) {
        notesContent += `KEY TAKEAWAYS:\n`;
        notesContent += `${'-'.repeat(15)}\n`;
        keyTakeaways.forEach((takeaway: any, index: number) => {
          notesContent += `${index + 1}. ${takeaway.text}\n`;
        });
        notesContent += '\n';
      }

      // Personal Notes Section
      notesContent += `PERSONAL NOTES:\n`;
      notesContent += `${'-'.repeat(15)}\n`;
      notesContent += `${'\n'.repeat(10)}`;

      // Footer
      notesContent += `\n${'='.repeat(50)}\n`;
      notesContent += `Generated on: ${new Date().toLocaleDateString()}\n`;
      notesContent += `LearnHub Learning Platform\n`;
      if (content.estimatedDurationMinutes) {
        notesContent += `Estimated Duration: ${content.estimatedDurationMinutes} minutes\n`;
      }

      // Create and download the file
      const blob = new Blob([notesContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = `${(content.title || 'module-notes').replace(/[^a-z0-9]/gi, '-').toLowerCase()}-notes.txt`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(url);

      onDownload?.();
    } catch (error) {
      console.error('Error generating notes:', error);
      alert('Error generating notes. Please try again.');
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={generatePDFNotes}
        size="sm"
        variant="outline"
        className="border-primary/30 text-primary hover:bg-primary/10"
        title="Download formatted notes (HTML format for PDF printing)"
      >
        <FileText className="w-4 h-4 mr-2" />
        Download Notes (PDF)
      </Button>
      <Button
        onClick={generateSimplePDFNotes}
        size="sm"
        variant="outline"
        className="border-white/20 text-gray-400 hover:text-white"
        title="Download simple text notes"
      >
        <Download className="w-4 h-4 mr-2" />
        Text Notes
      </Button>
    </div>
  );
}

export default PDFNotesGenerator;