import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaBriefcase } from "react-icons/fa";
import { API_BASE_URL } from "../config";

const HomePage = () => {
  // get job past detailss
  const [jobdetailsData, setjobdetailstData] = useState([]);

  const fetchStudentData = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/get-jobpost`);
      console.log("Job Details", res.data);
      setjobdetailstData(res.data.jobPostsFormatted);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  return (
    <div className="flex-1 p-15 flex flex-col items-center justify-center text-center">
      <h1 className="text-5xl font-extrabold mb-6 text-blue-700">
        Welcome to Skill Bridge
      </h1>
      <p className="text-gray-600 text-lg mb-10 max-w-xl">
        Connect your skills with the perfect career opportunities.
      </p>

      <div className="flex gap-10 justify-center mb-16">
        <div>
          <strong className="text-2xl text-green-600">1000+</strong>
          <p className="text-sm mt-1">Active Jobs</p>
        </div>
        <div>
          <strong className="text-2xl text-purple-600">500+</strong>
          <p className="text-sm mt-1">Companies</p>
        </div>
        <div>
          <strong className="text-2xl text-red-500">2000+</strong>
          <p className="text-sm mt-1">Professionals</p>
        </div>
      </div>

      <div className="w-full border-t border-gray-300 pt-8 mt-8">
        <div className="flex items-center justify-center gap-2 text-blue-800 text-xl font-semibold">
          <FaBriefcase className="text-2xl" />
          <span>Available Job Posts</span>
        </div>
        <p className="text-gray-500 text-sm mt-2">
          Browse exciting opportunities posted by top companies.
        </p>

        {/* Job Posts */}
        {/* Job Posts */}
        {jobdetailsData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 mt-6">
            {jobdetailsData.map((job) => (
              <div
                key={job._id}
                className="border border-gray-200 rounded-lg p-5 shadow-md text-left"
              >
                <h3 className="text-xl font-semibold text-blue-700 mb-2">
                  {job.jobroles}
                </h3>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Company:</strong> {job.company}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Category:</strong> {job.category}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Location:</strong> {job.location}
                </p>
                <p className="text-sm text-gray-700 mt-2">
                  {job.jobdescription}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm mt-6">Nothing to display.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;