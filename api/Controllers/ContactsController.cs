using HuntLog.Api.Data;
using HuntLog.Api.Dtos;
using HuntLog.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HuntLog.Api.Controllers;

// Contacts belong to an application, so their URLs are NESTED under it:
//   GET    /api/applications/3/contacts   -> contacts for application 3
//   POST   /api/applications/3/contacts   -> add a contact to application 3
//   GET    /api/contacts/7                -> one contact
//   DELETE /api/contacts/7                -> delete one contact
// A contact's own Id is enough to identify it, so get/delete don't need nesting.
[ApiController]
[Route("api")]
public class ContactsController : ControllerBase
{
    private readonly HuntLogDbContext _db;

    public ContactsController(HuntLogDbContext db)
    {
        _db = db;
    }

    [HttpGet("applications/{applicationId:int}/contacts")]
    public async Task<ActionResult<IEnumerable<Contact>>> GetForApplication(int applicationId)
    {
        // Return 404 for an unknown application instead of an empty list,
        // so the client can tell "no contacts yet" apart from "wrong id".
        if (!await _db.Applications.AnyAsync(a => a.Id == applicationId))
        {
            return NotFound();
        }

        // Filtering on the foreign key becomes: SELECT ... WHERE ApplicationId = @id
        var contacts = await _db.Contacts
            .Where(c => c.ApplicationId == applicationId)
            .OrderBy(c => c.Name)
            .ToListAsync();

        return Ok(contacts);
    }

    [HttpGet("contacts/{id:int}")]
    public async Task<ActionResult<Contact>> GetById(int id)
    {
        var contact = await _db.Contacts.FindAsync(id);
        return contact is null ? NotFound() : Ok(contact);
    }

    [HttpPost("applications/{applicationId:int}/contacts")]
    public async Task<ActionResult<Contact>> Create(int applicationId, ContactInput input)
    {
        if (!await _db.Applications.AnyAsync(a => a.Id == applicationId))
        {
            return NotFound();
        }

        var contact = new Contact
        {
            Name = input.Name,
            Title = input.Title,
            Email = input.Email,
            LinkedIn = input.LinkedIn,
            Notes = input.Notes,
            ApplicationId = applicationId // the foreign key comes from the URL
        };

        _db.Contacts.Add(contact);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = contact.Id }, contact);
    }

    [HttpDelete("contacts/{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var contact = await _db.Contacts.FindAsync(id);
        if (contact is null)
        {
            return NotFound();
        }

        _db.Contacts.Remove(contact);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
