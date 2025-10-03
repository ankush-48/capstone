// Script to create structured course content with lessons and assessments
import { BaseCrudService } from '@/integrations';
import { Courses } from '@/entities/courses';
import { CourseContent } from '@/entities/coursecontent';

// Animated video URLs for different course topics
const animatedVideos = {
  dataScience: "https://static.wixstatic.com/media/f45df3_228d7a8c3da549af94eeeb7871157f43~mv2.png?id=data-science-animated",
  ai: "https://static.wixstatic.com/media/f45df3_a10340ffe1f8465cbdca9fe4beb1c405~mv2.png?id=ai-ml-animated", 
  webDev: "https://static.wixstatic.com/media/f45df3_1aa8711514bc414ebde9fcc559ea0326~mv2.png?id=web-dev-animated",
  design: "https://static.wixstatic.com/media/f45df3_acd398a22f284654a3d5a6a26f1b58bc~mv2.png?id=ux-ui-animated",
  general: "https://static.wixstatic.com/media/f45df3_29f921dcd14344ab93fd96a86dcf8482~mv2.png?id=general-animated"
};

// Course content templates
const courseTemplates = {
  "Advanced Data Visualization": {
    videoType: animatedVideos.dataScience,
    lessons: [
      {
        title: "Introduction to Data Visualization Principles",
        description: "Learn the fundamental principles of effective data visualization and how to choose the right chart types for your data.",
        duration: 25
      },
      {
        title: "Interactive Charts and Dashboards",
        description: "Create interactive visualizations that engage users and provide dynamic data exploration capabilities.",
        duration: 30
      },
      {
        title: "Advanced Statistical Visualizations",
        description: "Master complex statistical plots including box plots, violin plots, and multi-dimensional visualizations.",
        duration: 35
      },
      {
        title: "Real-time Data Visualization",
        description: "Build live dashboards that update in real-time with streaming data sources.",
        duration: 40
      },
      {
        title: "Data Storytelling Techniques",
        description: "Learn how to craft compelling narratives with your data visualizations.",
        duration: 30
      },
      {
        title: "Performance Optimization for Large Datasets",
        description: "Optimize your visualizations to handle millions of data points efficiently.",
        duration: 35
      }
    ]
  },
  "AI & Machine Learning Principles": {
    videoType: animatedVideos.ai,
    lessons: [
      {
        title: "Foundations of Artificial Intelligence",
        description: "Understand the history, types, and applications of AI in modern technology.",
        duration: 30
      },
      {
        title: "Machine Learning Algorithms Overview",
        description: "Explore supervised, unsupervised, and reinforcement learning algorithms.",
        duration: 35
      },
      {
        title: "Neural Networks and Deep Learning",
        description: "Dive deep into neural network architectures and deep learning concepts.",
        duration: 45
      },
      {
        title: "Natural Language Processing",
        description: "Learn how AI understands and processes human language.",
        duration: 40
      },
      {
        title: "Computer Vision Fundamentals",
        description: "Discover how machines can see and interpret visual information.",
        duration: 35
      },
      {
        title: "AI Ethics and Responsible Development",
        description: "Understand the ethical implications and responsible practices in AI development.",
        duration: 25
      },
      {
        title: "Building Your First AI Application",
        description: "Put theory into practice by building a complete AI-powered application.",
        duration: 50
      }
    ]
  },
  "Secure Backend Development": {
    videoType: animatedVideos.webDev,
    lessons: [
      {
        title: "Backend Security Fundamentals",
        description: "Learn the core principles of secure backend development and common vulnerabilities.",
        duration: 30
      },
      {
        title: "Authentication and Authorization",
        description: "Implement robust user authentication and role-based access control systems.",
        duration: 35
      },
      {
        title: "API Security Best Practices",
        description: "Secure your APIs with proper validation, rate limiting, and encryption.",
        duration: 40
      },
      {
        title: "Database Security and Encryption",
        description: "Protect sensitive data with encryption, secure queries, and access controls.",
        duration: 35
      },
      {
        title: "Server Hardening and Monitoring",
        description: "Configure secure servers and implement comprehensive monitoring systems.",
        duration: 30
      },
      {
        title: "Incident Response and Recovery",
        description: "Prepare for and respond to security incidents effectively.",
        duration: 25
      }
    ]
  },
  "UX/UI Design Fundamentals": {
    videoType: animatedVideos.design,
    lessons: [
      {
        title: "Design Thinking and User Research",
        description: "Master the design thinking process and conduct effective user research.",
        duration: 30
      },
      {
        title: "Information Architecture and Wireframing",
        description: "Structure information effectively and create detailed wireframes.",
        duration: 35
      },
      {
        title: "Visual Design Principles",
        description: "Apply color theory, typography, and layout principles to create beautiful interfaces.",
        duration: 40
      },
      {
        title: "Prototyping and User Testing",
        description: "Build interactive prototypes and conduct user testing sessions.",
        duration: 35
      },
      {
        title: "Responsive and Accessible Design",
        description: "Design interfaces that work across devices and are accessible to all users.",
        duration: 30
      },
      {
        title: "Design Systems and Component Libraries",
        description: "Create scalable design systems and maintain consistency across products.",
        duration: 25
      },
      {
        title: "Advanced Interaction Design",
        description: "Design complex interactions and micro-animations that enhance user experience.",
        duration: 40
      }
    ]
  }
};

