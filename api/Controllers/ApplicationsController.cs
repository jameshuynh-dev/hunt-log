using HuntLog.Api.Data;
using HuntLog.Api.Dtos;
using HuntLog.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HuntLog.Api.Controllers;

// REST: the URL names a resource (/api/applications) and the HTTP verb
// says what to do with it:
//   GET    /api/applications       -> list all
//   GET    /api/applications/5     -> get one
//   POST   /api/applications       -> create
//   PUT    /api/applications/5     -> replace/update one
//   DELETE /api/applications/5     -> delete one
//
// [ApiController] turns on API conveniences: automatic 400s for invalid
// input, and reading complex parameters from the JSON body.
// [Route("api/[controller]")] -> "[controller]" becomes "applications"
// (the class name minus "Controller").
[ApiController]
[Route("api/[controller]")]
public class ApplicationsController : ControllerBase
{
    private readonly HuntLogDbContext _db;

    // Dependency injection: we don't "new up" the DbContext ourselves.
    // ASP.NET creates one per HTTP request and passes it in here.
    // That keeps the controller easy to test and decoupled from setup details.
    public ApplicationsController(HuntLogDbContext db)
    {
        _db = db;
    }

    // GET /api/applications
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Application>>> GetAll()
    {
        // async/await frees the server thread while waiting on the database,
        // so it can serve other requests in the meantime.
        var applications = await _db.Applications
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();

        return Ok(applications); // 200 OK + JSON array
    }

    // GET /api/applications/5
    // "{id:int}" is a route constraint: /api/applications/abc won't match.
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Application>> GetById(int id)
    {
        var application = await _db.Applications.FindAsync(id);

        if (application is null)
        {
            return NotFound(); // 404
        }

        return Ok(application);
    }

    // POST /api/applications
    [HttpPost]
    public async Task<ActionResult<Application>> Create(ApplicationInput input)
    {
        var application = new Application
        {
            Company = input.Company,
            Role = input.Role,
            Status = input.Status,
            DateApplied = input.DateApplied,
            Deadline = input.Deadline,
            FollowUpDate = input.FollowUpDate,
            Notes = input.Notes,
            CreatedAt = DateTime.UtcNow // the server decides, not the client
        };

        _db.Applications.Add(application);
        await _db.SaveChangesAsync(); // runs the INSERT; Id gets filled in

        // 201 Created + a "Location" header pointing at GET /api/applications/{id}.
        // That's the REST convention for "here's the new thing and where it lives".
        return CreatedAtAction(nameof(GetById), new { id = application.Id }, application);
    }

    // PUT /api/applications/5
    [HttpPut("{id:int}")]
    public async Task<ActionResult<Application>> Update(int id, ApplicationInput input)
    {
        var application = await _db.Applications.FindAsync(id);

        if (application is null)
        {
            return NotFound();
        }

        // EF Core "tracks" the entity it loaded, so changing properties and
        // calling SaveChanges generates an UPDATE for just the changed columns.
        application.Company = input.Company;
        application.Role = input.Role;
        application.Status = input.Status;
        application.DateApplied = input.DateApplied;
        application.Deadline = input.Deadline;
        application.FollowUpDate = input.FollowUpDate;
        application.Notes = input.Notes;

        await _db.SaveChangesAsync();

        // Many APIs return 204 No Content here. We return the updated object
        // (200 OK) so the React app can refresh its row without a second request.
        return Ok(application);
    }

    // DELETE /api/applications/5
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var application = await _db.Applications.FindAsync(id);

        if (application is null)
        {
            return NotFound();
        }

        _db.Applications.Remove(application);
        await _db.SaveChangesAsync();

        return NoContent(); // 204: success, nothing to send back
    }
}
