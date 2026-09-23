namespace HuntLog.Api.Models;

// An enum limits Status to these five values, so a typo like "Aplied"
// can never reach the database. It is stored as text (see HuntLogDbContext)
// so the table stays readable if you open it in a DB browser.
public enum ApplicationStatus
{
    Saved,
    Applied,
    Interviewing,
    Offer,
    Rejected
}
