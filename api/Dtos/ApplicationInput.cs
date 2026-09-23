using System.ComponentModel.DataAnnotations;
using HuntLog.Api.Models;

namespace HuntLog.Api.Dtos;

// A DTO (Data Transfer Object) is the shape of data the client may SEND.
// It leaves out Id and CreatedAt, which the server controls. Without it a
// client could POST {"id": 5, "createdAt": "1999-01-01"} and overwrite them
// (this is called "over-posting").
//
// The [Required]/[MaxLength] attributes are validated automatically by
// [ApiController]. Bad input gets a 400 Bad Request before our code runs.
public class ApplicationInput
{
    [Required, MaxLength(100)]
    public string Company { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string Role { get; set; } = string.Empty;

    public ApplicationStatus Status { get; set; } = ApplicationStatus.Saved;

    public DateOnly? DateApplied { get; set; }
    public DateOnly? Deadline { get; set; }
    public DateOnly? FollowUpDate { get; set; }

    [MaxLength(2000)]
    public string? Notes { get; set; }
}
