use keyring::{Entry, Result};
use whoami::username;

const SERVICE_NAME: &str = "retrieve-jobs";

// These functions manage password storage using the OS keyring.
// We don't use cookies or our own encryption for the desktop app.

pub fn set_stored_password(password: String) -> Result<()> {
    let username = username();
    let entry = Entry::new(SERVICE_NAME, &username)?;
    entry.set_password(&password)?;
    Ok(())
}

pub fn get_stored_password() -> Result<String> {
    let username = username();
    let entry = Entry::new(SERVICE_NAME, &username)?;
    let password = entry.get_password()?;
    Ok(password)
}

pub fn delete_stored_password() -> Result<()> {
    let username = username();
    let entry = Entry::new(SERVICE_NAME, &username)?;
    entry.delete_password()?;
    Ok(())
}