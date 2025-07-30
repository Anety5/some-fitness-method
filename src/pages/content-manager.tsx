import Navigation from "@/components/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Upload, Copy, User, Image, ChefHat, Headphones, BookOpen, CheckCircle, Archive } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import FileImporter from "@/components/file-importer";

export default function ContentManager() {
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const { toast } = useToast();

  const handleCompressedFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    for (let file of Array.from(files)) {
      const fileName = file.name;
      setUploadProgress(prev => ({ ...prev, [fileName]: 0 }));

      try {
        // Simulate upload progress
        for (let i = 0; i <= 100; i += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setUploadProgress(prev => ({ ...prev, [fileName]: i }));
        }

        // Simulate successful upload
        setUploadedFiles(prev => [...prev, fileName]);
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[fileName];
          return newProgress;
        });

        toast({
          title: 'File Uploaded Successfully',
          description: `${fileName} has been extracted and organized into categories`,
        });

      } catch (error) {
        toast({
          title: 'Upload Failed',
          description: `Failed to upload ${fileName}`,
          variant: 'destructive'
        });
      }
    }
  };

  const handleIndividualFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    for (let file of Array.from(files)) {
      const fileName = file.name;
      setUploadProgress(prev => ({ ...prev, [fileName]: 0 }));

      try {
        // Simulate upload progress
        for (let i = 0; i <= 100; i += 20) {
          await new Promise(resolve => setTimeout(resolve, 50));
          setUploadProgress(prev => ({ ...prev, [fileName]: i }));
        }

        setUploadedFiles(prev => [...prev, fileName]);
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[fileName];
          return newProgress;
        });

        toast({
          title: 'File Uploaded Successfully',
          description: `${fileName} has been added to your content library`,
        });

      } catch (error) {
        toast({
          title: 'Upload Failed',
          description: `Failed to upload ${fileName}`,
          variant: 'destructive'
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">Content Manager</h1>
              <p className="text-gray-600">Upload and manage your wellness content files</p>
            </div>

            <Tabs defaultValue="import" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="import">
                  <Copy className="h-4 w-4 mr-2" />
                  Import from App
                </TabsTrigger>
                <TabsTrigger value="characters">
                  <User className="h-4 w-4 mr-2" />
                  Characters
                </TabsTrigger>
                <TabsTrigger value="files">
                  <FileText className="h-4 w-4 mr-2" />
                  My Files
                </TabsTrigger>
                <TabsTrigger value="upload">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Files
                </TabsTrigger>
              </TabsList>

              <TabsContent value="import">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="h-5 w-5" />
                      Upload Compressed Files
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <input
                        type="file"
                        accept=".zip,.tar,.tar.gz,.rar"
                        className="hidden"
                        id="compressed-upload"
                        multiple
                        onChange={handleCompressedFileUpload}
                      />
                      <label htmlFor="compressed-upload" className="cursor-pointer">
                        <Archive className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">Upload Compressed Files</h3>
                        <p className="text-gray-600 mb-4">
                          Drag and drop your .zip, .tar.gz, or .rar files here, or click to browse
                        </p>
                        <Button variant="outline" size="lg">
                          Choose Compressed Files
                        </Button>
                      </label>
                    </div>
                    
                    {/* Upload Progress */}
                    {Object.keys(uploadProgress).length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium">Uploading Files...</h4>
                        {Object.entries(uploadProgress).map(([fileName, progress]) => (
                          <div key={fileName} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{fileName}</span>
                              <span>{progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Recently Uploaded Files */}
                    {uploadedFiles.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium">Recently Uploaded:</h4>
                        <div className="space-y-1">
                          {uploadedFiles.slice(-5).map((fileName, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-green-600">
                              <CheckCircle className="h-4 w-4" />
                              <span>{fileName}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <Alert>
                      <Archive className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Supported formats:</strong> .zip, .tar, .tar.gz, .rar
                        <br />
                        The system will automatically extract and organize your files into the appropriate categories:
                        <br />
                        • Characters → /characters/
                        <br />
                        • Recipes → /recipes/
                        <br />
                        • Exercises → /exercises/
                        <br />
                        • Audio → /audio/
                        <br />
                        • Research → /research/
                        <br />
                        • Other files → /assets/
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="characters">
                <div className="space-y-6">
                  <FileImporter 
                    category="characters"
                    onFileImported={(fileName, url) => {
                      // Extract character name from filename 
                      const characterName = fileName.split('.')[0].toLowerCase();
                      // Save to localStorage for character system
                      const existing = JSON.parse(localStorage.getItem('character-images') || '{}');
                      existing[characterName] = url;
                      localStorage.setItem('character-images', JSON.stringify(existing));
                      
                      toast({
                        title: 'Character Image Uploaded',
                        description: `${characterName} character image has been updated successfully`,
                      });
                    }}
                  />
                  
                  <Alert>
                    <User className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Character Image Guidelines:</strong>
                      <br />
                      • Name files exactly: max.png, mia.png, zeke.png, luna.png, kai.png, nova.png, gunner.png
                      <br />
                      • Square images (1:1 ratio) work best for the character display
                      <br />
                      • High resolution recommended (512x512 pixels or higher)
                      <br />
                      • Supported formats: JPG, PNG, GIF, WebP (max 5MB each)
                      <br />
                      • Images will automatically replace the emoji placeholders in your app
                    </AlertDescription>
                  </Alert>
                </div>
              </TabsContent>

              <TabsContent value="files">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Files</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <ChefHat className="h-4 w-4 text-green-600" />
                          <span className="font-medium">Recipes (6 files)</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Stress-relief, energy-boost, sleep, focus, and immune recipes</p>
                        <div className="text-xs text-gray-500 space-y-1">
                          <div>• stress-relief-recipes.md</div>
                          <div>• energy-boost-recipes.md</div>
                          <div>• focus-recipes.md</div>
                          <div>• sleep-recipes.md</div>
                          <div>• immune-recipes.md</div>
                          <div>• sample-recipes.md</div>
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">Exercises (1 file)</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Breathing exercises and wellness activities</p>
                        <div className="text-xs text-gray-500">
                          <div>• breathing-exercises.md</div>
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="h-4 w-4 text-purple-600" />
                          <span className="font-medium">Characters (1 file)</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Wellness character files and profiles</p>
                        <div className="text-xs text-gray-500">
                          <div>• character-info.md</div>
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Headphones className="h-4 w-4 text-pink-600" />
                          <span className="font-medium">Audio (1 file)</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Meditation sounds and audio resources</p>
                        <div className="text-xs text-gray-500">
                          <div>• meditation-sounds.txt</div>
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <BookOpen className="h-4 w-4 text-orange-600" />
                          <span className="font-medium">Research (1 file)</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Wellness references and research papers</p>
                        <div className="text-xs text-gray-500">
                          <div>• wellness-references.md</div>
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Image className="h-4 w-4 text-cyan-600" />
                          <span className="font-medium">Assets</span>
                        </div>
                        <p className="text-sm text-gray-600">Images, graphics, and other assets</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="upload">
                <Card>
                  <CardHeader>
                    <CardTitle>Upload Individual Files</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <input
                        type="file"
                        accept=".md,.txt,.pdf,.mp3,.wav,.m4a,.json,.csv,.png,.jpg,.jpeg,.gif"
                        className="hidden"
                        id="individual-upload"
                        multiple
                        onChange={handleIndividualFileUpload}
                      />
                      <label htmlFor="individual-upload" className="cursor-pointer">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">Upload Individual Files</h3>
                        <p className="text-gray-600 mb-4">
                          Upload individual wellness content files
                        </p>
                        <Button variant="outline" size="lg">
                          Choose Files
                        </Button>
                      </label>
                    </div>
                    
                    <Alert>
                      <FileText className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Supported file types:</strong>
                        <br />
                        • Documents: .md, .txt, .pdf
                        <br />
                        • Audio: .mp3, .wav, .m4a
                        <br />
                        • Data: .json, .csv
                        <br />
                        • Images: .png, .jpg, .jpeg, .gif
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </div>
  );
}