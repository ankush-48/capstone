import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BaseCrudService, useMember } from '@/integrations';
import { Courses } from '@/entities/courses';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MemberProtectedRoute } from '@/components/ui/member-protected-route';
import { CertificateGenerator } from '@/components/ui/certificate-generator';
import { 
  Award, 
  Download, 
  FileText,
  Calendar,
  Search,
  CheckCircle,
  ExternalLink,
  Share2
} from 'lucide-react';
import { Image } from '@/components/ui/image';

interface CertificateRecord {
  id: string;
  course: Courses;
  completionDate: Date;
  certificateId: string;
  verified: boolean;
}

function CertificatesContent() {
  const { member } = useMember();
  const [certificates, setCertificates] = useState<CertificateRecord[]>([]);
  const [filteredCertificates, setFilteredCertificates] = useState<CertificateRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();
  }, []);

  useEffect(() => {
    filterCertificates();
  }, [certificates, searchTerm]);

  const fetchCertificates = async () => {
    try {
      // Fetch all courses and simulate completed courses with certificates
      const { items: allCourses } = await BaseCrudService.getAll<Courses>('courses');
      
      // Simulate completed courses with certificates (in a real app, this would come from user progress data)
      const completedCourses = allCourses.slice(0, 3); // First 3 courses as completed
      
      const certificateRecords: CertificateRecord[] = completedCourses.map((course, index) => ({
        id: `cert-${course._id}`,
        course,
        completionDate: new Date(Date.now() - (index + 1) * 7 * 24 * 60 * 60 * 1000), // Completed 1-3 weeks ago
        certificateId: `CERT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
        verified: true
      }));
      
      setCertificates(certificateRecords);
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCertificates = () => {
    let filtered = certificates;

    if (searchTerm) {
      filtered = filtered.filter(cert =>
        cert.course.titleEn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.course.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.certificateId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCertificates(filtered);
  };

  const shareCertificate = (certificate: CertificateRecord) => {
    const shareText = `I just completed "${certificate.course.titleEn}" and earned a verified certificate! 🎓`;
    const shareUrl = `${window.location.origin}/certificates/verify/${certificate.certificateId}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Certificate',
        text: shareText,
        url: shareUrl
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${shareText}\n\nVerify at: ${shareUrl}`);
      alert('Certificate link copied to clipboard!');
    }
  };

  const viewCertificateOnline = (certificate: CertificateRecord) => {
    // In a real app, this would open a public certificate verification page
    const verificationUrl = `${window.location.origin}/certificates/verify/${certificate.certificateId}`;
    window.open(verificationUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-paragraph text-gray-400">Loading certificates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <section className="py-12 px-6 bg-gradient-to-br from-surface/50 to-background">
        <div className="max-w-[100rem] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold font-heading text-white">
                My Certificates
              </h1>
            </div>
            <p className="text-lg font-paragraph text-gray-400 mb-6">
              View, download, and share your earned certificates
            </p>

            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search certificates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-surface/50 border-white/20 text-white placeholder:text-gray-500"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Certificates Grid */}
      <section className="py-12 px-6">
        <div className="max-w-[100rem] mx-auto">
          {filteredCertificates.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Award className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-heading text-gray-400 mb-2">
                {certificates.length === 0 ? 'No certificates earned yet' : 'No certificates found'}
              </h3>
              <p className="font-paragraph text-gray-500 mb-6">
                {certificates.length === 0 
                  ? 'Complete courses to earn verified certificates'
                  : 'Try adjusting your search criteria'
                }
              </p>
              {certificates.length === 0 && (
                <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <a href="/courses">Browse Courses</a>
                </Button>
              )}
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCertificates.map((certificate, index) => {
                const { downloadCertificate, downloadCertificatePDF } = CertificateGenerator({
                  course: certificate.course,
                  completionDate: certificate.completionDate,
                  onDownload: () => {
                    console.log(`Certificate downloaded for ${certificate.course.titleEn}`);
                  }
                });

                return (
                  <motion.div
                    key={certificate.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="bg-surface/50 border-white/10 backdrop-blur-sm hover:bg-surface/70 transition-all duration-300 group overflow-hidden">
                      {/* Certificate Preview */}
                      <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <div className="text-center">
                          <Award className="w-16 h-16 text-primary mx-auto mb-3" />
                          <div className="text-white font-heading font-bold text-lg">
                            CERTIFICATE
                          </div>
                          <div className="text-primary text-sm">
                            OF COMPLETION
                          </div>
                        </div>
                        
                        {certificate.verified && (
                          <div className="absolute top-3 right-3">
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          </div>
                        )}
                      </div>

                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-heading text-white line-clamp-2">
                          {certificate.course.titleEn}
                        </CardTitle>
                        
                        <div className="flex items-center gap-2">
                          {certificate.course.category && (
                            <Badge variant="outline" className="border-primary/30 text-primary text-xs">
                              {certificate.course.category}
                            </Badge>
                          )}
                          {certificate.course.difficultyLevel && (
                            <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30 text-xs">
                              {certificate.course.difficultyLevel}
                            </Badge>
                          )}
                        </div>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <div className="space-y-4">
                          {/* Certificate Details */}
                          <div className="space-y-2 text-sm font-paragraph">
                            <div className="flex items-center gap-2 text-gray-400">
                              <Calendar className="w-4 h-4" />
                              <span>Completed: {certificate.completionDate.toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                              <Award className="w-4 h-4" />
                              <span>ID: {certificate.certificateId}</span>
                            </div>
                            {certificate.course.instructorName && (
                              <div className="text-gray-400">
                                Instructor: {certificate.course.instructorName}
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              onClick={downloadCertificate}
                              size="sm"
                              className="bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              PNG
                            </Button>
                            <Button
                              onClick={downloadCertificatePDF}
                              size="sm"
                              variant="outline"
                              className="border-primary/30 text-primary hover:bg-primary/10"
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              PDF
                            </Button>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              onClick={() => viewCertificateOnline(certificate)}
                              size="sm"
                              variant="outline"
                              className="border-white/20 text-gray-400 hover:text-white"
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View
                            </Button>
                            <Button
                              onClick={() => shareCertificate(certificate)}
                              size="sm"
                              variant="outline"
                              className="border-white/20 text-gray-400 hover:text-white"
                            >
                              <Share2 className="w-4 h-4 mr-2" />
                              Share
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Certificate Stats */}
      {certificates.length > 0 && (
        <section className="py-12 px-6 bg-surface/30">
          <div className="max-w-[100rem] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold font-heading text-white mb-8 text-center">
                Your Learning Achievements
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-surface/50 border-white/10 backdrop-blur-sm text-center">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold font-heading text-primary mb-2">
                      {certificates.length}
                    </div>
                    <div className="text-sm font-paragraph text-gray-400">
                      Certificates Earned
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-surface/50 border-white/10 backdrop-blur-sm text-center">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold font-heading text-primary mb-2">
                      {new Set(certificates.map(c => c.course.category)).size}
                    </div>
                    <div className="text-sm font-paragraph text-gray-400">
                      Categories Mastered
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-surface/50 border-white/10 backdrop-blur-sm text-center">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold font-heading text-primary mb-2">
                      {certificates.filter(c => c.verified).length}
                    </div>
                    <div className="text-sm font-paragraph text-gray-400">
                      Verified Certificates
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
}

export default function CertificatesPage() {
  return (
    <MemberProtectedRoute>
      <CertificatesContent />
    </MemberProtectedRoute>
  );
}