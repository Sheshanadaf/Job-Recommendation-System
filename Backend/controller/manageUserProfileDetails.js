const userprofileTable = require("../models/userCvDetailsModel");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const sw = require("stopword"); //
const path = require("path");
const { exec } = require("child_process");
const router = require("../routes");
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");

const AWS = require("aws-sdk");


const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// helper: escape double quotes for CSV fields
function escapeCsvField(str) {
  if (str === null || str === undefined) return "";
  // convert to string, replace " with ""
  return String(str).replace(/"/g, '""');
}

// Helper function to get S3 object as a buffer
async function getS3FileBuffer(bucket, key) {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  const response = await s3.send(command);

  const chunks = [];
  for await (const chunk of response.Body) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}


const manageUserProfileDetails = {
  // add cv
  createCvData: async (req, res) => {
    try {
      const { id } = req.params;
      const file = req.file;
      const {
        fullName,
        dateOfBirth,
        headline,
        email,
        website,
        phone,
        location,
        profiles,
        experience,
        education,
        skills,
        languages,
        certifications,
        interests,
        projects,
        volunteering,
        references,
        summary,
      } = req.body;
      
      const userData = {
        id: id,
        fileName: file ? file.originalname : null,
        fileType: file ? file.mimetype : null,
        filePath: file ? file.location : null,

        fullName: fullName || null,
        dateOfBirth: dateOfBirth || null,
        headline: headline || null,
        email: email || null,
        website: website || null,
        phone: phone || null,
        headline: headline || null,
        profiles: profiles || null,
        experience: experience || null,
        education: education || null,
        skills: skills || null,
        languages: languages || null,
        certifications: certifications || null,
        interests: interests || null,
        projects: projects || null,
        volunteering: volunteering || null,
        references: references || null,
        summary: summary || null,
      };

      // Check if ID already exists in DB
      const existingUser = await userprofileTable.findOne({ id });

      if (existingUser) {
        // Delete existing record
        await userprofileTable.deleteOne({ id });
      }

      const newUserProfileDetails = new userprofileTable(userData);
      const saveUserProfileDetails = await newUserProfileDetails.save();

      res.status(201).json({
      message: existingUser
        ? "Existing CV replaced with new data successfully"
        : "CV/Qualification form added successfully",
      data: saveUserProfileDetails,
    });

    } catch (error) {
      console.log("error", error);
      return res.status(500).json({
        message: "CV not added.",
      });
    }
  },

  getUserProfileDetails: async (req,res) => {
    try {
      const { id } = req.params;
      const profile = await userprofileTable.findOne({ id });
      console.log("sas1111", profile);

      if (!profile) {
        return res.status(404).json({ message: "User profile not found." });
      }

      let extractedText = null;
      let profileDetailsText = null;

      // If CV file path exists, read and parse the PD

      if (profile.filePath) {
        try {
          const s3Url = new URL(profile.filePath);
          const bucket = s3Url.hostname.split(".")[0]; // bucket name
          const key = decodeURIComponent(s3Url.pathname.substring(1)); // remove leading '/'

          const pdfBuffer = await getS3FileBuffer(bucket, key);
          const data = await pdfParse(pdfBuffer);
          extractedText = data.text;
          console.log("Extracted PDF text:", extractedText);
        } catch (pdfErr) {
          console.warn("Failed to parse PDF from S3:", pdfErr);
        }
      }

      if (
        profile.fullName ||
        profile.dateOfBirth ||
        profile.headline ||
        profile.email ||
        profile.website ||
        profile.phone ||
        profile.location ||
        profile.profiles ||
        profile.experience ||
        profile.education ||
        profile.skills ||
        // profile.skills ||
        profile.certifications ||
        profile.interests ||
        profile.projects ||
        profile.volunteering ||
        profile.references ||
        profile.summary
      ) {
        profileDetailsText = [
          `name: ${profile.fullName || ""}`,
          `headline: ${profile.headline || ""}`,
          `email: ${profile.email || ""}`,
          `location: ${profile.location || ""}`,
          `profiles: ${
            Array.isArray(profile.profiles) ? profile.profiles.join(" | ") : ""
          }`,
          `experience: ${
            Array.isArray(profile.experience)
              ? profile.experience
                  .map(
                    (exp) =>
                      `${exp.position || ""} at ${exp.company || ""} (${
                        exp.dateRange || ""
                      })`
                  )
                  .join(" | ")
              : ""
          }`,
          `education: ${
            Array.isArray(profile.education)
              ? profile.education
                  .map(
                    (edu) =>
                      `${edu.typeOfStudy || ""} ${edu.areaOfStudy || ""} at ${
                        edu.institution || ""
                      }`
                  )
                  .join(" | ")
              : ""
          }`,
          `skills: ${
            Array.isArray(profile.skills)
              ? profile.skills
                  .map((s) => s.name || s.description || "")
                  .join(" | ")
              : ""
          }`,
          `certifications: ${
            Array.isArray(profile.certifications)
              ? profile.certifications.map((c) => c.name || "").join(" | ")
              : ""
          }`,
          `interests: ${
            Array.isArray(profile.interests)
              ? profile.interests.join(" | ")
              : ""
          }`,
          `projects: ${
            Array.isArray(profile.projects)
              ? profile.projects.map((p) => p.name || "").join(" | ")
              : ""
          }`,
          `volunteering: ${
            Array.isArray(profile.volunteering)
              ? profile.volunteering
                  .map((v) => `${v.position || ""} at ${v.organization || ""}`)
                  .join(" | ")
              : ""
          }`,
          `references: ${
            Array.isArray(profile.references)
              ? profile.references.map((r) => r.name || "").join(" | ")
              : ""
          }`,
          `summary: ${profile.summary || ""}`,
        ].filter(Boolean); // remove nulls
        // .join("\n");
      } else if (extractedText) {
      }


      // 1. Build raw profile details array
      const profileDetailsArray = [
        profile.fullName,
        profile.headline,
        profile.email,
        profile.location,
        Array.isArray(profile.profiles) ? profile.profiles.join(" ") : "",
        Array.isArray(profile.experience)
          ? profile.experience
              .map((exp) => `${exp.position} at ${exp.company}`)
              .join(" ")
          : "",
        Array.isArray(profile.education)
          ? profile.education
              .map(
                (edu) =>
                  `${edu.typeOfStudy} ${edu.areaOfStudy} at ${edu.institution}`
              )
              .join(" ")
          : "",
        Array.isArray(profile.skills)
          ? profile.skills
              .map((s) => `${s.name} ${s.description || ""}`)
              .join(" ")
          : "",
        Array.isArray(profile.certifications)
          ? profile.certifications.map((c) => c.name).join(" ")
          : "",
        Array.isArray(profile.interests) ? profile.interests.join(" ") : "",
        Array.isArray(profile.projects)
          ? profile.projects.map((p) => p.name).join(" ")
          : "",
        Array.isArray(profile.volunteering)
          ? profile.volunteering
              .map((v) => `${v.position} at ${v.organization}`)
              .join(" ")
          : "",
        Array.isArray(profile.references)
          ? profile.references.map((r) => r.name).join(" ")
          : "",
        profile.summary,
      ].filter(Boolean);
      console.log("aaaalllllll",profile);

      console.log("aaaa");
      // 2. Clean text function
      function cleanText(text) {
        if (!text) return "";
        text = text.toLowerCase();
        text = text.replace(/http\S+/g, ""); // Remove URLs
        text = text.replace(/[^a-z\s]/g, ""); // Remove punctuation/numbers
        text = text.replace(/\s+/g, " "); // Collapse multiple spaces
        console.log("bbbb",text);
        return text.trim();
      }
      console.log("bbbb");

      // remove stopwords
      function removeStopwords(text) {
        const words = text.split(" ");
        const filtered = sw.removeStopwords(words);
        console.log("cccc", filtered);
        return filtered.join(" ");
      }
      console.log("cccc2");

      // Check if structured profile data has any meaningful content
      const hasProfileData = profileDetailsArray.some(
        (item) => item && item.trim().length > 0
      );

      let user_profiles_cleaned;

      if (hasProfileData) {
        // Clean and remove stopwords from structured profile data
        const cleanedText = cleanText(profileDetailsArray.join(" "));
        user_profiles_cleaned = [removeStopwords(cleanedText)];
      } else if (extractedText && extractedText.trim().length > 0) {
        // Fallback: Clean and remove stopwords from extracted PDF text
        const cleanedText = cleanText(extractedText);
        user_profiles_cleaned = [removeStopwords(cleanedText)];
      } else {
        user_profiles_cleaned = [];
      }
      console.log("ccccrqrqrq", user_profiles_cleaned);
      // Save to DB

      profile.user_profiles_cleaned = user_profiles_cleaned;
      const saved = await profile.save();
      console.log("Saved profile:", saved);
      //await profile.save();

      const bucket = process.env.S3_BUCKET;
      if (!bucket) {
        console.error("S3_BUCKET not set in environment");
        // you can decide whether to fail or continue — here we'll return error
        return res.status(500).json({ message: "S3_BUCKET not configured" });
      }

      const prefix = process.env.S3_DATA_PREFIX || "dataset";
      const key = `${prefix}/userdetails/user_${id}.csv`;

      // Build CSV content with header and a single row for this user.
      // Escape double-quotes in the CSV field.
      const csvHeader = "id,user_text_clean\n";
      const textField = Array.isArray(user_profiles_cleaned)
        ? user_profiles_cleaned.join(" ")
        : (user_profiles_cleaned || "");
      const safeText = escapeCsvField(textField); // replace " -> ""
      const csvContent = `${csvHeader}${id},"${safeText}"\n`;

      try {
        await s3.send(
          new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: csvContent,
          ContentType: "text/csv",
        })
      );
        console.log(`Uploaded user CSV to s3://${bucket}/userdetails/${key}`);
      } catch (s3Err) {
        console.error("Failed to upload user CSV to S3:", s3Err);
        return res.status(500).json({ message: "Failed to upload CSV to S3", error: s3Err.toString() });
      }

      async function appendToCSV(userId, newRow) {
        const fileKey = `dataset/${userId}.csv`;

        try {
            let existingData = "";
            try {
                const existing = await s3.getObject({ Bucket: BUCKET_NAME, Key: fileKey }).promise();
                existingData = existing.Body.toString();
            } catch (err) {
                if (err.code !== "NoSuchKey") throw err;
            }

            const newLine = Array.isArray(newRow) ? newRow.join(",") : newRow;
            const updatedData = existingData
                ? existingData + "\n" + newLine
                : newLine;

            await s3.putObject({
                Bucket: BUCKET_NAME,
                Key: fileKey,
                Body: updatedData
            }).promise();

            console.log(`✅ Data appended for user: ${userId}`);
        } catch (error) {
            console.error("❌ Error appending CSV:", error);
        }
    }
    
    } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Error retrieving user profile" });
  }

},
  
  // New: Read CV Data
  getPredictDetails: async (req, res) => {
    try {
        console.log("SSS");
        const AWS = require("aws-sdk");

        // Configure AWS SDK
        AWS.config.update({ region: "us-east-1" });
        const lambda = new AWS.Lambda();

        console.log("Calling Lambda for predictions...");

        // Hardcoded for now; you can later replace with req.params.id
        //const id = "689cbd79a47f654f05a5adcd";
        const { id } = req.params;

        // Lambda invoke parameters
        const params = {
            FunctionName: "jrs-predict", // replace with your Lambda name
            InvocationType: "RequestResponse", // synchronous
            Payload: JSON.stringify({ user_id: id })
        };

        // Call Lambda
        const lambdaResponse = await lambda.invoke(params).promise();
        console.log("Raw Lambda response:", lambdaResponse);

        // Lambda returns a JSON string in Payload
        const payload = JSON.parse(lambdaResponse.Payload);
        console.log("Parsed Lambda payload:", payload);

        // If Lambda returns an error inside payload
        if (payload.statusCode && payload.statusCode !== 200) {
            console.log("Lambda error:", payload.body ? JSON.parse(payload.body) : payload);
            return res.status(payload.statusCode).json(payload.body ? JSON.parse(payload.body) : payload);
        }

        // Success
        console.log("Lambda success response:", payload.body ? JSON.parse(payload.body) : payload);
        return res.status(200).json(payload.body ? JSON.parse(payload.body) : payload);

    } catch (error) {
        console.error("Error calling Lambda:", error);
        return res.status(500).json({ error: error.message });
    }
}

};

module.exports = manageUserProfileDetails;
