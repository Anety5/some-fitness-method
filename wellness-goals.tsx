import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, Plus, Calendar, TrendingUp } from 'lucide-react';

interface WellnessGoal {
  id: number;
  title: string;
  description: string;
  category: 'sleep' | 'nutrition' | 'exercise' | 'mindfulness' | 'general';
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: Date;
  isActive: boolean;
}

interface WellnessGoalsProps {
  userId: number;
}

export default function WellnessGoals({ userId }: WellnessGoalsProps) {
  const [goals, setGoals] = useState<WellnessGoal[]>([
    {
      id: 1,
      title: "Improve Sleep Quality",
      description: "Achieve 8 hours of quality sleep based on research-backed sleep hygiene practices",
      category: "sleep",
      targetValue: 8,
      currentValue: 6.5,
      unit: "hours",
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isActive: true
    },
    {
      id: 2,
      title: "Daily Meditation Practice",
      description: "Establish consistent evidence-based meditation practice for stress reduction",
      category: "mindfulness",
      targetValue: 20,
      currentValue: 12,
      unit: "minutes",
      deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      isActive: true
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'general' as const,
    targetValue: 0,
    unit: '',
    deadline: ''
  });

  const getCategoryColor = (category: string) => {
    const colors = {
      sleep: 'bg-blue-100 text-blue-800',
      nutrition: 'bg-green-100 text-green-800',
      exercise: 'bg-orange-100 text-orange-800',
      mindfulness: 'bg-purple-100 text-purple-800',
      general: 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors.general;
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const handleAddGoal = () => {
    if (newGoal.title && newGoal.targetValue > 0) {
      const goal: WellnessGoal = {
        id: Date.now(),
        title: newGoal.title,
        description: newGoal.description,
        category: newGoal.category,
        targetValue: newGoal.targetValue,
        currentValue: 0,
        unit: newGoal.unit,
        deadline: new Date(newGoal.deadline),
        isActive: true
      };
      setGoals([...goals, goal]);
      setNewGoal({
        title: '',
        description: '',
        category: 'general',
        targetValue: 0,
        unit: '',
        deadline: ''
      });
      setShowAddForm(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Target className="h-6 w-6 text-red-600" />
          <h2 className="text-2xl font-bold text-gray-900">Wellness Goals</h2>
        </div>
        <Button 
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Goal</span>
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Wellness Goal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Goal title"
              value={newGoal.title}
              onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
            />
            <Textarea
              placeholder="Goal description"
              value={newGoal.description}
              onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
              <select
                className="rounded-md border border-gray-300 px-3 py-2"
                value={newGoal.category}
                onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value as any })}
              >
                <option value="general">General</option>
                <option value="sleep">Sleep</option>
                <option value="nutrition">Nutrition</option>
                <option value="exercise">Exercise</option>
                <option value="mindfulness">Mindfulness</option>
              </select>
              <Input
                type="number"
                placeholder="Target value"
                value={newGoal.targetValue || ''}
                onChange={(e) => setNewGoal({ ...newGoal, targetValue: Number(e.target.value) })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Unit (hours, minutes, etc.)"
                value={newGoal.unit}
                onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
              />
              <Input
                type="date"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleAddGoal}>Add Goal</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal) => (
          <Card key={goal.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{goal.title}</CardTitle>
                  <Badge className={`mt-2 ${getCategoryColor(goal.category)}`}>
                    {goal.category}
                  </Badge>
                </div>
                <TrendingUp className="h-5 w-5 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-sm">{goal.description}</p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{goal.currentValue} / {goal.targetValue} {goal.unit}</span>
                </div>
                <Progress value={getProgressPercentage(goal.currentValue, goal.targetValue)} />
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Due: {goal.deadline.toLocaleDateString()}</span>
                </div>
                <span>{Math.round(getProgressPercentage(goal.currentValue, goal.targetValue))}% complete</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {goals.length === 0 && !showAddForm && (
        <Card>
          <CardContent className="text-center py-12">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No wellness goals yet</h3>
            <p className="text-gray-600 mb-4">Start your wellness journey by setting your first goal</p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Goal
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}