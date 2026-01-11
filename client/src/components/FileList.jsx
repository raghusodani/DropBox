import { motion } from 'framer-motion';
import { Download, Eye, FileCode, FileText, HardDrive, Image as ImageIcon } from 'lucide-react';
import { useSelector } from 'react-redux';

const API_BASE_URL = 'http://localhost:5001/api';

const FileList = ({ onPreview }) => {
    const { items: files } = useSelector((state) => state.files);

    const getIcon = (mimeType) => {
        if (mimeType?.includes('image')) return <ImageIcon className="text-pink-500" />;
        if (mimeType?.includes('json')) return <FileCode className="text-orange-500" />;
        return <FileText className="text-blue-500" />;
    };

    const formatSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    if (!files || files.length === 0) {
        return (
            <div className="glass-panel p-12 text-center">
                <HardDrive className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-700">No files yet</h3>
                <p className="text-gray-500">Upload your first file to see it here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Your Files ({files.length})</h2>
            <div className="grid gap-4">
                {files.map((file, index) => (
                    <motion.div
                        key={file.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="glass-panel p-4 flex items-center justify-between group hover:shadow-2xl transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <div className="bg-gray-100 p-3 rounded-lg group-hover:bg-white transition-colors">
                                {getIcon(file.mimeType)}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 truncate max-w-md">{file.originalName}</h3>
                                <p className="text-xs text-gray-500 flex gap-4">
                                    <span>{formatSize(file.size)}</span>
                                    <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => onPreview(file)}
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Preview"
                            >
                                <Eye className="w-5 h-5" />
                            </button>
                            <a
                                href={`${API_BASE_URL}/files/download/${file.id}`}
                                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Download"
                            >
                                <Download className="w-5 h-5" />
                            </a>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default FileList;
