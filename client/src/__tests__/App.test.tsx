import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../App";

const axios = require('axios');

jest.mock("axios");

const axiosGetMock = axios.get as jest.Mock;

describe("App Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the app and initial UI", () => {
    render(<App />);

    expect(screen.getByText(/Emergency Services/i)).toBeInTheDocument();
    expect(screen.getByText(/"In times of emergency, heroes aren't born; they respond."/i)).toBeInTheDocument();

    expect(screen.getByText(/Total Ambulances/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Doctors/i)).toBeInTheDocument();
  });

  test("fetches and displays ambulance and doctor counts", async () => {

    axiosGetMock.mockResolvedValueOnce({ status: 200, data: [{ id: 1 }, { id: 2 }] });
    axiosGetMock.mockResolvedValueOnce({ status: 200, data: [{ id: 1 }, { id: 2 }] });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
    });
  });

  test("displays loading message while fetching data", () => {
    axiosGetMock.mockReturnValue(new Promise(() => {}));

    render(<App />);

    expect(screen.getByText(/Loading data.../i)).toBeInTheDocument();
  });

  test("displays error message when API fails", async () => {
    axiosGetMock.mockRejectedValueOnce(new Error("Failed to fetch data"));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Error: Failed to fetch data/i)).toBeInTheDocument();
    });
  });

  test("handles Ambulance and Doctor view toggle", async () => {
    axiosGetMock.mockResolvedValueOnce({ status: 200, data: [{ id: 1 }, { id: 2 }] });
    axiosGetMock.mockResolvedValueOnce({ status: 200, data: [{ id: 1 }, { id: 2 }] });

    render(<App />);

    fireEvent.click(screen.getByText(/Ambulances/i));
    expect(screen.getByText(/Ambulance List/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Doctors/i));
    expect(screen.getByText(/Doctor List/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Back/i));
    expect(screen.getByText(/Total Ambulances/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Doctors/i)).toBeInTheDocument();
  });

  test("displays 'N/A' when ambulance or doctor count is not available", async () => {
    axiosGetMock.mockResolvedValueOnce({ status: 200, data: [] });
    axiosGetMock.mockResolvedValueOnce({ status: 200, data: [] });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("N/A")).toBeInTheDocument(); // Total ambulances
      expect(screen.getByText("N/A")).toBeInTheDocument(); // Total doctors
    });
  });

  test("shows appropriate icons for ambulance and doctor", () => {
    render(<App />);

    expect(screen.getByTestId("ambulance-icon")).toBeInTheDocument();
    expect(screen.getByTestId("doctor-icon")).toBeInTheDocument();
  });
});
