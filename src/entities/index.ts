/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: coursecontent
 * Interface for CourseContent
 */
export interface CourseContent {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  activityData?: string;
  /** @wixFieldType text */
  keyTakeaways?: string;
  /** @wixFieldType text */
  interactiveElements?: string;
  /** @wixFieldType url */
  downloadableNotes?: string;
  /** @wixFieldType text */
  learningObjectives?: string;
  /** @wixFieldType number */
  timeLimitMinutes?: number;
  /** @wixFieldType text */
  scoringSystem?: string;
  /** @wixFieldType text */
  assessmentQuestions?: string;
  /** @wixFieldType url */
  captionsTamil?: string;
  /** @wixFieldType url */
  captionsTelugu?: string;
  /** @wixFieldType url */
  videoLectureUrl?: string;
  /** @wixFieldType url */
  captionsHindi?: string;
  /** @wixFieldType text */
  title?: string;
  /** @wixFieldType text */
  contentType?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType number */
  orderIndex?: number;
  /** @wixFieldType url */
  contentUrl?: string;
  /** @wixFieldType text */
  textContent?: string;
  /** @wixFieldType image */
  thumbnailImage?: string;
  /** @wixFieldType number */
  estimatedDurationMinutes?: number;
  /** @wixFieldType text */
  moduleContent?: string;
  /** @wixFieldType text */
  activityType?: string;
}


/**
 * Collection ID: courses
 * Interface for Courses
 */
export interface Courses {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  titleEn?: string;
  /** @wixFieldType text */
  titleEs?: string;
  /** @wixFieldType text */
  descriptionEn?: string;
  /** @wixFieldType text */
  descriptionEs?: string;
  /** @wixFieldType image */
  thumbnail?: string;
  /** @wixFieldType text */
  category?: string;
  /** @wixFieldType number */
  durationMinutes?: number;
  /** @wixFieldType text */
  difficultyLevel?: string;
  /** @wixFieldType text */
  instructorName?: string;
}


/**
 * Collection ID: usercourseprogress
 * Interface for UserCourseProgress
 */
export interface UserCourseProgress {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  userId?: string;
  /** @wixFieldType text */
  courseId?: string;
  /** @wixFieldType number */
  completionPercentage?: number;
  /** @wixFieldType datetime */
  lastUpdatedDate?: Date;
  /** @wixFieldType boolean */
  isCompleted?: boolean;
}
