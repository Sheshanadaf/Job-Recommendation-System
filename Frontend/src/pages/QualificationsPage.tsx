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
    console.log(formData);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/add-userprofile/${id}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to upload CV");

      const result = await response.json();

      toast({
        title: "Upload Successful",
        description: result.message || "Your CV was uploaded successfully.",
      });

      // ✅ Background API call (non-blocking)
      fetch(`${API_BASE_URL}/api/read-user-profile/${id}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((result) => {
          console.log("Background prediction result:", result);
          // Optionally: store it
          // localStorage.setItem("predictionResult", JSON.stringify(data));
          // Or: toast({
          //   title: "Prediction Ready",
          //   description: data.predictedCategory || "Check your dashboard",
          // });
        })
        .catch((err) => {
          console.error("Background prediction error:", err);
        });
        
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

  const handleManualEntry = () => {
    navigate("/qualifications-form");
  };

  const handleBack = () => {
    navigate("/home");
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto h-full">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Add Your Qualifications
            </h1>
            <p className="text-muted-foreground">
              Choose how you'd like to share your professional background
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-3/5">
            {/* Upload CV Option */}
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="mr-2 h-5 w-5" />
                  Upload Your CV
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground">
                  Upload your existing CV and let our system analyze your
                  qualifications automatically.
                </p>

                <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="cv-upload"
                  />
                  <Label htmlFor="cv-upload" className="cursor-pointer">
                    <div className="space-y-4">
                      <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Click to upload your CV</p>
                        <p className="text-sm text-muted-foreground">
                          PDF, DOC, or DOCX files only
                        </p>
                      </div>
                    </div>
                  </Label>
                </div>

                {selectedFile && (
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-800">
                      Selected: {selectedFile.name}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Manual Entry Option */}
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="mr-2 h-5 w-5" />
                  Fill Details Manually
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground">
                  Prefer to enter your information manually? Fill out a detailed
                  form with all your qualifications.
                </p>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div>• Personal Information</div>
                    <div>• Work Experience</div>
                    <div>• Education</div>
                    <div>• Skills & Languages</div>
                    <div>• Certifications</div>
                    <div>• Custom Fields</div>
                  </div>
                </div>

                <div className="mt-auto">
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={handleManualEntry}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Professional Background & Qualification
                    {/* Add Your Professional Background & Qualification Details */}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-8">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <Button onClick={handleCVSubmit} size="lg">
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QualificationsPage;