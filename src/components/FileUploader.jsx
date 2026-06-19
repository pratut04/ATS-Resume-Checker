import React, { useState, useCallback, useRef } from 'react';
import { Upload, FileText, CheckCircle2, XCircle, X, CloudUpload } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function FileUploader({ onTextExtracted, onError, setIsLoading }) {
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const extractPdfText = async (file) => {
    setIsLoading(true);
    setStatus('loading');
    setProgress(0);

    try {
      const buffer = await file.arrayBuffer();
      setProgress(20);
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
      setProgress(40);

      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        fullText += content.items.map(it => it.str).join(' ') + '\n';
        setProgress(40 + Math.round((i / pdf.numPages) * 55));
      }

      setProgress(100);
      setStatus('success');
      setIsLoading(false);

      if (fullText.trim().length < 50) {
        onError('Could not extract enough text — make sure the PDF is not scanned/image-based.');
        setStatus('error');
        return;
      }
      onTextExtracted(fullText);
    } catch {
      setStatus('error');
      setIsLoading(false);
      onError('Failed to parse PDF. Please upload a valid, text-based PDF.');
    }
  };

  const handleFile = (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf') {
      onError('Only PDF files are accepted. Please upload a .pdf file.');
      setStatus('error');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      onError('File too large — maximum size is 10 MB.');
      setStatus('error');
      return;
    }
    setFileName(file.name);
    setFileSize(formatSize(file.size));
    setProgress(0);
    extractPdfText(file);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);

  const reset = () => {
    setStatus('idle');
    setFileName('');
    setFileSize('');
    setProgress(0);
    onTextExtracted(null);
  };

  const zoneClass = `upload-zone ${isDragging ? 'drag-over' : ''} ${status === 'success' ? 'success' : ''} ${status === 'error' ? 'error' : ''}`;

  return (
    <div className="w-full">
      <div
        className={zoneClass}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => status === 'idle' && fileInputRef.current?.click()}
      >
        <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={e => { handleFile(e.target.files[0]); e.target.value = ''; }} />

        <div className="py-12 px-6 flex flex-col items-center gap-5">

          {/* IDLE */}
          {status === 'idle' && (
            <>
              <div className={`upload-ring anim-float`}>
                <CloudUpload className="w-9 h-9 text-violet-400" strokeWidth={1.5} />
              </div>
              <div className="text-center space-y-1.5">
                <p className="text-white/90 font-semibold text-lg">Drop your resume here</p>
                <p className="text-white/40 text-sm">
                  or <span className="text-violet-400 font-medium hover:text-violet-300 transition-colors underline underline-offset-2 decoration-dotted cursor-pointer">browse files</span>
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs text-white/25">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" /> PDF only
                </span>
                <span className="w-px h-3 bg-white/10" />
                <span>Max 10 MB</span>
                <span className="w-px h-3 bg-white/10" />
                <span>Text-based</span>
              </div>
            </>
          )}

          {/* LOADING */}
          {status === 'loading' && (
            <div className="w-full max-w-xs flex flex-col items-center gap-5">
              {/* Spinner ring */}
              <div className="relative w-20 h-20">
                <svg className="absolute inset-0" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(124,58,237,.15)" strokeWidth="6" />
                  <circle
                    cx="40" cy="40" r="34" fill="none"
                    stroke="url(#spinGrad)" strokeWidth="6" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 34}`}
                    strokeDashoffset={`${2 * Math.PI * 34 * (1 - progress / 100)}`}
                    style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', transition: 'stroke-dashoffset .3s' }}
                  />
                  <defs>
                    <linearGradient id="spinGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop stopColor="#7c3aed" /><stop offset="1" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-violet-400">{progress}%</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-white/80 font-medium text-sm">Extracting text...</p>
                <p className="text-white/35 text-xs mt-1 truncate max-w-[200px]">{fileName}</p>
              </div>
            </div>
          )}

          {/* SUCCESS */}
          {status === 'success' && (
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'rgba(16,185,129,.12)', border: '1px solid rgba(16,185,129,.3)' }}>
                <CheckCircle2 className="w-9 h-9 text-emerald-400" strokeWidth={1.5} />
              </div>
              <div className="text-center">
                <p className="text-emerald-400 font-semibold">Resume Loaded!</p>
                <p className="text-white/45 text-sm mt-0.5">{fileName} · {fileSize}</p>
              </div>
              <button
                onClick={e => { e.stopPropagation(); reset(); }}
                className="flex items-center gap-1.5 text-xs text-white/35 hover:text-white/65 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
              >
                <X className="w-3.5 h-3.5" /> Replace file
              </button>
            </div>
          )}

          {/* ERROR */}
          {status === 'error' && (
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'rgba(244,63,94,.1)', border: '1px solid rgba(244,63,94,.3)' }}>
                <XCircle className="w-9 h-9 text-rose-400" strokeWidth={1.5} />
              </div>
              <div className="text-center">
                <p className="text-rose-400 font-semibold">Upload Failed</p>
                <p className="text-white/45 text-sm mt-0.5">Try a different file</p>
              </div>
              <button
                onClick={e => { e.stopPropagation(); reset(); }}
                className="flex items-center gap-1.5 text-xs text-white/35 hover:text-white/65 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
              >
                <X className="w-3.5 h-3.5" /> Try again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
