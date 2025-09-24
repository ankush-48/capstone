import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMember } from '@/integrations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { MemberProtectedRoute } from '@/components/ui/member-protected-route';
import { 
  User, 
  Mail, 
  Calendar,
  Settings,
  Shield,
  Bell,
  Globe,
  Save
} from 'lucide-react';
import { Image } from '@/components/ui/image';

function ProfileContent() {
  const { member, actions } = useMember();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: member?.contact?.firstName || '',
    lastName: member?.contact?.lastName || '',
    nickname: member?.profile?.nickname || '',
    title: member?.profile?.title || '',
  });

  const handleSave = () => {
    // In a real app, this would update the member profile
    console.log('Saving profile:', formData);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <section className="py-12 px-6 bg-gradient-to-br from-surface/50 to-background">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="relative inline-block mb-6">
              {member?.profile?.photo?.url ? (
                <Image
                  src={member.profile.photo.url}
                  alt="Profile photo"
                  width={120}
                  className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-surface border-4 border-primary/20 flex items-center justify-center">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Settings className="w-4 h-4 text-primary-foreground" />
              </div>
            </div>

            <h1 className="text-3xl font-bold font-heading text-white mb-2">
              {member?.profile?.nickname || member?.contact?.firstName || 'User Profile'}
            </h1>
            
            {member?.profile?.title && (
              <p className="text-lg font-paragraph text-gray-400 mb-4">
                {member.profile.title}
              </p>
            )}

            <div className="flex items-center justify-center gap-4 text-sm font-paragraph text-gray-500">
              <div className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                <span>{member?.loginEmail}</span>
              </div>
              {member?._createdDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {new Date(member._createdDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Profile Content */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Profile Info */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="bg-surface/50 border-white/10 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="font-heading text-white">Personal Information</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                      className="border-primary/30 text-primary hover:bg-primary/10"
                    >
                      {isEditing ? (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </>
                      ) : (
                        'Edit'
                      )}
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName" className="text-gray-300">First Name</Label>
                        {isEditing ? (
                          <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            className="mt-1 bg-background/50 border-white/20 text-white"
                          />
                        ) : (
                          <div className="mt-1 p-2 text-white font-paragraph">
                            {member?.contact?.firstName || 'Not set'}
                          </div>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="lastName" className="text-gray-300">Last Name</Label>
                        {isEditing ? (
                          <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            className="mt-1 bg-background/50 border-white/20 text-white"
                          />
                        ) : (
                          <div className="mt-1 p-2 text-white font-paragraph">
                            {member?.contact?.lastName || 'Not set'}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="nickname" className="text-gray-300">Display Name</Label>
                      {isEditing ? (
                        <Input
                          id="nickname"
                          value={formData.nickname}
                          onChange={(e) => handleInputChange('nickname', e.target.value)}
                          className="mt-1 bg-background/50 border-white/20 text-white"
                        />
                      ) : (
                        <div className="mt-1 p-2 text-white font-paragraph">
                          {member?.profile?.nickname || 'Not set'}
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="title" className="text-gray-300">Title/Role</Label>
                      {isEditing ? (
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => handleInputChange('title', e.target.value)}
                          className="mt-1 bg-background/50 border-white/20 text-white"
                          placeholder="e.g., Software Developer, Student"
                        />
                      ) : (
                        <div className="mt-1 p-2 text-white font-paragraph">
                          {member?.profile?.title || 'Not set'}
                        </div>
                      )}
                    </div>

                    <Separator className="bg-white/10" />

                    <div>
                      <Label className="text-gray-300">Email Address</Label>
                      <div className="mt-1 p-2 text-white font-paragraph flex items-center gap-2">
                        {member?.loginEmail}
                        {member?.loginEmailVerified && (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* Account Status */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <Card className="bg-surface/50 border-white/10 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="font-heading text-white flex items-center gap-2">
                        <Shield className="w-5 h-5 text-primary" />
                        Account Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-paragraph text-gray-400 text-sm">Status</span>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          {member?.status || 'Active'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="font-paragraph text-gray-400 text-sm">Email Verified</span>
                        <Badge className={
                          member?.loginEmailVerified 
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                        }>
                          {member?.loginEmailVerified ? 'Yes' : 'Pending'}
                        </Badge>
                      </div>

                      {member?.lastLoginDate && (
                        <div className="pt-2 border-t border-white/10">
                          <span className="font-paragraph text-gray-400 text-sm">Last Login</span>
                          <div className="font-paragraph text-white text-sm mt-1">
                            {new Date(member.lastLoginDate).toLocaleDateString()}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Quick Settings */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <Card className="bg-surface/50 border-white/10 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="font-heading text-white">Quick Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button variant="outline" className="w-full justify-start border-white/20 text-gray-400 hover:text-white">
                        <Bell className="w-4 h-4 mr-2" />
                        Notifications
                      </Button>
                      <Button variant="outline" className="w-full justify-start border-white/20 text-gray-400 hover:text-white">
                        <Globe className="w-4 h-4 mr-2" />
                        Language
                      </Button>
                      <Button variant="outline" className="w-full justify-start border-white/20 text-gray-400 hover:text-white">
                        <Shield className="w-4 h-4 mr-2" />
                        Privacy
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Account Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <Card className="bg-surface/50 border-white/10 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="font-heading text-white">Account</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button 
                        onClick={actions.logout}
                        variant="outline" 
                        className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10"
                      >
                        Sign Out
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <MemberProtectedRoute>
      <ProfileContent />
    </MemberProtectedRoute>
  );
}