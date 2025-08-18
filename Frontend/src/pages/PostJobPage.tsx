import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Briefcase } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { API_BASE_URL } from "../config";


const PostJobPage: React.FC = () => {
  const id = localStorage.getItem("userSub");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    jobRole: '',
    company: '',
    category: '',
    location: '',
    description: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

const handleSubmit = async () => {
  const requiredFields = ['jobRole', 'company', 'category', 'location', 'description'];
  const emptyFields = requiredFields.filter(field => !formData[field as keyof typeof formData].trim());

  if (emptyFields.length > 0) {
    toast({
      title: "Missing Information",
      description: "Please fill in all required fields before submitting.",
      variant: "destructive"
    });
    return;
  }

  const jobPayload = {
    jobroles: formData.jobRole,
    company: formData.company,
    category: formData.category,
    location: formData.location,
    jobdescription: formData.description,
    postedDate: new Date().toLocaleDateString()
  };

  try {
    const response = await fetch(`${API_BASE_URL}/api/add-jobpost/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(jobPayload)
    });

    if (!response.ok) throw new Error("Failed to post job");

    const data = await response.json();

    toast({
      title: "Job Posted Successfully",
      description: data.message,
    });

    navigate('/home');
  } catch (error) {
    console.error("Error posting job:", error);
    toast({
      title: "Submission Failed",
      description: "There was a problem submitting the job.",
      variant: "destructive"
    });
  }
};


  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto h-full">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Post Job Vacancy</h1>
            <p className="text-muted-foreground">Create a new job posting to attract qualified candidates</p>
          </div>

          <Card className="h-4/5">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="mr-2 h-5 w-5" />
                Job Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="jobRole">Job Role *</Label>
                  <Input
                    id="jobRole"
                    placeholder="e.g. Senior Software Developer"
                    value={formData.jobRole}
                    onChange={(e) => handleInputChange('jobRole', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company *</Label>
                  <Input
                    id="company"
                    placeholder="e.g. Tech Solutions Inc."
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Input
                    id="category"
                    placeholder="e.g. Technology, Finance, Healthcare"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    placeholder="e.g. New York, NY or Remote"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Job Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the job role, responsibilities, requirements, and qualifications..."
                  rows={8}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </div>

              <div className="text-sm text-muted-foreground">
                * Required fields
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-8">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            
            <Button onClick={handleSubmit} size="lg">
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostJobPage;