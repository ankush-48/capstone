import React from 'react';
import { useMember } from '@/integrations';
import { Courses } from '@/entities/courses';

interface CertificateData {
  learnerName: string;
  courseName: string;
  completionDate: string;
  certificateId: string;
  instructorName?: string;
  courseCategory?: string;
}

interface CertificateGeneratorProps {
  course: Courses;
  completionDate: Date;
  onDownload?: () => void;
}

export function CertificateGenerator({ course, completionDate, onDownload }: CertificateGeneratorProps) {
  const { member } = useMember();
  
  const generateCertificateId = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `CERT-${timestamp}-${random}`.toUpperCase();
  };

  const certificateData: CertificateData = {
    learnerName: member?.profile?.nickname || 
                 `${member?.contact?.firstName || ''} ${member?.contact?.lastName || ''}`.trim() || 
                 'Learner',
    courseName: course.titleEn || 'Course',
    completionDate: completionDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    certificateId: generateCertificateId(),
    instructorName: course.instructorName,
    courseCategory: course.category
  };

  const generateCertificateSVG = () => {
    return `
      <svg width="800" height="600" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#1E1E1E;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#121212;stop-opacity:1" />
          </linearGradient>
          <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#64FFDA;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#BB86FC;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#64FFDA;stop-opacity:1" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <!-- Background -->
        <rect width="800" height="600" fill="url(#bgGradient)"/>
        
        <!-- Border -->
        <rect x="20" y="20" width="760" height="560" fill="none" stroke="url(#borderGradient)" stroke-width="3" rx="10"/>
        <rect x="40" y="40" width="720" height="520" fill="none" stroke="#64FFDA" stroke-width="1" opacity="0.3" rx="5"/>
        
        <!-- Header -->
        <text x="400" y="80" text-anchor="middle" fill="#64FFDA" font-family="Arial, sans-serif" font-size="24" font-weight="bold">
          CERTIFICATE OF COMPLETION
        </text>
        
        <!-- Decorative line -->
        <line x1="200" y1="100" x2="600" y2="100" stroke="#64FFDA" stroke-width="2" opacity="0.5"/>
        
        <!-- Main content -->
        <text x="400" y="150" text-anchor="middle" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="16">
          This is to certify that
        </text>
        
        <text x="400" y="200" text-anchor="middle" fill="#64FFDA" font-family="Arial, sans-serif" font-size="32" font-weight="bold" filter="url(#glow)">
          ${certificateData.learnerName}
        </text>
        
        <text x="400" y="250" text-anchor="middle" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="16">
          has successfully completed the course
        </text>
        
        <text x="400" y="300" text-anchor="middle" fill="#BB86FC" font-family="Arial, sans-serif" font-size="24" font-weight="bold">
          ${certificateData.courseName}
        </text>
        
        ${certificateData.courseCategory ? `
        <text x="400" y="330" text-anchor="middle" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="14" opacity="0.8">
          Category: ${certificateData.courseCategory}
        </text>
        ` : ''}
        
        <text x="400" y="380" text-anchor="middle" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="16">
          Date of Completion: ${certificateData.completionDate}
        </text>
        
        <!-- Certificate ID -->
        <text x="400" y="420" text-anchor="middle" fill="#64FFDA" font-family="Arial, sans-serif" font-size="12" opacity="0.8">
          Certificate ID: ${certificateData.certificateId}
        </text>
        
        <!-- Instructor signature area -->
        ${certificateData.instructorName ? `
        <text x="200" y="500" text-anchor="middle" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="12">
          Instructor
        </text>
        <line x1="150" y1="510" x2="250" y2="510" stroke="#64FFDA" stroke-width="1"/>
        <text x="200" y="530" text-anchor="middle" fill="#64FFDA" font-family="Arial, sans-serif" font-size="14">
          ${certificateData.instructorName}
        </text>
        ` : ''}
        
        <!-- Platform signature -->
        <text x="600" y="500" text-anchor="middle" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="12">
          LearnHub Platform
        </text>
        <line x1="550" y1="510" x2="650" y2="510" stroke="#64FFDA" stroke-width="1"/>
        <text x="600" y="530" text-anchor="middle" fill="#64FFDA" font-family="Arial, sans-serif" font-size="14">
          Verified Certificate
        </text>
        
        <!-- Decorative elements -->
        <circle cx="100" cy="100" r="30" fill="none" stroke="#64FFDA" stroke-width="2" opacity="0.3"/>
        <circle cx="700" cy="100" r="30" fill="none" stroke="#BB86FC" stroke-width="2" opacity="0.3"/>
        <circle cx="100" cy="500" r="30" fill="none" stroke="#BB86FC" stroke-width="2" opacity="0.3"/>
        <circle cx="700" cy="500" r="30" fill="none" stroke="#64FFDA" stroke-width="2" opacity="0.3"/>
        
        <!-- Grid pattern -->
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#64FFDA" stroke-width="0.5" opacity="0.1"/>
          </pattern>
        </defs>
        <rect width="800" height="600" fill="url(#grid)"/>
      </svg>
    `;
  };

  const downloadCertificate = () => {
    const svgContent = generateCertificateSVG();
    
    // Create a canvas to convert SVG to PNG
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    canvas.width = 800;
    canvas.height = 600;
    
    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = '#1E1E1E';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        // Convert to blob and download
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `certificate-${certificateData.certificateId}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            if (onDownload) {
              onDownload();
            }
          }
        }, 'image/png', 1.0);
      }
    };
    
    const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(svgBlob);
    img.src = url;
  };

  // Also create a PDF version
  const downloadCertificatePDF = () => {
    const svgContent = generateCertificateSVG();
    
    // For PDF generation, we'll create a simple HTML version that can be printed
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Certificate - ${certificateData.courseName}</title>
        <style>
          @page { size: A4 landscape; margin: 0; }
          body { 
            margin: 0; 
            padding: 20px; 
            font-family: Arial, sans-serif; 
            background: linear-gradient(135deg, #1E1E1E 0%, #121212 100%);
            color: white;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
          .certificate {
            border: 3px solid #64FFDA;
            border-radius: 10px;
            padding: 60px;
            text-align: center;
            background: rgba(30, 30, 30, 0.9);
            width: 90%;
            max-width: 800px;
          }
          .title { color: #64FFDA; font-size: 24px; font-weight: bold; margin-bottom: 20px; }
          .learner-name { color: #64FFDA; font-size: 32px; font-weight: bold; margin: 20px 0; }
          .course-name { color: #BB86FC; font-size: 24px; font-weight: bold; margin: 20px 0; }
          .cert-id { color: #64FFDA; font-size: 12px; opacity: 0.8; margin-top: 30px; }
          .signatures { display: flex; justify-content: space-between; margin-top: 40px; }
          .signature { text-align: center; }
          .signature-line { border-top: 1px solid #64FFDA; margin: 10px 0; width: 150px; }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="title">CERTIFICATE OF COMPLETION</div>
          <div>This is to certify that</div>
          <div class="learner-name">${certificateData.learnerName}</div>
          <div>has successfully completed the course</div>
          <div class="course-name">${certificateData.courseName}</div>
          ${certificateData.courseCategory ? `<div>Category: ${certificateData.courseCategory}</div>` : ''}
          <div style="margin-top: 30px;">Date of Completion: ${certificateData.completionDate}</div>
          <div class="cert-id">Certificate ID: ${certificateData.certificateId}</div>
          <div class="signatures">
            ${certificateData.instructorName ? `
            <div class="signature">
              <div>Instructor</div>
              <div class="signature-line"></div>
              <div style="color: #64FFDA;">${certificateData.instructorName}</div>
            </div>
            ` : '<div></div>'}
            <div class="signature">
              <div>LearnHub Platform</div>
              <div class="signature-line"></div>
              <div style="color: #64FFDA;">Verified Certificate</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        if (onDownload) {
          onDownload();
        }
      }, 500);
    }
  };

  return {
    certificateData,
    downloadCertificate,
    downloadCertificatePDF,
    generateCertificateSVG
  };
}