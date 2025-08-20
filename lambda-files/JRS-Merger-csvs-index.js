import { S3Client, ListObjectsV2Command, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

const s3 = new S3Client({ region: process.env.AWS_REGION });
const BUCKET = process.env.BUCKET_NAME;

// Helper: stream to stringk
async function streamToString(stream) {
  return await new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
  });
}

// Merge CSVs from a source prefix to a destination key
async function mergeCsvs(sourcePrefix, destKey) {
  // 1. List objects
  const listCommand = new ListObjectsV2Command({ Bucket: BUCKET, Prefix: sourcePrefix });
  const listResponse = await s3.send(listCommand);
  const files = listResponse.Contents || [];

  if (files.length === 0) {
    console.log(`No CSV files found under ${sourcePrefix}.`);
    return;
  }

  let allRecords = [];
  let headerColumns = null;

  // 2. Download and parse each CSV
  for (const file of files) {
    if (!file.Key.endsWith(".csv")) continue;

    console.log("Reading", file.Key);

    const getCommand = new GetObjectCommand({ Bucket: BUCKET, Key: file.Key });
    const getResponse = await s3.send(getCommand);
    const csvString = await streamToString(getResponse.Body);

    const records = parse(csvString, { columns: true, skip_empty_lines: true });

    if (!headerColumns && records.length > 0) {
      headerColumns = Object.keys(records[0]);
    }

    allRecords = allRecords.concat(records);
  }

  if (allRecords.length === 0) {
    console.log(`No records found in ${sourcePrefix}.`);
    return;
  }

  // 3. Convert merd records to CSV
  const mergedCsv = stringify(allRecords, { header: true, columns: headerColumns });

  // 4. Upload merged CSV to s3 buckets
  const putCommand = new PutObjectCommand({
    Bucket: BUCKET,
    Key: destKey,
    Body: mergedCsv,
    ContentType: "text/csv",
  });

  await s3.send(putCommand);
  console.log(`Merged CSV uploaded to s3://${BUCKET}/${destKey}`);
}

// Main handle
export const handler = async () => {
  try {
    // Merge userdetail CSVs
    await mergeCsvs("dataset/userdetails/", "training/user_profiles_cleaned.csv");

    // Merge jobpost CSVs
    await mergeCsvs("dataset/jobpost/", "training/job_listings_cleaned.csv");

    console.log("All CSVs merged successfully.");
  } catch (error) {
    console.error("Error merging CSVs:", error);
    throw error;
  }
};
