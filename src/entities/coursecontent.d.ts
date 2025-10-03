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
  assessmentQuestions?: string;
  /** @wixFieldType text */
  scoringSystem?: string;
  /** @wixFieldType number */
  timeLimitMinutes?: number;
}
