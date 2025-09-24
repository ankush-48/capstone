// HPI 1.4-G
import { useMember } from '@/integrations';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookOpen, Users, Award, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { useEffect, useState, useRef } from 'react';

// Custom hook for Intersection Observer
const useIntersectionObserver = (options: IntersectionObserverInit & { triggerOnce?: boolean }) => {
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const [node, setNode] = useState<HTMLElement | null>(null);
  const [hasTriggered, setHasTriggered] = useState(false);

  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(([entry]) => {
      setEntry(entry);
      
      // Handle triggerOnce functionality
      if (options.triggerOnce && entry.isIntersecting && !hasTriggered) {
        setHasTriggered(true);
      }
    }, {
      threshold: options.threshold,
      root: options.root,
      rootMargin: options.rootMargin
    });

    const { current: currentObserver } = observer;
    if (node) currentObserver.observe(node);

    return () => currentObserver.disconnect();
  }, [node, options, hasTriggered]);

  // Return the intersection state, considering triggerOnce behavior
  const isIntersecting = options.triggerOnce 
    ? (hasTriggered || entry?.isIntersecting) 
    : entry?.isIntersecting;

  return [setNode, isIntersecting] as const;
};

const AnimatedElement = ({ children, className, delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1, triggerOnce: true });
  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default function HomePage() {
  const { isAuthenticated, actions } = useMember();
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: BookOpen,
      title: "Expert-Led Courses",
      description: "Dive into a curated catalog of courses designed and taught by industry veterans. Gain practical, real-world skills that are immediately applicable to your career.",
      imageSrc: "https://static.wixstatic.com/media/f45df3_7af6340e27684dbc8a1b201b6b15e841~mv2.png?originWidth=576&originHeight=576",
      alt: "An industry expert giving a lecture on a complex topic."
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Visualize your learning journey with an intuitive dashboard. Monitor course completion, quiz scores, and skill acquisition to stay motivated and on track.",
      imageSrc: "https://static.wixstatic.com/media/f45df3_0b955daa214d4a67bae473108c75de11~mv2.png?originWidth=576&originHeight=576",
      alt: "A close-up of a personal progress dashboard with charts and graphs."
    },
    {
      icon: Award,
      title: "Verified Certificates",
      description: "Earn recognized certificates upon course completion. Showcase your achievements on your resume and professional networks to validate your new expertise.",
      imageSrc: "https://static.wixstatic.com/media/f45df3_d4e58872114a4d2a82a3ec88903e1a42~mv2.png?originWidth=576&originHeight=576",
      alt: "A digital certificate of completion with a modern design."
    },
    {
      icon: Users,
      title: "Global Community",
      description: "Connect with a vibrant community of learners and mentors. Collaborate on projects, ask questions, and grow your professional network in a supportive environment.",
      imageSrc: "https://static.wixstatic.com/media/f45df3_e62cef1b6b8d46a485dfa0f85dfe848a~mv2.png?originWidth=576&originHeight=576",
      alt: "An online forum showing collaboration between learners."
    }
  ];

  const courses = [
    {
      title: "Advanced Data Visualization",
      category: "Data Science",
      imageSrc: "https://static.wixstatic.com/media/f45df3_d4dd50cb207e441f804837f9a03b6b8e~mv2.png?originWidth=384&originHeight=192",
      alt: "A course on advanced data visualization."
    },
    {
      title: "AI & Machine Learning Principles",
      category: "Artificial Intelligence",
      imageSrc: "https://static.wixstatic.com/media/f45df3_68c2e4b73e154eb6be1fb4b530d56644~mv2.png?originWidth=384&originHeight=192",
      alt: "A course on AI and machine learning principles."
    },
    {
      title: "Secure Backend Development",
      category: "Web Development",
      imageSrc: "https://static.wixstatic.com/media/f45df3_92be4e0d0b7c451c96f42f817f31f89e~mv2.png?originWidth=384&originHeight=192",
      alt: "A course on secure backend development."
    },
    {
      title: "UX/UI Design Fundamentals",
      category: "Design",
      imageSrc: "https://static.wixstatic.com/media/f45df3_713cd03ff2644d389f7070c1fb3e0a49~mv2.png?originWidth=384&originHeight=192",
      alt: "A course on UX/UI design fundamentals."
    }
  ];

  return (
    <div className="bg-background text-foreground font-paragraph overflow-clip">
      <style>{`
        .glassmorphic-card {
          background: rgba(30, 30, 30, 0.5);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(100, 255, 218, 0.15);
        }
        .grid-bg {
          background-image:
            linear-gradient(to right, rgba(100, 255, 218, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(100, 255, 218, 0.08) 1px, transparent 1px);
          background-size: 4rem 4rem;
        }
        .corner-brackets::before, .corner-brackets::after {
          content: '';
          position: absolute;
          width: 24px;
          height: 24px;
          border-color: #64FFDA;
          border-style: solid;
          transition: all 0.3s ease;
        }
        .corner-brackets::before {
          top: -8px;
          left: -8px;
          border-width: 2px 0 0 2px;
        }
        .corner-brackets::after {
          bottom: -8px;
          right: -8px;
          border-width: 0 2px 2px 0;
        }
        .infinity-slider .slider-track {
          animation: scroll 60s linear infinite;
        }
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-384px * ${courses.length})); }
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative w-full h-screen min-h-[700px] flex items-center overflow-clip">
        <div className="absolute inset-0 grid-bg opacity-50"></div>
        <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-primary/50 via-primary/20 to-transparent"></div>
        
        <div className="relative z-10 w-full max-w-[120rem] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-12 gap-x-8 items-center">
            <div className="col-span-12 lg:col-span-7 xl:col-span-6 z-20">
              <AnimatedElement>
                <p className="font-paragraph text-primary text-lg mb-4">01 / Introduction</p>
                <h1 className="text-5xl md:text-7xl font-bold font-heading text-on-surface mb-6 z-10 relative">
                  Empower Your Future
                </h1>
              </AnimatedElement>
              <AnimatedElement delay={150}>
                <p className="text-lg text-foreground/80 mb-8 max-w-xl">
                  Master new skills with our cutting-edge learning platform. Access expert-led courses, track your progress, and earn certificates in emerging technologies.
                </p>
              </AnimatedElement>
              <AnimatedElement delay={300} className="flex flex-col sm:flex-row gap-4">
                {isAuthenticated ? (
                  <>
                    <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                      <Link to="/dashboard">Go to Dashboard</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/10 transition-colors">
                      <Link to="/courses">Browse Courses</Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button onClick={actions.login} size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                      Get Started
                    </Button>
                    <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/10 transition-colors">
                      <Link to="/courses">Explore Courses</Link>
                    </Button>
                  </>
                )}
              </AnimatedElement>
            </div>
            
            <div className="hidden lg:block col-span-5 xl:col-span-6 h-[80vh] relative -mr-12">
              <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent z-10"></div>
              <Image
                src="https://static.wixstatic.com/media/f45df3_b2e983da99df42f483130d0d69a229e1~mv2.png?originWidth=1152&originHeight=896"
                alt="A futuristic user dashboard interface for the learning platform."
                width={1200}
                height={900}
                className="w-full h-full object-cover object-left rounded-l-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 md:py-32 px-6 lg:px-12">
        <div className="max-w-[120rem] mx-auto">
          <AnimatedElement className="text-center mb-16">
            <p className="font-paragraph text-primary text-lg mb-4">02 / The Process</p>
            <h2 className="text-4xl md:text-5xl font-bold font-heading text-on-surface mb-4">
              The Future of Learning, Simplified
            </h2>
            <p className="text-lg text-foreground/80 max-w-3xl mx-auto">
              Our platform is designed for a seamless journey from discovery to mastery.
            </p>
          </AnimatedElement>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Explore & Enroll", description: "Browse our extensive catalog and find the perfect course to match your career goals.", icon: <BookOpen className="w-8 h-8 text-primary" /> },
              { title: "Learn & Track", description: "Engage with high-quality content and monitor your progress with our intuitive dashboard.", icon: <TrendingUp className="w-8 h-8 text-primary" /> },
              { title: "Achieve & Certify", description: "Complete your course and earn a verified certificate to showcase your new skills.", icon: <Award className="w-8 h-8 text-primary" /> }
            ].map((step, index) => (
              <AnimatedElement key={step.title} delay={index * 150}>
                <div className="glassmorphic-card p-8 rounded-lg h-full">
                  <div className="flex items-center gap-4 mb-4">
                    {step.icon}
                    <span className="text-3xl font-heading text-primary/50">0{index + 1}</span>
                  </div>
                  <h3 className="text-2xl font-semibold font-heading text-on-surface mb-3">{step.title}</h3>
                  <p className="text-foreground/70">{step.description}</p>
                </div>
              </AnimatedElement>
            ))}
          </div>
        </div>
      </section>

      {/* Course Showcase Section */}
      <section className="py-24 md:py-32 bg-surface/50 overflow-clip infinity-slider">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12 mb-16">
          <AnimatedElement>
            <p className="font-paragraph text-primary text-lg mb-4">03 / Course Catalog</p>
            <h2 className="text-4xl md:text-5xl font-bold font-heading text-on-surface">Featured Courses</h2>
          </AnimatedElement>
        </div>
        <div className="slider-track flex gap-8">
          {[...courses, ...courses].map((course, index) => (
            <Card key={`${course.title}-${index}`} className="glassmorphic-card group w-96 flex-shrink-0 rounded-lg overflow-clip">
              <div className="h-56 overflow-clip">
                <Image
                  src={course.imageSrc}
                  alt={course.alt}
                  width={384}
                  height={224}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <p className="font-paragraph text-primary text-sm mb-2">{course.category}</p>
                <h3 className="text-xl font-semibold font-heading text-on-surface mb-4">{course.title}</h3>
                <Link to="/courses" className="text-primary font-semibold inline-flex items-center gap-2 group/link">
                  Explore Course
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 md:py-32 px-6 lg:px-12 relative grid-bg">
        <div className="max-w-[120rem] mx-auto">
          <AnimatedElement className="text-center mb-16">
            <p className="font-paragraph text-primary text-lg mb-4">04 / Proven Results</p>
            <h2 className="text-4xl md:text-5xl font-bold font-heading text-on-surface mb-4">
              Join a Thriving Community
            </h2>
            <p className="text-lg text-foreground/80 max-w-3xl mx-auto">
              Our platform empowers thousands of learners to achieve their goals. The numbers speak for themselves.
            </p>
          </AnimatedElement>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { number: "10,000+", label: "Active Learners" },
              { number: "50+", label: "Expert Courses" },
              { number: "95%", label: "Completion Rate" }
            ].map((stat, index) => (
              <AnimatedElement key={stat.label} delay={index * 150}>
                <div className="relative p-8 text-center rounded-lg glassmorphic-card">
                  <div className="relative corner-brackets">
                    <div className="text-6xl font-bold font-heading text-primary mb-2">
                      {stat.number}
                    </div>
                    <div className="text-lg text-foreground/80">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </AnimatedElement>
            ))}
          </div>
        </div>
      </section>

      {/* Features Deep Dive Section */}
      <section className="py-24 md:py-32 px-6 lg:px-12">
        <div className="max-w-[120rem] mx-auto">
          <AnimatedElement className="text-center mb-16">
            <p className="font-paragraph text-primary text-lg mb-4">05 / Platform Features</p>
            <h2 className="text-4xl md:text-5xl font-bold font-heading text-on-surface mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-lg text-foreground/80 max-w-3xl mx-auto">
              Experience the future of learning with our innovative approach to skill development.
            </p>
          </AnimatedElement>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-4">
              {features.map((feature, index) => (
                <AnimatedElement key={feature.title} delay={index * 100}>
                  <button
                    onClick={() => setActiveFeature(index)}
                    className={`w-full text-left p-6 rounded-lg transition-colors duration-300 mb-4 ${activeFeature === index ? 'glassmorphic-card' : 'hover:bg-surface/50'}`}
                    aria-selected={activeFeature === index}
                    role="tab"
                  >
                    <div className="flex items-center gap-4">
                      <feature.icon className={`w-8 h-8 transition-colors ${activeFeature === index ? 'text-primary' : 'text-foreground/50'}`} />
                      <h3 className="text-xl font-semibold font-heading text-on-surface">{feature.title}</h3>
                    </div>
                  </button>
                </AnimatedElement>
              ))}
            </div>
            <div className="lg:col-span-8 relative h-[60vh] min-h-[500px]">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className={`absolute inset-0 transition-opacity duration-500 ${activeFeature === index ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                  role="tabpanel"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                    <div className="relative w-full h-full rounded-lg overflow-clip">
                       <Image
                        src={feature.imageSrc}
                        alt={feature.alt}
                        width={600}
                        height={600}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
                    </div>
                    <div className="flex flex-col justify-center p-4">
                      <h3 className="text-3xl font-bold font-heading text-on-surface mb-4">{feature.title}</h3>
                      <p className="text-lg text-foreground/80">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="absolute -inset-16 grid-bg opacity-30 -z-10"></div>
          <AnimatedElement>
            <p className="font-paragraph text-primary text-lg mb-4">06 / Get Started</p>
            <h2 className="text-4xl md:text-5xl font-bold font-heading text-on-surface mb-6">
              Ready to Transform Your Career?
            </h2>
            <p className="text-lg text-foreground/80 mb-8">
              Join thousands of learners who have already started their journey to success.
            </p>
            {isAuthenticated ? (
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6 transition-colors">
                <Link to="/dashboard">Continue Learning</Link>
              </Button>
            ) : (
              <Button onClick={actions.login} size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6 transition-colors">
                Start Learning Today
              </Button>
            )}
          </AnimatedElement>
        </div>
      </section>
    </div>
  );
}