import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { CourseContent } from '@/entities/coursecontent';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  ArrowRight, 
  Lightbulb, 
  Target, 
  BookOpen,
  Activity,
  Brain,
  Users,
  Zap,
  Download
} from 'lucide-react';
import { PDFNotesGenerator } from '@/components/ui/pdf-notes-generator';

interface ScrollLearningModuleProps {
  content: CourseContent;
  onComplete: () => void;
  onProgress: (progress: number) => void;
  courseName?: string;
}

interface InteractiveElement {
  id: string;
  type: 'highlight' | 'callout' | 'definition' | 'example' | 'tip';
  content: string;
  position: number; // Position in the text (0-100%)
  title?: string;
}

interface LearningObjective {
  id: string;
  text: string;
  completed: boolean;
}

interface KeyTakeaway {
  id: string;
  text: string;
  icon: string;
}

export function ScrollLearningModule({ content, onComplete, onProgress, courseName }: ScrollLearningModuleProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [completedObjectives, setCompletedObjectives] = useState<Set<string>>(new Set());
  const [showActivity, setShowActivity] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Parse content data
  const learningObjectives: LearningObjective[] = content.learningObjectives 
    ? JSON.parse(content.learningObjectives) 
    : [];
  
  const keyTakeaways: KeyTakeaway[] = content.keyTakeaways 
    ? JSON.parse(content.keyTakeaways) 
    : [];
  
  const interactiveElements: InteractiveElement[] = content.interactiveElements 
    ? JSON.parse(content.interactiveElements) 
    : [];

  // Transform scroll progress to percentage
  const progressValue = useTransform(scrollYProgress, [0, 1], [0, 100]);

  useEffect(() => {
    const unsubscribe = progressValue.onChange((value) => {
      setScrollProgress(value);
      onProgress(value);
      
      // Mark objectives as completed based on scroll progress
      learningObjectives.forEach((objective, index) => {
        const threshold = ((index + 1) / learningObjectives.length) * 80; // 80% for objectives
        if (value >= threshold && !completedObjectives.has(objective.id)) {
          setCompletedObjectives(prev => new Set(prev).add(objective.id));
        }
      });

      // Show activity when 80% scrolled
      if (value >= 80 && !showActivity) {
        setShowActivity(true);
      }

      // Mark as completed when 95% scrolled and activity shown
      if (value >= 95 && showActivity && !isCompleted) {
        setIsCompleted(true);
        onComplete();
      }
    });

    return unsubscribe;
  }, [progressValue, learningObjectives, completedObjectives, showActivity, isCompleted, onComplete, onProgress]);

  const getIconForTakeaway = (iconName: string) => {
    const icons: { [key: string]: React.ComponentType<any> } = {
      'lightbulb': Lightbulb,
      'target': Target,
      'book': BookOpen,
      'activity': Activity,
      'brain': Brain,
      'users': Users,
      'zap': Zap
    };
    const IconComponent = icons[iconName] || Lightbulb;
    return <IconComponent className="w-5 h-5" />;
  };

  const renderInteractiveElement = (element: InteractiveElement) => {
    const baseClasses = "my-6 p-4 rounded-lg border-l-4 transition-all duration-300";
    
    switch (element.type) {
      case 'highlight':
        return (
          <div className={`${baseClasses} bg-primary/10 border-primary`}>
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                {element.title && (
                  <h4 className="font-heading text-primary font-semibold mb-2">{element.title}</h4>
                )}
                <p className="font-paragraph text-white">{element.content}</p>
              </div>
            </div>
          </div>
        );
      
      case 'callout':
        return (
          <div className={`${baseClasses} bg-secondary/10 border-secondary`}>
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
              <div>
                {element.title && (
                  <h4 className="font-heading text-secondary font-semibold mb-2">{element.title}</h4>
                )}
                <p className="font-paragraph text-white">{element.content}</p>
              </div>
            </div>
          </div>
        );
      
      case 'definition':
        return (
          <div className={`${baseClasses} bg-blue-500/10 border-blue-500`}>
            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-heading text-blue-400 font-semibold mb-2">
                  {element.title || 'Definition'}
                </h4>
                <p className="font-paragraph text-white">{element.content}</p>
              </div>
            </div>
          </div>
        );
      
      case 'example':
        return (
          <div className={`${baseClasses} bg-green-500/10 border-green-500`}>
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-heading text-green-400 font-semibold mb-2">
                  {element.title || 'Example'}
                </h4>
                <p className="font-paragraph text-white">{element.content}</p>
              </div>
            </div>
          </div>
        );
      
      case 'tip':
        return (
          <div className={`${baseClasses} bg-yellow-500/10 border-yellow-500`}>
            <div className="flex items-start gap-3">
              <Brain className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-heading text-yellow-400 font-semibold mb-2">
                  {element.title || 'Pro Tip'}
                </h4>
                <p className="font-paragraph text-white">{element.content}</p>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="relative">
      {/* Progress Indicator */}
      <div className="fixed top-20 right-6 z-50">
        <Card className="bg-surface/90 backdrop-blur-sm border-white/20 p-4">
          <div className="text-center mb-2">
            <div className="text-2xl font-bold font-heading text-primary">
              {Math.round(scrollProgress)}%
            </div>
            <div className="text-xs font-paragraph text-gray-400">
              Progress
            </div>
          </div>
          <Progress value={scrollProgress} className="w-24 h-2" />
        </Card>
      </div>

      {/* Learning Objectives Sidebar */}
      <div className="fixed left-6 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
        <Card className="bg-surface/90 backdrop-blur-sm border-white/20 p-4 w-64">
          <h3 className="font-heading text-white font-semibold mb-3 flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            Learning Objectives
          </h3>
          <div className="space-y-2">
            {learningObjectives.map((objective) => (
              <div
                key={objective.id}
                className={`flex items-start gap-2 p-2 rounded transition-colors ${
                  completedObjectives.has(objective.id)
                    ? 'bg-primary/20 text-primary'
                    : 'text-gray-400'
                }`}
              >
                <CheckCircle 
                  className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                    completedObjectives.has(objective.id) ? 'text-primary' : 'text-gray-600'
                  }`} 
                />
                <span className="text-sm font-paragraph">{objective.text}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div ref={containerRef} className="max-w-4xl mx-auto px-6 py-12">
        {/* Module Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <Badge className="bg-primary/20 text-primary border-primary/30 mb-4">
            {content.contentType || 'Learning Module'}
          </Badge>
          <h1 className="text-4xl font-bold font-heading text-white mb-4">
            {content.title}
          </h1>
          <p className="text-lg font-paragraph text-gray-400 mb-6">
            {content.description}
          </p>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              {/* Estimated Duration */}
              {content.estimatedDurationMinutes && (
                <div className="flex items-center gap-2 text-sm font-paragraph text-gray-500">
                  <BookOpen className="w-4 h-4" />
                  <span>Estimated reading time: {content.estimatedDurationMinutes} minutes</span>
                </div>
              )}
            </div>
            
            {/* Download Notes Button */}
            <PDFNotesGenerator 
              content={{
                ...content,
                learningObjectives: content.learningObjectives || JSON.stringify([
                  { id: '1', text: `Master the core concepts of ${content.title || 'this learning module'}`, completed: false },
                  { id: '2', text: 'Apply knowledge through interactive exercises and activities', completed: false },
                  { id: '3', text: 'Understand practical applications in real-world scenarios', completed: false },
                  { id: '4', text: 'Develop critical thinking skills for problem-solving', completed: false }
                ]),
                keyTakeaways: content.keyTakeaways || JSON.stringify([
                  { id: '1', text: 'Interactive learning enhances retention and understanding', icon: 'brain' },
                  { id: '2', text: 'Progressive disclosure prevents cognitive overload', icon: 'activity' },
                  { id: '3', text: 'Hands-on practice reinforces theoretical concepts', icon: 'target' },
                  { id: '4', text: 'Regular review and reflection improve long-term retention', icon: 'lightbulb' }
                ]),
                interactiveElements: content.interactiveElements || JSON.stringify([
                  {
                    id: '1',
                    type: 'highlight',
                    title: 'Core Principle',
                    content: 'Active engagement with content leads to better learning outcomes than passive consumption.',
                    position: 20
                  },
                  {
                    id: '2',
                    type: 'definition',
                    title: 'Progressive Learning',
                    content: 'A methodology that introduces concepts gradually, building complexity as understanding develops.',
                    position: 40
                  },
                  {
                    id: '3',
                    type: 'tip',
                    title: 'Study Strategy',
                    content: 'Take breaks between sections to allow your brain to process and consolidate new information.',
                    position: 60
                  },
                  {
                    id: '4',
                    type: 'example',
                    title: 'Real-World Application',
                    content: 'These learning principles are used by top educational institutions and corporate training programs worldwide.',
                    position: 80
                  }
                ]),
                moduleContent: content.moduleContent || `
                  <div class="space-y-6">
                    <h3 class="text-xl font-semibold text-primary mb-3">${content.title || 'Interactive Learning Module'}</h3>
                    <p>${content.description || 'This interactive learning module is designed to provide you with comprehensive understanding through engaging, scroll-based content delivery.'}</p>
                    
                    <h3 class="text-xl font-semibold text-primary mb-3">Module Structure</h3>
                    <p>This module uses a progressive disclosure approach, revealing information as you scroll through the content. This method helps prevent cognitive overload and allows you to absorb information at your own pace.</p>
                    
                    <h3 class="text-xl font-semibold text-primary mb-3">Interactive Elements</h3>
                    <p>Throughout the module, you'll encounter various interactive elements including:</p>
                    <ul class="list-disc pl-6 space-y-1">
                      <li><strong>Highlights:</strong> Key concepts and important information</li>
                      <li><strong>Definitions:</strong> Clear explanations of technical terms</li>
                      <li><strong>Tips:</strong> Practical advice and study strategies</li>
                      <li><strong>Examples:</strong> Real-world applications and case studies</li>
                    </ul>
                    
                    <h3 class="text-xl font-semibold text-primary mb-3">Learning Objectives</h3>
                    <p>By completing this module, you will achieve specific learning outcomes that build upon each other to create a comprehensive understanding of the subject matter.</p>
                    
                    <h3 class="text-xl font-semibold text-primary mb-3">Assessment and Activities</h3>
                    <p>The module may include interactive activities and assessments designed to test your understanding and provide immediate feedback on your progress.</p>
                    
                    <h3 class="text-xl font-semibold text-primary mb-3">Study Tips</h3>
                    <ul class="list-disc pl-6 space-y-1">
                      <li>Read through the entire module first to get an overview</li>
                      <li>Take notes on key concepts as you progress</li>
                      <li>Pay special attention to interactive elements</li>
                      <li>Complete any activities or assessments</li>
                      <li>Review the key takeaways at the end</li>
                    </ul>
                    
                    <h3 class="text-xl font-semibold text-primary mb-3">Time Management</h3>
                    <p>This module is designed to be completed in approximately ${content.estimatedDurationMinutes || 30} minutes. However, you can take as much time as you need to fully understand the concepts.</p>
                  </div>
                `
              }}
              courseName={courseName}
              onDownload={() => console.log('Notes downloaded for:', content.title)}
            />
          </div>
        </motion.div>

        {/* Learning Objectives (Mobile) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:hidden mb-8"
        >
          <Card className="bg-surface/50 border-white/10 p-6">
            <h3 className="font-heading text-white font-semibold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              What You'll Learn
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {learningObjectives.map((objective) => (
                <div
                  key={objective.id}
                  className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                    completedObjectives.has(objective.id)
                      ? 'bg-primary/20 text-primary'
                      : 'bg-background/30 text-gray-400'
                  }`}
                >
                  <CheckCircle 
                    className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                      completedObjectives.has(objective.id) ? 'text-primary' : 'text-gray-600'
                    }`} 
                  />
                  <span className="font-paragraph">{objective.text}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="prose prose-invert prose-lg max-w-none"
        >
          <div className="font-paragraph text-gray-300 leading-relaxed space-y-6">
            {content.moduleContent ? (
              <div dangerouslySetInnerHTML={{ __html: content.moduleContent }} />
            ) : (
              <div>
                <p className="mb-6">
                  Welcome to this comprehensive learning module. This interactive experience is designed 
                  to help you master key concepts through engaging, scroll-based learning similar to 
                  modern educational platforms.
                </p>
                
                {renderInteractiveElement({
                  id: '1',
                  type: 'highlight',
                  title: 'Key Concept',
                  content: 'This module uses progressive disclosure to help you learn at your own pace. As you scroll, new concepts will be introduced and reinforced.',
                  position: 20
                })}

                <p className="mb-6">
                  The beauty of scroll-based learning lies in its natural flow. Unlike traditional video 
                  lectures, you control the pace entirely. You can pause to reflect, re-read important 
                  sections, and engage with interactive elements as they appear.
                </p>

                {renderInteractiveElement({
                  id: '2',
                  type: 'definition',
                  title: 'Progressive Disclosure',
                  content: 'A technique that presents information in carefully sequenced steps, revealing complexity gradually to avoid cognitive overload.',
                  position: 40
                })}

                <p className="mb-6">
                  Research shows that learners retain information better when they can control the pacing 
                  and when content is presented in digestible chunks. This approach also allows for 
                  better integration of multimedia elements and interactive components.
                </p>

                {renderInteractiveElement({
                  id: '3',
                  type: 'example',
                  title: 'Real-World Application',
                  content: 'Companies like HP LIFE use this approach to deliver business education, allowing learners to progress through complex topics at their own speed while maintaining engagement.',
                  position: 60
                })}

                <p className="mb-6">
                  As you continue through this module, you'll encounter various types of interactive 
                  elements designed to reinforce learning and provide practical applications of the 
                  concepts being taught.
                </p>

                {renderInteractiveElement({
                  id: '4',
                  type: 'tip',
                  title: 'Learning Strategy',
                  content: 'Take notes as you progress through the module. The combination of reading, note-taking, and interactive engagement creates multiple pathways for memory formation.',
                  position: 80
                })}

                <p className="mb-6">
                  The final section of each module includes hands-on activities that allow you to 
                  apply what you've learned. These activities are designed to be practical and 
                  immediately applicable to real-world scenarios.
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Key Takeaways */}
        {keyTakeaways.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12"
          >
            <Card className="bg-surface/50 border-white/10 p-6">
              <h3 className="font-heading text-white font-semibold mb-6 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-primary" />
                Key Takeaways
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {keyTakeaways.map((takeaway) => (
                  <div
                    key={takeaway.id}
                    className="flex items-start gap-3 p-4 bg-background/30 rounded-lg"
                  >
                    <div className="text-primary mt-1">
                      {getIconForTakeaway(takeaway.icon)}
                    </div>
                    <span className="font-paragraph text-gray-300">{takeaway.text}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Activity Section */}
        {showActivity && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-12"
          >
            <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30 p-8">
              <div className="text-center mb-6">
                <Activity className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold font-heading text-white mb-2">
                  Ready for the Activity?
                </h3>
                <p className="font-paragraph text-gray-400">
                  Now that you've completed the reading, let's apply what you've learned!
                </p>
              </div>
              
              <div className="flex justify-center">
                <Button 
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => {
                    // This would trigger the activity component
                    console.log('Starting activity...');
                  }}
                >
                  Start Activity
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Completion Status */}
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-8"
          >
            <Card className="bg-green-500/20 border-green-500/30 p-6 text-center">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold font-heading text-green-400 mb-2">
                Module Completed!
              </h3>
              <p className="font-paragraph text-gray-300">
                Great job! You've successfully completed this learning module.
              </p>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}