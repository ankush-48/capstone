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
}
