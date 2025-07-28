import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpen, Search, ExternalLink, Star } from 'lucide-react';

interface ResearchItem {
  id: number;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  abstract: string;
  category: 'sleep' | 'meditation' | 'nutrition' | 'exercise' | 'mental-health';
  evidenceLevel: 'high' | 'medium' | 'low';
  keyFindings: string[];
  url?: string;
}

export default function ResearchLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const researchItems: ResearchItem[] = [
    {
      id: 1,
      title: "Mindfulness-Based Stress Reduction and Health Benefits: A Meta-Analysis",
      authors: ["Goyal, M.", "Singh, S.", "Sibinga, E.M.S."],
      journal: "JAMA Internal Medicine",
      year: 2014,
      abstract: "This meta-analysis examined the effectiveness of mindfulness meditation programs in improving anxiety, depression, and pain. The study found moderate evidence for reduced anxiety, depression, and pain, with effects maintained at 3-6 months.",
      category: "meditation",
      evidenceLevel: "high",
      keyFindings: [
        "Moderate evidence for anxiety reduction",
        "Significant improvement in depression scores",
        "Pain reduction maintained over 3-6 months",
        "Effects comparable to other behavioral interventions"
      ],
      url: "https://jamanetwork.com/journals/jamainternalmedicine/fullarticle/1809754"
    },
    {
      id: 2,
      title: "Sleep Duration and Quality: Impact on Lifestyle Behaviors and Health Outcomes",
      authors: ["Hirshkowitz, M.", "Whiton, K.", "Albert, S.M."],
      journal: "Sleep Medicine Reviews",
      year: 2015,
      abstract: "Comprehensive review of sleep research showing optimal sleep duration of 7-9 hours for adults, with quality being equally important as quantity for health outcomes.",
      category: "sleep",
      evidenceLevel: "high",
      keyFindings: [
        "7-9 hours optimal for most adults",
        "Sleep quality as important as duration",
        "Poor sleep linked to multiple health issues",
        "Sleep hygiene practices improve outcomes"
      ]
    },
    {
      id: 3,
      title: "The Effect of Natural Sounds on Stress Reduction and Cognitive Performance",
      authors: ["Alvarsson, J.J.", "Wiens, S.", "Nilsson, M.E."],
      journal: "Applied Psychology: Health and Well-Being",
      year: 2010,
      abstract: "Study demonstrating that natural sounds, particularly water and rain, significantly reduce stress markers and improve cognitive recovery compared to urban noise.",
      category: "meditation",
      evidenceLevel: "medium",
      keyFindings: [
        "Natural sounds reduce cortisol levels",
        "Rain sounds most effective for relaxation",
        "Improved attention restoration",
        "Better than silence for some individuals"
      ]
    },
    {
      id: 4,
      title: "Progressive Muscle Relaxation for Sleep Quality in Adults: A Systematic Review",
      authors: ["Dolbier, C.L.", "Rush, T.E."],
      journal: "Sleep Medicine",
      year: 2012,
      abstract: "Systematic review showing progressive muscle relaxation techniques significantly improve sleep quality, reduce sleep latency, and decrease nighttime awakenings.",
      category: "sleep",
      evidenceLevel: "high",
      keyFindings: [
        "Significant improvement in sleep quality",
        "Reduced time to fall asleep",
        "Fewer nighttime awakenings",
        "Effective for insomnia treatment"
      ]
    }
  ];

  const getEvidenceBadgeColor = (level: string) => {
    const colors = {
      high: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-red-100 text-red-800'
    };
    return colors[level as keyof typeof colors];
  };

  const getCategoryBadgeColor = (category: string) => {
    const colors = {
      sleep: 'bg-blue-100 text-blue-800',
      meditation: 'bg-purple-100 text-purple-800',
      nutrition: 'bg-green-100 text-green-800',
      exercise: 'bg-orange-100 text-orange-800',
      'mental-health': 'bg-pink-100 text-pink-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const filteredResearch = researchItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.abstract.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.authors.some(author => author.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <BookOpen className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold text-gray-900">Evidence-Based Research Library</h2>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search research papers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          className="rounded-md border border-gray-300 px-3 py-2 min-w-[150px]"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="sleep">Sleep</option>
          <option value="meditation">Meditation</option>
          <option value="nutrition">Nutrition</option>
          <option value="exercise">Exercise</option>
          <option value="mental-health">Mental Health</option>
        </select>
      </div>

      <div className="space-y-6">
        {filteredResearch.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg leading-tight pr-4">{item.title}</CardTitle>
                  {item.url && (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={item.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  {item.authors.join(", ")} • {item.journal} ({item.year})
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge className={getCategoryBadgeColor(item.category)}>
                    {item.category.replace('-', ' ')}
                  </Badge>
                  <Badge className={getEvidenceBadgeColor(item.evidenceLevel)}>
                    {item.evidenceLevel} evidence
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 text-sm leading-relaxed">{item.abstract}</p>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <Star className="h-4 w-4 mr-1 text-yellow-500" />
                  Key Findings:
                </h4>
                <ul className="space-y-1">
                  {item.keyFindings.map((finding, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {finding}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredResearch.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No research found</h3>
            <p className="text-gray-600">Try adjusting your search terms or category filter</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}