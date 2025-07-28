import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, File, CheckCircle, AlertCircle, X } from 'lucide-react';

interface FileUploadProps {
  category: 'audio' | 'recipes' | 'exercises' | 'research';
  accept: string;
  maxSize?: number; // in MB
  onUploadComplete?: (filePath: string) => void;
}

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'complete' | 'error';
  progress: number;
  url?: string;
}

export default function FileUpload({ category, accept, maxSize = 10, onUploadComplete }: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles: UploadedFile[] = [];
    
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is ${maxSize}MB.`);
        continue;
      }

      const newFile: UploadedFile = {
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'uploading',
        progress: 0
      };

      newFiles.push(newFile);
    }

    setFiles(prev => [...prev, ...newFiles]);

    // Simulate upload for each file
    newFiles.forEach((file, index) => {
      simulateUpload(selectedFiles[index], file);
    });
  };

  const simulateUpload = async (file: File, uploadedFile: UploadedFile) => {
    try {
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        
        setFiles(prev => 
          prev.map(f => 
            f.name === uploadedFile.name 
              ? { ...f, progress } 
              : f
          )
        );
      }

      // Simulate successful upload
      const filePath = `/assets/${category}/${file.name}`;
      
      setFiles(prev => 
        prev.map(f => 
          f.name === uploadedFile.name 
            ? { ...f, status: 'complete', url: filePath } 
            : f
        )
      );

      if (onUploadComplete) {
        onUploadComplete(filePath);
      }
    } catch (error) {
      setFiles(prev => 
        prev.map(f => 
          f.name === uploadedFile.name 
            ? { ...f, status: 'error' } 
            : f
        )
      );
    }
  };

  const removeFile = (fileName: string) => {
    setFiles(prev => prev.filter(f => f.name !== fileName));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'audio': return 'bg-purple-100 text-purple-800';
      case 'recipes': return 'bg-green-100 text-green-800';
      case 'exercises': return 'bg-blue-100 text-blue-800';
      case 'research': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload {category.charAt(0).toUpperCase() + category.slice(1)} Files
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFileSelect(e.dataTransfer.files);
          }}
        >
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Drop files here or click to browse
          </h3>
          <p className="text-gray-600 mb-4">
            Supported formats: {accept}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Maximum file size: {maxSize}MB
          </p>
          
          <Label htmlFor="file-input">
            <Button variant="outline" className="cursor-pointer">
              Choose Files
            </Button>
          </Label>
          <Input
            id="file-input"
            type="file"
            accept={accept}
            multiple
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
          />
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Uploaded Files</h4>
            {files.map((file, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  {file.status === 'complete' ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : file.status === 'error' ? (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  ) : (
                    <File className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <Badge className={getCategoryColor(category)}>
                      {category}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                  
                  {file.status === 'uploading' && (
                    <div className="mt-2">
                      <Progress value={file.progress} className="h-2" />
                      <p className="text-xs text-gray-500 mt-1">
                        {file.progress}% uploaded
                      </p>
                    </div>
                  )}
                  
                  {file.status === 'complete' && file.url && (
                    <p className="text-xs text-green-600 mt-1">
                      Uploaded successfully • {file.url}
                    </p>
                  )}
                  
                  {file.status === 'error' && (
                    <p className="text-xs text-red-600 mt-1">
                      Upload failed
                    </p>
                  )}
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file.name)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Upload Guidelines</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Files will be organized by category in your assets folder</li>
            <li>• Use descriptive filenames for easy searching</li>
            <li>• Markdown files (.md) are preferred for text content</li>
            <li>• Include metadata like tags, categories, and descriptions</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}