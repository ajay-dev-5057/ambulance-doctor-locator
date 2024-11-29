import React from "react";
import { useState, useEffect, useCallback } from "react";
import { FaAmbulance, FaUserMd } from "react-icons/fa";
import AmbulanceList from "./components/AmbulanceList";
import DoctorList from "./components/DoctorList";
import axiosInstance from "./api/axiosInstance";

const App = () => {
  const [view, setView] = useState<"ambulance" | "doctor" | null>(null);
  const [totalAmbulances, setTotalAmbulances] = useState<number | null>(null);
  const [totalDoctors, setTotalDoctors] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCounts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [ambulancesRes, doctorsRes] = await Promise.all([
        axiosInstance.get("/ambulances"),
        axiosInstance.get("/doctors"),
      ]);

      if (ambulancesRes.status !== 200 || doctorsRes.status !== 200) {
        throw new Error("Failed to fetch data");
      }

      setTotalAmbulances(ambulancesRes.data.length);
      setTotalDoctors(doctorsRes.data.length);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  const handleBackClick = () => {
    setView(null);
    fetchCounts(); 
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col items-center">
      <header className="w-full bg-gradient-to-r from-red-600 via-red-500 to-red-700 shadow-lg">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-4xl font-extrabold text-white drop-shadow-md">
            Emergency Services
          </h1>
          {view && (
            <button
              onClick={handleBackClick}
              className="px-4 py-2 bg-white text-red-600 font-semibold rounded-lg hover:bg-red-100 transition duration-300 transform hover:scale-105 shadow-md"
            >
              Back
            </button>
          )}
        </div>
      </header>

      {error && (
        <div className="mt-6 text-red-600 font-bold">Error: {error}</div>
      )}
      {loading && !error && (
        <div className="mt-6 text-gray-700 font-semibold">Loading data...</div>
      )}

      {!view && !loading && !error && (
        <div className="flex space-x-6 mt-8 max-w-5xl">
          <div
            className="w-[400px] bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
            onClick={() => setView("ambulance")}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-red-600">
                  Total Ambulances
                </h2>
                <p className="text-4xl font-extrabold text-gray-900 mt-2">
                  {totalAmbulances !== null ? totalAmbulances : "N/A"}
                </p>
              </div>
              <FaAmbulance size={45} />
            </div>
          </div>

          <div
            className="w-[400px] bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
            onClick={() => setView("doctor")}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-red-600">
                  Total Doctors
                </h2>
                <p className="text-4xl font-extrabold text-gray-900 mt-2">
                  {totalDoctors !== null ? totalDoctors : "N/A"}
                </p>
              </div>
              <FaUserMd size={45} />
            </div>
          </div>
        </div>
      )}

      {!view && (
        <p className="text-lg font-light italic text-gray-700 mt-6 px-6 text-center">
          "In times of emergency, heroes aren't born; they respond."
        </p>
      )}

      {view === "ambulance" || view === "doctor" ? (
        <div className="w-full max-w-3xl mt-8">
          {view === "ambulance" && <AmbulanceList />}
          {view === "doctor" && <DoctorList />}
        </div>
      ) : (
        <div className="flex space-x-6 mt-8">
          <button
            onClick={() => setView("ambulance")}
            className="px-6 py-3 text-lg font-medium bg-red-600 text-white rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105 hover:bg-red-500"
          >
            Ambulances
          </button>
          <button
            onClick={() => setView("doctor")}
            className="px-6 py-3 text-lg font-medium bg-gray-800 text-white rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105 hover:bg-gray-700"
          >
            Doctors
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
