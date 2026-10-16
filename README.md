# Login-Parking

Setup guide for running the backend and frontend on a new Windows PC.

## Prerequisites

- Windows 10 or later
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js LTS](https://nodejs.org/) (includes npm)
- SQL Server (for example, SQL Server Express or Developer) running locally, with an account that can create databases
- Git, if you are cloning the repository

## Get the project

Clone the repository, or open the folder containing the project:

```powershell
git clone https://github.com/DoxDuck/Login-Parking.git
cd Login-Parking
```

## Configure SQL Server

The backend reads the `ConnectionStrings:DefaultConnection` setting from `appsettings.json`. Update it for the SQL Server instance and authentication method on your PC. The checked-in value refers to the original developer's computer and should be replaced.

For Windows authentication with a local SQL Server instance:

```json
"DefaultConnection": "Server=localhost;Database=ParkingSystemDB;Trusted_Connection=True;TrustServerCertificate=True"
```

For SQL Server Express, the instance name is commonly `SQLEXPRESS`:

```json
"DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=ParkingSystemDB;Trusted_Connection=True;TrustServerCertificate=True"
```

If using SQL authentication, substitute your own SQL Server username and password. Do not commit real credentials to source control. You can instead set the connection string as a local .NET user secret:

```powershell
dotnet user-secrets init --project SWP391.csproj
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=localhost;Database=ParkingSystemDB;User Id=<your-user>;Password=<your-password>;TrustServerCertificate=True" --project SWP391.csproj
```

Replace the placeholders with your own credentials. Keep the database server running while applying migrations and running the backend.

## Create or update the database

The EF Core migrations are included in the repository. Install the EF Core command-line tool if it is not already installed, then apply the migrations:

```powershell
dotnet tool install --global dotnet-ef --version 8.0.10
dotnet ef database update --project SWP391.csproj
```

If `dotnet-ef` is already installed, update it to the matching version instead:

```powershell
dotnet tool update --global dotnet-ef --version 8.0.10
```

The migration creates `ParkingSystemDB` (if needed), the `Users` table, and the EF migration history table. The SQL Server account in the connection string must have permission to create the database, or the database must be created for it in advance.

## Run the backend

From the repository root:

```powershell
dotnet restore
dotnet run --project SWP391.csproj
```

The HTTP launch profile listens on `http://localhost:5225`. In Development, Swagger is available at:

```text
http://localhost:5225/swagger
```

## Run the frontend

Open a second PowerShell terminal from the repository root:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

## Troubleshooting

- **Cannot connect to SQL Server:** Confirm the SQL Server service is running, check the server/instance name in `DefaultConnection`, and verify the selected authentication method.
- **Login or database creation fails:** Confirm the database credentials are correct and the account can create databases, or create `ParkingSystemDB` first and grant that account access.
- **`dotnet ef` is not recognized:** Install the .NET 8 SDK and EF Core tool, then open a new terminal so the global tool path is available.
- **Frontend dependencies fail to install:** Install a current Node.js LTS release, then retry `npm install` from the `frontend` directory.
