# Unified Contribution Navigator

This project is a unified contribution navigator for discovering and exploring open-source repositories.

## Prerequisites

Make sure you have the following installed on your system:

- Node.js (v18 or higher)
- npm (v8 or higher)
- Python (v3.8 or higher)
- Flask (v2.0 or higher)

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/your-username/unified-contribution-navigator.git
   cd unified-contribution-navigator
   ```

2. Install the frontend dependencies:

   ```sh
   cd frontend
   npm install
   ```

3. Install the backend dependencies:

   ```sh
   cd ../Data_collection
   pip install -r requirements.txt
   ```

## Running the Project

### Backend

1. Navigate to the `Data_collection` directory:

   ```sh
   cd Data_collection
   ```

2. Start the Flask server:

   ```sh
   python app.py
   ```

   The backend server will start on `http://127.0.0.1:5000`.

### Frontend

1. Navigate to the `frontend` directory:

   ```sh
   cd ../frontend
   ```

2. Start the Next.js development server:

   ```sh
   npm run dev
   ```

   The frontend server will start on `http://localhost:3000`.

## Dependencies

### Frontend

- `@radix-ui/react-dropdown-menu`
- `@radix-ui/react-slot`
- `axios`
- `class-variance-authority`
- `clsx`
- `framer-motion`
- `geist`
- `lucide-react`
- `next`
- `next-themes`
- `react`
- `react-dom`
- `tailwind-merge`
- `tailwindcss-animate`

### Backend

- `requests`
- `base64`
- `json`
- `time`
- `markdown`
- `beautifulsoup4`
- `flask`
- `flask-cors`
- `logging`

## License

This project is licensed under the MIT License.