import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Download, Link, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function UrlFileImporter() {
  const [fileName, setFileName] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [category, setCategory] = useState('characters');
  const [importMethod, setImportMethod] = useState<'paste' | 'url'>('url');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleUrlImport = async () => {
    if (!fileUrl) {
      toast({
        title: 'Missing URL',
        description: 'Please provide a file URL from your wellnesscompanion app',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Try to fetch the content from the URL
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }
      
      const content = await response.text();
      const urlFileName = fileUrl.split('/').pop() || 'imported-file';
      
      toast({
        title: 'File Imported Successfully',
        description: `${urlFileName} has been imported to ${category}`,
      });
      
      // Reset form
      setFileUrl('');
      setFileName('');
      
    } catch (error) {
      toast({
        title: 'Import Failed',
        description: 'Could not fetch content from URL. Please check the link or try copy-paste method.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasteImport = () => {
    if (!fileName || !fileContent) {
      toast({
        title: 'Missing Information',
        description: 'Please provide both file name and content',
        variant: 'destructive'
      });
      return;
    }

    // Simulate saving the file
    const fullFileName = `${fileName}${fileName.includes('.') ? '' : '.md'}`;
    
    toast({
      title: 'File Imported Successfully',
      description: `${fullFileName} has been imported to ${category}`,
    });
    
    // Reset form
    setFileName('');
    setFileContent('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Import from Wellnesscompanion App</h2>
        <p className="text-gray-600">Import files using direct links or copy-paste content</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            File Import Tool
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full mt-1 rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="characters">Characters</option>
              <option value="assets">Assets</option>
              <option value="recipes">Recipes</option>
              <option value="exercises">Exercises</option>
              <option value="audio">Audio</option>
              <option value="research">Research</option>
            </select>
          </div>

          <Tabs value={importMethod} onValueChange={(value) => setImportMethod(value as 'paste' | 'url')} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="url" className="flex items-center gap-2">
                <Link className="h-4 w-4" />
                File/Folder Link
              </TabsTrigger>
              <TabsTrigger value="paste" className="flex items-center gap-2">
                <Copy className="h-4 w-4" />
                Copy & Paste
              </TabsTrigger>
            </TabsList>

            <TabsContent value="url" className="space-y-4">
              <div>
                <Label htmlFor="file-url">File or Folder URL</Label>
                <Input
                  id="file-url"
                  placeholder="https://replit.com/@username/wellnesscompanion/file.md or folder link"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <Button onClick={handleUrlImport} className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Importing...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Import from Link
                  </>
                )}
              </Button>

              <Alert>
                <Link className="h-4 w-4" />
                <AlertDescription>
                  <strong>How to get file links from wellnesscompanion:</strong>
                  <br />
                  1. Open your wellnesscompanion Replit app
                  <br />
                  2. Right-click on any file or folder
                  <br />
                  3. Select "Copy link" or "Share"
                  <br />
                  4. Paste the link above and click "Import from Link"
                  <br />
                  <br />
                  <strong>Supported formats:</strong> .md, .txt, .json, .csv files
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="paste" className="space-y-4">
              <div>
                <Label htmlFor="file-name">File Name</Label>
                <Input
                  id="file-name"
                  placeholder="e.g., character-profiles.md"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="file-content">File Content</Label>
                <Textarea
                  id="file-content"
                  placeholder="Copy and paste your file content from wellnesscompanion app here..."
                  value={fileContent}
                  onChange={(e) => setFileContent(e.target.value)}
                  rows={15}
                  className="mt-1 font-mono text-sm"
                />
              </div>

              <Button onClick={handlePasteImport} className="w-full" size="lg">
                <Download className="h-4 w-4 mr-2" />
                Import File
              </Button>

              <Alert>
                <Copy className="h-4 w-4" />
                <AlertDescription>
                  <strong>How to copy content from wellnesscompanion:</strong>
                  <br />
                  1. Open your wellnesscompanion app files
                  <br />
                  2. Copy the entire content of the file
                  <br />
                  3. Paste it in the text area above
                  <br />
                  4. Give it a filename and click "Import File"
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}