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

      const res = await axios.get(`${API_BASE_URL}/api/read-predict-details/${userId}`);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError("Please try again later. Your prediction is on the way");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResultData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-4 text-center">
         Your Personalized Job Match
      </h1>
      <p className="text-gray-600 text-lg md:text-xl mb-10 max-w-2xl text-center">
        Based on your qualifications and profile, here’s what we think fits you best.
      </p>

      {loading ? (
        <div className="flex flex-col items-center justify-center mt-10">
          <FaSpinner className="animate-spin text-blue-600 text-5xl" />
          <p className="mt-4 text-lg text-gray-500">Fetching your results...</p>
        </div>
      ) : error ? (
        <div className="text-red-500 text-lg mt-4">{error}</div>
      ) : result ? (
        <div className="w-full max-w-4xl space-y-6">
          <div className="bg-white shadow-lg rounded-xl p-6 text-center">
            <p className="text-lg md:text-xl font-semibold text-blue-700">
              📌 Predicted Job Category: {result.predicted_category}
            </p>
          </div>

          {result.top_jobs.map((job, index) => (
            <div
              key={job.id}
              className="bg-white shadow-md rounded-xl p-5 hover:shadow-xl transition duration-300 border border-gray-200"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg md:text-xl font-bold text-gray-800">
                  {index + 1}. {job.jobroles}
                </h2>
                <div className="flex items-center space-x-1">
                  {[...Array(Math.round(job.similarity_score))].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" />
                  ))}
                </div>
              </div>

              <p className="text-gray-600 font-medium mb-2">{job.company}</p>

              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {job.category}
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {job.location}
                </span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                  Similarity: {job.similarity_score.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mt-4">No results found.</p>
      )}
    </div>
  );
};

export default ResultPage;
