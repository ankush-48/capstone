import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BaseCrudService, useMember } from '@/integrations';
import { Courses } from '@/entities/courses';
import { CourseContent } from '@/entities/coursecontent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MemberProtectedRoute } from '@/components/ui/member-protected-route';
import { 
  Clock, 
  User, 
  BookOpen, 
  Play, 
  FileText, 
  Award,
  ArrowLeft,
  CheckCircle,
  Download
} from 'lucide-react';
import { Image } from '@/components/ui/image';

function CourseDetailContent() {
  const { id } = useParams<{ id: string }>();
  const { member } = useMember();
  const [course, setCourse] = useState<Courses | null>(null);
  const [courseContent, setCourseContent] = useState<CourseContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCourseData();
    }
  }, [id]);

  const fetchCourseData = async () => {
    try {
      // Fetch course details
      const courseData = await BaseCrudService.getById<Courses>('courses', id!);
      setCourse(courseData);

      // Fetch course content
      const { items: contentItems } = await BaseCrudService.getAll<CourseContent>('coursecontent');
      // Filter content for this course (in a real app, you'd have a courseId field)
      const filteredContent = contentItems.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
      setCourseContent(filteredContent.slice(0, 6)); // Show first 6 items as sample

      // Check if user is enrolled (mock logic)
      setEnrolled(Math.random() > 0.5);
    } catch (error) {
      console.error('Error fetching course data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = () => {
    setEnrolled(true);
    // In a real app, this would make an API call to enroll the user
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'intermediate':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'advanced':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getContentIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'video':
        return Play;
      case 'text':
        return FileText;
      case 'quiz':
        return CheckCircle;
      default:
        return BookOpen;
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

  if (!course) {
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
      <section className="py-8 px-6 bg-gradient-to-br from-surface/50 to-background">
        <div className="max-w-[100rem] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Button variant="ghost" asChild className="mb-6 text-gray-400 hover:text-white">
              <Link to="/courses">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Courses
              </Link>
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Course Info */}
              <div className="lg:col-span-2">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  {course.category && (
                    <Badge variant="outline" className="border-primary/30 text-primary">
                      {course.category}
                    </Badge>
                  )}
                  {course.difficultyLevel && (
                    <Badge className={getDifficultyColor(course.difficultyLevel)}>
                      {course.difficultyLevel}
                    </Badge>
                  )}
                </div>

                <h1 className="text-4xl font-bold font-heading text-white mb-4">
                  {course.titleEn}
                </h1>

                <p className="text-lg font-paragraph text-gray-400 mb-6">
                  {course.descriptionEn}
                </p>

                <div className="flex flex-wrap items-center gap-6 text-sm font-paragraph text-gray-500">
                  {course.instructorName && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>Instructor: {course.instructorName}</span>
                    </div>
                  )}
                  {course.durationMinutes && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Duration: {Math.round(course.durationMinutes / 60)} hours</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    <span>Certificate included</span>
                  </div>
                </div>
              </div>

              {/* Course Image */}
              <div className="lg:col-span-1">
                {course.thumbnail && (
                  <div className="relative rounded-2xl overflow-hidden">
                    <Image
                      src={course.thumbnail}
                      alt={course.titleEn || 'Course thumbnail'}
                      width={400}
                      className="w-full h-64 lg:h-80 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-12 px-6">
        <div className="max-w-[100rem] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold font-heading text-white mb-6">
                  Course Content
                </h2>

                <div className="space-y-4">
                  {courseContent.map((content, index) => {
                    const IconComponent = getContentIcon(content.contentType || '');
                    const hasVideo = content.videoLectureUrl;
                    const hasCaptions = content.captionsHindi || content.captionsTamil || content.captionsTelugu;
                    const hasNotes = content.downloadableNotes;
                    
                    return (
                      <Card key={content._id} className="bg-surface/50 border-white/10 backdrop-blur-sm">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                              <IconComponent className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-heading text-white font-medium">
                                {content.title || `Lesson ${index + 1}`}
                              </h3>
                              {content.description && (
                                <p className="text-sm font-paragraph text-gray-400 mt-1">
                                  {content.description}
                                </p>
                              )}
                              
                              {/* Content Features */}
                              <div className="flex items-center gap-2 mt-2">
                                {hasVideo && (
                                  <span className="inline-flex items-center gap-1 text-xs font-paragraph text-green-400">
                                    <Play className="w-3 h-3" />
                                    Video
                                  </span>
                                )}
                                {hasCaptions && (
                                  <span className="inline-flex items-center gap-1 text-xs font-paragraph text-purple-400">
                                    <FileText className="w-3 h-3" />
                                    Multi-language
                                  </span>
                                )}
                                {hasNotes && (
                                  <span className="inline-flex items-center gap-1 text-xs font-paragraph text-orange-400">
                                    <Download className="w-3 h-3" />
                                    Notes
                                  </span>
                                )}
                              </div>
                            </div>
                            {content.estimatedDurationMinutes && (
                              <div className="flex items-center gap-1 text-xs font-paragraph text-gray-500">
                                <Clock className="w-3 h-3" />
                                <span>{content.estimatedDurationMinutes}min</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="bg-surface/50 border-white/10 backdrop-blur-sm sticky top-6">
                  <CardHeader>
                    <CardTitle className="font-heading text-white">
                      {enrolled ? 'Continue Learning' : 'Start Learning'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {enrolled ? (
                      <>
                        <div className="text-sm font-paragraph text-gray-400 mb-4">
                          Progress: 0% complete
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                          <div className="bg-primary h-2 rounded-full" style={{ width: '0%' }}></div>
                        </div>
                        <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                          <Link to={`/courses/${course._id}/learn`}>
                            Continue Course
                          </Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                          <Link to="/dashboard">
                            Go to Dashboard
                          </Link>
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="text-center mb-4">
                          <div className="text-3xl font-bold font-heading text-primary mb-1">
                            Free
                          </div>
                          <div className="text-sm font-paragraph text-gray-400">
                            Full access included
                          </div>
                        </div>
                        <Button 
                          onClick={handleEnroll}
                          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          Enroll Now
                        </Button>
                      </>
                    )}

                    <Separator className="bg-white/10" />

                    <div className="space-y-3 text-sm font-paragraph">
                      <div className="flex items-center gap-2 text-gray-400">
                        <BookOpen className="w-4 h-4" />
                        <span>{courseContent.length} lessons</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Play className="w-4 h-4" />
                        <span>HD video lectures</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <FileText className="w-4 h-4" />
                        <span>Multi-language captions</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Download className="w-4 h-4" />
                        <span>Downloadable resources</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>Self-paced learning</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Award className="w-4 h-4" />
                        <span>Certificate of completion</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function CourseDetailPage() {
  return (
    <MemberProtectedRoute messageToSignIn="Sign in to view course details and enroll">
      <CourseDetailContent />
    </MemberProtectedRoute>
  );
}