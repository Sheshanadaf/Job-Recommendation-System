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
    setFormData(prev => ({ ...prev, [field]: value }));
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
        headers: { "Content-Type": "application/json" },
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

  const handleBack = () => navigate('/home');

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-1 p-6 md:p-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Post Job Vacancy</h1>
            <p className="text-gray-600">Attract qualified candidates by creating an engaging job posting.</p>
          </div>

          {/* Job Form Card */}
          <Card className="shadow-lg border border-gray-200 rounded-xl overflow-hidden">
            <CardHeader className="bg-blue-100">
              <CardTitle className="flex items-center text-lg md:text-xl font-semibold text-gray-800">
                <Briefcase className="mr-2 h-5 w-5 text-gray-600" />
                Job Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="jobRole" className="text-gray-700 font-medium">Job Role *</Label>
                  <Input
                    id="jobRole"
                    placeholder="Senior Software Developer"
                    value={formData.jobRole}
                    onChange={(e) => handleInputChange('jobRole', e.target.value)}
                    className="rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-gray-700 font-medium">Company *</Label>
                  <Input
                    id="company"
                    placeholder="Tech Solutions Inc."
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-gray-700 font-medium">Category *</Label>
                  <Input
                    id="category"
                    placeholder="Technology, Finance, Healthcare"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-gray-700 font-medium">Location *</Label>
                  <Input
                    id="location"
                    placeholder="New York, NY or Remote"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-700 font-medium">Job Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the role, responsibilities, requirements, and qualifications..."
                  rows={6}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <p className="text-sm text-gray-500">* Required fields</p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex items-center space-x-2 hover:bg-gray-100 transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            
            <Button
              onClick={handleSubmit}
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all duration-200"
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostJobPage;
