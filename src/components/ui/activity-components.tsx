import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  X, 
  ArrowRight, 
  RotateCcw,
  Lightbulb,
  Target,
  Users,
  Brain,
  Award,
  Clock
} from 'lucide-react';

// Activity Types
export type ActivityType = 'quiz' | 'drag-drop' | 'scenario' | 'reflection' | 'case-study' | 'matching' | 'sorting';

interface BaseActivity {
  id: string;
  type: ActivityType;
  title: string;
  instructions: string;
  timeLimit?: number; // in minutes
  points?: number;
}

// Quiz Activity
interface QuizActivity extends BaseActivity {
  type: 'quiz';
  questions: QuizQuestion[];
}

interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  options?: string[];
  correctAnswer: string | number;
  explanation?: string;
  points: number;
}

// Drag and Drop Activity
interface DragDropActivity extends BaseActivity {
  type: 'drag-drop';
  items: DragDropItem[];
  categories: DragDropCategory[];
}

interface DragDropItem {
  id: string;
  content: string;
  correctCategory: string;
}

interface DragDropCategory {
  id: string;
  name: string;
  description?: string;
}

// Scenario Activity
interface ScenarioActivity extends BaseActivity {
  type: 'scenario';
  scenario: string;
  decisions: ScenarioDecision[];
}

interface ScenarioDecision {
  id: string;
  choice: string;
  outcome: string;
  isOptimal: boolean;
  feedback: string;
}

// Reflection Activity
interface ReflectionActivity extends BaseActivity {
  type: 'reflection';
  prompts: ReflectionPrompt[];
}

interface ReflectionPrompt {
  id: string;
  question: string;
  placeholder?: string;
  minWords?: number;
}

// Case Study Activity
interface CaseStudyActivity extends BaseActivity {
  type: 'case-study';
  caseStudy: string;
  questions: CaseStudyQuestion[];
}

interface CaseStudyQuestion {
  id: string;
  question: string;
  type: 'analysis' | 'solution' | 'evaluation';
  guidelines?: string[];
}

export type Activity = QuizActivity | DragDropActivity | ScenarioActivity | ReflectionActivity | CaseStudyActivity;

interface ActivityComponentProps {
  activity: Activity;
  onComplete: (score: number, responses: any) => void;
  onProgress?: (progress: number) => void;
}

// Quiz Component
export function QuizActivityComponent({ activity, onComplete, onProgress }: { activity: QuizActivity } & Omit<ActivityComponentProps, 'activity'>) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(activity.timeLimit ? activity.timeLimit * 60 : null);

  useEffect(() => {
    if (timeLeft && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleSubmit();
    }
  }, [timeLeft]);

  useEffect(() => {
    const progress = (Object.keys(answers).length / activity.questions.length) * 100;
    onProgress?.(progress);
  }, [answers, activity.questions.length, onProgress]);

  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = () => {
    let totalScore = 0;
    let maxScore = 0;

    activity.questions.forEach(question => {
      maxScore += question.points;
      const userAnswer = answers[question.id];
      
      if (question.type === 'multiple-choice' || question.type === 'true-false') {
        if (userAnswer === question.correctAnswer) {
          totalScore += question.points;
        }
      } else if (question.type === 'short-answer') {
        // Simple keyword matching for short answers
        const correctAnswer = String(question.correctAnswer).toLowerCase();
        const userAnswerStr = String(userAnswer || '').toLowerCase();
        if (userAnswerStr.includes(correctAnswer) || correctAnswer.includes(userAnswerStr)) {
          totalScore += question.points;
        }
      }
    });

    const finalScore = (totalScore / maxScore) * 100;
    setScore(finalScore);
    setShowResults(true);
    onComplete(finalScore, answers);
  };

  const currentQ = activity.questions[currentQuestion];

  if (showResults) {
    return (
      <Card className="bg-surface/50 border-white/10">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {score >= 70 ? (
              <CheckCircle className="w-16 h-16 text-green-400" />
            ) : (
              <Target className="w-16 h-16 text-yellow-400" />
            )}
          </div>
          <CardTitle className="text-2xl font-heading text-white">
            Quiz Complete!
          </CardTitle>
          <div className="text-4xl font-bold font-heading text-primary mt-2">
            {Math.round(score)}%
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activity.questions.map((question, index) => {
              const userAnswer = answers[question.id];
              const isCorrect = question.type === 'multiple-choice' || question.type === 'true-false' 
                ? userAnswer === question.correctAnswer
                : String(userAnswer || '').toLowerCase().includes(String(question.correctAnswer).toLowerCase());

              return (
                <div key={question.id} className="p-4 bg-background/30 rounded-lg">
                  <div className="flex items-start gap-3 mb-2">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-400 mt-1" />
                    ) : (
                      <X className="w-5 h-5 text-red-400 mt-1" />
                    )}
                    <div className="flex-1">
                      <h4 className="font-heading text-white font-medium">
                        Question {index + 1}: {question.question}
                      </h4>
                      <p className="text-sm font-paragraph text-gray-400 mt-1">
                        Your answer: {question.type === 'multiple-choice' && question.options 
                          ? question.options[userAnswer] || 'No answer'
                          : userAnswer || 'No answer'
                        }
                      </p>
                      {question.explanation && (
                        <p className="text-sm font-paragraph text-gray-300 mt-2 p-2 bg-primary/10 rounded">
                          {question.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-surface/50 border-white/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-heading text-white">
            {activity.title}
          </CardTitle>
          {timeLeft !== null && (
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
              <Clock className="w-3 h-3 mr-1" />
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </Badge>
          )}
        </div>
        <Progress value={(currentQuestion / activity.questions.length) * 100} className="mt-2" />
        <p className="text-sm font-paragraph text-gray-400">
          Question {currentQuestion + 1} of {activity.questions.length}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <h3 className="text-lg font-heading text-white">
            {currentQ.question}
          </h3>

          {currentQ.type === 'multiple-choice' && currentQ.options && (
            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(currentQ.id, index)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    answers[currentQ.id] === index
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-white/20 text-gray-300 hover:border-white/40'
                  }`}
                >
                  {String.fromCharCode(65 + index)}. {option}
                </button>
              ))}
            </div>
          )}

          {currentQ.type === 'true-false' && (
            <div className="flex gap-4">
              {[true, false].map((value) => (
                <button
                  key={String(value)}
                  onClick={() => handleAnswer(currentQ.id, value)}
                  className={`flex-1 p-4 rounded-lg border transition-all ${
                    answers[currentQ.id] === value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-white/20 text-gray-300 hover:border-white/40'
                  }`}
                >
                  {value ? 'True' : 'False'}
                </button>
              ))}
            </div>
          )}

          {currentQ.type === 'short-answer' && (
            <Input
              placeholder="Type your answer here..."
              value={answers[currentQ.id] || ''}
              onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
              className="bg-background/50 border-white/20 text-white"
            />
          )}

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="border-white/20 text-gray-400 hover:text-white"
            >
              Previous
            </Button>

            {currentQuestion === activity.questions.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={Object.keys(answers).length < activity.questions.length}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Submit Quiz
              </Button>
            ) : (
              <Button
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                disabled={!answers[currentQ.id]}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Drag and Drop Component
export function DragDropActivityComponent({ activity, onComplete, onProgress }: { activity: DragDropActivity } & Omit<ActivityComponentProps, 'activity'>) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<{ [itemId: string]: string }>({});
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const progress = (Object.keys(assignments).length / activity.items.length) * 100;
    onProgress?.(progress);

    if (Object.keys(assignments).length === activity.items.length) {
      setIsComplete(true);
    }
  }, [assignments, activity.items.length, onProgress]);

  const handleDragStart = (itemId: string) => {
    setDraggedItem(itemId);
  };

  const handleDrop = (categoryId: string) => {
    if (draggedItem) {
      setAssignments(prev => ({ ...prev, [draggedItem]: categoryId }));
      setDraggedItem(null);
    }
  };

  const handleSubmit = () => {
    let correct = 0;
    activity.items.forEach(item => {
      if (assignments[item.id] === item.correctCategory) {
        correct++;
      }
    });

    const score = (correct / activity.items.length) * 100;
    onComplete(score, assignments);
  };

  const unassignedItems = activity.items.filter(item => !assignments[item.id]);

  return (
    <Card className="bg-surface/50 border-white/10">
      <CardHeader>
        <CardTitle className="font-heading text-white">{activity.title}</CardTitle>
        <p className="font-paragraph text-gray-400">{activity.instructions}</p>
        <Progress value={(Object.keys(assignments).length / activity.items.length) * 100} />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Items to Drag */}
          <div>
            <h3 className="font-heading text-white font-semibold mb-4">Items to Categorize</h3>
            <div className="space-y-3">
              {unassignedItems.map(item => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={() => handleDragStart(item.id)}
                  className="p-3 bg-background/50 border border-white/20 rounded-lg cursor-move hover:border-primary/50 transition-colors"
                >
                  <span className="font-paragraph text-white">{item.content}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Drop Categories */}
          <div>
            <h3 className="font-heading text-white font-semibold mb-4">Categories</h3>
            <div className="space-y-4">
              {activity.categories.map(category => {
                const assignedItems = activity.items.filter(item => assignments[item.id] === category.id);
                
                return (
                  <div
                    key={category.id}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(category.id)}
                    className="min-h-[100px] p-4 border-2 border-dashed border-white/30 rounded-lg hover:border-primary/50 transition-colors"
                  >
                    <h4 className="font-heading text-primary font-medium mb-2">{category.name}</h4>
                    {category.description && (
                      <p className="text-sm font-paragraph text-gray-400 mb-3">{category.description}</p>
                    )}
                    <div className="space-y-2">
                      {assignedItems.map(item => (
                        <div
                          key={item.id}
                          className="p-2 bg-primary/20 border border-primary/30 rounded text-sm font-paragraph text-white"
                        >
                          {item.content}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {isComplete && (
          <div className="mt-6 text-center">
            <Button
              onClick={handleSubmit}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Submit Assignment
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Reflection Activity Component
export function ReflectionActivityComponent({ activity, onComplete, onProgress }: { activity: ReflectionActivity } & Omit<ActivityComponentProps, 'activity'>) {
  const [responses, setResponses] = useState<{ [promptId: string]: string }>({});

  useEffect(() => {
    const completedPrompts = Object.values(responses).filter(response => response.trim().length > 0).length;
    const progress = (completedPrompts / activity.prompts.length) * 100;
    onProgress?.(progress);
  }, [responses, activity.prompts.length, onProgress]);

  const handleResponseChange = (promptId: string, response: string) => {
    setResponses(prev => ({ ...prev, [promptId]: response }));
  };

  const handleSubmit = () => {
    // For reflection activities, completion is based on effort rather than correctness
    const completedPrompts = Object.values(responses).filter(response => response.trim().length > 0).length;
    const score = (completedPrompts / activity.prompts.length) * 100;
    onComplete(score, responses);
  };

  const allCompleted = activity.prompts.every(prompt => {
    const response = responses[prompt.id] || '';
    const minWords = prompt.minWords || 10;
    return response.trim().split(/\s+/).length >= minWords;
  });

  return (
    <Card className="bg-surface/50 border-white/10">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <Brain className="w-6 h-6 text-primary" />
          <CardTitle className="font-heading text-white">{activity.title}</CardTitle>
        </div>
        <p className="font-paragraph text-gray-400">{activity.instructions}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activity.prompts.map((prompt, index) => {
            const wordCount = (responses[prompt.id] || '').trim().split(/\s+/).filter(word => word.length > 0).length;
            const minWords = prompt.minWords || 10;
            
            return (
              <div key={prompt.id} className="space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="font-heading text-white font-medium">
                    {index + 1}. {prompt.question}
                  </h3>
                  <Badge className={`text-xs ${wordCount >= minWords ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {wordCount}/{minWords} words
                  </Badge>
                </div>
                <Textarea
                  placeholder={prompt.placeholder || 'Share your thoughts...'}
                  value={responses[prompt.id] || ''}
                  onChange={(e) => handleResponseChange(prompt.id, e.target.value)}
                  className="min-h-[120px] bg-background/50 border-white/20 text-white resize-none"
                />
              </div>
            );
          })}

          <div className="text-center">
            <Button
              onClick={handleSubmit}
              disabled={!allCompleted}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Submit Reflection
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Main Activity Router Component
export function ActivityComponent({ activity, onComplete, onProgress }: ActivityComponentProps) {
  switch (activity.type) {
    case 'quiz':
      return <QuizActivityComponent activity={activity} onComplete={onComplete} onProgress={onProgress} />;
    case 'drag-drop':
      return <DragDropActivityComponent activity={activity} onComplete={onComplete} onProgress={onProgress} />;
    case 'reflection':
      return <ReflectionActivityComponent activity={activity} onComplete={onComplete} onProgress={onProgress} />;
    default:
      return (
        <Card className="bg-surface/50 border-white/10 p-6">
          <div className="text-center">
            <Lightbulb className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="font-heading text-white font-semibold mb-2">
              Activity Type Not Implemented
            </h3>
            <p className="font-paragraph text-gray-400">
              The activity type "{activity.type}" is not yet implemented.
            </p>
          </div>
        </Card>
      );
  }
}