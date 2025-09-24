import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BaseCrudService } from '@/integrations';
import { Courses } from '@/entities/courses';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Clock, User, BookOpen } from 'lucide-react';
import { Image } from '@/components/ui/image';

export default function CoursesPage() {
  const [courses, setCourses] = useState<Courses[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Courses[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [courses, searchTerm, selectedCategory, selectedDifficulty]);

  const fetchCourses = async () => {
    try {
      const { items } = await BaseCrudService.getAll<Courses>('courses');
      setCourses(items);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = courses;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.titleEn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.descriptionEn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructorName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }

    // Difficulty filter
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(course => course.difficultyLevel === selectedDifficulty);
    }

    setFilteredCourses(filtered);
  };

  const categories = [...new Set(courses.map(course => course.category).filter(Boolean))];
  const difficulties = [...new Set(courses.map(course => course.difficultyLevel).filter(Boolean))];

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-paragraph text-gray-400">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <section className="py-16 px-6 bg-gradient-to-br from-surface/50 to-background">
        <div className="max-w-[100rem] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold font-heading text-white mb-4">
              Course Catalog
            </h1>
            <p className="text-lg font-paragraph text-gray-400 max-w-3xl mx-auto">
              Discover our comprehensive collection of courses designed to advance your skills and career
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-surface/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background/50 border-white/20 text-white placeholder:text-gray-500"
                />
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-background/50 border-white/20 text-white">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category!}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="bg-background/50 border-white/20 text-white">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {difficulties.map(difficulty => (
                    <SelectItem key={difficulty} value={difficulty!}>
                      {difficulty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="text-sm font-paragraph text-gray-400 flex items-center">
                {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-12 px-6">
        <div className="max-w-[100rem] mx-auto">
          {filteredCourses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-heading text-gray-400 mb-2">No courses found</h3>
              <p className="font-paragraph text-gray-500">
                Try adjusting your search criteria or browse all courses
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course, index) => (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="bg-surface/50 border-white/10 backdrop-blur-sm hover:bg-surface/70 transition-all duration-300 group overflow-hidden">
                    {course.thumbnail && (
                      <div className="relative overflow-hidden">
                        <Image
                          src={course.thumbnail}
                          alt={course.titleEn || 'Course thumbnail'}
                          width={400}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      </div>
                    )}
                    
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <CardTitle className="text-lg font-heading text-white line-clamp-2">
                          {course.titleEn}
                        </CardTitle>
                        {course.difficultyLevel && (
                          <Badge className={`text-xs ${getDifficultyColor(course.difficultyLevel)}`}>
                            {course.difficultyLevel}
                          </Badge>
                        )}
                      </div>
                      
                      {course.category && (
                        <Badge variant="outline" className="w-fit text-xs border-primary/30 text-primary">
                          {course.category}
                        </Badge>
                      )}
                    </CardHeader>

                    <CardContent className="pt-0">
                      <p className="font-paragraph text-gray-400 text-sm mb-4 line-clamp-3">
                        {course.descriptionEn}
                      </p>

                      <div className="flex items-center gap-4 text-xs font-paragraph text-gray-500 mb-4">
                        {course.instructorName && (
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>{course.instructorName}</span>
                          </div>
                        )}
                        {course.durationMinutes && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{Math.round(course.durationMinutes / 60)}h</span>
                          </div>
                        )}
                      </div>

                      <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                        <Link to={`/courses/${course._id}`}>
                          View Course
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}