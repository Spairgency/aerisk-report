import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import Page1 from './components/Page1';
import Page2 from './components/Page2';
import Page3 from './components/Page3';
import Page4 from './components/Page4';
import Page5 from './components/Page5';
import Page6 from './components/Page6';
import Page7 from './components/Page7';
import Page8 from './components/Page8';

const App = () => {
  const reportRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: reportRef,
    documentTitle: 'AERISK-ASSESS-2026-0452',
    pageStyle: `
      @page {
        size: A4;
        margin: 0;
      }
      @media print {
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          background: white !important;
          width: 210mm !important;
        }
        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        .no-print { display: none !important; }
      }
    `,
  });

  return (
    <div style={{
      backgroundColor: '#525659',
      minHeight: '100vh',
      padding: '40px 0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px'
    }}>

      {/* BUTON DOWNLOAD */}
      <div className="no-print" style={{
        position: 'fixed',
        top: '20px',
        right: '28px',
        zIndex: 1000,
      }}>
        <button
          onClick={() => handlePrint()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#1e293b',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '10px 20px',
            fontSize: '13px',
            fontWeight: 600,
            fontFamily: 'sans-serif',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            letterSpacing: '0.03em',
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#0f172a')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#1e293b')}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Descarcă Raport PDF
        </button>
      </div>

      {/* RAPORT — toate paginile */}
      <div ref={reportRef}>
        <Page1 />
        <Page2 />
        <Page3 />
        <Page4 />
        <Page5 />
        <Page6 />
        <Page7 />
        <Page8 />
      </div>

    </div>
  );
};

export default App;
