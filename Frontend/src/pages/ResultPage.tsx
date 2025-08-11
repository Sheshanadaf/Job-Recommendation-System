import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaSpinner, FaStar } from "react-icons/fa";
import { API_BASE_URL } from "../config";

const ResultPage = () => {
  const [loading, setLoading] = useState(true);
  const [resultOutput, setResultOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const userId = localStorage.getItem("userSub");

  const fetchResultData = async () => {
    try {
      if (!userId) {
        setError("User ID not found in localStorage.");
        setLoading(false);
        return;
      }

      const res = await axios.get(
        `${API_BASE_URL}/api/read-predict-details/${userId}`
      );

      setResultOutput(res.data.output);
    } catch (err) {
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
      ) : resultOutput ? (
        <div className="bg-white border rounded-lg shadow-md p-6 w-full max-w-3xl text-left">
          {resultOutput.split("\n").map((line, index) => (
            <p key={index} className="text-gray-800 mb-2">
              {line.startsWith("Predicted Job Category") ? (
                <span className="font-semibold text-blue-600">
                  📌 {line}
                </span>
              ) : line.startsWith("-") ? (
                <span className="text-gray-700 flex items-center">
                  <FaStar className="text-yellow-500 mr-2" />
                  {line.slice(1).trim()}
                </span>
              ) : (
                line
              )}
            </p>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No results found.</p>
      )}
    </div>
  );
};

export default ResultPage;
