import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { Target, Plus, ArrowLeft, Trophy, Calendar, CheckCircle, Clock, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import BotanicalDecorations from "@/components/botanical-decorations";

// Goal schema for form validation
const goalSchema = z.object({
  title: z.string().min(1, "Goal title is required"),
  description: z.string().optional(),
  category: z.enum(["sleep", "oxygen", "move", "eat", "wellness"]),
  targetValue: z.number().min(1, "Target value must be positive"),
  targetUnit: z.string().min(1, "Target unit is required"),
  deadline: z.string().min(1, "Deadline is required"),
});

type GoalForm = z.infer<typeof goalSchema>;

interface Goal {
  id: number;
  title: string;
  description?: string;
  category: "sleep" | "oxygen" | "move" | "eat" | "wellness";
  targetValue: number;
  targetUnit: string;
  currentValue: number;
  deadline: string;
  status: "active" | "completed" | "paused";
  createdAt: string;
}

export default function Goals() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock user ID - in real app would come from auth context
  const userId = 1;

  // Form setup
  const form = useForm<GoalForm>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "wellness",
      targetValue: 1,
      targetUnit: "days",
      deadline: "",
    },
  });

  // Mock goals data - in real app this would come from API
  const mockGoals: Goal[] = [
    {
      id: 1,
      title: "Daily Check-ins for 30 Days",
      description: "Complete daily wellness check-ins consistently",
      category: "wellness",
      targetValue: 30,
      targetUnit: "days",
      currentValue: 12,
      deadline: "2025-02-25",
      status: "active",
      createdAt: "2025-01-25",
    },
    {
      id: 2,
      title: "Breathing Exercises Weekly",
      description: "Practice breathing exercises 5 times per week",
      category: "oxygen",
      targetValue: 5,
      targetUnit: "sessions/week",
      currentValue: 3,
      deadline: "2025-03-01",
      status: "active",
      createdAt: "2025-01-20",
    },
    {
      id: 3,
      title: "Morning Movement Routine",
      description: "Complete morning exercises 6 days a week",
      category: "move",
      targetValue: 6,
      targetUnit: "days/week",
      currentValue: 4,
      deadline: "2025-02-15",
      status: "active",
      createdAt: "2025-01-15",
    },
  ];

  // Create goal mutation
  const createGoal = useMutation({
    mutationFn: async (goalData: GoalForm) => {
      // In real app, this would be an API call
      console.log("Creating goal:", goalData);
      return { id: Date.now(), ...goalData, currentValue: 0, status: "active", createdAt: new Date().toISOString() };
    },
    onSuccess: () => {
      toast({
        title: "Goal Created",
        description: "Your wellness goal has been successfully created!",
      });
      setIsDialogOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["goals", userId] });
    },
  });

  const onSubmit = (data: GoalForm) => {
    createGoal.mutate(data);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "sleep": return "🌙";
      case "oxygen": return "🌬️";
      case "move": return "🏃";
      case "eat": return "🍎";
      default: return "⭐";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "sleep": return "bg-purple-100 text-purple-700 border-purple-200";
      case "oxygen": return "bg-blue-100 text-blue-700 border-blue-200";
      case "move": return "bg-green-100 text-green-700 border-green-200";
      case "eat": return "bg-orange-100 text-orange-700 border-orange-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <div className="min-h-screen relative">
      <BotanicalDecorations variant="page" elements={['wave']} />
      
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Back to Profile Button */}
          <div className="mb-6">
            <Link href="/profile">
              <Button variant="outline" className="bg-white/90 hover:bg-white border-gray-300 text-gray-900 shadow-lg">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Profile
              </Button>
            </Link>
          </div>

          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
              <Target className="h-8 w-8" />
              Wellness Goals
            </h1>
            <p className="text-white/80 text-lg">Track your progress and achieve your wellness milestones</p>
          </div>

          {/* Goals Overview */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-white/95 backdrop-blur-sm border border-gray-300 shadow-lg">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">3</div>
                <div className="text-sm text-gray-600">Active Goals</div>
              </CardContent>
            </Card>
            <Card className="bg-white/95 backdrop-blur-sm border border-gray-300 shadow-lg">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">1</div>
                <div className="text-sm text-gray-600">Completed This Month</div>
              </CardContent>
            </Card>
            <Card className="bg-white/95 backdrop-blur-sm border border-gray-300 shadow-lg">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">67%</div>
                <div className="text-sm text-gray-600">Average Progress</div>
              </CardContent>
            </Card>
          </div>

          {/* Add New Goal Button */}
          <div className="mb-6">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Goal
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Goal</DialogTitle>
                  <DialogDescription>
                    Set a new wellness goal to track your progress.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Goal Title</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Daily meditation for 30 days" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="sleep">🌙 Sleep</SelectItem>
                              <SelectItem value="oxygen">🌬️ Oxygen (Breathing)</SelectItem>
                              <SelectItem value="move">🏃 Move (Exercise)</SelectItem>
                              <SelectItem value="eat">🍎 Eat (Nutrition)</SelectItem>
                              <SelectItem value="wellness">⭐ General Wellness</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <FormField
                        control={form.control}
                        name="targetValue"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Target</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                placeholder="30"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="targetUnit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Unit</FormLabel>
                            <FormControl>
                              <Input placeholder="days" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="deadline"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Deadline</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Add any additional details about your goal..."
                              className="min-h-[80px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <DialogFooter>
                      <Button type="submit" disabled={createGoal.isPending}>
                        {createGoal.isPending ? "Creating..." : "Create Goal"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Goals List */}
          <div className="space-y-4">
            {mockGoals.map((goal) => (
              <Card key={goal.id} className="bg-white/95 backdrop-blur-sm border border-gray-300 shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-gray-900 mb-2 flex items-center gap-2">
                        <span className="text-xl">{getCategoryIcon(goal.category)}</span>
                        {goal.title}
                      </CardTitle>
                      {goal.description && (
                        <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
                      )}
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={getCategoryColor(goal.category)}>
                          {goal.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Calendar className="h-3 w-3 mr-1" />
                          Due {new Date(goal.deadline).toLocaleDateString()}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {goal.currentValue} / {goal.targetValue} {goal.targetUnit}
                      </div>
                      <div className="text-xs text-gray-500">
                        {Math.round(getProgress(goal.currentValue, goal.targetValue))}% complete
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <Progress value={getProgress(goal.currentValue, goal.targetValue)} className="h-2" />
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Started {new Date(goal.createdAt).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1">
                        {goal.status === "active" && <Clock className="h-3 w-3" />}
                        {goal.status === "completed" && <CheckCircle className="h-3 w-3 text-green-600" />}
                        {goal.status === "paused" && <Star className="h-3 w-3 text-orange-600" />}
                        {goal.status}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Motivational Section */}
          <Card className="mt-8 bg-gradient-to-r from-emerald-50 to-blue-50 border border-gray-300 shadow-lg">
            <CardContent className="p-6 text-center">
              <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Keep Going!</h3>
              <p className="text-gray-700 text-sm max-w-md mx-auto">
                Every small step counts toward your wellness journey. Consistency is more important than perfection.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}