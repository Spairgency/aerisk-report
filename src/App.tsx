import { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import Page1 from './components/Page1';
import Page2 from './components/Page2';
import Page3 from './components/Page3';
import Page4 from './components/Page4';
import Page5 from './components/Page5';
import Page6 from './components/Page6';
import Page7 from './components/Page7';
import Page8 from './components/Page8';

// A4 width at 96 dpi (210mm). Pages keep their exact A4 layout; on narrow
// screens the whole report is zoomed down to fit, like a PDF viewer.
const A4_WIDTH_PX = 794;
const SCREEN_GUTTER_PX = 16;

const computeScale = () =>
  typeof window === 'undefined'
    ? 1
    : Math.min(1, (window.innerWidth - SCREEN_GUTTER_PX) / A4_WIDTH_PX);

const App = () => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(computeScale);
  const isNarrow = scale < 1;

  useEffect(() => {
    const onResize = () => setScale(computeScale());
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, []);

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
      padding: isNarrow ? '64px 0 16px' : '40px 0',
      overflowX: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px'
    }}>

      {/* BUTON DOWNLOAD */}
      <div className="no-print" style={{
        position: 'fixed',
        top: isNarrow ? '12px' : '20px',
        right: isNarrow ? '12px' : '28px',
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

      {/* RAPORT — toate paginile.
          Zoom lives on this outer wrapper, NOT on reportRef: react-to-print
          clones only reportRef, so the printed PDF stays exact A4. */}
      <div style={{ zoom: scale }}>
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

    </div>
  );
};

export default App;
