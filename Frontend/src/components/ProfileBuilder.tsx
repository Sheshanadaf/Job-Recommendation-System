import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Upload, CheckCircle, Plus, X } from 'lucide-react';

const ProfileBuilder = () => {
  const navigate = useNavigate();
  const [cvUploaded, setCvUploaded] = useState(false);
  const [fileName, setFileName] = useState('');
  const [showProfessionalForm, setShowProfessionalForm] = useState(false);
  const [skills, setSkills] = useState(['React', 'JavaScript', 'TypeScript', 'Node.js']);
  const [newSkill, setNewSkill] = useState('');

  // Form Data State
  const [formData, setFormData] = useState({
    education: '',
    experience: '',
    targetRoles: '',
    location: '',
    workPreference: [] as string[],
    salary: '',
    keySkills: [] as string[],
    softSkills: [] as string[],
    projects: '',
    certifications: '',
    jobType: [] as string[],
    industry: '',
    companySize: '',
    careerStage: '',
    jobFunction: '',
    workStyle: '',
    culture: [] as string[],
    growth: [3],
    workLifeBalance: ''
  });

  const [conditionalData, setConditionalData] = useState({
    graduationTimeline: '',
    academicCredits: '',
    internshipDuration: '',
    careerGoals: '',
    noticePeriod: '',
    jobChangeReason: '',
    currentRole: '',
    dealBreakers: [] as string[]
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setCvUploaded(true);
      
      // Simulate CV parsing and auto-fill skills
      setTimeout(() => {
        setFormData(prev => ({
          ...prev,
          keySkills: ['React', 'JavaScript', 'TypeScript', 'Node.js', 'Python']
        }));
      }, 1000);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleCheckboxChange = (field: string, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...(prev[field as keyof typeof prev] as string[]), value]
        : (prev[field as keyof typeof prev] as string[]).filter(item => item !== value)
    }));
  };

  const isFormComplete = () => {
    const requiredFields = [
      'education', 'experience', 'targetRoles', 'location', 'salary',
      'projects', 'industry', 'companySize', 'careerStage', 'jobFunction',
      'workStyle', 'workLifeBalance'
    ];
    
    return cvUploaded && 
           requiredFields.every(field => formData[field as keyof typeof formData]) &&
           formData.workPreference.length > 0 &&
           formData.jobType.length > 0 &&
           formData.softSkills.length > 0 &&
           formData.culture.length > 0;
  };

  const handleSubmit = () => {
    if (isFormComplete()) {
      navigate('/jobs');
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-4 font-inter tracking-tight">
            Welcome to Skill Bridge!
          </h1>
          <p className="text-lg text-muted-foreground font-inter">
            Let's build your professional profile to find the perfect job match.
          </p>
        </div>

        {/* CV Upload Section */}
        <Card className="p-8 mb-8 soft-shadow border-0">
          <h3 className="text-xl font-semibold text-foreground mb-6 font-inter">
            Upload Your CV
          </h3>
          
          <div className="relative">
            <input
              type="file"
              id="cv-upload"
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label
              htmlFor="cv-upload"
              className={`
                block w-full border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300
                ${cvUploaded 
                  ? 'border-success bg-success/5 text-success' 
                  : 'border-primary bg-muted/30 hover:bg-muted/50 text-muted-foreground hover:text-foreground'
                }
              `}
            >
              <div className="flex flex-col items-center space-y-4">
                {cvUploaded ? (
                  <>
                    <CheckCircle className="h-12 w-12" />
                    <div>
                      <p className="font-medium">CV Uploaded Successfully!</p>
                      <p className="text-sm">{fileName}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <Upload className="h-12 w-12" />
                    <div>
                      <p className="font-medium">Drag & drop your CV (PDF or DOC) here, or click to browse</p>
                      <p className="text-sm mt-1">Supported formats: PDF, DOC, DOCX</p>
                    </div>
                  </>
                )}
              </div>
            </label>
          </div>
        </Card>

        {/* Professional Background Button */}
        {cvUploaded && !showProfessionalForm && (
          <div className="text-center mb-8">
            <Button
              onClick={() => setShowProfessionalForm(true)}
              className="bg-transparent text-primary font-semibold hover:bg-primary/5 border-0 text-lg"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add Professional Background
            </Button>
          </div>
        )}

        {/* Professional Background Form */}
        {showProfessionalForm && (
          <div className="space-y-8 animate-slide-down">
            
            {/* Basic Profile Information */}
            <Card className="p-8 soft-shadow border-0">
              <h3 className="text-xl font-semibold text-foreground mb-6 font-inter">
                Basic Profile Information
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium text-foreground mb-2 block">
                    Current Education Level and Field of Study *
                  </Label>
                  <Input
                    placeholder="e.g., Bachelor's in Computer Science"
                    value={formData.education}
                    onChange={(e) => setFormData({...formData, education: e.target.value})}
                    className="focus-glow"
                  />
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-foreground mb-2 block">
                    Years of Experience / Graduation Date *
                  </Label>
                  <Input
                    placeholder="e.g., 3 years or Graduated in 2023"
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    className="focus-glow"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label className="text-sm font-medium text-foreground mb-2 block">
                    Target Job Titles or Career Interests *
                  </Label>
                  <Textarea
                    placeholder="e.g., Software Engineer, Data Analyst, Product Manager"
                    value={formData.targetRoles}
                    onChange={(e) => setFormData({...formData, targetRoles: e.target.value})}
                    className="focus-glow"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-foreground mb-2 block">
                    Preferred Locations *
                  </Label>
                  <Input
                    placeholder="e.g., New York, Remote, San Francisco"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="focus-glow"
                  />
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-foreground mb-2 block">
                    Work Preferences *
                  </Label>
                  <div className="space-y-2">
                    {['On-site', 'Hybrid', 'Remote'].map((pref) => (
                      <div key={pref} className="flex items-center space-x-2">
                        <Checkbox
                          id={pref}
                          checked={formData.workPreference.includes(pref)}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange('workPreference', pref, checked as boolean)
                          }
                        />
                        <Label htmlFor={pref} className="text-sm">{pref}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <Label className="text-sm font-medium text-foreground mb-2 block">
                    Salary Expectations *
                  </Label>
                  <Select value={formData.salary} onValueChange={(value) => setFormData({...formData, salary: value})}>
                    <SelectTrigger className="focus-glow">
                      <SelectValue placeholder="Select salary range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-50k">Under $50K</SelectItem>
                      <SelectItem value="50k-75k">$50K - $75K</SelectItem>
                      <SelectItem value="75k-100k">$75K - $100K</SelectItem>
                      <SelectItem value="100k-plus">$100K+</SelectItem>
                      <SelectItem value="negotiable">Negotiable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            {/* Skills & Experience Mapping */}
            <Card className="p-8 soft-shadow border-0">
              <h3 className="text-xl font-semibold text-foreground mb-6 font-inter">
                Skills & Experience Mapping
              </h3>
              
              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-medium text-foreground mb-2 block">
                    Key Skills from CV (Auto-filled, editable)
                  </Label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2"
                      >
                        {skill}
                        <button
                          onClick={() => removeSkill(skill)}
                          className="hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add new skill"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                      className="focus-glow"
                    />
                    <Button onClick={addSkill} variant="outline">Add</Button>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-foreground mb-2 block">
                    Soft Skills Assessment *
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {['Communication', 'Leadership', 'Teamwork', 'Problem-Solving', 'Creativity', 'Adaptability', 'Time Management', 'Critical Thinking'].map((skill) => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox
                          id={skill}
                          checked={formData.softSkills.includes(skill)}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange('softSkills', skill, checked as boolean)
                          }
                        />
                        <Label htmlFor={skill} className="text-sm">{skill}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-foreground mb-2 block">
                    Relevant Projects or Achievements *
                  </Label>
                  <Textarea
                    placeholder="Describe your key projects, achievements, or notable work experiences"
                    value={formData.projects}
                    onChange={(e) => setFormData({...formData, projects: e.target.value})}
                    className="focus-glow"
                    rows={4}
                  />
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-foreground mb-2 block">
                    Certifications or Ongoing Training
                  </Label>
                  <Textarea
                    placeholder="List any certifications, courses, or training programs"
                    value={formData.certifications}
                    onChange={(e) => setFormData({...formData, certifications: e.target.value})}
                    className="focus-glow"
                    rows={3}
                  />
                </div>
              </div>
            </Card>

            {/* Job Search Preferences */}
            <Card className="p-8 soft-shadow border-0">
              <h3 className="text-xl font-semibold text-foreground mb-6 font-inter">
                Job Search Preferences
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium text-foreground mb-2 block">
                    Job Type *
                  </Label>
                  <div className="space-y-2">
                    {['Full-time', 'Part-time', 'Contract', 'Internship'].map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={type}
                          checked={formData.jobType.includes(type)}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange('jobType', type, checked as boolean)
                          }
                        />
                        <Label htmlFor={type} className="text-sm">{type}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-foreground mb-2 block">
                    Industry Preferences *
                  </Label>
                  <Select value={formData.industry} onValueChange={(value) => setFormData({...formData, industry: value})}>
                    <SelectTrigger className="focus-glow">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="consulting">Consulting</SelectItem>
                      <SelectItem value="media">Media & Entertainment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-foreground mb-2 block">
                    Company Size *
                  </Label>
                  <Select value={formData.companySize} onValueChange={(value) => setFormData({...formData, companySize: value})}>
                    <SelectTrigger className="focus-glow">
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 employees</SelectItem>
                      <SelectItem value="11-50">11-50 employees</SelectItem>
                      <SelectItem value="51-200">51-200 employees</SelectItem>
                      <SelectItem value="201-1000">201-1000 employees</SelectItem>
                      <SelectItem value="1000+">1000+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-foreground mb-2 block">
                    Career Stage *
                  </Label>
                  <Select value={formData.careerStage} onValueChange={(value) => setFormData({...formData, careerStage: value})}>
                    <SelectTrigger className="focus-glow">
                      <SelectValue placeholder="Select career stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry">Entry-level</SelectItem>
                      <SelectItem value="mid">Mid-level</SelectItem>
                      <SelectItem value="senior">Senior</SelectItem>
                      <SelectItem value="executive">Executive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="md:col-span-2">
                  <Label className="text-sm font-medium text-foreground mb-2 block">
                    Job Function/Department *
                  </Label>
                  <Select value={formData.jobFunction} onValueChange={(value) => setFormData({...formData, jobFunction: value})}>
                    <SelectTrigger className="focus-glow">
                      <SelectValue placeholder="Select job function" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="hr">Human Resources</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="operations">Operations</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="product">Product Management</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            {/* Behavioral & Cultural Fit */}
            <Card className="p-8 soft-shadow border-0">
              <h3 className="text-xl font-semibold text-foreground mb-6 font-inter">
                Behavioral & Cultural Fit
              </h3>
              
              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-medium text-foreground mb-2 block">
                    Work Style Preferences *
                  </Label>
                  <div className="space-y-2">
                    {['Collaborative', 'Independent', 'Balanced'].map((style) => (
                      <div key={style} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id={style}
                          name="workStyle"
                          value={style}
                          checked={formData.workStyle === style}
                          onChange={(e) => setFormData({...formData, workStyle: e.target.value})}
                          className="text-primary focus:ring-primary"
                        />
                        <Label htmlFor={style} className="text-sm">{style}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-foreground mb-2 block">
                    Company Culture Preferences *
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {['Innovative', 'Structured', 'Fast-paced', 'Calm', 'Diverse', 'Results-driven', 'Learning-focused', 'Flexible'].map((culture) => (
                      <div key={culture} className="flex items-center space-x-2">
                        <Checkbox
                          id={culture}
                          checked={formData.culture.includes(culture)}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange('culture', culture, checked as boolean)
                          }
                        />
                        <Label htmlFor={culture} className="text-sm">{culture}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-foreground mb-4 block">
                    Growth Opportunities Importance: {formData.growth[0]}/5
                  </Label>
                  <Slider
                    value={formData.growth}
                    onValueChange={(value) => setFormData({...formData, growth: value})}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-foreground mb-2 block">
                    Work-Life Balance Priorities *
                  </Label>
                  <div className="space-y-2">
                    {['Very Important', 'Important', 'Moderate', 'Flexible'].map((priority) => (
                      <div key={priority} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id={priority}
                          name="workLifeBalance"
                          value={priority}
                          checked={formData.workLifeBalance === priority}
                          onChange={(e) => setFormData({...formData, workLifeBalance: e.target.value})}
                          className="text-primary focus:ring-primary"
                        />
                        <Label htmlFor={priority} className="text-sm">{priority}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Submit Button */}
            <div className="text-center">
              <Button
                onClick={handleSubmit}
                disabled={!isFormComplete()}
                className={`
                  px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-200
                  ${isFormComplete() 
                    ? 'bg-primary hover:bg-primary-hover active:bg-primary-active text-primary-foreground btn-hover' 
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                  }
                `}
              >
                Search for Jobs
              </Button>
              {!isFormComplete() && (
                <p className="text-muted-foreground text-sm mt-2">
                  Please complete all required fields to continue
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileBuilder;