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
