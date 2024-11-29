# Accident Management Application

## Overview

This React application provides a solution to display nearby ambulance services and doctors based on location, with CRUD functionality to manage the data. The app allows users to add, edit, update, and delete ambulance and doctor records. It features pagination and supports displaying a list of ambulances and doctors with details such as title, description, location, and image (if available).

## Features

- **CRUD Operations**: Users can add, edit, update, and delete ambulance and doctor records.
- **Pagination**: The first 10 records are displayed by default, with the ability to paginate through the list.
- **Data Display**: Displays the following for each record:
  
  **Doctors**
    - Name
    - Specialty
    - Location

  **Ambulances**
    - Name
    - Description
    - Location

- **Loading State**: A loading indicator is shown while fetching data.
- **Error State**: Displays an error message if the list is unavailable.
- **Empty State**: Shows a message when no records are available.
- **Total Count**: Displays the total number of ambulance services and doctors available in the app.

## Tech Stack

### Frontend

- **React**: A JavaScript library for building user interfaces.
- **TypeScript**: A superset of JavaScript that provides optional static typing.
- **Tailwind css**: For writing CSS in JavaScript to style components.
- **Jest**: A testing framework for unit and integration tests.
- **React Testing Library**: For testing React components.
- **Fetch API**: For making HTTP requests to the NodeJS API to get JSON content.
  
### Backend (Optional)

- **Node.js**: A JavaScript runtime for the backend.
- **SQLite**: A lightweight database for managing CRUD operations (you can replace this with any database or in-memory JSON).
- **Express.js**: A web framework for Node.js to handle the server-side API.
  
## Setup and Installation

### Frontend

1. Clone the repository:
    ```bash
    git clone https://github.com/your-repository.git
    cd your-repository
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Start the development server:
    ```bash
    npm start
    ```

4. The app will be running at [http://localhost:3000](http://localhost:3000).

### Running Tests

1. Run tests using Jest:
    ```bash
    npm test
    ```

## Key Functionality

1. **Pagination**:
    - Display the first 10 records by default.
    - Ability to navigate between pages and load more records using pagination.

2. **CRUD Operations**:
    - Users can add, edit, update, and delete ambulance and doctor records.
    - Form validation is implemented to ensure valid data is entered.

3. **Loading, Error, and Empty States**:
    - Displays a loading spinner while waiting for data from the server.
    - An error message is shown if the data could not be fetched.
    - Displays a message when no records are available.

4. **Data Display**:
    - For each record, display:
        **Doctors**
        - Name
        - Specialty
        - Location

        **Ambulances**
        - Name
        - Description
        - Location


## Testing

- **Unit Tests**: Jest and React Testing Library are used for testing the components and hooks. The test suite covers various cases including:
  - Rendering lists of ambulances and doctors.
  - Handling loading, error, and empty states.
  - Pagination functionality.
  - CRUD operations.

## Seed Data (Optional)

You can include seed data for testing purposes in the backend or in-memory JSON files. Example seed data for ambulances and doctors:

```json
[
  {
    "id": 1,
    "title": "Ambulance Service A",
    "description": "24/7 Emergency Ambulance Service",
    "location": "City Center",
    "image": "ambulance_a.jpg"
  },
  {
    "id": 2,
    "title": "Doctor John Doe",
    "description": "General Practitioner",
    "location": "Main Street Clinic",
    "image": "doctor_john.jpg"
  }
]
```
## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
