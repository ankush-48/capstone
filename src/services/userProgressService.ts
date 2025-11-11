import { BaseCrudService } from '@/integrations';
import { UserCourseProgress, Courses } from '@/entities';

export class UserProgressService {
  private static readonly COLLECTION_ID = 'usercourseprogress';

  /**
   * Initialize progress for a new user by creating 0% progress entries for all available courses
   */
  static async initializeUserProgress(userId: string): Promise<void> {
    try {
      // Check if user already has progress records
      const existingProgress = await this.getUserProgress(userId);
      if (existingProgress.length > 0) {
        console.log('User already has progress records, skipping initialization');
        return;
      }

      // Get all available courses
      const { items: allCourses } = await BaseCrudService.getAll<Courses>('courses');
      
      // Create progress records for each course with 0% completion
      const progressRecords: Partial<UserCourseProgress>[] = allCourses.map(course => ({
        _id: crypto.randomUUID(),
        userId,
        courseId: course._id,
        completionPercentage: 0,
        isCompleted: false,
        lastUpdatedDate: new Date()
      }));

      // Batch create all progress records
      for (const record of progressRecords) {
        await BaseCrudService.create(this.COLLECTION_ID, record as any);
      }

      console.log(`Initialized progress for ${progressRecords.length} courses for user ${userId}`);
    } catch (error) {
      console.error('Error initializing user progress:', error);
      throw error;
    }
  }

  /**
   * Get all progress records for a specific user
   */
  static async getUserProgress(userId: string): Promise<UserCourseProgress[]> {
    try {
      const { items } = await BaseCrudService.getAll<UserCourseProgress>(this.COLLECTION_ID);
      return items.filter(progress => progress.userId === userId);
    } catch (error) {
      console.error('Error fetching user progress:', error);
      return [];
    }
  }

  /**
   * Get progress for a specific user and course
   */
  static async getCourseProgress(userId: string, courseId: string): Promise<UserCourseProgress | null> {
    try {
      const userProgress = await this.getUserProgress(userId);
      return userProgress.find(progress => progress.courseId === courseId) || null;
    } catch (error) {
      console.error('Error fetching course progress:', error);
      return null;
    }
  }

  /**
   * Update progress for a specific course
   */
  static async updateCourseProgress(
    userId: string, 
    courseId: string, 
    completionPercentage: number
  ): Promise<void> {
    try {
      const existingProgress = await this.getCourseProgress(userId, courseId);
      
      if (!existingProgress) {
        // Create new progress record if it doesn't exist
        await BaseCrudService.create(this.COLLECTION_ID, {
          _id: crypto.randomUUID(),
          userId,
          courseId,
          completionPercentage,
          isCompleted: completionPercentage >= 100,
          lastUpdatedDate: new Date()
        });
      } else {
        // Update existing progress record
        await BaseCrudService.update(this.COLLECTION_ID, {
          _id: existingProgress._id,
          completionPercentage,
          isCompleted: completionPercentage >= 100,
          lastUpdatedDate: new Date()
        });
      }
    } catch (error) {
      console.error('Error updating course progress:', error);
      throw error;
    }
  }

  /**
   * Get courses with progress information for a user
   */
  static async getUserCoursesWithProgress(userId: string): Promise<Array<Courses & { progress: number; isCompleted: boolean }>> {
    try {
      // Get all courses
      const { items: allCourses } = await BaseCrudService.getAll<Courses>('courses');
      
      // Get user progress
      const userProgress = await this.getUserProgress(userId);
      
      // Combine course data with progress
      return allCourses.map(course => {
        const progress = userProgress.find(p => p.courseId === course._id);
        return {
          ...course,
          progress: progress?.completionPercentage || 0,
          isCompleted: progress?.isCompleted || false
        };
      });
    } catch (error) {
      console.error('Error fetching courses with progress:', error);
      return [];
    }
  }

  /**
   * Get completed courses for a user
   */
  static async getCompletedCourses(userId: string): Promise<Courses[]> {
    try {
      const coursesWithProgress = await this.getUserCoursesWithProgress(userId);
      const completedCourseIds = coursesWithProgress
        .filter(course => course.isCompleted)
        .map(course => course._id);

      const { items: allCourses } = await BaseCrudService.getAll<Courses>('courses');
      return allCourses.filter(course => completedCourseIds.includes(course._id));
    } catch (error) {
      console.error('Error fetching completed courses:', error);
      return [];
    }
  }

  /**
   * Get enrolled courses (courses with progress > 0 but not completed)
   */
  static async getEnrolledCourses(userId: string): Promise<Array<Courses & { progress: number }>> {
    try {
      const coursesWithProgress = await this.getUserCoursesWithProgress(userId);
      return coursesWithProgress
        .filter(course => course.progress > 0 && !course.isCompleted)
        .map(course => ({
          _id: course._id,
          _createdDate: course._createdDate,
          _updatedDate: course._updatedDate,
          titleEn: course.titleEn,
          titleEs: course.titleEs,
          descriptionEn: course.descriptionEn,
          descriptionEs: course.descriptionEs,
          thumbnail: course.thumbnail,
          category: course.category,
          durationMinutes: course.durationMinutes,
          difficultyLevel: course.difficultyLevel,
          instructorName: course.instructorName,
          progress: course.progress
        }));
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      return [];
    }
  }
}