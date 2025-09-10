import React, { useState, useRef, useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist";
// import "pdfjs-dist/web/pdf_viewer.css";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const PdfViewerEditor = ({ pdfUrl = "https://admin.revision24.com/storage/app/public/test_syllabus/test_syllabus1756981265.pdf" }) => {
  const canvasRef = useRef(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [scale, setScale] = useState(1.2);

  // load pdf from URL
  useEffect(() => {
    if (pdfUrl) {
      pdfjsLib.getDocument(pdfUrl).promise.then((pdf) => {
        setPdfDoc(pdf);
        setPageNum(1);
      });
    }
  }, [pdfUrl]);

  // render page
  useEffect(() => {
    if (pdfDoc) {
      renderPage(pageNum);
    }
  }, [pdfDoc, pageNum, scale]);

  const renderPage = (num) => {
    pdfDoc.getPage(num).then((page) => {
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
      page.render(renderContext);
    });
  };

  return (
    <div className="p-4">
      {pdfDoc ? (
        <div>
          <canvas ref={canvasRef}></canvas>
          <div className="flex gap-4 mt-2">
            <button
              onClick={() => pageNum > 1 && setPageNum(pageNum - 1)}
              className="px-3 py-1 bg-gray-300 rounded"
            >
              Prev
            </button>
            <span>
              Page {pageNum} of {pdfDoc.numPages}
            </span>
            <button
              onClick={() => pageNum < pdfDoc.numPages && setPageNum(pageNum + 1)}
              className="px-3 py-1 bg-gray-300 rounded"
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-600">Loading PDF...</p>
      )}
    </div>
  );
};

export default PdfViewerEditor;