// Assessment templates
const assessmentQuestions = {
  multipleChoice: [
    {
      question: "What is the primary goal of this lesson's content?",
      options: ["To memorize facts", "To understand concepts and apply them", "To complete assignments", "To pass the test"],
      correctAnswer: 1
    },
    {
      question: "Which of the following best describes the key principle covered?",
      options: ["It's optional to learn", "It's fundamental to the field", "It's outdated information", "It's only for experts"],
      correctAnswer: 1
    }
  ],
  practical: [
    {
      question: "Based on the lesson content, how would you approach solving a real-world problem?",
      type: "essay",
      points: 10
    },
    {
      question: "Identify three key takeaways from this lesson and explain how you would apply them.",
      type: "essay", 
      points: 15
    }
  ]
};

export async function createStructuredCourseContent() {
  try {
    // Get all existing courses
    const { items: courses } = await BaseCrudService.getAll<Courses>('courses');
    console.log(`Found ${courses.length} courses to populate with content`);

    for (const course of courses) {
      const courseTitle = course.titleEn || 'General Course';
      const template = courseTemplates[courseTitle as keyof typeof courseTemplates] || {
        videoType: animatedVideos.general,
        lessons: [
          { title: "Introduction", description: "Course introduction and overview", duration: 20 },
          { title: "Fundamentals", description: "Core concepts and principles", duration: 30 },
          { title: "Practical Applications", description: "Real-world applications and examples", duration: 35 },
          { title: "Advanced Concepts", description: "Advanced topics and techniques", duration: 40 },
          { title: "Best Practices", description: "Industry best practices and standards", duration: 30 },
          { title: "Final Project", description: "Capstone project and implementation", duration: 45 }
        ]
      };

      let orderIndex = 1;

      // Create lessons and assessments for each course
      for (let i = 0; i < template.lessons.length; i++) {
        const lesson = template.lessons[i];

        // Create lesson content
        const lessonContent: Partial<CourseContent> = {
          _id: crypto.randomUUID(),
          title: `Lesson ${i + 1}: ${lesson.title}`,
          contentType: 'video',
          description: lesson.description,
          orderIndex: orderIndex++,
          estimatedDurationMinutes: lesson.duration,
          videoLectureUrl: template.videoType,
          captionsHindi: `${template.videoType.replace('?id=', '?id=hindi-')}-captions.vtt`,
          captionsTamil: `${template.videoType.replace('?id=', '?id=tamil-')}-captions.vtt`,
          captionsTelugu: `${template.videoType.replace('?id=', '?id=telugu-')}-captions.vtt`,
          downloadableNotes: `${template.videoType.replace('?id=', '?id=notes-')}-lesson-${i + 1}.pdf`,
          thumbnailImage: template.videoType,
          textContent: `This lesson covers ${lesson.description.toLowerCase()}. You'll learn through animated examples and interactive demonstrations.`,
          _createdDate: new Date(),
          _updatedDate: new Date()
        };

        await BaseCrudService.create('coursecontent', lessonContent as any);

        // Create assessment after each lesson
        const assessmentContent: Partial<CourseContent> = {
          _id: crypto.randomUUID(),
          title: `Assessment ${i + 1}: ${lesson.title} Quiz`,
          contentType: 'assessment',
          description: `Comprehensive assessment to test your understanding of ${lesson.title.toLowerCase()}. Includes multiple choice questions and practical scenarios.`,
          orderIndex: orderIndex++,
          estimatedDurationMinutes: 15,
          textContent: JSON.stringify({
            questions: [
              ...assessmentQuestions.multipleChoice.map(q => ({
                ...q,
                question: q.question.replace('this lesson\'s content', lesson.title.toLowerCase())
              })),
              ...assessmentQuestions.practical.map(q => ({
                ...q,
                question: q.question.replace('this lesson', lesson.title)
              }))
            ],
            totalPoints: 30,
            passingScore: 21,
            timeLimit: 15
          }),
          _createdDate: new Date(),
          _updatedDate: new Date()
        };

        await BaseCrudService.create('coursecontent', assessmentContent as any);
      }

      console.log(`Created ${template.lessons.length * 2} content items for course: ${courseTitle}`);
    }

    console.log('Successfully created structured course content with lessons and assessments!');
  } catch (error) {
    console.error('Error creating course content:', error);
  }
}