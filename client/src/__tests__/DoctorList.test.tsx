import { render, screen, waitFor } from '@testing-library/react';
import axiosInstance from '../api/axiosInstance';
import DoctorList from '../components/DoctorList';

jest.mock('../api/axiosInstance', () => ({
  get: jest.fn(),
  post: jest.fn(),
  delete: jest.fn(),
}));


describe('AmbulanceList Component', () => {
  it('should render the AmbulanceList component and display ambulances', async () => {
    const mockAmbulances = [{ id: 1, name: 'Ambulance 1', description: 'Description 1', location: 'Location 1' }];
    (axiosInstance.get as jest.Mock).mockResolvedValueOnce({ data: mockAmbulances });
  
    render(<DoctorList />);
  
    await waitFor(() => {
      expect(screen.getByText('Ambulance 1')).toBeInTheDocument();
    });
  });
  
});
