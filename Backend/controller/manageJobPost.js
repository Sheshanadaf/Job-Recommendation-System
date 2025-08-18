const jobpostTable = require("../models/jobPost_model");
const router = require("../routes");
const sw = require("stopword");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

// Configure AWS S3 Client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Utility function to clean text
function cleanText(text) {
  if (!text) return "";
  text = text.toLowerCase();
  text = text.replace(/http\S+/g, ""); // Remove URLs
  text = text.replace(/[^a-z\s]/g, ""); // Remove punctuation/numbers
  text = text.replace(/\s+/g, " "); // Collapse multiple spaces
  return text.trim();
}

// Remove stopwords
function removeStopwords(text) {
  const words = text.split(" ");
  const filtered = sw.removeStopwords(words);
  return filtered.join(" ");
}

// Escape CSV fields
function escapeCsvField(str) {
  if (!str) return "";
  return str.replace(/"/g, '""');
}

const manageJobPost = {
  createJobpost: async (req, res) => {
    try {
      const { jobroles, company, category, location, jobdescription} = req.body;
      const { id } = req.params;
      const userId = id
      console.log("id",userId);
      // 1. Save the new job post
      const newJobPost = new jobpostTable({
        userId: userId,
        jobroles,
        company,
        category,
        location,
        jobdescription,
      });

      const saveJobPost = await newJobPost.save();

      // 2. Fetch all job posts (or you could fetch only this user's posts if userId is available)
      const jobposttables = await jobpostTable.find({ userId });


      // 3. Format posts and clean text
      const formattedJobPosts = await Promise.all(
        jobposttables.map(async (job) => {
          const combinedText = [
            job.jobroles,
            job.company,
            job.category,
            job.location,
            job.jobdescription,
          ].filter(Boolean).join(" ");

          const cleaned = cleanText(combinedText);
          const noStopwords = removeStopwords(cleaned);

          await jobpostTable.findByIdAndUpdate(job._id, { job_text_clean: noStopwords });

          return {
            _id: job._id,
            jobroles: job.jobroles || "",
            company: job.company || "",
            category: job.category || "",
            location: job.location || "",
            jobdescription: job.jobdescription || "",
            job_text_clean: noStopwords,
          };
        })
      );

      // 4. Build CSV
      const csvHeader = "id,jobroles,company,category,location,jobdescription,job_text_clean\n";
      const csvRows = formattedJobPosts.map(row => {
        return `${row._id},"${escapeCsvField(row.jobroles)}","${escapeCsvField(
          row.company
        )}","${escapeCsvField(row.category)}","${escapeCsvField(
          row.location
        )}","${escapeCsvField(row.jobdescription)}","${escapeCsvField(row.job_text_clean)}"`;
      });
      const csvContent = csvHeader + csvRows.join("\n");

      // 5. Upload to S3
      const bucket = process.env.S3_BUCKET;
      if (!bucket) {
        console.error("S3_BUCKET not set in environment");
        return res.status(500).json({ message: "S3_BUCKET not configured" });
      }
      const prefix = process.env.S3_DATA_PREFIX || "exports";
      const key = `${prefix}/jobpost/user_${userId || "anonymous"}_job_posts.csv`;

      await s3.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: csvContent,
          ContentType: "text/csv",
        })
      );
      console.log(`Uploaded CSV to s3://${bucket}/${key}`);

      // 6. Return response
      res.status(201).json({
        message: "Job post created and CSV uploaded to S3 successfully.",
        data: saveJobPost,
        s3FileKey: key,
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Job Post Details not added or CSV upload failed.",
        error: error.toString(),
      });
    }
  },

 getjobpostdetails: async (req, res) => {
  try {
    // Fetch all job posts
    const jobPosts = await jobpostTable.find();

    // Process and clean text for each job post
    const formattedJobPosts = await Promise.all(
      jobPosts.map(async (job) => {
        const combinedText = [job.jobroles, job.company, job.category, job.location, job.jobdescription]
          .filter(Boolean)
          .join(" ");

        const cleaned = cleanText(combinedText);
        const noStopwords = removeStopwords(cleaned);

        // Update cleaned text in DB
        await jobpostTable.findByIdAndUpdate(job._id, { job_text_clean: noStopwords });

        return {
          _id: job._id,
          jobroles: job.jobroles || "",
          company: job.company || "",
          category: job.category || "",
          location: job.location || "",
          jobdescription: job.jobdescription || "",
          job_text_clean: noStopwords,
        };
      })
    );

    // Send response
    res.status(200).json({
      message: "Job posts retrieved successfully",
      jobPostsFormatted: formattedJobPosts,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
},
};
module.exports = manageJobPost;
