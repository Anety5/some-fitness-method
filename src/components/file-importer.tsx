import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, X, CheckCircle, AlertCircle, Image } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface FileImporterProps {
  category: 'characters' | 'assets' | 'recipes' | 'exercises' | 'audio' | 'research';
  onFileImported?: (fileName: string, content: string) => void;
}

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'complete' | 'error';
  progress: number;
  preview?: string;
  url?: string;
}

export default function FileImporter({ category, onFileImported }: FileImporterProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedTypes = {
    characters: '.jpg,.jpeg,.png,.gif,.webp',
    assets: '.jpg,.jpeg,.png,.gif,.svg,.webp',
    recipes: '.pdf,.txt,.md,.doc,.docx',
    exercises: '.pdf,.txt,.md,.mp4,.mov',
    audio: '.mp3,.wav,.ogg,.m4a',
    research: '.pdf,.txt,.md,.doc,.docx'
  };

  const maxFileSize = {
    characters: 5, // 5MB for character images
    assets: 10,
    recipes: 20,
    exercises: 50,
    audio: 30,
    research: 20
  };

  const handleFiles = (fileList: FileList) => {
    const newFiles: UploadedFile[] = [];
    
    Array.from(fileList).forEach(file => {
      // Validate file type
      const allowedTypes = acceptedTypes[category].split(',');
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (!allowedTypes.includes(fileExtension)) {
        alert(`File type ${fileExtension} not allowed for ${category}`);
        return;
      }

      // Validate file size
      const maxSize = maxFileSize[category] * 1024 * 1024; // Convert MB to bytes
      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size: ${maxFileSize[category]}MB`);
        return;
      }

      const uploadedFile: UploadedFile = {
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'uploading',
        progress: 0
      };

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFiles(prev => prev.map(f => 
            f.name === file.name && f.size === file.size 
              ? { ...f, preview: e.target?.result as string }
              : f
          ));
        };
        reader.readAsDataURL(file);
      }

      newFiles.push(uploadedFile);
      
      // Simulate upload process
      simulateUpload(file, uploadedFile);
    });

    setFiles(prev => [...prev, ...newFiles]);
  };

  const simulateUpload = async (file: File, uploadedFile: UploadedFile) => {
    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setFiles(prev => prev.map(f => 
        f.name === file.name && f.size === file.size 
          ? { ...f, progress }
          : f
      ));
    }

    // Create object URL for local file access
    const objectUrl = URL.createObjectURL(file);
    
    // Read file content if it's text-based
    let content = '';
    if (file.type.startsWith('text/') || file.name.endsWith('.md') || file.name.endsWith('.txt')) {
      content = await file.text();
    }

    // Update file status to complete
    setFiles(prev => prev.map(f => 
      f.name === file.name && f.size === file.size 
        ? { ...f, status: 'complete', url: objectUrl }
        : f
    ));

    // Call callback if provided
    if (onFileImported) {
      onFileImported(file.name, content || objectUrl);
    }
  };

  const removeFile = (fileName: string, fileSize: number) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.name === fileName && f.size === fileSize);
      if (fileToRemove?.url) {
        URL.revokeObjectURL(fileToRemove.url);
      }
      return prev.filter(f => !(f.name === fileName && f.size === fileSize));
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCategoryInfo = () => {
    switch (category) {
      case 'characters':
        return {
          title: 'Character Images',
          description: 'Upload character images (JPG, PNG, GIF, WebP)',
          icon: <Image className="w-5 h-5" />
        };
      case 'assets':
        return {
          title: 'Asset Files',
          description: 'Upload images and graphics (JPG, PNG, SVG, WebP)',
          icon: <Upload className="w-5 h-5" />
        };
      default:
        return {
          title: 'File Upload',
          description: 'Upload files for this category',
          icon: <Upload className="w-5 h-5" />
        };
    }
  };

  const categoryInfo = getCategoryInfo();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {categoryInfo.icon}
          {categoryInfo.title}
        </CardTitle>
        <p className="text-sm text-gray-600">{categoryInfo.description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div className="space-y-4">
          {/* Primary Upload Button */}
          <div className="text-center">
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 px-8 py-3 text-lg"
              size="lg"
            >
              <Upload className="w-5 h-5 mr-2" />
              Browse and Select Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={acceptedTypes[category]}
              onChange={handleFileInput}
              className="hidden"
            />
          </div>
          
          {/* File Requirements Info */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">File Requirements:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Formats: {acceptedTypes[category]}</li>
              <li>• Maximum size: {maxFileSize[category]}MB per file</li>
              <li>• Multiple files can be selected at once</li>
              {category === 'characters' && (
                <li>• Name files exactly: max.png, mia.png, zeke.png, etc.</li>
              )}
            </ul>
          </div>
          
          {/* Alternative drag-drop area (smaller) */}
          <div
            className={`
              border-2 border-dashed rounded-lg p-4 text-center transition-colors text-sm
              ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <p className="text-gray-600">
              Or drag and drop files here (if supported by your browser)
            </p>
          </div>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Uploaded Files</h4>
            {files.map((file, index) => (
              <div key={`${file.name}-${file.size}-${index}`} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                {/* File Preview */}
                <div className="flex-shrink-0">
                  {file.preview ? (
                    <img 
                      src={file.preview} 
                      alt={file.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                      <Upload className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                  
                  {/* Progress Bar */}
                  {file.status === 'uploading' && (
                    <div className="mt-2">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${file.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Status & Actions */}
                <div className="flex items-center space-x-2">
                  {file.status === 'uploading' && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  )}
                  {file.status === 'complete' && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                  {file.status === 'error' && (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                  
                  <Badge variant={
                    file.status === 'complete' ? 'default' : 
                    file.status === 'error' ? 'destructive' : 'secondary'
                  }>
                    {file.status}
                  </Badge>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file.name, file.size)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Character-specific instructions */}
        {category === 'characters' && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Character Image Guidelines</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Name files with character names: max.png, mia.png, etc.</li>
              <li>• Square images work best (1:1 aspect ratio)</li>
              <li>• High resolution recommended (at least 512x512)</li>
              <li>• Clear, well-lit character portraits</li>
              <li>• Background will be automatically handled</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}