import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FileViewer from '@/components/file-viewer';
import ContentViewer from '@/components/content-viewer';
import { ExternalLink, Search, BookOpen, Globe, FileText, Video, Headphones, Music, Wind } from 'lucide-react';

interface Reference {
  id: number;
  title: string;
  type: 'research' | 'article' | 'video' | 'audio' | 'tool' | 'guide';
  description: string;
  url: string;
  category: 'sleep' | 'meditation' | 'nutrition' | 'exercise' | 'mental-health' | 'general';
  source: string;
  rating?: number;
}

export default function Explore() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const references: Reference[] = [
    {
      id: 1,
      title: "Sleep Foundation - Sleep Hygiene Guidelines",
      type: "guide",
      description: "Comprehensive guide to evidence-based sleep hygiene practices for better sleep quality and duration.",
      url: "https://www.sleepfoundation.org/sleep-hygiene",
      category: "sleep",
      source: "Sleep Foundation",
      rating: 5
    },
    {
      id: 2,
      title: "Mindfulness-Based Stress Reduction (MBSR) Program",
      type: "research",
      description: "Original research and program details from the University of Massachusetts Medical School on MBSR effectiveness.",
      url: "https://www.umassmed.edu/cfm/mindfulness-based-programs/mbsr-courses/",
      category: "meditation",
      source: "UMass Medical School",
      rating: 5
    },
    {
      id: 3,
      title: "Harvard Health - The Benefits of Meditation",
      type: "article",
      description: "Harvard Medical School's comprehensive overview of meditation benefits backed by clinical research.",
      url: "https://www.health.harvard.edu/blog/benefits-of-meditation-2018042513685",
      category: "meditation",
      source: "Harvard Medical School",
      rating: 5
    },
    {
      id: 4,
      title: "Progressive Muscle Relaxation Audio Guide",
      type: "audio",
      description: "Free guided progressive muscle relaxation session based on clinical protocols for stress reduction.",
      url: "https://www.dartmouth.edu/~healthed/relax/downloads.html",
      category: "mental-health",
      source: "Dartmouth College",
      rating: 4
    },
    {
      id: 5,
      title: "Mayo Clinic - Stress Management Techniques",
      type: "guide",
      description: "Evidence-based stress management strategies including breathing exercises and mindfulness techniques.",
      url: "https://www.mayoclinic.org/healthy-lifestyle/stress-management/in-depth/stress-management/art-20044151",
      category: "mental-health",
      source: "Mayo Clinic",
      rating: 5
    },
    {
      id: 6,
      title: "National Sleep Foundation Sleep Diary",
      type: "tool",
      description: "Downloadable sleep diary template for tracking sleep patterns and identifying improvement areas.",
      url: "https://www.sleepfoundation.org/sleep-diary",
      category: "sleep",
      source: "Sleep Foundation",
      rating: 4
    },
    {
      id: 7,
      title: "Insight Timer - Free Meditation App",
      type: "tool",
      description: "Large library of guided meditations, sleep stories, and mindfulness exercises from certified teachers.",
      url: "https://insighttimer.com/",
      category: "meditation",
      source: "Insight Timer",
      rating: 4
    },
    {
      id: 8,
      title: "American Heart Association - Exercise Guidelines",
      type: "guide",
      description: "Official guidelines for physical activity and exercise recommendations for optimal health.",
      url: "https://www.heart.org/en/healthy-living/fitness/fitness-basics/aha-recs-for-physical-activity-in-adults",
      category: "exercise",
      source: "American Heart Association",
      rating: 5
    },
    {
      id: 9,
      title: "Headspace Guide to Meditation Netflix Series",
      type: "video",
      description: "Educational series explaining meditation techniques and their benefits, featuring animated explanations.",
      url: "https://www.netflix.com/title/81280926",
      category: "meditation",
      source: "Netflix/Headspace",
      rating: 4
    },
    {
      id: 10,
      title: "NIH - Relaxation Techniques for Health",
      type: "research",
      description: "National Institutes of Health comprehensive review of relaxation techniques and their health benefits.",
      url: "https://www.nccih.nih.gov/health/relaxation-techniques-what-you-need-to-know",
      category: "mental-health",
      source: "National Institutes of Health",
      rating: 5
    },
    {
      id: 11,
      title: "Rain Sounds for Sleep - Nature Sounds",
      type: "audio",
      description: "High-quality rain and nature sounds for relaxation and sleep improvement, scientifically optimized.",
      url: "https://mynoise.net/NoiseMachines/rainNoiseGenerator.php",
      category: "sleep",
      source: "myNoise",
      rating: 4
    },
    {
      id: 12,
      title: "Nutrition.gov - Healthy Eating Guidelines",
      type: "guide",
      description: "Official dietary guidelines and nutrition information from the US Department of Agriculture.",
      url: "https://www.nutrition.gov/",
      category: "nutrition",
      source: "USDA",
      rating: 5
    }
  ];

  const getTypeIcon = (type: string) => {
    const icons = {
      research: <FileText className="h-4 w-4" />,
      article: <BookOpen className="h-4 w-4" />,
      video: <Video className="h-4 w-4" />,
      audio: <Headphones className="h-4 w-4" />,
      tool: <Globe className="h-4 w-4" />,
      guide: <BookOpen className="h-4 w-4" />
    };
    return icons[type as keyof typeof icons] || <Globe className="h-4 w-4" />;
  };

  const getTypeBadgeColor = (type: string) => {
    const colors = {
      research: 'bg-blue-100 text-blue-800',
      article: 'bg-green-100 text-green-800',
      video: 'bg-red-100 text-red-800',
      audio: 'bg-purple-100 text-purple-800',
      tool: 'bg-orange-100 text-orange-800',
      guide: 'bg-indigo-100 text-indigo-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryBadgeColor = (category: string) => {
    const colors = {
      sleep: 'bg-blue-100 text-blue-800',
      meditation: 'bg-purple-100 text-purple-800',
      nutrition: 'bg-green-100 text-green-800',
      exercise: 'bg-orange-100 text-orange-800',
      'mental-health': 'bg-pink-100 text-pink-800',
      general: 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
            ★
          </span>
        ))}
      </div>
    );
  };

  const filteredReferences = references.filter(ref => {
    const matchesSearch = ref.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ref.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ref.source.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || ref.category === selectedCategory;
    const matchesType = selectedType === 'all' || ref.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Explore More Options</h1>
        <p className="text-gray-600">Discover evidence-based resources, tools, and guides for your wellness journey</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <select
            className="rounded-md border border-gray-300 px-3 py-2 min-w-[120px]"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="sleep">Sleep</option>
            <option value="meditation">Meditation</option>
            <option value="nutrition">Nutrition</option>
            <option value="exercise">Exercise</option>
            <option value="mental-health">Mental Health</option>
            <option value="general">General</option>
          </select>
          <select
            className="rounded-md border border-gray-300 px-3 py-2 min-w-[100px]"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="research">Research</option>
            <option value="article">Article</option>
            <option value="video">Video</option>
            <option value="audio">Audio</option>
            <option value="tool">Tool</option>
            <option value="guide">Guide</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredReferences.map((ref) => (
          <Card key={ref.id} className="hover:shadow-lg transition-shadow h-full flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg leading-tight pr-2">{ref.title}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="flex-shrink-0"
                >
                  <a href={ref.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge className={`${getTypeBadgeColor(ref.type)} flex items-center gap-1`}>
                  {getTypeIcon(ref.type)}
                  {ref.type}
                </Badge>
                <Badge className={getCategoryBadgeColor(ref.category)}>
                  {ref.category.replace('-', ' ')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <p className="text-gray-600 text-sm leading-relaxed">{ref.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-medium">{ref.source}</span>
                  {renderStars(ref.rating)}
                </div>
              </div>
              <Button
                className="w-full mt-4"
                variant="outline"
                asChild
              >
                <a href={ref.url} target="_blank" rel="noopener noreferrer">
                  Visit Resource
                  <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredReferences.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
            <p className="text-gray-600">Try adjusting your search terms or filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}