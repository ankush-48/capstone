/**
 * Collection ID: coursecontent
 * Interface for CourseContent
 */
export interface CourseContent {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType url */
  downloadableNotes?: string;
  /** @wixFieldType number */
  timeLimitMinutes?: number;
  /** @wixFieldType text */
  scoringSystem?: string;
  /** @wixFieldType text */
  assessmentQuestions?: string;
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
  learningObjectives?: string;
  /** @wixFieldType text */
  keyTakeaways?: string;
  /** @wixFieldType text */
  interactiveElements?: string;
  /** @wixFieldType text */
  activityData?: string;
  /** @wixFieldType text */
  moduleContent?: string;
  /** @wixFieldType text */
  activityType?: string;
}
