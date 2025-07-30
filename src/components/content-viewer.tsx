import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, ExternalLink, Eye } from 'lucide-react';

interface ContentViewerProps {
  title: string;
  filePath: string;
  description?: string;
}

export default function ContentViewer({ title, filePath, description }: ContentViewerProps) {
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleViewContent = async () => {
    if (content && isExpanded) {
      setIsExpanded(false);
      return;
    }

    if (!content) {
      setIsLoading(true);
      try {
        const response = await fetch(filePath);
        if (response.ok) {
          const text = await response.text();
          setContent(text);
        } else {
          setContent(`# ${title}\n\nContent not available. The file may need to be uploaded first.\n\nExpected location: ${filePath}`);
        }
      } catch (error) {
        setContent(`# ${title}\n\nError loading content: ${error}\n\nFile path: ${filePath}`);
      }
      setIsLoading(false);
    }
    
    setIsExpanded(!isExpanded);
  };

  const handleDownload = () => {
    if (content) {
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5" />
              {title}
            </CardTitle>
            {description && (
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={handleViewContent} disabled={isLoading}>
            <Eye className="h-4 w-4 mr-2" />
            {isLoading ? 'Loading...' : isExpanded ? 'Hide Content' : 'View Content'}
          </Button>
          {content && (
            <Button variant="outline" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          )}
        </div>

        {isExpanded && content && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg max-h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">{content}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}