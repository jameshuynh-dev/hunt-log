# Hunt Log

**A full-stack internship application tracker built with React + TypeScript, ASP.NET Core Web API, and Entity Framework Core.**

Hunt Log keeps my internship search organized in one place: every company and role I'm pursuing, where each application stands, upcoming deadlines, the people I've met at career fairs, and a daily list of who I need to follow up with.

![Dashboard](docs/screenshots/dashboard.png)

---

## Why this was built

I was tracking my internship search across my various notes and email.

I also built it on purpose to learn C# ASP.NET Core Web API with controllers, Entity Framework Core with migrations, a relational database, and a typed React front end. 

## Features

- **Track applications:** company, role, status, date applied, deadline, follow-up date, and notes
- **Dashboard:** stat cards with counts by status (click one to filter the table)
- **Follow up today:** a panel listing every application whose follow-up date is today or overdue, most overdue first
- **Contacts:** record the recruiters and engineers I meet, linked to a specific application

| Application detail with contacts | Editing an application |
| --- | --- |
| ![Application detail](docs/screenshots/application-detail.png) | ![Edit application](docs/screenshots/edit-application.png) |

> _Screenshot placeholders: the images in `docs/screenshots/` use sample data. Replace them with your own captures as the app evolves._

## Tech stack

| Layer | Technology |
| --- | --- |
| Front end | React 19, TypeScript, Vite |
| Styling | Tailwind CSS v4 (all colors defined once as theme tokens) |
| Back end | C# / ASP.NET Core 9 Web API using **controllers** |
| Data access | Entity Framework Core 9 (code-first, migrations) |
| Database | SQLite (local file), designed to swap to SQL Server |
| API docs / testing | Swagger UI (Swashbuckle) and a VS Code `.http` file |

## Running it locally

**Prerequisites:** [.NET 9 SDK](https://dotnet.microsoft.com/download) and [Node.js](https://nodejs.org/) 20.19+ or 22.12+.

**1. Start the API** (terminal 1, from the repo root):

```powershell
dotnet tool restore          # installs the pinned dotnet-ef CLI (only needed for migration commands)
dotnet run --project api
```

The API listens on **http://localhost:5041**. On first run it creates `api/huntlog.db` and applies all migrations automatically. You can explore it at **http://localhost:5041/swagger**.

**2. Start the front end** (terminal 2):

```powershell
cd client
npm install
npm run dev
```

Open **http://localhost:5180**.

**Testing the API without the UI:** open `api/HuntLog.Api.http` in VS Code with the [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) extension and click **Send Request** above any request, or use Swagger UI.

**Changing the schema:** edit a model, then run:

```powershell
dotnet ef migrations add <DescriptiveName> --project api
```

The new migration is applied the next time the API starts.


