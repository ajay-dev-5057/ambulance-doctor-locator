import express, { Request, Response, } from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const readFile = (filename: string) => {
  const filePath = path.join(__dirname, 'data', filename);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

app.get('/api/ambulances', (req: Request, res: Response) => {
  try {
    const ambulances = readFile('ambulances.json');
    res.status(200).json(ambulances);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ambulances' });
  }
});


app.post('/api/ambulances', (req: Request, res: Response) => {
  const { name, description, location } = req.body;
  try {
    const ambulances = readFile('ambulances.json');
    const newAmbulance = { id: Date.now(), name, description, location };
    ambulances.push(newAmbulance);

    fs.writeFileSync(path.join(__dirname, 'data', 'ambulances.json'), JSON.stringify(ambulances, null, 2));

    res.status(201).json(newAmbulance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add ambulance' });
  }
});

app.put('/api/ambulances/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, description, location } = req.body;

  try {
    const ambulances = readFile('ambulances.json');
    const ambulanceIndex = ambulances.findIndex((ambulance: any) => ambulance.id === parseInt(id));

    if (ambulanceIndex === -1) {
      res.status(404).json({ error: 'Ambulance not found' });
      return;
    }

    const updatedAmbulance = { ...ambulances[ambulanceIndex], name, description, location };
    ambulances[ambulanceIndex] = updatedAmbulance;

    fs.writeFileSync(path.join(__dirname, 'data', 'ambulances.json'), JSON.stringify(ambulances, null, 2));

    res.status(200).json(updatedAmbulance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update ambulance' });
  }
});

app.delete('/api/ambulances/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    let ambulances = readFile('ambulances.json');
    ambulances = ambulances.filter((ambulance: any) => ambulance.id !== parseInt(id));

    fs.writeFileSync(path.join(__dirname, 'data', 'ambulances.json'), JSON.stringify(ambulances, null, 2));

    res.status(200).json({ message: 'Ambulance deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete ambulance' });
  }
});


app.get('/api/doctors', (req: Request, res: Response) => {
  try {
    const doctors = readFile('doctors.json');
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
});


app.post('/api/doctors', (req: Request, res: Response) => {
  const { name, specialty, location } = req.body;
  try {
    const doctors = readFile('doctors.json');
    const newDoctor = { id: Date.now(), name, specialty, location };
    doctors.push(newDoctor);

    fs.writeFileSync(path.join(__dirname, 'data', 'doctors.json'), JSON.stringify(doctors, null, 2));

    res.status(201).json(newDoctor);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add doctor' });
  }
});

app.put('/api/doctors/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, specialty, location } = req.body;

  try {
    const doctors = readFile('doctors.json');
    const doctorIndex = doctors.findIndex((doctor: any) => doctor.id === parseInt(id));

    if (doctorIndex === -1) {
      res.status(404).json({ error: 'Doctor not found' });
      return; 
    }

    const updatedDoctor = { ...doctors[doctorIndex], name, specialty, location };
    doctors[doctorIndex] = updatedDoctor;

    fs.writeFileSync(path.join(__dirname, 'data', 'doctors.json'), JSON.stringify(doctors, null, 2));

    res.status(200).json(updatedDoctor);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update doctor' });
  }
});


app.delete('/api/doctors/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    let doctors = readFile('doctors.json');
    doctors = doctors.filter((doctor: any) => doctor.id !== parseInt(id));

    fs.writeFileSync(path.join(__dirname, 'data', 'doctors.json'), JSON.stringify(doctors, null, 2));

    res.status(200).json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete doctor' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;