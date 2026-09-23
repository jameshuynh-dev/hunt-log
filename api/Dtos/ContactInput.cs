using System.ComponentModel.DataAnnotations;

namespace HuntLog.Api.Dtos;

// What the client may send when adding a contact. ApplicationId is NOT here:
// it comes from the URL (/api/applications/{applicationId}/contacts).
public class ContactInput
{
    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? Title { get; set; }

    [EmailAddress, MaxLength(200)]
    public string? Email { get; set; }

    [MaxLength(300)]
    public string? LinkedIn { get; set; }

    [MaxLength(2000)]
    public string? Notes { get; set; }
}
