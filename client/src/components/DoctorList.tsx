import React, { useState, useEffect, useCallback, memo } from "react";
import axiosInstance from "../api/axiosInstance";
import ConfirmationModal from "./ConfirmationModal";
import Swal from "sweetalert2";

const DoctorList = () => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [newDoctor, setNewDoctor] = useState({
    name: "",
    specialty: "",
    location: "",
  });
  const [doctorToDelete, setDoctorToDelete] = useState<number | null>(null);
  const [doctorToEdit, setDoctorToEdit] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    name: "",
    specialty: "",
    location: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/doctors");
      setDoctors(response.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewDoctor({ ...newDoctor, [name]: value });
  };

  const addDoctor = async () => {
    const errors = validateFields(newDoctor);
    setValidationErrors(errors);

    if (!errors.name && !errors.specialty && !errors.location) {
      try {
        const response = await axiosInstance.post("/doctors", newDoctor);
        setDoctors((prevDoctors) => [...prevDoctors, response.data]);
        setNewDoctor({ name: "", specialty: "", location: "" });
        setIsModalOpen(false); 
        Swal.fire('Success!', 'Doctor added successfully.', 'success');
      } catch (error) {
        Swal.fire('Error!', 'Failed to added Doctor.', 'error');
        console.error('Error adding doctor:');
      }
    }
  };

  const handleEdit = async () => {
    const errors = validateFields(doctorToEdit);
    setValidationErrors(errors);

    if (!errors.name && !errors.specialty && !errors.location) {
      try {
        const response = await axiosInstance.put(
          `/doctors/${doctorToEdit.id}`,
          doctorToEdit
        );
        const updatedDoctors = doctors.map((doctor) =>
          doctor.id === doctorToEdit.id ? response.data : doctor
        );
        setDoctors(updatedDoctors);
        setDoctorToEdit(null);
        setIsModalOpen(false); 
        Swal.fire('Success!', 'Doctor updated successfully.', 'success');
      } catch (error) {
        Swal.fire('Error!', 'Failed to delete Doctor.', 'error');
        console.error('Error adding doctor:');      }
    }
  };

  const deleteDoctor = async () => {
    if (doctorToDelete === null) return;

    const updatedDoctors = doctors.filter(
      (doctor) => doctor.id !== doctorToDelete
    );
    setDoctors(updatedDoctors);

    try {
      const response = await axiosInstance.delete(`/doctors/${doctorToDelete}`);

      if (response.status === 200) {
        setDoctorToDelete(null);
        Swal.fire('Success!', 'Doctor deleted successfully.', 'success');
      } else {
        Swal.fire('Error!', 'Failed to delete Doctor.', 'error');
        console.error('Error adding doctor:');
      }
    } catch (error) {
      Swal.fire('Error!', 'Failed to delete Doctor.', 'error');
      console.error('Error adding doctor:');
      setDoctors((prevDoctors) => [...prevDoctors, { id: doctorToDelete }]);
      setDoctorToDelete(null);
    }
  };

  const totalDoctors = doctors.length;
  const totalPages = Math.ceil(totalDoctors / rowsPerPage);
  const indexOfLastDoctor = currentPage * rowsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - rowsPerPage;
  const currentDoctors = doctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setDoctorToEdit(null); 
    setNewDoctor({ name: "", specialty: "", location: "" });  
    setValidationErrors({ name: "", specialty: "", location: "" });
  };

  const validateFields = (doctor: any) => {
    const errors: any = {};
    if (!doctor.name) errors.name = "Title is required."; 
    if (!doctor.specialty) errors.specialty = "description is required."; 
    if (!doctor.location) errors.location = "Location is required.";
    return errors;
  };

  return (
    <div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="py-2 px-4 bg-blue-400 text-black-600 rounded-md mb-4 hover:bg-blue-500"
      >
        Add Doctor
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-800 text-gray-100 p-6 rounded-lg shadow-md w-96">
            <h2 className="text-xl font-semibold text-blue-400 mb-4">
              {doctorToEdit ? "Edit Doctor" : "Add New Doctor"}
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                value={doctorToEdit ? doctorToEdit.name : newDoctor.name}
                onChange={(e) =>
                  doctorToEdit
                    ? setDoctorToEdit({ ...doctorToEdit, name: e.target.value })
                    : handleInputChange(e)
                }
                className="w-full p-2 bg-gray-700 text-gray-100 rounded-md"
                placeholder="Name"
              />
              {validationErrors.name && (
                <p className="text-red-500 text-sm">{validationErrors.name}</p>
              )}

              <input
                type="text"
                name="specialty"
                value={
                  doctorToEdit ? doctorToEdit.specialty : newDoctor.specialty
                }
                onChange={(e) =>
                  doctorToEdit
                    ? setDoctorToEdit({
                        ...doctorToEdit,
                        specialty: e.target.value,
                      })
                    : handleInputChange(e)
                }
                className="w-full p-2 bg-gray-700 text-gray-100 rounded-md"
                placeholder="Specialty"
              />
              {validationErrors.specialty && (
                <p className="text-red-500 text-sm">
                  {validationErrors.specialty}
                </p>
              )}

              <input
                type="text"
                name="location"
                value={
                  doctorToEdit ? doctorToEdit.location : newDoctor.location
                }
                onChange={(e) =>
                  doctorToEdit
                    ? setDoctorToEdit({
                        ...doctorToEdit,
                        location: e.target.value,
                      })
                    : handleInputChange(e)
                }
                className="w-full p-2 bg-gray-700 text-gray-100 rounded-md"
                placeholder="Location"
              />
              {validationErrors.location && (
                <p className="text-red-500 text-sm">
                  {validationErrors.location}
                </p>
              )}

              <div className="mt-4 text-right">
                <button
                  onClick={doctorToEdit ? handleEdit : addDoctor}
                  className="py-2 px-4 bg-blue-400 text-gray-900 rounded-md"
                >
                  {doctorToEdit ? "Save Changes" : "Add Doctor"}
                </button>
                <button
                  onClick={handleCancel}
                  className="py-2 px-4 bg-gray-500 text-gray-900 rounded-md ml-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {doctorToDelete !== null && (
        <ConfirmationModal
          isOpen={true}
          onConfirm={deleteDoctor}
          onCancel={() => setDoctorToDelete(null)}
        />
      )}

      <ul>
        {currentDoctors.length > 0 ? (
          currentDoctors.map(
            (doctor) => (
              (
                <li
                  key={doctor.id}
                  className="py-2 px-4 bg-gray-200 mb-2 rounded-md"
                >
                  <div className="flex justify-between">
                    <div>
                      <strong>{doctor.name}</strong>
                      <p>{doctor.specialty}</p>
                      <p>{doctor.location}</p>
                    </div>
                    <div>
                      <button
                        onClick={() => {
                          setDoctorToEdit(doctor);
                          setIsModalOpen(true);
                        }}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md mr-2 hover:bg-gray-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDoctorToDelete(doctor.id)}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md mr-2 hover:bg-gray-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              )
            )
          )
        ) : (
          <li>No doctors found.</li>
        )}
      </ul>

      <div className="mt-4 flex justify-between">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="py-2 px-4 bg-blue-400 text-black-600 rounded-md hover:bg-blue-500 disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="py-2 px-4 bg-blue-400 text-black-600 rounded-md hover:bg-blue-500 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default memo(DoctorList);
