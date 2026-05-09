import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ExternalLink } from 'lucide-react';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl?: string;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose, pdfUrl }) => {
  const PDF_URL = pdfUrl || '/Rex_CV.pdf';
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-5xl bg-white dark:bg-[#111] rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 flex flex-col h-[90vh]"
          >
            {/* Header */}
            <div className="p-6 sm:p-8 flex items-center justify-between sticky top-0 bg-white dark:bg-[#111] z-20 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-black">
                    <ExternalLink size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-black dark:text-white">Curriculum Vitae</h2>
                  <p className="text-gray-500 text-xs mt-1 uppercase tracking-widest font-bold">Rex J. Punlagao</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                    className="p-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-xl transition-all flex items-center gap-2 text-sm font-bold"
                    onClick={() => {
                        const link = document.createElement('a');
                        link.href = PDF_URL;
                        link.download = 'Rex_CV.pdf';
                        link.click();
                    }}
                    title="Download PDF"
                >
                    <Download size={18} />
                    <span className="hidden sm:inline uppercase">Download</span>
                </button>
                <button 
                  onClick={onClose} 
                  className="p-3 text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Viewer */}
            <div className="flex-1 bg-gray-50 dark:bg-black/20 p-4 sm:p-6 overflow-hidden">
              <div className="w-full h-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-inner overflow-hidden relative group">
                <iframe 
                  src={`${PDF_URL}#toolbar=0&navpanes=0&scrollbar=1`}
                  className="w-full h-full border-none"
                  title="Resume PDF Viewer"
                />
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <p className="text-[10px] text-center text-gray-500 font-bold uppercase tracking-tighter">Preview Mode</p>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 bg-white dark:bg-[#111] border-t border-gray-100 dark:border-gray-800">
                <button 
                    className="w-full py-4 bg-accent hover:bg-yellow-400 text-black font-extrabold rounded-2xl transition-all shadow-lg shadow-accent/20 flex items-center justify-center gap-2 uppercase tracking-widest"
                    onClick={() => {
                        window.open(PDF_URL, '_blank');
                    }}
                >
                    Open in Full Screen <ExternalLink size={18} />
                </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
