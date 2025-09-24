/**
 * Collection ID: coursecontent
 * Interface for CourseContent
 */
export interface CourseContent {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
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
