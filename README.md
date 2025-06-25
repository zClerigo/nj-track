# NJ TRANSIT SEAT TRACKER

This app allows vehicle drivers to monitor the seat locations of passengers using computer vision.

This app was made in 16 hours for Hack RU 2024, winning 2nd place in the transit track.

![screenshot](media/test.png)

We then briefly collaborated with members of the NJ Transit Department of Innovation after the hackathon, but have continued to fine tune and improve the software independently since then!

## Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL

## Installation

```bash
git clone https://github.com/zClerigo/nj-track.git
```

### Backend Setup

1. **Navigate to backend directory:**

   ```bash
   cd backend
   ```

2. **Create and activate virtual environment:**

   ```bash
   python -m venv venv

   # On Windows:
   venv\Scripts\activate

   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**

   ```bash
   cp .env.example .env
   ```

   Edit the `.env` file with your credentials:

   - **PostgreSQL Database**: Set up your database credentials (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_NAME`, `DB_PWD`)
   - **NJ Transit API**: Create a [NJ Transit Developer account](https://www.njtransit.com/developer-resources) and add your credentials:
     - `NJ_TRANSIT_USER`: Your NJ Transit developer username
     - `NJ_TRANSIT_PWD`: Your NJ Transit developer password
     - `NJ_TRANSIT_TOKEN`: Leave as provided in example (will be auto-generated)

5. **Set up PostgreSQL and your database:**

**Option 1: Using pgAdmin:**

- Open **pgAdmin** and click the "Add New Server" button (plug icon).
- Give your server any name (e.g., `LocalPostgres`).
- Under the "Connection" tab, set:
  - **Host**: Should match `DB_HOST` in your `.env` (usually `localhost`)
  - **Port**: Should match `DB_PORT` in your `.env` (usually `5432`)
  - **Username**: Should match `DB_USER` in your `.env` (often `postgres`)
  - **Password**: Your PostgreSQL password
- Click **Save** to connect.
- In the left sidebar, right-click on "Databases" under your server and select **Create > Database...**
  - Name the database exactly as in your `.env` `DB_NAME` (e.g., `njtrackdb`, all lowercase)
  - Click **Save**

Now your server and database are ready and match your `.env` settings.

**Option 2: Using the command line (no pgAdmin):**

- **Start the PostgreSQL server:**

  - On Windows, open Command Prompt as Administrator and run:

    ```bash
    net start postgresql-x64-XX
    ```

    Replace `XX` with your PostgreSQL version (e.g., `15`).

  - On macOS/Linux, run:

    ```bash
    sudo service postgresql start
    # or
    sudo systemctl start postgresql
    ```

- **Create the database:**

  - Run:

    ```bash
    createdb -U <your_db_user> <your_db_name>
    ```

    Replace `<your_db_user>` and `<your_db_name>` with the values from your `.env` file. You may be prompted for your PostgreSQL password.

Now your server and database are ready and match your `.env` settings.

6. **Set up database:**

   ```bash
   python manage.py migrate
   ```

7. **Start the development server:**

   ```bash
   python manage.py runserver
   ```

The backend will be available at `http://localhost:8000/`

### Frontend Setup

1. **Navigate to frontend directory:**

   ```bash
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**

   ```bash
   cp .env.example .env
   ```

   Edit the `.env` file if needed:

   - Set `DEVMODE` to `"development"` to use stored developer images for testing
   - Set `DEVMODE` to `"production"` to use user-captured images
   - Update API URL if running backend on a different port

4. **Start the development server:**

   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173/`

## Running the Application

1. **Start the backend server:**

   ```bash
   cd backend
   # Activate virtual environment if not already active
   venv\Scripts\activate  # Windows
   # source venv/bin/activate  # macOS/Linux
   python manage.py runserver
   ```

2. **In a separate terminal, start the frontend:**

   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the application:**
   - Frontend: `http://localhost:8000/`
   - Backend API: `http://localhost:5432/`

## Stopping the Application

To stop the application, you need to stop both the backend and frontend development servers:

1. **In each terminal window (backend and frontend):**

   - Press `Ctrl + C` to gracefully stop the server process.

2. **If you started the servers in background processes or with a process manager:**
   - Use the appropriate command to stop them (e.g., `kill` the process by PID, or use your process manager's stop command).

**Note:**

- Make sure to deactivate your Python virtual environment after stopping the backend, if you no longer need it:
  - On Windows: `deactivate`
  - On macOS/Linux: `deactivate`
