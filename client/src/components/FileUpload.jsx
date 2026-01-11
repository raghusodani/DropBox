import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Upload, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearUploadStatus, uploadFile } from '../store/fileSlice';

const FileUpload = () => {
    const dispatch = useDispatch();
    const { uploading, uploadStatus, error } = useSelector((state) => state.files);
    const [file, setFile] = useState(null);

    const allowedTypes = ['text/plain', 'image/jpeg', 'image/png', 'application/json'];

    useEffect(() => {
        if (uploadStatus === 'success') {
            setFile(null);
            const timer = setTimeout(() => {
                dispatch(clearUploadStatus());
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [uploadStatus, dispatch]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (allowedTypes.includes(selectedFile.type)) {
                setFile(selectedFile);
                dispatch(clearUploadStatus());
            } else {
                // We can handle local error if we want, but letting the slice handle it via rejectWithValue is also fine.
                // For now, let's keep it simple.
                setFile(null);
                alert('Invalid file type. Only txt, jpg, png, and json are allowed.');
            }
        }
    };

    const handleUpload = () => {
        if (!file) return;
        dispatch(uploadFile(file));
    };

    return (
        <div className="glass-panel p-6 sticky top-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5" /> Upload File
            </h2>

            <div
                className={`border-2 border-dashed rounded-xl p-8 transition-colors text-center ${file ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
                    }`}
            >
                {!file ? (
                    <>
                        <input
                            type="file"
                            id="fileInput"
                            className="hidden"
                            onChange={handleFileChange}
                            accept=".txt,.jpg,.jpeg,.png,.json"
                        />
                        <label htmlFor="fileInput" className="cursor-pointer block">
                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 font-medium">Click to upload or drag and drop</p>
                            <p className="text-gray-400 text-sm mt-1">TXT, JPG, PNG, JSON (max 10MB)</p>
                        </label>
                    </>
                ) : (
                    <div className="flex flex-col items-center">
                        <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
                        <p className="text-blue-600 font-bold truncate max-w-xs">{file.name}</p>
                        <button
                            onClick={() => setFile(null)}
                            className="mt-2 text-gray-500 hover:text-red-500 flex items-center gap-1"
                        >
                            <X className="w-4 h-4" /> Remove
                        </button>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {(uploadStatus || error) && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${uploadStatus === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}
                    >
                        {uploadStatus === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                        <span className="text-sm font-medium">{uploadStatus === 'success' ? 'Uploaded successfully!' : error}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                disabled={!file || uploading}
                onClick={handleUpload}
                className={`w-full mt-6 flex items-center justify-center gap-2 ${uploading ? 'bg-blue-400 cursor-not-allowed' : 'btn-primary'
                    }`}
            >
                {uploading ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Uploading...
                    </>
                ) : (
                    'Upload to Dropbox'
                )}
            </button>
        </div>
    );
};

export default FileUpload;
