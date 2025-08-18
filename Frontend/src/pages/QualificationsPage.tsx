import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, ArrowLeft, Plus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { API_BASE_URL } from "../config";

const QualificationsPage: React.FC = () => {
  const id = localStorage.getItem("userSub");
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      toast({
        title: "CV Uploaded",
        description: `${file.name} has been selected successfully.`,
      });
    }
  };

  const handleCVSubmit = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please upload a CV before submitting.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("cv_files", selectedFile);

    try {
      const response = await fetch(`${API_BASE_URL}/api/add-userprofile/${id}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload CV");

      const result = await response.json();

      toast({
        title: "Upload Successful",
        description: result.message || "Your CV was uploaded successfully.",
      });

      fetch(`${API_BASE_URL}/api/read-user-profile/${id}`)
        .then((res) => res.json())
        .then((result) => console.log("Background prediction result:", result))
        .catch((err) => console.error("Background prediction error:", err));

      navigate("/home");
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description: "An error occurred while uploading your CV.",
        variant: "destructive",
      });
    }
  };

  const handleManualEntry = () => navigate("/qualifications-form");
  const handleBack = () => navigate("/home");

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Add Your Qualifications
          </h1>
          <p className="text-gray-600">
            Choose how you'd like to share your professional background
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Upload CV Option */}
          <Card className="h-full shadow-lg rounded-xl hover:shadow-2xl transition duration-300 flex flex-col">
            <CardHeader className="bg-indigo-50 rounded-t-xl">
              <CardTitle className="flex items-center text-indigo-700 font-semibold">
                <Upload className="mr-2 h-5 w-5" /> Upload Your CV
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 flex-1 flex flex-col justify-between">
              <p className="text-gray-600">
                Upload your existing CV and let our system analyze your
                qualifications automatically.
              </p>

              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-10 cursor-pointer hover:bg-indigo-50 transition">
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="cv-upload"
                />
                <Label htmlFor="cv-upload" className="cursor-pointer w-full text-center">
                  <div className="space-y-4">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-700">Click to upload your CV</p>
                      <p className="text-sm text-gray-500">PDF, DOC, or DOCX files only</p>
                    </div>
                  </div>
                </Label>
              </div>

              {selectedFile && (
                <div className="text-center p-4 bg-green-50 rounded-lg mt-2">
                  <p className="text-sm font-medium text-green-800">
                    Selected: {selectedFile.name}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Manual Entry Option */}
          <Card className="h-full shadow-lg rounded-xl hover:shadow-2xl transition duration-300 flex flex-col">
            <CardHeader className="bg-green-50 rounded-t-xl">
              <CardTitle className="flex items-center text-green-700 font-semibold">
                <Plus className="mr-2 h-5 w-5" /> Fill Details Manually
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 flex-1 flex flex-col justify-between">
              <p className="text-gray-600">
                Prefer to enter your information manually? Fill out a detailed form with all your qualifications.
              </p>

              <ul className="list-disc list-inside text-sm text-gray-500 space-y-1">
                <li>Personal Information</li>
                <li>Work Experience</li>
                <li>Education</li>
                <li>Skills & Languages</li>
                <li>Certifications</li>
                <li>Custom Fields</li>
              </ul>

              <Button
                className="w-full mt-4"
                variant="outline"
                onClick={handleManualEntry}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Professional Background
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-8">
          <Button variant="outline" onClick={handleBack} className="flex items-center gap-2 hover:bg-gray-100 transition">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>

          <Button onClick={handleCVSubmit} size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition">
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QualificationsPage;
