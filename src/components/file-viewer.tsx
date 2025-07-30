import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, ExternalLink, Play, Pause } from 'lucide-react';

interface FileViewerProps {
  title: string;
  filePath: string;
  type: 'audio' | 'text' | 'link';
  description?: string;
}

export default function FileViewer({ title, filePath, type, description }: FileViewerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleViewFile = async () => {
    if (type === 'link') {
      window.open(filePath, '_blank');
      return;
    }

    if (type === 'text') {
      setIsLoading(true);
      try {
        const response = await fetch(filePath);
        const text = await response.text();
        setContent(text);
      } catch (error) {
        setContent('Error loading file content.');
      }
      setIsLoading(false);
    }

    if (type === 'audio') {
      try {
        const audio = new Audio(filePath);
        if (isPlaying) {
          audio.pause();
          setIsPlaying(false);
        } else {
          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsPlaying(true);
                audio.onended = () => setIsPlaying(false);
              })
              .catch(error => {
                console.log('Audio playback failed:', error);
                setIsPlaying(false);
              });
          }
        }
      } catch (error) {
        console.log('Audio creation failed:', error);
        setIsPlaying(false);
      }
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = filePath;
    link.download = title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getIcon = () => {
    switch (type) {
      case 'audio':
        return isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />;
      case 'link':
        return <ExternalLink className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getActionText = () => {
    switch (type) {
      case 'audio':
        return isPlaying ? 'Pause' : 'Play';
      case 'link':
        return 'Open Link';
      default:
        return 'View Content';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          {getIcon()}
          {title}
        </CardTitle>
        {description && (
          <p className="text-sm text-gray-600">{description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={handleViewFile} disabled={isLoading}>
            {getIcon()}
            {getActionText()}
          </Button>
          {type !== 'link' && (
            <Button variant="outline" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          )}
        </div>

        {content && type === 'text' && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg max-h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm">{content}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}