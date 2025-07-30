import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, FileText, Headphones, ChefHat, BookOpen, Eye, Download, Trash2 } from 'lucide-react';
import FileUpload from './file-upload';
import ContentViewer from './content-viewer';
import FileImporter from './file-importer';

interface FileItem {
  name: string;
  path: string;
  category: 'audio' | 'recipes' | 'exercises' | 'research' | 'characters' | 'assets';
  size: number;
  type: string;
  uploadDate: string;
  description?: string;
}

export default function FileManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewingFile, setViewingFile] = useState<FileItem | null>(null);

  // Sample files - in real app, this would come from API
  const sampleFiles: FileItem[] = [
    {
      name: 'stress-relief-recipes.md',
      path: '/assets/recipes/stress-relief-recipes.md',
      category: 'recipes',
      size: 2048,
      type: 'text/markdown',
      uploadDate: '2024-01-15',
      description: 'Calming recipes to reduce stress and anxiety'
    },
    {
      name: 'energy-boost-recipes.md',
      path: '/assets/recipes/energy-boost-recipes.md',
      category: 'recipes',
      size: 1856,
      type: 'text/markdown',
      uploadDate: '2024-01-15',
      description: 'Nutritious recipes for natural energy'
    },
    {
      name: 'breathing-exercises.md',
      path: '/assets/exercises/breathing-exercises.md',
      category: 'exercises',
      size: 1024,
      type: 'text/markdown',
      uploadDate: '2024-01-10',
      description: 'Guided breathing techniques and exercises'
    },
    {
      name: 'meditation-sounds.txt',
      path: '/assets/audio/meditation-sounds.txt',
      category: 'audio',
      size: 512,
      type: 'text/plain',
      uploadDate: '2024-01-12',
      description: 'Collection of calming meditation audio files'
    },
    {
      name: 'wellness-references.md',
      path: '/assets/research/wellness-references.md',
      category: 'research',
      size: 3072,
      type: 'text/markdown',
      uploadDate: '2024-01-08',
      description: 'Research papers and wellness studies'
    },
    {
      name: 'character-info.md',
      path: '/assets/characters/character-info.md',
      category: 'characters',
      size: 256,
      type: 'text/markdown',
      uploadDate: '2024-01-16',
      description: 'Wellness character files from wellnesscompanion app'
    }
  ];

  const filteredFiles = sampleFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || file.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'audio': return <Headphones className="h-4 w-4" />;
      case 'recipes': return <ChefHat className="h-4 w-4" />;
      case 'exercises': return <FileText className="h-4 w-4" />;
      case 'research': return <BookOpen className="h-4 w-4" />;
      case 'characters': return <Search className="h-4 w-4" />;
      case 'assets': return <Search className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'audio': return 'bg-purple-100 text-purple-800';
      case 'recipes': return 'bg-green-100 text-green-800';
      case 'exercises': return 'bg-blue-100 text-blue-800';
      case 'research': return 'bg-orange-100 text-orange-800';
      case 'characters': return 'bg-pink-100 text-pink-800';
      case 'assets': return 'bg-cyan-100 text-cyan-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleFileUpload = (filePath: string) => {
    console.log('File uploaded:', filePath);
    // In real app, would refresh file list from API
  };

  if (viewingFile) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setViewingFile(null)}>
            ← Back to Files
          </Button>
          <h2 className="text-xl font-semibold">{viewingFile.name}</h2>
        </div>
        
        <ContentViewer 
          title={viewingFile.name}
          filePath={viewingFile.path}
          description={viewingFile.description}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Content Manager</h2>
        <p className="text-gray-600">Upload and manage your wellness content files</p>
      </div>

      <Tabs defaultValue="files" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="files">My Files</TabsTrigger>
          <TabsTrigger value="upload">Upload Files</TabsTrigger>
          <TabsTrigger value="import">Import from App</TabsTrigger>
        </TabsList>

        <TabsContent value="files" className="space-y-6">
          {/* Search and Filter */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search files..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  {['all', 'recipes', 'exercises', 'audio', 'research', 'characters', 'assets'].map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* File List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFiles.map((file, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(file.category)}
                      <CardTitle className="text-sm truncate">{file.name}</CardTitle>
                    </div>
                    <Badge className={getCategoryColor(file.category)}>
                      {file.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {file.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {file.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{formatFileSize(file.size)}</span>
                      <span>{file.uploadDate}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewingFile(file)}
                        className="flex-1"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredFiles.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No files found</h3>
                <p className="text-gray-600">
                  {searchTerm ? 'Try adjusting your search terms' : 'Upload some files to get started'}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="upload" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FileUpload 
              category="recipes"
              accept=".md,.txt,.pdf"
              maxSize={5}
              onUploadComplete={handleFileUpload}
            />
            <FileUpload 
              category="exercises"
              accept=".md,.txt,.pdf"
              maxSize={5}
              onUploadComplete={handleFileUpload}
            />
            <FileUpload 
              category="audio"
              accept=".mp3,.wav,.m4a,.txt"
              maxSize={50}
              onUploadComplete={handleFileUpload}
            />
            <FileUpload 
              category="research"
              accept=".md,.txt,.pdf"
              maxSize={10}
              onUploadComplete={handleFileUpload}
            />
          </div>
        </TabsContent>

        <TabsContent value="import" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FileImporter 
              category="characters"
              onFileImported={(fileName, content) => {
                console.log('Character file imported:', fileName);
                handleFileUpload(`/assets/characters/${fileName}`);
              }}
            />
            <FileImporter 
              category="assets"
              onFileImported={(fileName, content) => {
                console.log('Asset file imported:', fileName);
                handleFileUpload(`/assets/${fileName}`);
              }}
            />
            <FileImporter 
              category="recipes"
              onFileImported={(fileName, content) => {
                console.log('Recipe file imported:', fileName);
                handleFileUpload(`/assets/recipes/${fileName}`);
              }}
            />
            <FileImporter 
              category="exercises"
              onFileImported={(fileName, content) => {
                console.log('Exercise file imported:', fileName);
                handleFileUpload(`/assets/exercises/${fileName}`);
              }}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}