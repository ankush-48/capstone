import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BaseCrudService, useMember } from '@/integrations';
import { Courses } from '@/entities/courses';
import { UserProgressService } from '@/services/userProgressService';
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
  const [enrolledCourses, setEnrolledCourses] = useState<Array<Courses & { progress: number }>>([]);
  const [completedCourses, setCompletedCourses] = useState<Courses[]>([]);
  const [courseContent, setCourseContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (member?._id) {
      initializeAndFetchUserCourses();
    }
  }, [member?._id]);

  const initializeAndFetchUserCourses = async () => {
    try {
      if (!member?._id) return;

      // Initialize progress for new user (this will skip if user already has progress)
      await UserProgressService.initializeUserProgress(member._id);
      
      // Fetch user courses with progress
      const enrolled = await UserProgressService.getEnrolledCourses(member._id);
      setEnrolledCourses(enrolled);
      
      // Fetch completed courses
      const completed = await UserProgressService.getCompletedCourses(member._id);
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

  const progressValues = enrolledCourses.map(course => course.progress);
  const totalHoursLearned = Math.round(enrolledCourses.reduce((total, course) => {
    const courseHours = course.durationMinutes ? course.durationMinutes / 60 : 0;
    return total + (courseHours * (course.progress / 100));
  }, 0));
  const certificatesEarned = completedCourses.length;
  const averageProgress = progressValues.length > 0 ? Math.round(progressValues.reduce((a, b) => a + b, 0) / progressValues.length) : 0;

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
                value: `${averageProgress}%`,
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
                                  <span>{course.progress}%</span>
                                </div>
                                <Progress value={course.progress} className="h-2" />
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
                                      title: `${course.titleEn} - Comprehensive Study Guide`,
                                      description: course.descriptionEn,
                                      learningObjectives: JSON.stringify([
                                        { id: '1', text: `Master the fundamental concepts and principles of ${course.category || 'this subject area'}`, completed: false },
                                        { id: '2', text: 'Apply theoretical knowledge through practical exercises and real-world scenarios', completed: false },
                                        { id: '3', text: 'Develop problem-solving skills specific to industry challenges', completed: false },
                                        { id: '4', text: 'Build a portfolio of projects demonstrating your expertise', completed: false },
                                        { id: '5', text: 'Prepare for professional certification and career advancement', completed: false }
                                      ]),
                                      keyTakeaways: JSON.stringify([
                                        { id: '1', text: `${course.category || 'This field'} requires both theoretical understanding and practical application`, icon: 'brain' },
                                        { id: '2', text: 'Hands-on practice is essential for mastering complex concepts', icon: 'activity' },
                                        { id: '3', text: 'Industry best practices evolve rapidly - continuous learning is key', icon: 'target' },
                                        { id: '4', text: 'Building a strong foundation enables advanced skill development', icon: 'lightbulb' },
                                        { id: '5', text: 'Professional networks and mentorship accelerate career growth', icon: 'users' }
                                      ]),
                                      interactiveElements: JSON.stringify([
                                        {
                                          id: '1',
                                          type: 'highlight',
                                          title: 'Industry Insight',
                                          content: `${course.category || 'This field'} professionals are in high demand, with average salaries ranging from $70,000 to $150,000+ depending on experience and specialization.`,
                                          position: 15
                                        },
                                        {
                                          id: '2',
                                          type: 'definition',
                                          title: 'Core Competency',
                                          content: `The ability to analyze complex problems, design effective solutions, and implement them using industry-standard tools and methodologies.`,
                                          position: 35
                                        },
                                        {
                                          id: '3',
                                          type: 'tip',
                                          title: 'Study Strategy',
                                          content: 'Focus on understanding the "why" behind each concept, not just the "how". This deeper understanding will help you adapt to new technologies and methodologies.',
                                          position: 55
                                        },
                                        {
                                          id: '4',
                                          type: 'example',
                                          title: 'Real-World Application',
                                          content: `Companies like Google, Microsoft, and Amazon regularly use these concepts in their daily operations, making this knowledge directly applicable to industry work.`,
                                          position: 75
                                        }
                                      ]),
                                      moduleContent: `
                                        <div class="space-y-6">
                                          <h3 class="text-xl font-semibold text-primary mb-3">Course Overview: ${course.titleEn}</h3>
                                          <p>${course.descriptionEn}</p>
                                          
                                          <h3 class="text-xl font-semibold text-primary mb-3">Learning Path & Curriculum</h3>
                                          <p>This comprehensive course is structured to take you from foundational concepts to advanced applications. Each module builds upon the previous one, ensuring a solid understanding before progressing to more complex topics.</p>
                                          
                                          <h4 class="text-lg font-semibold text-primary mb-2">Module 1: Foundations & Core Concepts</h4>
                                          <p>Begin with the fundamental principles that form the backbone of ${course.category || 'this field'}. You'll learn essential terminology, basic methodologies, and industry standards that every professional should know.</p>
                                          
                                          <h4 class="text-lg font-semibold text-primary mb-2">Module 2: Practical Applications</h4>
                                          <p>Move from theory to practice with hands-on exercises and real-world scenarios. This module focuses on applying what you've learned to solve actual problems you'll encounter in professional settings.</p>
                                          
                                          <h4 class="text-lg font-semibold text-primary mb-2">Module 3: Advanced Techniques</h4>
                                          <p>Explore sophisticated approaches and cutting-edge methodologies used by industry leaders. Learn optimization techniques, best practices, and how to handle complex, multi-faceted challenges.</p>
                                          
                                          <h4 class="text-lg font-semibold text-primary mb-2">Module 4: Industry Integration</h4>
                                          <p>Understand how your new skills fit into the broader industry landscape. Learn about career paths, professional development opportunities, and how to stay current with evolving trends.</p>
                                          
                                          <h3 class="text-xl font-semibold text-primary mb-3">Key Skills You'll Develop</h3>
                                          <ul class="list-disc pl-6 space-y-2">
                                            <li><strong>Analytical Thinking:</strong> Break down complex problems into manageable components</li>
                                            <li><strong>Technical Proficiency:</strong> Master industry-standard tools and technologies</li>
                                            <li><strong>Problem-Solving:</strong> Develop systematic approaches to finding effective solutions</li>
                                            <li><strong>Communication:</strong> Present technical concepts clearly to diverse audiences</li>
                                            <li><strong>Collaboration:</strong> Work effectively in team environments and cross-functional projects</li>
                                          </ul>
                                          
                                          <h3 class="text-xl font-semibold text-primary mb-3">Industry Context & Applications</h3>
                                          <p>The skills taught in this course are directly applicable across multiple industries including technology, finance, healthcare, manufacturing, and consulting. Graduates often pursue roles such as:</p>
                                          <ul class="list-disc pl-6 space-y-1">
                                            <li>Senior Analyst</li>
                                            <li>Technical Consultant</li>
                                            <li>Project Manager</li>
                                            <li>Solution Architect</li>
                                            <li>Team Lead</li>
                                          </ul>
                                          
                                          <h3 class="text-xl font-semibold text-primary mb-3">Prerequisites & Preparation</h3>
                                          <p>This course is designed for ${course.difficultyLevel?.toLowerCase() || 'all'} level learners. While no specific prerequisites are required, familiarity with basic concepts in the field will be helpful. We recommend:</p>
                                          <ul class="list-disc pl-6 space-y-1">
                                            <li>Basic understanding of fundamental principles</li>
                                            <li>Willingness to engage with hands-on exercises</li>
                                            <li>Access to a computer for practical assignments</li>
                                            <li>Commitment to approximately ${course.durationMinutes ? Math.round(course.durationMinutes / 60) : '10-15'} hours of study time</li>
                                          </ul>
                                          
                                          <h3 class="text-xl font-semibold text-primary mb-3">Assessment & Certification</h3>
                                          <p>Your progress will be evaluated through a combination of:</p>
                                          <ul class="list-disc pl-6 space-y-1">
                                            <li><strong>Interactive Quizzes:</strong> Test your understanding of key concepts</li>
                                            <li><strong>Practical Projects:</strong> Apply your skills to real-world scenarios</li>
                                            <li><strong>Peer Reviews:</strong> Learn from and provide feedback to fellow learners</li>
                                            <li><strong>Final Assessment:</strong> Comprehensive evaluation of your mastery</li>
                                          </ul>
                                          
                                          <p>Upon successful completion, you'll receive a verified certificate that demonstrates your competency to employers and can be shared on professional networks like LinkedIn.</p>
                                          
                                          <h3 class="text-xl font-semibold text-primary mb-3">Study Tips for Success</h3>
                                          <ul class="list-disc pl-6 space-y-2">
                                            <li><strong>Set a Schedule:</strong> Dedicate specific times for learning to maintain consistency</li>
                                            <li><strong>Take Notes:</strong> Use this study guide to supplement your learning with personal insights</li>
                                            <li><strong>Practice Regularly:</strong> Apply concepts immediately to reinforce understanding</li>
                                            <li><strong>Join Discussions:</strong> Engage with the learning community for additional perspectives</li>
                                            <li><strong>Seek Help:</strong> Don't hesitate to ask questions when concepts are unclear</li>
                                          </ul>
                                          
                                          <h3 class="text-xl font-semibold text-primary mb-3">Additional Resources</h3>
                                          <p>To supplement your learning, consider exploring:</p>
                                          <ul class="list-disc pl-6 space-y-1">
                                            <li>Industry publications and research papers</li>
                                            <li>Professional associations and networking groups</li>
                                            <li>Open-source projects and community contributions</li>
                                            <li>Conferences and webinars in your field of interest</li>
                                            <li>Mentorship opportunities with industry professionals</li>
                                          </ul>
                                        </div>
                                      `
                                    }}
                                    courseName={course.titleEn}
                                    onDownload={() => console.log('Comprehensive study guide downloaded for:', course.titleEn)}
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