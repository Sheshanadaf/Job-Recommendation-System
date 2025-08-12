const userprofileTable = require("../models/userCvDetailsModel");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const sw = require("stopword"); //
const path = require("path");
const { exec } = require("child_process");

const router = require("../routes");

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
        filePath: file ? file.path : null,

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

      const newUserProfileDetails = new userprofileTable(userData);
      const saveUserProfileDetails = await newUserProfileDetails.save();

      res.status(201).json({
        message: "CV/Qualification form Add Successfully",
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

      // If CV file path exists, read and parse the PDF
      if (profile.filePath) {
        try {
          const pdfBuffer = fs.readFileSync(profile.filePath);
          const data = await pdfParse(pdfBuffer);
          extractedText = data.text;
          console.log("jkjbj",data.text);
        } catch (pdfErr) {
          console.warn("Failed to parse PDF:", pdfErr);
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

      // === Export to CSV ===
      const outputPath = path.join(
        __dirname,
        "../exports/user_profiles_cleaned.csv"
      );

      const csvLine = `${profile._id},"${user_profiles_cleaned.join(" ")}"\n`;
      if (!fs.existsSync(outputPath)) {
        fs.writeFileSync(outputPath, "id,user_text_clean\n");
      }
      fs.appendFileSync(outputPath, csvLine, "utf8");

      // === Run SBERT Python Script ===
      // const { spawn } = require("child_process");
      // const sbertScriptPath = path.join(
      //   __dirname,
      //   "../python/generate_embeddings.py"
      // );

      // // Use "python" not "python3" on Windows unless python3 is configured
      // const sbertProcess = spawn("python", [sbertScriptPath]);
      // console.log(
      //   "Running generate_embeddings.py for user ID:",
      //   profile._id.toString()
      // );

      // let sbertOutput = "";
      // let sbertError = "";

      // sbertProcess.stdout.on(
      //   "data",
      //   (data) => (sbertOutput += data.toString())
      // );
      // sbertProcess.stderr.on("data", (data) => (sbertError += data.toString()));
      
      // sbertProcess.on("close", (code) => {
      //   if (code !== 0) {
      //     return res.status(500).json({
      //       message: "SBERT embedding generation failed.",
      //       error: sbertError,
      //     });
      //   }
      //   // === Step 2: After SBERT, run xgboost_pipeline.py ===
      //   const xgbScriptPath = path.join(
      //     __dirname,
      //     "../python/xgboost_pipeline.py"
      //   );

      //   // ✅ FIXED: Now we pass user ID
      //   const xgbProcess = spawn("python", [
      //     xgbScriptPath,
      //     profile._id.toString(),
      //   ]);
      //   console.log(
      //     "Running xgboost_pipeline.py for user ID:",
      //     profile._id.toString()
      //   );

      //   let xgbOutput = "";
      //   let xgbError = "";

      //   xgbProcess.stdout.on("data", (data) => (xgbOutput += data.toString()));
      //   xgbProcess.stderr.on("data", (data) => (xgbError += data.toString()));

      //   xgbProcess.on("close", (xgbCode) => {
      //     if (xgbCode !== 0) {
      //       return res.status(500).json({
      //         message: "XGBoost pipeline failed.",
      //         error: xgbError,
      //       });
      //     }

      //     return res.status(200).json({
      //     message: "User profile processed successfully.",
      //     userId: profile._id,
      //     user_profiles_cleaned,
      //     sbertOutput,
      //     xgbOutput,
      //   });
      //   });
      // });
    
    } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Error retrieving user profile" });
  }

},
  
  // New: Read CV Data
  getPredictDetails: async (req, res) => {
    try {
      console.log("dddd");
      const { id } = req.params;
      const profile = await userprofileTable.findOne({ id });
      console.log("sas1111458", profile);

      if (!profile) {
        return res.status(404).json({ message: "User profile not found." });
      }

        // === Step 2: After SBERT, run xgboost_pipeline.py ===
        const path = require("path");
        const { spawn } = require("child_process");
        const aScriptPath = path.join(
          __dirname,
          "../python/a.py"
        );

        
        // ✅ FIXED: Now we pass user ID
        const xgbProcess = spawn("python", [
          aScriptPath,
          profile._id.toString(),
        ]);
        console.log(
          "Running a.py for user ID:",
          profile._id.toString()
        );

        let xgbOutput = "";
        let xgbError = "";

        xgbProcess.stdout.on("data", (data) => (xgbOutput += data.toString()));
        xgbProcess.stderr.on("data", (data) => (xgbError += data.toString()));

        xgbProcess.on("close", (xgbCode) => {
          if (xgbCode !== 0) {
            return res.status(500).json({
              message: "XGBoost pipeline failed.",
              error: xgbError,
            });
          }

          return res.status(200).json({
          message: "✅ Prediction completed successfully.",
          output: xgbOutput.trim(),
        });
        });
      // });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Error retrieving user profile" });
    }
  },
};

module.exports = manageUserProfileDetails;
