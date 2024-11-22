import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import TicketHeader from '../components/TicketView/TicketHeader';
import TicketCover from '../components/TicketView/TicketCover';
import TicketInfo from '../components/TicketView/TicketInfo';
import TicketGuidelines from '../components/TicketView/TicketGuidelines';
import Logo from '../components/Logo';

interface TicketViewProps {
  ticket: {
    id: string;
    eventTitle: string;
    date: string;
    time: string;
    location: string;
    ticketType: string;
    qrCode: string;
    coverImage: string;
    price?: string;
  }
}

export default function TicketView({ ticket }: TicketViewProps) {
  const ticketRef = useRef<HTMLDivElement>(null);
  const downloadButtonRef = useRef<HTMLButtonElement>(null);

  const downloadPDF = async () => {
    if (!ticketRef.current || !downloadButtonRef.current) return;

    try {
      downloadButtonRef.current.style.display = 'none';
      
      const images = ticketRef.current.getElementsByTagName('img');
      await Promise.all(
        Array.from(images).map(img => 
          new Promise((resolve) => {
            if (img.complete) resolve(null);
            else {
              img.onload = () => resolve(null);
              img.onerror = () => resolve(null);
            }
          })
        )
      );

      const ticketElement = ticketRef.current.cloneNode(true) as HTMLElement;
      
      // Ajustements pour le PDF
      ticketElement.style.width = '794px';
      ticketElement.style.margin = '0';
      ticketElement.style.padding = '40px';
      ticketElement.style.boxSizing = 'border-box';
      ticketElement.style.backgroundColor = 'white';
      ticketElement.style.fontFamily = 'Arial, sans-serif';
      
      // Suppression des éléments non nécessaires pour le PDF
      const downloadButton = ticketElement.querySelector('[data-download-button]');
      if (downloadButton) {
        downloadButton.remove();
      }

      // Optimisations des styles pour le PDF
      ticketElement.querySelectorAll('*').forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.transform = 'none';
          el.style.transition = 'none';
          
          // Ajustement des tailles de police
          if (el.classList.contains('text-xs')) {
            el.style.fontSize = '12px';
          }
          if (el.classList.contains('text-sm')) {
            el.style.fontSize = '14px';
          }
          if (el.classList.contains('text-lg')) {
            el.style.fontSize = '18px';
          }
          
          // Optimisation des couleurs pour l'impression
          if (el.classList.contains('text-gray-500')) {
            el.style.color = '#666666';
          }
          if (el.classList.contains('text-gray-900')) {
            el.style.color = '#000000';
          }
          if (el.classList.contains('text-brand-red')) {
            el.style.color = '#D43530';
          }
        }
      });

      // Optimisation du QR Code
      const qrCode = ticketElement.querySelector('[data-qr-code]');
      if (qrCode instanceof HTMLElement) {
        qrCode.style.transform = 'scale(1.2)';
        qrCode.style.margin = '20px auto';
      }

      // Optimisation du logo
      const logo = ticketElement.querySelector('img[alt="PassPro"]');
      if (logo instanceof HTMLElement) {
        logo.style.height = '48px';
        logo.style.width = 'auto';
        logo.style.objectFit = 'contain';
      }

      // Optimisation des conseils d'usage
      const guidelines = ticketElement.querySelector('[data-guidelines]');
      if (guidelines instanceof HTMLElement) {
        guidelines.style.pageBreakInside = 'avoid';
        guidelines.style.marginTop = '20px';
      }

      const container = document.createElement('div');
      container.appendChild(ticketElement);
      document.body.appendChild(container);

      const canvas = await html2canvas(ticketElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        imageTimeout: 15000,
        width: 794,
        height: 1123,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.querySelector('[data-ticket-content]');
          if (clonedElement instanceof HTMLElement) {
            clonedElement.style.transform = 'none';
          }
        }
      });

      document.body.removeChild(container);

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4',
        hotfixes: ['px_scaling'],
      });

      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`ticket-${ticket.id}.pdf`);

    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      if (downloadButtonRef.current) {
        downloadButtonRef.current.style.display = 'flex';
      }
    }
  };

  return (
    <div className="pt-4 sm:pt-6 pb-20">
      <div className="max-w-lg mx-auto px-3 sm:px-4">
        <div 
          ref={ticketRef} 
          data-ticket-content
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <TicketHeader />
          
          <TicketCover 
            imageUrl={ticket.coverImage}
            title={ticket.eventTitle}
          />
          
          <TicketInfo
            date={ticket.date}
            time={ticket.time}
            location={ticket.location}
            ticketType={ticket.ticketType}
            ticketId={ticket.id}
            price={ticket.price}
          />
          
          <div className="flex items-center justify-center py-6" data-qr-code>
            <QRCodeSVG
              value={ticket.qrCode}
              size={180}
              level="H"
              includeMargin={true}
            />
          </div>

          <button
            ref={downloadButtonRef}
            onClick={downloadPDF}
            className="w-full py-3 px-4 bg-brand-button text-white rounded-brand text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mb-6"
            data-download-button
          >
            <Download className="h-5 w-5" />
            Télécharger le PDF
          </button>

          <div data-guidelines>
            <TicketGuidelines />
          </div>
        </div>
      </div>
    </div>
  );
}