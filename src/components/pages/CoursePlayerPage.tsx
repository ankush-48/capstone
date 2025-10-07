import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BaseCrudService, useMember } from '@/integrations';
import { Courses } from '@/entities/courses';
import { CourseContent } from '@/entities/coursecontent';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { MemberProtectedRoute } from '@/components/ui/member-protected-route';
import { CertificateGenerator } from '@/components/ui/certificate-generator';
import { ScrollLearningModule } from '@/components/ui/scroll-learning-module';
import { ActivityComponent, Activity } from '@/components/ui/activity-components';
import { 
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  FileText,
  Clock,
  BookOpen,
  Download,
  Award,
  Activity as ActivityIcon,
  Brain,
  Target
} from 'lucide-react';

function CoursePlayerContent() {
  const { id } = useParams<{ id: string }>();
  const { member } = useMember();
  const [course, setCourse] = useState<Courses | null>(null);
  const [courseContent, setCourseContent] = useState<CourseContent[]>([]);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [completedContent, setCompletedContent] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [courseCompleted, setCourseCompleted] = useState(false);
  const [contentProgress, setContentProgress] = useState<{ [contentId: string]: number }>({});
  const [showActivity, setShowActivity] = useState(false);
  const [activityCompleted, setActivityCompleted] = useState(false);

  // Mock sample content with scroll-based learning data
  const mockScrollContent = {
    learningObjectives: JSON.stringify([
      { id: '1', text: 'Understand the fundamentals of modern learning design', completed: false },
      { id: '2', text: 'Learn how to create engaging educational content', completed: false },
      { id: '3', text: 'Master the principles of progressive disclosure', completed: false },
      { id: '4', text: 'Apply activity-based learning techniques', completed: false }
    ]),
    keyTakeaways: JSON.stringify([
      { id: '1', text: 'Scroll-based learning improves retention and engagement', icon: 'brain' },
      { id: '2', text: 'Interactive elements enhance the learning experience', icon: 'activity' },
      { id: '3', text: 'Progressive disclosure prevents cognitive overload', icon: 'target' },
      { id: '4', text: 'Activity-based learning reinforces key concepts', icon: 'lightbulb' }
    ]),
    interactiveElements: JSON.stringify([
      {
        id: '1',
        type: 'highlight',
        title: 'Key Insight',
        content: 'Modern learners prefer self-paced, interactive content over traditional video lectures.',
        position: 25
      },
      {
        id: '2',
        type: 'definition',
        title: 'Progressive Disclosure',
        content: 'A design technique that presents information in carefully sequenced steps to avoid overwhelming the learner.',
        position: 50
      },
      {
        id: '3',
        type: 'tip',
        title: 'Best Practice',
        content: 'Include interactive elements every 2-3 paragraphs to maintain engagement and reinforce learning.',
        position: 75
      }
    ]),
    moduleContent: `
      <div class="space-y-6">
        <p>Welcome to the future of online learning. This module demonstrates how scroll-based learning can create more engaging and effective educational experiences compared to traditional video lectures.</p>
        
        <h3 class="text-xl font-semibold text-primary mb-3">Why Scroll-Based Learning Works</h3>
        <p>Research in cognitive psychology shows that learners retain information better when they can control the pace of content consumption. Unlike video lectures where the pace is predetermined, scroll-based learning allows each learner to spend more time on challenging concepts and move quickly through familiar material.</p>
        
        <h3 class="text-xl font-semibold text-primary mb-3">The Power of Progressive Disclosure</h3>
        <p>Progressive disclosure is a technique borrowed from user experience design that presents information in digestible chunks. This approach prevents cognitive overload and helps learners build understanding incrementally.</p>
        
        <p>In traditional e-learning, students often feel overwhelmed by dense video content or lengthy text blocks. Scroll-based learning breaks this pattern by revealing information as the learner progresses, creating a natural rhythm that matches human attention spans.</p>
        
        <h3 class="text-xl font-semibold text-primary mb-3">Interactive Elements Enhance Engagement</h3>
        <p>Static content, whether video or text, can lead to passive consumption. By embedding interactive elements throughout the learning journey, we transform passive readers into active participants.</p>
        
        <p>These elements can include definitions, examples, tips, and callouts that provide additional context without disrupting the main narrative flow. They serve as mental checkpoints that help consolidate learning.</p>
        
        <h3 class="text-xl font-semibold text-primary mb-3">Activity-Based Learning Integration</h3>
        <p>The most effective learning happens when theory meets practice. Scroll-based modules naturally lead into hands-on activities that allow learners to apply what they've just absorbed.</p>
        
        <p>This immediate application reinforces learning and helps identify areas where additional review might be needed. It's a more natural flow than the traditional "watch video, then take quiz" approach.</p>
        
        <h3 class="text-xl font-semibold text-primary mb-3">Measuring Success</h3>
        <p>Scroll-based learning provides rich analytics about learner behavior. We can track not just completion, but engagement patterns, time spent on different sections, and interaction with various elements.</p>
        
        <p>This data helps instructors understand which concepts are challenging and which explanations are most effective, leading to continuous improvement of the learning experience.</p>
      </div>
    `
  };

  // Mock activity data
  const mockActivity: Activity = {
    id: 'activity-1',
    type: 'quiz',
    title: 'Knowledge Check: Scroll-Based Learning',
    instructions: 'Test your understanding of the concepts covered in this module.',
    timeLimit: 10,
    points: 100,
    questions: [
      {
        id: 'q1',
        question: 'What is the main advantage of scroll-based learning over video lectures?',
        type: 'multiple-choice',
        options: [
          'It requires less bandwidth',
          'Learners can control the pace of content consumption',
          'It\'s easier to create',
          'It works better on mobile devices'
        ],
        correctAnswer: 1,
        explanation: 'Scroll-based learning allows learners to spend more time on challenging concepts and move quickly through familiar material.',
        points: 25
      },
      {
        id: 'q2',
        question: 'Progressive disclosure helps prevent cognitive overload.',
        type: 'true-false',
        correctAnswer: 0, // 0 for true, 1 for false in true-false questions
        explanation: 'Progressive disclosure presents information in digestible chunks, preventing learners from feeling overwhelmed.',
        points: 25
      },
      {
        id: 'q3',
        question: 'What is progressive disclosure?',
        type: 'short-answer',
        correctAnswer: 'technique that presents information in sequenced steps',
        explanation: 'Progressive disclosure is a design technique that presents information in carefully sequenced steps to avoid overwhelming the learner.',
        points: 25
      },
      {
        id: 'q4',
        question: 'Which of the following is NOT mentioned as a benefit of interactive elements?',
        type: 'multiple-choice',
        options: [
          'They transform passive readers into active participants',
          'They serve as mental checkpoints',
          'They reduce the need for instructors',
          'They provide additional context'
        ],
        correctAnswer: 2,
        explanation: 'Interactive elements enhance learning but don\'t replace the need for instructors.',
        points: 25
      }
    ]
  };

  useEffect(() => {
    if (id) {
      fetchCourseData();
    }
  }, [id]);

  const fetchCourseData = async () => {
    try {
      const courseData = await BaseCrudService.getById<Courses>('courses', id!);
      setCourse(courseData);

      const { items: contentItems } = await BaseCrudService.getAll<CourseContent>('coursecontent');
      const sortedContent = contentItems.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
      setCourseContent(sortedContent.slice(0, 8)); // Show first 8 items
    } catch (error) {
      console.error('Error fetching course data:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentContent = courseContent[currentContentIndex];
  const progress = ((completedContent.size) / courseContent.length) * 100;

  const handleNext = () => {
    if (currentContent) {
      setCompletedContent(prev => new Set(prev).add(currentContent._id));
    }
    if (currentContentIndex < courseContent.length - 1) {
      setCurrentContentIndex(currentContentIndex + 1);
      setShowActivity(false);
      setActivityCompleted(false);
    } else {
      // Course completed
      setCourseCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentContentIndex > 0) {
      setCurrentContentIndex(currentContentIndex - 1);
      setShowActivity(false);
      setActivityCompleted(false);
    }
  };

  const handleContentProgress = (contentId: string, progress: number) => {
    setContentProgress(prev => ({ ...prev, [contentId]: progress }));
  };

  const handleContentComplete = () => {
    if (currentContent) {
      setCompletedContent(prev => new Set(prev).add(currentContent._id));
      
      // Show activity if content has activity data
      if (currentContent.activityType && currentContent.activityData) {
        setShowActivity(true);
      }
    }
  };

  const handleActivityComplete = (score: number, responses: any) => {
    setActivityCompleted(true);
    console.log('Activity completed with score:', score, 'responses:', responses);
    
    // Auto-advance after activity completion
    setTimeout(() => {
      handleNext();
    }, 2000);
  };

  const renderContent = () => {
    if (!currentContent) return null;

    const contentType = currentContent.contentType?.toLowerCase();

    // All content is now scroll-based learning modules
    if (contentType === 'module' || contentType === 'scroll' || contentType === 'text' || !contentType || contentType === 'video') {
      // Enhance content with mock data for demonstration if no real data exists
      const enhancedContent = {
        ...currentContent,
        learningObjectives: currentContent.learningObjectives || JSON.stringify([
          { id: '1', text: 'Understand the fundamentals of this topic', completed: false },
          { id: '2', text: 'Learn practical applications and use cases', completed: false },
          { id: '3', text: 'Master key concepts and terminology', completed: false },
          { id: '4', text: 'Apply knowledge through hands-on activities', completed: false }
        ]),
        keyTakeaways: currentContent.keyTakeaways || JSON.stringify([
          { id: '1', text: 'Interactive learning improves retention and engagement', icon: 'brain' },
          { id: '2', text: 'Scroll-based modules allow self-paced learning', icon: 'activity' },
          { id: '3', text: 'Progressive disclosure prevents cognitive overload', icon: 'target' },
          { id: '4', text: 'Activity-based learning reinforces key concepts', icon: 'lightbulb' }
        ]),
        interactiveElements: currentContent.interactiveElements || JSON.stringify([
          {
            id: '1',
            type: 'highlight',
            title: 'Key Insight',
            content: 'Modern learners prefer self-paced, interactive content over traditional video lectures.',
            position: 25
          },
          {
            id: '2',
            type: 'definition',
            title: 'Progressive Disclosure',
            content: 'A design technique that presents information in carefully sequenced steps to avoid overwhelming the learner.',
            position: 50
          },
          {
            id: '3',
            type: 'tip',
            title: 'Best Practice',
            content: 'Include interactive elements every 2-3 paragraphs to maintain engagement and reinforce learning.',
            position: 75
          }
        ]),
        moduleContent: currentContent.moduleContent || `
          <div class="space-y-6">
            <p>Welcome to this comprehensive learning module. This interactive experience demonstrates how scroll-based learning creates more engaging and effective educational experiences.</p>
            
            <h3 class="text-xl font-semibold text-primary mb-3">Why Scroll-Based Learning Works</h3>
            <p>Research in cognitive psychology shows that learners retain information better when they can control the pace of content consumption. This approach allows each learner to spend more time on challenging concepts and move quickly through familiar material.</p>
            
            <h3 class="text-xl font-semibold text-primary mb-3">The Power of Progressive Disclosure</h3>
            <p>Progressive disclosure is a technique borrowed from user experience design that presents information in digestible chunks. This approach prevents cognitive overload and helps learners build understanding incrementally.</p>
            
            <p>In traditional e-learning, students often feel overwhelmed by dense content. Scroll-based learning breaks this pattern by revealing information as the learner progresses, creating a natural rhythm that matches human attention spans.</p>
            
            <h3 class="text-xl font-semibold text-primary mb-3">Interactive Elements Enhance Engagement</h3>
            <p>Static content can lead to passive consumption. By embedding interactive elements throughout the learning journey, we transform passive readers into active participants.</p>
            
            <p>These elements include definitions, examples, tips, and callouts that provide additional context without disrupting the main narrative flow. They serve as mental checkpoints that help consolidate learning.</p>
            
            <h3 class="text-xl font-semibold text-primary mb-3">Activity-Based Learning Integration</h3>
            <p>The most effective learning happens when theory meets practice. Scroll-based modules naturally lead into hands-on activities that allow learners to apply what they've just absorbed.</p>
            
            <p>This immediate application reinforces learning and helps identify areas where additional review might be needed. It's a more natural flow than traditional approaches.</p>
            
            <h3 class="text-xl font-semibold text-primary mb-3">Measuring Success</h3>
            <p>Scroll-based learning provides rich analytics about learner behavior. We can track not just completion, but engagement patterns, time spent on different sections, and interaction with various elements.</p>
            
            <p>This data helps instructors understand which concepts are challenging and which explanations are most effective, leading to continuous improvement of the learning experience.</p>
          </div>
        `
      };

      return (
        <div className="space-y-8">
          <ScrollLearningModule
            content={enhancedContent}
            onComplete={handleContentComplete}
            onProgress={(progress) => handleContentProgress(currentContent._id, progress)}
          />
          
          {/* Activity Section */}
          {showActivity && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mt-12"
            >
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <ActivityIcon className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold font-heading text-white">
                    Interactive Activity
                  </h2>
                </div>
                <p className="font-paragraph text-gray-400">
                  Apply what you've learned in this hands-on activity.
                </p>
              </div>
              
              <ActivityComponent
                activity={mockActivity}
                onComplete={handleActivityComplete}
                onProgress={(progress) => console.log('Activity progress:', progress)}
              />
            </motion.div>
          )}
        </div>
      );
    }

    // Fallback for any other content types (convert to scroll-based)
    return (
      <div className="space-y-8">
        <ScrollLearningModule
          content={{
            ...currentContent,
            learningObjectives: JSON.stringify([
              { id: '1', text: 'Understand the key concepts presented in this module', completed: false },
              { id: '2', text: 'Apply the knowledge through practical exercises', completed: false }
            ]),
            keyTakeaways: JSON.stringify([
              { id: '1', text: 'This content has been converted to an interactive format', icon: 'brain' },
              { id: '2', text: 'Scroll-based learning improves comprehension', icon: 'activity' }
            ]),
            moduleContent: `
              <div class="space-y-6">
                <p>This content has been enhanced with our scroll-based learning format for better engagement and retention.</p>
                ${currentContent.textContent ? `<div>${currentContent.textContent}</div>` : ''}
                ${currentContent.description ? `<p>${currentContent.description}</p>` : ''}
              </div>
            `
          }}
          onComplete={handleContentComplete}
          onProgress={(progress) => handleContentProgress(currentContent._id, progress)}
        />
      </div>
    );
  };

  const getContentIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'module':
      case 'scroll':
      case 'text':
      case 'video': // Convert video to module icon
        return BookOpen;
      case 'activity':
        return ActivityIcon;
      case 'assessment':
      case 'quiz':
        return Brain;
      default:
        return BookOpen; // Default to module icon
    }
  };

  // Certificate Download Component
  function CertificateDownloadButton({ course }: { course: Courses }) {
    const { downloadCertificate, downloadCertificatePDF } = CertificateGenerator({
      course,
      completionDate: new Date(),
      onDownload: () => {
        console.log(`Certificate downloaded for ${course.titleEn}`);
      }
    });

    return (
      <div className="flex gap-2">
        <Button
          onClick={downloadCertificate}
          size="sm"
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Award className="w-4 h-4 mr-2" />
          Download PNG
        </Button>
        <Button
          onClick={downloadCertificatePDF}
          size="sm"
          variant="outline"
          className="border-primary/30 text-primary hover:bg-primary/10"
        >
          <FileText className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-paragraph text-gray-400">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course || courseContent.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-heading text-white mb-4">Course not found</h2>
          <Button asChild>
            <Link to="/courses">Back to Courses</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-surface/30 border-b border-white/10 px-6 py-4">
        <div className="max-w-[100rem] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild className="text-gray-400 hover:text-white">
              <Link to={`/courses/${course._id}`}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Course
              </Link>
            </Button>
            <Separator orientation="vertical" className="h-6 bg-white/20" />
            <div>
              <h1 className="font-heading text-white font-semibold">
                {course.titleEn}
              </h1>
              <p className="text-sm font-paragraph text-gray-400">
                {currentContentIndex + 1} of {courseContent.length} modules
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm font-paragraph text-gray-400">
              {Math.round(progress)}% Complete
            </div>
            <Progress value={progress} className="w-32" />
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 bg-surface/30 border-r border-white/10 h-[calc(100vh-73px)] overflow-y-auto">
          <div className="p-6">
            <h2 className="font-heading text-white font-semibold mb-4">Course Modules</h2>
            <div className="space-y-2">
              {courseContent.map((content, index) => {
                const IconComponent = getContentIcon(content.contentType || '');
                const isCompleted = completedContent.has(content._id);
                const isCurrent = index === currentContentIndex;
                
                return (
                  <button
                    key={content._id}
                    onClick={() => {
                      setCurrentContentIndex(index);
                      setShowActivity(false);
                      setActivityCompleted(false);
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      isCurrent
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-white/10 text-gray-300 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <IconComponent className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-paragraph text-sm font-medium truncate">
                          {content.title || `Module ${index + 1}`}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {content.estimatedDurationMinutes && (
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>{content.estimatedDurationMinutes}min</span>
                            </div>
                          )}
                          {content.activityType && (
                            <div className="flex items-center gap-1 text-xs text-primary">
                              <ActivityIcon className="w-3 h-3" />
                              <span>Activity</span>
                            </div>
                          )}
                        </div>
                        {contentProgress[content._id] && (
                          <div className="mt-2">
                            <Progress value={contentProgress[content._id]} className="h-1" />
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              key={currentContentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              {renderContent()}
            </motion.div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-8 border-t border-white/10">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentContentIndex === 0}
                className="border-white/20 text-gray-400 hover:text-white disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <div className="text-center">
                <div className="text-sm font-paragraph text-gray-400 mb-1">
                  Module {currentContentIndex + 1} of {courseContent.length}
                </div>
                <div className="text-xs font-paragraph text-gray-500">
                  {currentContent?.estimatedDurationMinutes && `${currentContent.estimatedDurationMinutes} minutes`}
                  {showActivity && !activityCompleted && ' • Activity in progress'}
                  {activityCompleted && ' • Activity completed'}
                </div>
              </div>

              {currentContentIndex === courseContent.length - 1 ? (
                courseCompleted ? (
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-sm font-paragraph text-gray-400 mb-1">
                        🎉 Course Completed!
                      </div>
                      <div className="text-xs font-paragraph text-gray-500">
                        Download your certificate
                      </div>
                    </div>
                    {course && (
                      <CertificateDownloadButton course={course} />
                    )}
                  </div>
                ) : (
                  <Button
                    onClick={handleNext}
                    disabled={showActivity && !activityCompleted}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {showActivity && !activityCompleted ? 'Complete Activity First' : 'Complete Course'}
                    <CheckCircle className="w-4 h-4 ml-2" />
                  </Button>
                )
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={showActivity && !activityCompleted}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {showActivity && !activityCompleted ? 'Complete Activity First' : 'Next Module'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CoursePlayerPage() {
  return (
    <MemberProtectedRoute>
      <CoursePlayerContent />
    </MemberProtectedRoute>
  );
}