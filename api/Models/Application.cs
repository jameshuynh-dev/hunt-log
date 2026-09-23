using System.Text.Json.Serialization;

namespace HuntLog.Api.Models;

// An "entity": EF Core maps this class to the Applications table.
// Each property becomes a column.
public class Application
{
    // EF Core treats a property named "Id" as the primary key by convention,
    // and the database auto-generates it on insert.
    public int Id { get; set; }

    public string Company { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public ApplicationStatus Status { get; set; } = ApplicationStatus.Saved;

    // DateOnly (no time part) because these are calendar days. That keeps
    // "is the follow-up due today?" free of time-zone surprises.
    // The "?" makes them nullable, so they become NULL-able columns.
    public DateOnly? DateApplied { get; set; }
    public DateOnly? Deadline { get; set; }
    public DateOnly? FollowUpDate { get; set; }

    public string? Notes { get; set; }

    // Set by the server, never by the client. Stored in UTC.
    public DateTime CreatedAt { get; set; }

    // Navigation property for the "many" side of the relationship. It is NOT a
    // column: the link lives in Contact.ApplicationId. Contacts are fetched from
    // their own endpoint, so we leave them out of Application JSON.
    [JsonIgnore]
    public List<Contact> Contacts { get; set; } = new();
}
