import axios from 'axios';
import { motion } from 'framer-motion';
import { Download, FileText, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const FilePreview = ({ file, onClose, apiUrl }) => {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);

    const isImage = file.mimeType?.includes('image');
    const isJson = file.mimeType?.includes('json');
    const isText = file.mimeType?.includes('text');

    useEffect(() => {
        if (isJson || isText) {
            axios.get(apiUrl)
                .then(res => {
                    setContent(isJson ? JSON.stringify(res.data, null, 2) : res.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Error loading preview:', err);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [apiUrl, isJson, isText]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-3xl overflow-hidden w-full max-w-4xl max-h-[90vh] shadow-2xl flex flex-col"
            >
                <div className="p-4 border-b flex items-center justify-between bg-gray-50">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                            <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="font-bold text-gray-800">{file.originalName}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-auto p-8 flex justify-center items-center bg-gray-100/50">
                    {loading ? (
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    ) : isImage ? (
                        <img
                            src={apiUrl}
                            alt={file.originalName}
                            className="max-w-full max-h-full object-contain shadow-lg rounded-lg"
                        />
                    ) : (isJson || isText) ? (
                        <pre className="w-full h-full p-6 bg-gray-900 text-green-400 rounded-xl overflow-auto font-mono text-sm border-2 border-gray-800 shadow-inner">
                            <code>{content}</code>
                        </pre>
                    ) : (
                        <div className="text-center">
                            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">Preview not available for this file type.</p>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
                    <button onClick={onClose} className="btn-secondary">Close</button>
                    <a
                        href={apiUrl.replace('view', 'download')}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Download className="w-4 h-4" /> Download
                    </a>
                </div>
            </motion.div>
        </div>
    );
};

export default FilePreview;
