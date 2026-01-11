import { Layout } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FileList from './components/FileList';
import FilePreview from './components/FilePreview';
import FileUpload from './components/FileUpload';
import { fetchFiles } from './store/fileSlice';

const API_BASE_URL = 'http://localhost:5001/api';

function App() {
  const dispatch = useDispatch();
  const { items: files, loading } = useSelector((state) => state.files);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    dispatch(fetchFiles());
  }, [dispatch]);

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
          <FileUpload />
        </div>

        <div className="lg:col-span-2">
          {loading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <FileList onPreview={handlePreview} />
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
