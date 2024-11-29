import React, { useState, useEffect } from 'react';
import ConfirmationModal from './ConfirmationModal';
import axiosInstance from '../api/axiosInstance';
import Swal from 'sweetalert2';

const AmbulanceList = () => {
  const [ambulances, setAmbulances] = useState<any[]>([]);
  const [newAmbulance, setNewAmbulance] = useState({ name: '', description: '', location: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ambulanceToDelete, setAmbulanceToDelete] = useState<number | null>(null);
  const [ambulanceToEdit, setAmbulanceToEdit] = useState<any | null>(null);

  const [validationErrors, setValidationErrors] = useState({
    name: "",
    specialty: "",
    location: "",
  });
  

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    fetchAmbulances();
  }, []);

  const fetchAmbulances = async () => {
    try {
      const response = await axiosInstance.get('/ambulances');
      setAmbulances(response.data);
    } catch (error) {
      console.error('Error fetching ambulances:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAmbulance({ ...newAmbulance, [name]: value });
  };

  const validateFields = (ambulance: any) => {
    const errors: any = {};
    if (!ambulance.name) errors.name = "Title is required."; 
    if (!ambulance.description) errors.specialty = "description is required."; 
    if (!ambulance.location) errors.location = "Location is required.";
    return errors;
  };

  const addAmbulance = async () => {
    const errors = validateFields(newAmbulance);
    setValidationErrors(errors);
    if (!errors.name && !errors.specialty && !errors.location) {
      try {
        const response = await axiosInstance.post('/ambulances', newAmbulance);
        setAmbulances((prevAmbulances) => [...prevAmbulances, response.data]);
        setNewAmbulance({ name: '', description: '', location: '' });
        setIsModalOpen(false);
        Swal.fire('Success!', 'Ambulance added successfully.', 'success');
      } catch (error) {
        Swal.fire('Error!', 'Failed to added Ambulance.', 'error');
        console.error('Error adding ambulance:');
      }
    }
  };

  const handleEdit = async () => {
    
    if (ambulanceToEdit && ambulanceToEdit.name && ambulanceToEdit.description && ambulanceToEdit.location) {
      try {
        const response = await axiosInstance.put(`/ambulances/${ambulanceToEdit.id}`, ambulanceToEdit);
        const updatedAmbulances = ambulances.map((ambulance) =>
          ambulance.id === ambulanceToEdit.id ? response.data : ambulance
        );
        setAmbulances(updatedAmbulances);
        setAmbulanceToEdit(null);
        setIsModalOpen(false);
        Swal.fire('Success!', 'Ambulance Updated successfully.', 'success');
      } catch (error) {
        Swal.fire('Error!', 'Failed to Edit Ambulance.', 'error');
        console.error('Error Edit ambulance:');
      }
    } else {
      alert('Please fill out all fields');
    }
  };

  const deleteAmbulance = async () => {
    if (!ambulanceToDelete) return;

    const updatedAmbulances = ambulances.filter((ambulance) => ambulance.id !== ambulanceToDelete);
    setAmbulances(updatedAmbulances);

    try {
      const response = await axiosInstance.delete(`/ambulances/${ambulanceToDelete}`);
      if (response.status === 200) {
        setAmbulanceToDelete(null);
        Swal.fire('Success!', 'Ambulance deleted successfully.', 'success');
      } else {
        Swal.fire('Error!', 'Failed to delete Ambulance.', 'error');
        console.error('Error adding ambulance:');
      }
    } catch (error) {
      console.error('Error deleting ambulance:', error);
      setAmbulances((prevAmbulances) => [...prevAmbulances, { id: ambulanceToDelete }]);
      setAmbulanceToDelete(null);
      alert('Failed to delete the ambulance. Please try again.');
    }
  };

  const totalAmbulances = ambulances.length;
  const totalPages = Math.ceil(totalAmbulances / rowsPerPage);
  const indexOfLastAmbulance = currentPage * rowsPerPage;
  const indexOfFirstAmbulance = indexOfLastAmbulance - rowsPerPage;
  const currentAmbulances = ambulances.slice(indexOfFirstAmbulance, indexOfLastAmbulance);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const openEditModal = (ambulance: any) => {
    setAmbulanceToEdit(ambulance);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setAmbulanceToEdit(null);
    setNewAmbulance({ name: '', description: '', location: '' });
  };

  return (
    <div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="py-2 px-4 bg-blue-400 text-black-600 rounded-md mb-4 hover:bg-blue-500"
      >
        Add Ambulance
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-800 text-gray-100 p-6 rounded-lg shadow-md w-96">
            <h2 className="text-xl font-semibold text-blue-400 mb-4">
              {ambulanceToEdit ? 'Edit Ambulance' : 'Add New Ambulance'}
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                value={ambulanceToEdit ? ambulanceToEdit.name : newAmbulance.name}
                onChange={(e) =>
                  ambulanceToEdit
                    ? setAmbulanceToEdit({ ...ambulanceToEdit, name: e.target.value })
                    : handleInputChange(e)
                }
                className="w-full p-2 bg-gray-700 text-gray-100 rounded-md"
                placeholder="Ambulance Name"
              />
               {validationErrors.name && (
                <p className="text-red-500 text-sm">{validationErrors.name}</p>
              )}

              <input
                type="text"
                name="description"
                value={ambulanceToEdit ? ambulanceToEdit.description : newAmbulance.description}
                onChange={(e) =>
                  ambulanceToEdit
                    ? setAmbulanceToEdit({ ...ambulanceToEdit, description: e.target.value })
                    : handleInputChange(e)
                }
                className="w-full p-2 bg-gray-700 text-gray-100 rounded-md"
                placeholder="Ambulance Description"
              />
               {validationErrors.specialty && (
                <p className="text-red-500 text-sm">{validationErrors.specialty}</p>
              )}


              <input
                type="text"
                name="location"
                value={ambulanceToEdit ? ambulanceToEdit.location : newAmbulance.location}
                onChange={(e) =>
                  ambulanceToEdit
                    ? setAmbulanceToEdit({ ...ambulanceToEdit, location: e.target.value })
                    : handleInputChange(e)
                }
                className="w-full p-2 bg-gray-700 text-gray-100 rounded-md"
                placeholder="Location"
              />
               {validationErrors.location && (
                <p className="text-red-500 text-sm">{validationErrors.location}</p>
              )}
              <div className="mt-4 text-right space-x-2">
                <button
                  onClick={handleCancel}
                  className="py-2 px-4 bg-gray-500 text-gray-900 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={ambulanceToEdit ? handleEdit : addAmbulance}
                  className="py-2 px-4 bg-blue-400 text-gray-900 rounded-md"
                >
                  {ambulanceToEdit ? 'Update' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {ambulanceToDelete !== null && (
        <ConfirmationModal
          isOpen={true}
          onConfirm={deleteAmbulance}
          onCancel={() => setAmbulanceToDelete(null)}
        />
      )}

      <ul>
        {currentAmbulances.length > 0 ? (
          currentAmbulances.map((ambulance) => (
            <li key={ambulance.id} className="py-2 px-4 bg-gray-200 mb-2 rounded-md">
              <div className="flex justify-between">
                <div>
                  <strong>{ambulance.name}</strong>
                  <p>{ambulance.description}</p>
                  <p>{ambulance.location}</p>
                </div>
                <div className="">
                  <button
                    onClick={() => openEditModal(ambulance)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md mr-2 hover:bg-gray-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setAmbulanceToDelete(ambulance.id)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md mr-2 hover:bg-gray-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))
        ) : (
          <li>No ambulances available</li>
        )}
      </ul>

      <div className="mt-4 flex justify-between">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AmbulanceList;
