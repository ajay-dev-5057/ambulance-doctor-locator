import request from 'supertest';
import app from '../server';
import fs from 'fs';

jest.mock('fs');

describe('API Endpoints', () => {
  const mockAmbulances = [
    { id: 1, name: 'Ambulance 1', description: 'Desc 1', location: 'Location 1' },
    { id: 2, name: 'Ambulance 2', description: 'Desc 2', location: 'Location 2' },
  ];
  const mockDoctors = [
    { id: 1, name: 'Doctor 1', specialty: 'Cardiology', location: 'Location A' },
    { id: 2, name: 'Doctor 2', specialty: 'Neurology', location: 'Location B' },
  ];

  beforeEach(() => {
    (fs.readFileSync as jest.Mock).mockImplementation((filePath: string) => {
      if (filePath.includes('ambulances.json')) {
        return JSON.stringify(mockAmbulances);
      } else if (filePath.includes('doctors.json')) {
        return JSON.stringify(mockDoctors);
      }
    });

    (fs.writeFileSync as jest.Mock).mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Ambulance API', () => {
    it('should fetch all ambulances', async () => {
      const res = await request(app).get('/api/ambulances');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockAmbulances);
    });

    it('should add a new ambulance', async () => {
      const newAmbulance = {
        name: 'New Ambulance',
        description: 'New Description',
        location: 'New Location',
      };
      const res = await request(app).post('/api/ambulances').send(newAmbulance);
      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        id: expect.any(Number),
        ...newAmbulance,
      });
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it('should update an ambulance', async () => {
      const updatedAmbulance = {
        name: 'Updated Ambulance',
        description: 'Updated Description',
        location: 'Updated Location',
      };
      const res = await request(app).put('/api/ambulances/1').send(updatedAmbulance);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ id: 1, ...updatedAmbulance });
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it('should delete an ambulance', async () => {
      const res = await request(app).delete('/api/ambulances/1');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Ambulance deleted successfully' });
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it('should return 404 if ambulance not found for update', async () => {
      const res = await request(app).put('/api/ambulances/999').send({
        name: 'Non-existent Ambulance',
        description: 'No Description',
        location: 'No Location',
      });
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Ambulance not found' });
    });
  });

  // Doctor Tests
  describe('Doctor API', () => {
    it('should fetch all doctors', async () => {
      const res = await request(app).get('/api/doctors');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockDoctors);
    });

    it('should add a new doctor', async () => {
      const newDoctor = {
        name: 'New Doctor',
        specialty: 'Pediatrics',
        location: 'New Location',
      };
      const res = await request(app).post('/api/doctors').send(newDoctor);
      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        id: expect.any(Number),
        ...newDoctor,
      });
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it('should update a doctor', async () => {
      const updatedDoctor = {
        name: 'Updated Doctor',
        specialty: 'Orthopedics',
        location: 'Updated Location',
      };
      const res = await request(app).put('/api/doctors/1').send(updatedDoctor);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ id: 1, ...updatedDoctor });
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it('should delete a doctor', async () => {
      const res = await request(app).delete('/api/doctors/1');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Doctor deleted successfully' });
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it('should return 404 if doctor not found for update', async () => {
      const res = await request(app).put('/api/doctors/999').send({
        name: 'Non-existent Doctor',
        specialty: 'No Specialty',
        location: 'No Location',
      });
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Doctor not found' });
    });
  });
});
