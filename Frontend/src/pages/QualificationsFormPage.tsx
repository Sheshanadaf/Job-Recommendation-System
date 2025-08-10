import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";


interface FormField {
  id: string;
  label: string;
  value: string | string[] | object[];
  isCustom: boolean;
}

const nestedFieldConfigs: Record<
  string,
  { label: string; keys: string[] }
> = {
  experience: ["company", "position", "dateRange", "location"],
  education: ["institution", "typeOfStudy", "areaOfStudy", "score", "dateRange"],
  skills: ["name", "description", "level"],
  certifications: ["name", "issuer", "date", "website"],
  projects: ["name", "description", "dateRange", "website"],
  volunteering: ["organization", "position", "dateRange", "location"],
  references: ["name", "email", "contactNumber"],
};


const QualificationsFormPage: React.FC = () => {
  const navigate = useNavigate();
  const id = localStorage.getItem("userSub");
  const [fields, setFields] = useState<FormField[]>([
    { id: "fullName", label: "Full Name", value: "", isCustom: false },
    { id: "dateOfBirth", label: "Date of Birth", value: "", isCustom: false },
    { id: "headline", label: "Headline", value: "", isCustom: false },
    { id: "email", label: "Email", value: "", isCustom: false },
    { id: "website", label: "Website", value: "", isCustom: false },
    { id: "phone", label: "Phone", value: "", isCustom: false },
    { id: "location", label: "Location", value: "", isCustom: false },
    { id: "profiles", label: "Profiles", value: [] as string[], isCustom: false },

    {
      id: "experience",
      label: "Experience",
      value: [] as Array<{
        company?: string;
        position?: string;
        dateRange?: string;
        location?: string;
      }>,
      isCustom: false,
    },
    {
      id: "education",
      label: "Education",
      value: [] as Array<{
        institution?: string;
        typeOfStudy?: string;
        areaOfStudy?: string;
        score?: string;
        dateRange?: string;
      }>,
      isCustom: false,
    },
    {
      id: "skills",
      label: "Skills",
      value: [] as Array<{
        name?: string;
        description?: string;
        level?: "1" | "2" | "3" | "4" | "5";
      }>,
      isCustom: false,
    },
    
    { id: "languages", label: "Languages", value: [] as string[], isCustom: false },
    { id: "awards", label: "Awards", value: [] as string[], isCustom: false },
    {
      id: "certifications",
      label: "Certifications",
      value: [] as Array<{ name?: string; issuer?: string; date?: string; website?: string }>,
      isCustom: false,
    },
    { id: "interests", label: "Interests", value: [] as string[], isCustom: false },
    {
      id: "projects",
      label: "Projects",
      value: [] as Array<{ name?: string; description?: string; dateRange?: string; website?: string }>,
      isCustom: false,
    },
    { id: "publications", label: "Publications", value: [] as string[], isCustom: false },
    {
      id: "volunteering",
      label: "Volunteering",
      value: [] as Array<{ organization?: string; position?: string; dateRange?: string; location?: string }>,
      isCustom: false,
    },
    {
      id: "references",
      label: "References",
      value: [] as Array<{ name?: string; email?: string; contactNumber?: string }>,
      isCustom: false,
    },
    { id: "summary", label: "Summary", value: "", isCustom: false },
  ]);

  const [newFieldLabel, setNewFieldLabel] = useState("");

  // Handle simple string field change
  const handleFieldChange = (id: string, newValue: string) => {
    setFields((fields) =>
      fields.map((field) =>
        field.id === id ? { ...field, value: newValue } : field
      )
    );
  };

  // Handle nested array field change (update specific property of specific item)
  const handleNestedFieldChange = (
  fieldId: string,
  index: number,
  key: string,
  newValue: string
) => {
  setFields((fields) =>
    fields.map((field) => {
      if (field.id === fieldId && Array.isArray(field.value)) {
        // Cast here
        const newArr = [...(field.value as object[])];
        newArr[index] = { ...newArr[index], [key]: newValue };
        return { ...field, value: newArr };
      }
      return field;
    })
  );
};


  // Add new empty object to nested array field
  const addNestedItem = (fieldId: string) => {
    const keys = nestedFieldConfigs[fieldId];
    if (!keys) return;

    const emptyItem = keys.reduce((acc, key) => {
      acc[key] = "";
      return acc;
    }, {} as Record<string, string>);

    setFields((fields) =>
      fields.map((field) => {
        if (field.id === fieldId && Array.isArray(field.value)) {
          return { ...field, value: [...field.value, emptyItem] };
        }
        return field;
      })
    );
  };

  // Remove nested item by index
  const removeNestedItem = (fieldId: string, index: number) => {
  setFields((fields) =>
    fields.map((field) => {
      if (field.id === fieldId && Array.isArray(field.value)) {
        // Narrow type here (assume object[])
        const newArr = (field.value as object[]).filter((_, i) => i !== index);
        return { ...field, value: newArr };
      }
      return field;
    })
  );
};


  // Add new custom field
  const addNewField = () => {
    if (!newFieldLabel.trim()) {
      toast({
        title: "Field name required",
        description: "Please enter a name for the new field.",
        variant: "destructive",
      });
      return;
    }

    const newField: FormField = {
      id: `custom_${Date.now()}`,
      label: newFieldLabel,
      value: "",
      isCustom: true,
    };

    setFields((fields) => [...fields, newField]);
    setNewFieldLabel("");
    toast({
      title: "Field added",
      description: `${newFieldLabel} field has been added successfully.`,
    });
  };

  const removeField = (id: string) => {
    setFields((fields) => fields.filter((field) => field.id !== id));
    toast({
      title: "Field removed",
      description: "The field has been removed from the form.",
    });
  };

  const handleSubmit = async () => {
    // Prepare payload: only fields with non-empty values
    const payload: Record<string, any> = {};
    fields.forEach((field) => {
      if (typeof field.value === "string" && field.value.trim() !== "") {
        payload[field.id] = field.value;
      } else if (Array.isArray(field.value) && field.value.length > 0) {
        payload[field.id] = field.value;
      }
    });

    if (Object.keys(payload).length === 0) {
      toast({
        title: "No information provided",
        description: "Please fill at least one field before submitting.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/add-userprofile/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Submission failed");

      const data = await response.json();

      toast({
        title: "Submitted Successfully",
        description: data.message,
      });

      // ✅ Background API call (non-blocking)
      fetch(`http://localhost:3001/api/read-user-profile/${id}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Background prediction result:", data);
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

// ✅ Navigate immediately after first API call
      navigate(data.matchingRoute || "/home");

    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was a problem submitting your profile.",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const handleBack = () => {
    navigate("/qualifications");
  };

  const isMultiline = (fieldId: string) => {
    return [
      "summary",
      "publications",
    ].includes(fieldId);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto h-full">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Professional Profile Form
            </h1>
            <p className="text-muted-foreground">
              Fill in your professional details to create your profile
            </p>
          </div>

          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Your Information</CardTitle>
            </CardHeader>
            <CardContent className="h-full flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-6 pr-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {fields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={field.id}>{field.label}</Label>
                        {field.isCustom && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeField(field.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      {/* Nested array fields */}
                      {field.id in nestedFieldConfigs ? (
                        <>
                          {(field.value as object[]).map((item, idx) => (
                            <div
                              key={`${field.id}-${idx}`}
                              className="border p-4 rounded-md space-y-2 bg-gray-50"
                            >
                              <div className="flex justify-between items-center mb-2">
                                <div>{`${field.label} #${idx + 1}`}</div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeNestedItem(field.id, idx)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                              {nestedFieldConfigs[field.id].map((key) => (
                                <div key={key}>
                                  <Label htmlFor={`${field.id}-${idx}-${key}`}>
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                  </Label>

                                  {field.id === "skills" && key === "level" ? (
                                    <select
                                      id={`${field.id}-${idx}-${key}`}
                                      value={(item as any)[key] || ""}
                                      onChange={(e) =>
                                        handleNestedFieldChange(field.id, idx, key, e.target.value)
                                      }
                                      className="w-full border border-gray-300 rounded-md p-2"
                                    >
                                      <option value="">Select level</option>
                                      <option value="1">1 - Beginner</option>
                                      <option value="2">2 - Novice</option>
                                      <option value="3">3 - Intermediate</option>
                                      <option value="4">4 - Advanced</option>
                                      <option value="5">5 - Expert</option>
                                    </select>
                                  ) : (
                                    <Input
                                      id={`${field.id}-${idx}-${key}`}
                                      type="text"
                                      value={(item as any)[key] || ""}
                                      onChange={(e) =>
                                        handleNestedFieldChange(field.id, idx, key, e.target.value)
                                      }
                                      placeholder={`Enter ${key}`}
                                    />
                                  )}
                                </div>
                              ))}

                            </div>
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => addNestedItem(field.id)}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Add {field.label}
                          </Button>
                        </>
                      ) : isMultiline(field.id) ? (
                        <Textarea
                          id={field.id}
                          value={typeof field.value === "string" ? field.value : ""}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          placeholder={`Enter your ${field.label.toLowerCase()}`}
                          rows={3}
                        />
                      ) : (
                        <Input
                          id={field.id}
                          type={
                            field.id === "email"
                              ? "email"
                              : field.id === "dateOfBirth"
                              ? "date"
                              : "text"
                          }
                          value={typeof field.value === "string" ? field.value : ""}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          placeholder={`Enter your ${field.label.toLowerCase()}`}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Add New Field Section */}
                <div className="border-t pt-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4">Add Custom Field</h3>
                  <div className="flex gap-4">
                    <Input
                      placeholder="Enter field name"
                      value={newFieldLabel}
                      onChange={(e) => setNewFieldLabel(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addNewField()}
                    />
                    <Button onClick={addNewField}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Field
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-6">
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

export default QualificationsFormPage;
