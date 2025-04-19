// src/pages/PDFViewer.tsx

interface PDFViewerProps {
  url: string;
}

export function PDFViewer({ url }: PDFViewerProps) {
  return (
    <div style={{ width: "100%", height: "600px", border: "1px solid #ccc" }}>
      <iframe src={url} width="100%" height="100%" title="PDF Viewer" />
    </div>
  );
}

export default PDFViewer;
