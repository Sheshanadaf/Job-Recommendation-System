import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaSpinner, FaStar } from "react-icons/fa";
import { API_BASE_URL } from "../config";

interface Job {
  id: string;
  jobroles: string;
  company: string;
  category: string;
  location: string;
  similarity_score: number;
}

interface PredictionResult {
  user_id: string;
  predicted_category: string;
  top_jobs: Job[];
}

const ResultPage = () => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const userId = localStorage.getItem("userSub");

  const fetchResultData = async () => {
    try {
      if (!userId) {
        setError("User ID not found in localStorage.");
        setLoading(false);
        return;
      }

      console.log("Fetching predictions...");
      const res = await axios.get(`${API_BASE_URL}/api/read-predict-details/${userId}`);
      console.log("Response from API:", res.data);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch prediction result.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResultData();
  }, []);

  return (
    <div className="flex-1 p-10 flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-extrabold text-blue-700 mb-4">
        🎯 Your Personalized Job Match
      </h1>
      <p className="text-gray-600 text-lg mb-8 max-w-2xl">
        Based on your qualifications and profile, here’s what we think fits you best.
      </p>

      {loading ? (
        <div className="flex items-center justify-center mt-10">
          <FaSpinner className="animate-spin text-blue-600 text-4xl" />
          <p className="ml-3 text-lg text-gray-500">Fetching your results...</p>
        </div>
      ) : error ? (
        <div className="text-red-500 text-lg">{error}</div>
      ) : result ? (
        <div className="bg-white border rounded-lg shadow-md p-6 w-full max-w-3xl text-left">
          <p className="font-semibold text-blue-600 mb-4">
            📌 Predicted Job Category: {result.predicted_category}
          </p>
          <h2 className="font-bold text-lg mb-2">Top {result.top_jobs.length} Job Matches:</h2>
          {result.top_jobs.map((job, index) => (
            <div key={job.id} className="mb-3 border-b pb-2">
              <p className="text-gray-800 font-semibold">
                {index + 1}. {job.jobroles} at {job.company}
              </p>
              <p className="text-gray-600">
                Category: {job.category} | Location: {job.location} | Similarity: {job.similarity_score.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No results found.</p>
      )}
    </div>
  );
};

export default ResultPage;
