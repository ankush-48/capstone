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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MemberProtectedRoute } from '@/components/ui/member-protected-route';
import { 
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Play,
  FileText,
  HelpCircle,
  Clock,
  BookOpen,
  Download,
  Subtitles,
  Volume2,
  VolumeX,
  Maximize,
  Settings
} from 'lucide-react';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

function CoursePlayerContent() {
  const { id } = useParams<{ id: string }>();
  const { member } = useMember();
  const [course, setCourse] = useState<Courses | null>(null);
  const [courseContent, setCourseContent] = useState<CourseContent[]>([]);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [completedContent, setCompletedContent] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: number | string }>({});
  const [selectedLanguage, setSelectedLanguage] = useState<'hindi' | 'tamil' | 'telugu' | 'none'>('none');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showVideoControls, setShowVideoControls] = useState(true);

  // Mock quiz data
  const mockQuiz: QuizQuestion[] = [
    {
      id: '1',
      question: 'What is the primary purpose of this learning platform?',
      options: [
        'Entertainment',
        'Skill development and education',
        'Social networking',
        'E-commerce'
      ],
      correctAnswer: 1
    },
    {
      id: '2',
      question: 'Which feature helps track your learning progress?',
      options: [
        'Chat system',
        'Dashboard analytics',
        'Shopping cart',
        'Photo gallery'
      ],
      correctAnswer: 1
    }
  ];

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
    }
  };

  const handlePrevious = () => {
    if (currentContentIndex > 0) {
      setCurrentContentIndex(currentContentIndex - 1);
    }
  };

  const handleQuizAnswer = (questionId: string | number, answer: number | string) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const getCaptionUrl = (content: CourseContent) => {
    switch (selectedLanguage) {
      case 'hindi':
        return content.captionsHindi;
      case 'tamil':
        return content.captionsTamil;
      case 'telugu':
        return content.captionsTelugu;
      default:
        return null;
    }
  };

  const downloadNotes = (content: CourseContent) => {
    if (content.downloadableNotes) {
      window.open(content.downloadableNotes, '_blank');
    }
  };

  const toggleVideoPlay = () => {
    setIsVideoPlaying(!isVideoPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const renderContent = () => {
    if (!currentContent) return null;

    const contentType = currentContent.contentType?.toLowerCase();

    switch (contentType) {
      case 'video':
        return (
          <div className="space-y-4">
            {/* Video Player */}
            <div className="relative bg-black rounded-lg aspect-video overflow-hidden group">
              {currentContent.videoLectureUrl ? (
                <div className="relative w-full h-full">
                  <video
                    className="w-full h-full object-cover"
                    controls={showVideoControls}
                    poster={currentContent.thumbnailImage}
                    onPlay={() => setIsVideoPlaying(true)}
                    onPause={() => setIsVideoPlaying(false)}
                  >
                    <source src={currentContent.videoLectureUrl} type="video/mp4" />
                    {getCaptionUrl(currentContent) && (
                      <track
                        kind="subtitles"
                        src={getCaptionUrl(currentContent)!}
                        srcLang={selectedLanguage}
                        label={selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)}
                        default={selectedLanguage !== 'none'}
                      />
                    )}
                    Your browser does not support the video tag.
                  </video>
                  
                  {/* Custom Video Controls Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4 flex items-center gap-4">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={toggleVideoPlay}
                        className="text-white hover:bg-white/20"
                      >
                        {isVideoPlaying ? <VolumeX className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={toggleMute}
                        className="text-white hover:bg-white/20"
                      >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </Button>
                      
                      <div className="flex-1" />
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-white hover:bg-white/20"
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-white hover:bg-white/20"
                      >
                        <Maximize className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Play className="w-16 h-16 text-primary mx-auto mb-4" />
                    <p className="text-white font-paragraph">Video Player</p>
                    <p className="text-gray-400 text-sm mt-2">
                      {currentContent.title}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Video Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 bg-surface/50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Subtitles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-paragraph text-gray-300">Captions:</span>
                </div>
                <Select value={selectedLanguage} onValueChange={(value: 'hindi' | 'tamil' | 'telugu' | 'none') => setSelectedLanguage(value)}>
                  <SelectTrigger className="w-32 bg-background/50 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {currentContent.captionsHindi && <SelectItem value="hindi">Hindi</SelectItem>}
                    {currentContent.captionsTamil && <SelectItem value="tamil">Tamil</SelectItem>}
                    {currentContent.captionsTelugu && <SelectItem value="telugu">Telugu</SelectItem>}
                  </SelectContent>
                </Select>
              </div>
              
              {currentContent.downloadableNotes && (
                <Button
                  onClick={() => downloadNotes(currentContent)}
                  variant="outline"
                  size="sm"
                  className="border-primary/30 text-primary hover:bg-primary/10"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Notes
                </Button>
              )}
            </div>

            {/* Video Description */}
            {currentContent.description && (
              <Card className="bg-surface/50 border-white/10">
                <CardContent className="p-4">
                  <h4 className="font-heading text-white font-medium mb-2">About this lecture</h4>
                  <p className="font-paragraph text-gray-300 text-sm leading-relaxed">
                    {currentContent.description}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 'assessment':
      case 'quiz':
        const assessmentData = currentContent.assessmentQuestions ? JSON.parse(currentContent.assessmentQuestions) : null;
        const scoringData = currentContent.scoringSystem ? JSON.parse(currentContent.scoringSystem) : null;
        const questions = assessmentData?.questions || mockQuiz;
        
        return (
          <div className="space-y-6">
            <div className="bg-surface/50 border border-white/10 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-heading text-white">Major Assessment</h3>
                <div className="flex items-center gap-4 text-sm font-paragraph text-gray-400">
                  {scoringData?.totalPoints && (
                    <span>Total Points: {scoringData.totalPoints}</span>
                  )}
                  {currentContent.timeLimitMinutes && (
                    <span>Time Limit: {currentContent.timeLimitMinutes} minutes</span>
                  )}
                </div>
              </div>
              
              {scoringData?.passingScore && (
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
                  <p className="text-primary font-paragraph text-sm">
                    <strong>Passing Score:</strong> {scoringData.passingScore}/{scoringData.totalPoints} points ({Math.round((scoringData.passingScore / scoringData.totalPoints) * 100)}%)
                  </p>
                </div>
              )}
            </div>

            {questions.map((question: any, index: number) => (
              <Card key={question.id || index} className="bg-surface/50 border-white/10">
                <CardContent className="p-6">
                  <h4 className="font-heading text-white mb-4">
                    Question {index + 1}: {question.question}
                  </h4>
                  
                  {question.type === 'essay' ? (
                    <div className="space-y-3">
                      <textarea
                        className="w-full h-32 p-3 bg-background/50 border border-white/20 rounded-lg text-white placeholder:text-gray-500 resize-vertical"
                        placeholder="Type your answer here..."
                        value={quizAnswers[question.id || index] || ''}
                        onChange={(e) => handleQuizAnswer(question.id || index, e.target.value)}
                      />
                      {question.points && (
                        <p className="text-sm font-paragraph text-gray-400">
                          Points: {question.points}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {question.options?.map((option: string, optionIndex: number) => (
                        <button
                          key={optionIndex}
                          onClick={() => handleQuizAnswer(question.id || index, optionIndex)}
                          className={`w-full text-left p-3 rounded-lg border transition-all ${
                            quizAnswers[question.id || index] === optionIndex
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-white/20 text-gray-300 hover:border-white/40'
                          }`}
                        >
                          {String.fromCharCode(65 + optionIndex)}. {option}
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            <Card className="bg-surface/50 border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-heading text-white mb-2">Assessment Progress</h4>
                    <p className="text-sm font-paragraph text-gray-400">
                      {Object.keys(quizAnswers).length} of {questions.length} questions answered
                    </p>
                    {currentContent.timeLimitMinutes && (
                      <p className="text-xs font-paragraph text-gray-500 mt-1">
                        Time remaining: {currentContent.timeLimitMinutes} minutes
                      </p>
                    )}
                  </div>
                  <Button 
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={Object.keys(quizAnswers).length < questions.length}
                  >
                    Submit Assessment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <div className="prose prose-invert max-w-none">
            <h3 className="text-xl font-heading text-white mb-4">
              {currentContent.title}
            </h3>
            <div className="font-paragraph text-gray-300 leading-relaxed">
              {currentContent.textContent || currentContent.description || (
                <div>
                  <p className="mb-4">
                    Welcome to this comprehensive learning module. In this section, you'll discover 
                    key concepts and practical applications that will enhance your understanding 
                    of the subject matter.
                  </p>
                  <p className="mb-4">
                    Our interactive approach ensures that you not only learn the theory but also 
                    gain hands-on experience through practical exercises and real-world examples.
                  </p>
                  <p>
                    Take your time to absorb the information, and don't hesitate to revisit 
                    previous sections if you need to reinforce your understanding.
                  </p>
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  const getContentIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'video':
        return Play;
      case 'assessment':
      case 'quiz':
        return HelpCircle;
      default:
        return FileText;
    }
  };

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
                {currentContentIndex + 1} of {courseContent.length} lessons
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
            <h2 className="font-heading text-white font-semibold mb-4">Course Content</h2>
            <div className="space-y-2">
              {courseContent.map((content, index) => {
                const IconComponent = getContentIcon(content.contentType || '');
                const isCompleted = completedContent.has(content._id);
                const isCurrent = index === currentContentIndex;
                
                return (
                  <button
                    key={content._id}
                    onClick={() => setCurrentContentIndex(index)}
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
                          {content.title || `Lesson ${index + 1}`}
                        </div>
                        {content.estimatedDurationMinutes && (
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                            <Clock className="w-3 h-3" />
                            <span>{content.estimatedDurationMinutes}min</span>
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
                  Lesson {currentContentIndex + 1} of {courseContent.length}
                </div>
                <div className="text-xs font-paragraph text-gray-500">
                  {currentContent?.estimatedDurationMinutes && `${currentContent.estimatedDurationMinutes} minutes`}
                </div>
              </div>

              {currentContentIndex === courseContent.length - 1 ? (
                <Button
                  onClick={handleNext}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Complete Course
                  <CheckCircle className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Next
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