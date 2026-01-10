import axios from 'axios';
import { Layout } from 'lucide-react';
import { useEffect, useState } from 'react';
import FileList from './components/FileList';
import FilePreview from './components/FilePreview';
import FileUpload from './components/FileUpload';

const API_BASE_URL = 'http://localhost:5001/api';

function App() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchFiles = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/files`);
      setFiles(response.data);
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUploadSuccess = () => {
    fetchFiles();
  };

  const handlePreview = (file) => {
    setSelectedFile(file);
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <header className="flex items-center gap-4 mb-12">
        <div className="bg-blue-600 p-3 rounded-xl shadow-lg">
          <Layout className="text-white w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Typeface Dropbox</h1>
          <p className="text-gray-500">Simplify your file management</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <FileUpload onUploadSuccess={handleUploadSuccess} />
        </div>

        <div className="lg:col-span-2">
          {loading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <FileList files={files} onPreview={handlePreview} onDownloadSuccess={fetchFiles} />
          )}
        </div>
      </div>

      {selectedFile && (
        <FilePreview
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
          apiUrl={`${API_BASE_URL}/files/view/${selectedFile.id}`}
        />
      )}
    </div>
  );
}

export default App;
