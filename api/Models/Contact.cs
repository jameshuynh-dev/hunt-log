using System.Text.Json.Serialization;

namespace HuntLog.Api.Models;

// A person met for a specific application (e.g. at a career fair).
// Relationship: ONE Application has MANY Contacts.
public class Contact
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;
    public string? Title { get; set; }
    public string? Email { get; set; }
    public string? LinkedIn { get; set; }
    public string? Notes { get; set; }

    // FOREIGN KEY: stores the Id of the Application this contact belongs to.
    // The database enforces that it points to a real row in Applications.
    public int ApplicationId { get; set; }

    // Navigation property: lets C# code go contact.Application.Company.
    // [JsonIgnore] keeps it out of API responses. Otherwise serializing
    // Contact -> Application -> Contacts -> Application... would loop forever.
    [JsonIgnore]
    public Application? Application { get; set; }
}
