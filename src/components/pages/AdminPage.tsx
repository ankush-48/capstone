import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BaseCrudService, useMember } from '@/integrations';
import { Courses } from '@/entities/courses';
import { CourseContent } from '@/entities/coursecontent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MemberProtectedRoute } from '@/components/ui/member-protected-route';
import { 
  Plus,
  Edit,
  Trash2,
  Users,
  BookOpen,
  BarChart3,
  Settings,
  Upload,
  Download
} from 'lucide-react';

function AdminContent() {
  const { member } = useMember();
  const [courses, setCourses] = useState<Courses[]>([]);
  const [courseContent, setCourseContent] = useState<CourseContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Courses | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isContentDialogOpen, setIsContentDialogOpen] = useState(false);

  const [newCourse, setNewCourse] = useState({
    titleEn: '',
    titleEs: '',
    descriptionEn: '',
    descriptionEs: '',
    category: '',
    difficultyLevel: '',
    instructorName: '',
    durationMinutes: 0,
    thumbnail: ''
  });

  const [newContent, setNewContent] = useState({
    title: '',
    contentType: '',
    description: '',
    orderIndex: 0,
    estimatedDurationMinutes: 0,
    textContent: '',
    contentUrl: '',
    videoLectureUrl: '',
    captionsHindi: '',
    captionsTamil: '',
    captionsTelugu: '',
    downloadableNotes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [coursesResult, contentResult] = await Promise.all([
        BaseCrudService.getAll<Courses>('courses'),
        BaseCrudService.getAll<CourseContent>('coursecontent')
      ]);
      
      setCourses(coursesResult.items);
      setCourseContent(contentResult.items);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async () => {
    try {
      const courseData = {
        ...newCourse,
        _id: crypto.randomUUID(),
        _createdDate: new Date(),
        _updatedDate: new Date()
      };
      
      await BaseCrudService.create('courses', courseData);
      await fetchData();
      setIsCreateDialogOpen(false);
      setNewCourse({
        titleEn: '',
        titleEs: '',
        descriptionEn: '',
        descriptionEs: '',
        category: '',
        difficultyLevel: '',
        instructorName: '',
        durationMinutes: 0,
        thumbnail: ''
      });
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  const handleCreateContent = async () => {
    try {
      const contentData = {
        ...newContent,
        _id: crypto.randomUUID(),
        _createdDate: new Date(),
        _updatedDate: new Date()
      };
      
      await BaseCrudService.create('coursecontent', contentData);
      await fetchData();
      setIsContentDialogOpen(false);
      setNewContent({
        title: '',
        contentType: '',
        description: '',
        orderIndex: 0,
        estimatedDurationMinutes: 0,
        textContent: '',
        contentUrl: '',
        videoLectureUrl: '',
        captionsHindi: '',
        captionsTamil: '',
        captionsTelugu: '',
        downloadableNotes: ''
      });
    } catch (error) {
      console.error('Error creating content:', error);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (confirm('Are you sure you want to delete this course?')) {
      try {
        await BaseCrudService.delete('courses', courseId);
        await fetchData();
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  const handleDeleteContent = async (contentId: string) => {
    if (confirm('Are you sure you want to delete this content?')) {
      try {
        await BaseCrudService.delete('coursecontent', contentId);
        await fetchData();
      } catch (error) {
        console.error('Error deleting content:', error);
      }
    }
  };

  const exportData = () => {
    const data = {
      courses,
      courseContent,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `learnhub-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-paragraph text-gray-400">Loading admin panel...</p>
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
              Admin Panel
            </h1>
            <p className="text-lg font-paragraph text-gray-400">
              Manage courses, content, and platform settings
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="py-8 px-6">
        <div className="max-w-[100rem] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              {
                icon: BookOpen,
                title: 'Total Courses',
                value: courses.length,
                color: 'text-blue-400'
              },
              {
                icon: Users,
                title: 'Content Items',
                value: courseContent.length,
                color: 'text-primary'
              },
              {
                icon: BarChart3,
                title: 'Categories',
                value: new Set(courses.map(c => c.category).filter(Boolean)).size,
                color: 'text-yellow-400'
              },
              {
                icon: Settings,
                title: 'Active',
                value: courses.length,
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
          <Tabs defaultValue="courses" className="space-y-6">
            <TabsList className="bg-surface/50 border border-white/10">
              <TabsTrigger value="courses" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Courses
              </TabsTrigger>
              <TabsTrigger value="content" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Content
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Courses Tab */}
            <TabsContent value="courses" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold font-heading text-white">
                  Course Management
                </h2>
                <div className="flex gap-3">
                  <Button onClick={exportData} variant="outline" className="border-white/20 text-gray-400 hover:text-white">
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                  <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Course
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-surface border-white/20 text-white max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="font-heading">Create New Course</DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="titleEn">Title (English)</Label>
                          <Input
                            id="titleEn"
                            value={newCourse.titleEn}
                            onChange={(e) => setNewCourse({...newCourse, titleEn: e.target.value})}
                            className="bg-background/50 border-white/20 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="titleEs">Title (Spanish)</Label>
                          <Input
                            id="titleEs"
                            value={newCourse.titleEs}
                            onChange={(e) => setNewCourse({...newCourse, titleEs: e.target.value})}
                            className="bg-background/50 border-white/20 text-white"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="descriptionEn">Description (English)</Label>
                          <Textarea
                            id="descriptionEn"
                            value={newCourse.descriptionEn}
                            onChange={(e) => setNewCourse({...newCourse, descriptionEn: e.target.value})}
                            className="bg-background/50 border-white/20 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="category">Category</Label>
                          <Input
                            id="category"
                            value={newCourse.category}
                            onChange={(e) => setNewCourse({...newCourse, category: e.target.value})}
                            className="bg-background/50 border-white/20 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="difficulty">Difficulty</Label>
                          <Select value={newCourse.difficultyLevel} onValueChange={(value) => setNewCourse({...newCourse, difficultyLevel: value})}>
                            <SelectTrigger className="bg-background/50 border-white/20 text-white">
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Beginner">Beginner</SelectItem>
                              <SelectItem value="Intermediate">Intermediate</SelectItem>
                              <SelectItem value="Advanced">Advanced</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="instructor">Instructor</Label>
                          <Input
                            id="instructor"
                            value={newCourse.instructorName}
                            onChange={(e) => setNewCourse({...newCourse, instructorName: e.target.value})}
                            className="bg-background/50 border-white/20 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="duration">Duration (minutes)</Label>
                          <Input
                            id="duration"
                            type="number"
                            value={newCourse.durationMinutes}
                            onChange={(e) => setNewCourse({...newCourse, durationMinutes: parseInt(e.target.value) || 0})}
                            className="bg-background/50 border-white/20 text-white"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-3 mt-6">
                        <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateCourse} className="bg-primary text-primary-foreground">
                          Create Course
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <Card key={course._id} className="bg-surface/50 border-white/10 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg font-heading text-white line-clamp-2">
                          {course.titleEn}
                        </CardTitle>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleDeleteCourse(course._id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {course.category && (
                          <Badge variant="outline" className="border-primary/30 text-primary text-xs">
                            {course.category}
                          </Badge>
                        )}
                        {course.difficultyLevel && (
                          <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30 text-xs">
                            {course.difficultyLevel}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="font-paragraph text-gray-400 text-sm mb-3 line-clamp-2">
                        {course.descriptionEn}
                      </p>
                      <div className="text-xs font-paragraph text-gray-500">
                        Instructor: {course.instructorName || 'Not assigned'}
                      </div>
                      <div className="text-xs font-paragraph text-gray-500">
                        Duration: {course.durationMinutes ? `${Math.round(course.durationMinutes / 60)}h` : 'Not set'}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold font-heading text-white">
                  Content Management
                </h2>
                <Dialog open={isContentDialogOpen} onOpenChange={setIsContentDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Content
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-surface border-white/20 text-white max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="font-heading">Create New Content</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="contentTitle">Title</Label>
                        <Input
                          id="contentTitle"
                          value={newContent.title}
                          onChange={(e) => setNewContent({...newContent, title: e.target.value})}
                          className="bg-background/50 border-white/20 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="contentType">Content Type</Label>
                        <Select value={newContent.contentType} onValueChange={(value) => setNewContent({...newContent, contentType: value})}>
                          <SelectTrigger className="bg-background/50 border-white/20 text-white">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="video">Video</SelectItem>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="quiz">Quiz</SelectItem>
                            <SelectItem value="assignment">Assignment</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="contentDescription">Description</Label>
                        <Textarea
                          id="contentDescription"
                          value={newContent.description}
                          onChange={(e) => setNewContent({...newContent, description: e.target.value})}
                          className="bg-background/50 border-white/20 text-white"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="orderIndex">Order Index</Label>
                          <Input
                            id="orderIndex"
                            type="number"
                            value={newContent.orderIndex}
                            onChange={(e) => setNewContent({...newContent, orderIndex: parseInt(e.target.value) || 0})}
                            className="bg-background/50 border-white/20 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="duration">Duration (minutes)</Label>
                          <Input
                            id="duration"
                            type="number"
                            value={newContent.estimatedDurationMinutes}
                            onChange={(e) => setNewContent({...newContent, estimatedDurationMinutes: parseInt(e.target.value) || 0})}
                            className="bg-background/50 border-white/20 text-white"
                          />
                        </div>
                      </div>
                      
                      {newContent.contentType === 'video' && (
                        <>
                          <div>
                            <Label htmlFor="videoUrl">Video Lecture URL</Label>
                            <Input
                              id="videoUrl"
                              value={newContent.videoLectureUrl}
                              onChange={(e) => setNewContent({...newContent, videoLectureUrl: e.target.value})}
                              className="bg-background/50 border-white/20 text-white"
                              placeholder="https://example.com/video.mp4"
                            />
                          </div>
                          
                          <div className="space-y-4">
                            <Label className="text-white font-medium">Caption Files</Label>
                            <div className="grid grid-cols-1 gap-3">
                              <div>
                                <Label htmlFor="captionsHindi" className="text-sm text-gray-300">Hindi Captions (.vtt/.srt)</Label>
                                <Input
                                  id="captionsHindi"
                                  value={newContent.captionsHindi}
                                  onChange={(e) => setNewContent({...newContent, captionsHindi: e.target.value})}
                                  className="bg-background/50 border-white/20 text-white"
                                  placeholder="https://example.com/captions-hindi.vtt"
                                />
                              </div>
                              <div>
                                <Label htmlFor="captionsTamil" className="text-sm text-gray-300">Tamil Captions (.vtt/.srt)</Label>
                                <Input
                                  id="captionsTamil"
                                  value={newContent.captionsTamil}
                                  onChange={(e) => setNewContent({...newContent, captionsTamil: e.target.value})}
                                  className="bg-background/50 border-white/20 text-white"
                                  placeholder="https://example.com/captions-tamil.vtt"
                                />
                              </div>
                              <div>
                                <Label htmlFor="captionsTelugu" className="text-sm text-gray-300">Telugu Captions (.vtt/.srt)</Label>
                                <Input
                                  id="captionsTelugu"
                                  value={newContent.captionsTelugu}
                                  onChange={(e) => setNewContent({...newContent, captionsTelugu: e.target.value})}
                                  className="bg-background/50 border-white/20 text-white"
                                  placeholder="https://example.com/captions-telugu.vtt"
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="downloadableNotes">Downloadable Notes URL</Label>
                            <Input
                              id="downloadableNotes"
                              value={newContent.downloadableNotes}
                              onChange={(e) => setNewContent({...newContent, downloadableNotes: e.target.value})}
                              className="bg-background/50 border-white/20 text-white"
                              placeholder="https://example.com/lecture-notes.pdf"
                            />
                          </div>
                        </>
                      )}
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                      <Button variant="outline" onClick={() => setIsContentDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateContent} className="bg-primary text-primary-foreground">
                        Create Content
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-4">
                {courseContent.map((content) => (
                  <Card key={content._id} className="bg-surface/50 border-white/10 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-heading text-white font-medium">
                            {content.title || 'Untitled Content'}
                          </h3>
                          <div className="flex items-center gap-4 mt-2">
                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                              {content.contentType || 'Unknown'}
                            </Badge>
                            <span className="text-xs font-paragraph text-gray-500">
                              Order: {content.orderIndex || 0}
                            </span>
                            {content.estimatedDurationMinutes && (
                              <span className="text-xs font-paragraph text-gray-500">
                                {content.estimatedDurationMinutes}min
                              </span>
                            )}
                            {content.videoLectureUrl && (
                              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                                Video
                              </Badge>
                            )}
                            {(content.captionsHindi || content.captionsTamil || content.captionsTelugu) && (
                              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                                Captions
                              </Badge>
                            )}
                            {content.downloadableNotes && (
                              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs">
                                Notes
                              </Badge>
                            )}
                          </div>
                          {content.description && (
                            <p className="text-sm font-paragraph text-gray-400 mt-2 line-clamp-2">
                              {content.description}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleDeleteContent(content._id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <h2 className="text-2xl font-bold font-heading text-white">
                Platform Settings
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-surface/50 border-white/10 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="font-heading text-white">General Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Platform Name</Label>
                      <Input value="LearnHub" className="bg-background/50 border-white/20 text-white" />
                    </div>
                    <div>
                      <Label>Default Language</Label>
                      <Select defaultValue="en">
                        <SelectTrigger className="bg-background/50 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                      Save Settings
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-surface/50 border-white/10 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="font-heading text-white">Media Management</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Upload Media</Label>
                      <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="font-paragraph text-gray-400 text-sm">
                          Drag and drop files here or click to browse
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full border-white/20 text-gray-400 hover:text-white">
                      Manage Media Library
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}

export default function AdminPage() {
  return (
    <MemberProtectedRoute messageToSignIn="Sign in to access the admin panel">
      <AdminContent />
    </MemberProtectedRoute>
  );
}