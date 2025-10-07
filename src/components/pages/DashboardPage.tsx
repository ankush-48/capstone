import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BaseCrudService, useMember } from '@/integrations';
import { Courses } from '@/entities/courses';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MemberProtectedRoute } from '@/components/ui/member-protected-route';
import { CertificateGenerator } from '@/components/ui/certificate-generator';
import { PDFNotesGenerator } from '@/components/ui/pdf-notes-generator';
import { 
  BookOpen, 
  Clock, 
  Award, 
  TrendingUp,
  Play,
  Download,
  Calendar,
  Target,
  FileText,
  CheckCircle
} from 'lucide-react';
import { Image } from '@/components/ui/image';

function DashboardContent() {
  const { member } = useMember();
  const [enrolledCourses, setEnrolledCourses] = useState<Courses[]>([]);
  const [completedCourses, setCompletedCourses] = useState<Courses[]>([]);
  const [courseContent, setCourseContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserCourses();
  }, []);

  const fetchUserCourses = async () => {
    try {
      // Fetch all courses and simulate user enrollment
      const { items: allCourses } = await BaseCrudService.getAll<Courses>('courses');
      
      // Simulate enrolled courses (first 3 courses)
      const enrolled = allCourses.slice(0, 3);
      setEnrolledCourses(enrolled);
      
      // Simulate completed courses (last 2 courses)
      const completed = allCourses.slice(-2);
      setCompletedCourses(completed);

      // Fetch course content for notes generation
      const { items: contentItems } = await BaseCrudService.getAll('coursecontent');
      setCourseContent(contentItems);
    } catch (error) {
      console.error('Error fetching user courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const mockProgress = [65, 30, 85]; // Mock progress for enrolled courses
  const totalHoursLearned = 24;
  const certificatesEarned = completedCourses.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-paragraph text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <section className="py-12 px-6 bg-gradient-to-br from-surface/50 to-background">
        <div className="max-w-[100rem] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl font-bold font-heading text-white mb-2">
              Welcome back, {member?.profile?.nickname || member?.contact?.firstName || 'Learner'}!
            </h1>
            <p className="text-lg font-paragraph text-gray-400">
              Continue your learning journey and track your progress
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="py-8 px-6">
        <div className="max-w-[100rem] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[
              {
                icon: BookOpen,
                title: 'Courses Enrolled',
                value: enrolledCourses.length,
                color: 'text-blue-400'
              },
              {
                icon: Award,
                title: 'Certificates Earned',
                value: certificatesEarned,
                color: 'text-primary'
              },
              {
                icon: Clock,
                title: 'Hours Learned',
                value: totalHoursLearned,
                color: 'text-yellow-400'
              },
              {
                icon: TrendingUp,
                title: 'Average Progress',
                value: `${Math.round(mockProgress.reduce((a, b) => a + b, 0) / mockProgress.length)}%`,
                color: 'text-green-400'
              }
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-surface/50 border-white/10 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <stat.icon className={`w-8 h-8 ${stat.color}`} />
                      <div>
                        <div className="text-2xl font-bold font-heading text-white">
                          {stat.value}
                        </div>
                        <div className="text-sm font-paragraph text-gray-400">
                          {stat.title}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 px-6">
        <div className="max-w-[100rem] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Continue Learning */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold font-heading text-white mb-6">
                  Continue Learning
                </h2>

                <div className="space-y-6">
                  {enrolledCourses.map((course, index) => (
                    <Card key={course._id} className="bg-surface/50 border-white/10 backdrop-blur-sm hover:bg-surface/70 transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          {course.thumbnail && (
                            <div className="flex-shrink-0">
                              <Image
                                src={course.thumbnail}
                                alt={course.titleEn || 'Course thumbnail'}
                                width={120}
                                className="w-20 h-20 object-cover rounded-lg"
                              />
                            </div>
                          )}
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-lg font-heading text-white font-semibold">
                                {course.titleEn}
                              </h3>
                              <Badge variant="outline" className="border-primary/30 text-primary text-xs">
                                {course.category}
                              </Badge>
                            </div>
                            
                            <p className="font-paragraph text-gray-400 text-sm mb-3 line-clamp-2">
                              {course.descriptionEn}
                            </p>
                            
                            <div className="flex items-center gap-4 mb-3">
                              <div className="flex-1">
                                <div className="flex items-center justify-between text-sm font-paragraph text-gray-400 mb-1">
                                  <span>Progress</span>
                                  <span>{mockProgress[index]}%</span>
                                </div>
                                <Progress value={mockProgress[index]} className="h-2" />
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3 flex-wrap">
                              <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                                <Link to={`/courses/${course._id}/learn`}>
                                  <Play className="w-4 h-4 mr-2" />
                                  Continue
                                </Link>
                              </Button>
                              <Button asChild variant="outline" size="sm" className="border-white/20 text-gray-400 hover:text-white">
                                <Link to={`/courses/${course._id}`}>
                                  View Details
                                </Link>
                              </Button>
                              
                              {/* Download Notes for Course Modules */}
                              {courseContent.length > 0 && (
                                <div className="ml-auto">
                                  <PDFNotesGenerator
                                    content={{
                                      ...courseContent[index % courseContent.length],
                                      title: `${course.titleEn} - Course Overview`,
                                      description: course.descriptionEn,
                                      learningObjectives: JSON.stringify([
                                        { id: '1', text: 'Complete all course modules', completed: false },
                                        { id: '2', text: 'Apply learned concepts in practice', completed: false },
                                        { id: '3', text: 'Earn course certificate', completed: false }
                                      ]),
                                      keyTakeaways: JSON.stringify([
                                        { id: '1', text: 'Master the core concepts of this course', icon: 'brain' },
                                        { id: '2', text: 'Gain practical skills through hands-on learning', icon: 'activity' },
                                        { id: '3', text: 'Build a strong foundation for advanced topics', icon: 'target' }
                                      ]),
                                      moduleContent: `
                                        <div class="space-y-6">
                                          <h3 class="text-xl font-semibold text-primary mb-3">Course Overview</h3>
                                          <p>${course.descriptionEn}</p>
                                          
                                          <h3 class="text-xl font-semibold text-primary mb-3">What You'll Learn</h3>
                                          <p>This comprehensive course will guide you through essential concepts and practical applications. You'll engage with interactive content, complete hands-on activities, and build real-world skills.</p>
                                          
                                          <h3 class="text-xl font-semibold text-primary mb-3">Course Structure</h3>
                                          <p>The course is designed with a scroll-based learning approach, featuring progressive disclosure of concepts, interactive elements, and activity-based learning to ensure maximum retention and engagement.</p>
                                          
                                          <h3 class="text-xl font-semibold text-primary mb-3">Prerequisites</h3>
                                          <p>This course is suitable for ${course.difficultyLevel?.toLowerCase() || 'all'} level learners. Basic familiarity with the subject area is helpful but not required.</p>
                                          
                                          <h3 class="text-xl font-semibold text-primary mb-3">Certification</h3>
                                          <p>Upon successful completion, you'll receive a verified certificate that you can share on professional networks and include in your portfolio.</p>
                                        </div>
                                      `
                                    }}
                                    courseName={course.titleEn}
                                    onDownload={() => console.log('Course overview notes downloaded for:', course.titleEn)}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {enrolledCourses.length === 0 && (
                  <Card className="bg-surface/50 border-white/10 backdrop-blur-sm">
                    <CardContent className="p-12 text-center">
                      <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <h3 className="text-xl font-heading text-gray-400 mb-2">No courses enrolled yet</h3>
                      <p className="font-paragraph text-gray-500 mb-4">
                        Start your learning journey by enrolling in a course
                      </p>
                      <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                        <Link to="/courses">Browse Courses</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* Quick Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <Card className="bg-surface/50 border-white/10 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="font-heading text-white">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button asChild variant="outline" className="w-full justify-start border-white/20 text-gray-400 hover:text-white">
                        <Link to="/courses">
                          <BookOpen className="w-4 h-4 mr-2" />
                          Browse Courses
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full justify-start border-white/20 text-gray-400 hover:text-white">
                        <Link to="/certificates">
                          <Award className="w-4 h-4 mr-2" />
                          My Certificates
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full justify-start border-white/20 text-gray-400 hover:text-white">
                        <Link to="/profile">
                          <Target className="w-4 h-4 mr-2" />
                          Update Profile
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Certificates */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <Card className="bg-surface/50 border-white/10 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="font-heading text-white">Certificates</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {completedCourses.length > 0 ? (
                        <div className="space-y-3">
                          {completedCourses.map((course) => {
                            const { downloadCertificate, downloadCertificatePDF } = CertificateGenerator({
                              course,
                              completionDate: new Date(),
                              onDownload: () => {
                                console.log(`Certificate downloaded for ${course.titleEn}`);
                              }
                            });

                            return (
                              <div key={course._id} className="flex items-center justify-between p-3 bg-background/30 rounded-lg">
                                <div className="flex-1">
                                  <div className="font-paragraph text-white text-sm font-medium">
                                    {course.titleEn}
                                  </div>
                                  <div className="font-paragraph text-gray-400 text-xs">
                                    Completed • Certificate Available
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    onClick={downloadCertificate}
                                    className="text-primary hover:text-primary/80 hover:bg-primary/10"
                                    title="Download PNG Certificate"
                                  >
                                    <Download className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    onClick={downloadCertificatePDF}
                                    className="text-secondary hover:text-secondary/80 hover:bg-secondary/10"
                                    title="Download PDF Certificate"
                                  >
                                    <FileText className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <Award className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                          <p className="font-paragraph text-gray-500 text-sm">
                            Complete courses to earn certificates
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Learning Streak */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <Card className="bg-surface/50 border-white/10 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="font-heading text-white">Learning Streak</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="text-3xl font-bold font-heading text-primary mb-2">
                        7
                      </div>
                      <div className="font-paragraph text-gray-400 text-sm mb-4">
                        Days in a row
                      </div>
                      <div className="flex items-center justify-center gap-1">
                        {Array.from({ length: 7 }, (_, i) => (
                          <div
                            key={i}
                            className={`w-3 h-3 rounded-full ${
                              i < 7 ? 'bg-primary' : 'bg-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <MemberProtectedRoute>
      <DashboardContent />
    </MemberProtectedRoute>
  );
}