use std::error::Error;
use suppaftp::types::{FileType, FormatControl};
use suppaftp::FtpStream;

use crate::password_storage::{delete_stored_password, get_stored_password, set_stored_password};

// These functions handle the FTP requests for the desktop version of the app.
// Rust code never runs in the web version.

// Makes an FTP request to list the available jobs.
// Replaces the /api/list endpoint.
#[tauri::command(async)]
pub fn list(
    host: String,
    username: String,
    password: String,
    store_password: bool,
) -> Result<String, String> {
    match internal_list(host, username, password, store_password) {
        Ok(job_list) => Ok(job_list),
        Err(e) => {
            let _ = delete_stored_password();
            Err(format!("{}", e))
        }
    }
}

// Makes an FTP request to retrieve the contents of a specific job.
// Replaces the /api/get endpoint.
#[tauri::command(async)]
pub fn get(
    host: String,
    username: String,
    password: String,
    job: String,
) -> Result<String, String> {
    match internal_get(host, username, password, job) {
        Ok(file_contents) => Ok(file_contents),
        Err(e) => Err(format!("{}", e)),
    }
}

// Makes an FTP request to delete one or more jobs.
// Replaces the /api/delete endpoint.
#[tauri::command(async)]
pub fn delete(
    host: String,
    username: String,
    password: String,
    jobs: Vec<String>,
) -> Result<String, String> {
    match internal_delete(host, username, password, jobs) {
        Ok(job_list) => Ok(job_list),
        Err(e) => Err(format!("{}", e)),
    }
}

#[tauri::command(async)]
pub fn logout() -> Result<(), String> {
    match delete_stored_password() {
        Ok(_) => Ok(()),
        Err(e) => Err(format!("{}", e)),
    }
}

// Propogates errors up to the wrapping 'list' function.
fn internal_list(
    host: String,
    username: String,
    password: String,
    store_password: bool,
) -> Result<String, Box<dyn Error>> {
    let session_password = if password.len() > 0 {
        password
    } else {
        get_stored_password()?
    };

    // Connect to host and authenticate, else throw error
    let mut ftp_stream = FtpStream::connect(format!("{}:21", host))?;
    ftp_stream.login(username, session_password.clone())?;

    ftp_stream.site("filetype=jes")?;

    // Request the job list; we concatenate all the items into a single
    // string in order to keep the function consistent with the web version.
    let files: Vec<String> = ftp_stream.list(None)?;
    let job_list = files.join("\n");

    ftp_stream.quit()?;

    if store_password {
        let _ = set_stored_password(session_password);
    }

    Ok(job_list)
}

// Propogates errors up to the wrapping 'get' function.
fn internal_get(
    host: String,
    username: String,
    password: String,
    job: String,
) -> Result<String, Box<dyn Error>> {
    let session_password = if password.len() > 0 {
        password
    } else {
        get_stored_password()?
    };

    let mut ftp_stream = FtpStream::connect(format!("{}:21", host))?;
    ftp_stream.login(username, session_password)?;

    ftp_stream.site("filetype=jes")?;

    // Force ASCII transfer so the mainframe runs EBCDIC->ASCII translation
    // before sending bytes. Some bytes may still slip through, so we use
    // from_utf8_lossy below to avoid rejecting the whole spool file.
    ftp_stream.transfer_type(FileType::Ascii(FormatControl::Default))?;

    // Download file into a buffer
    let file = ftp_stream.retr_as_buffer(&job)?;

    ftp_stream.quit()?;

    // Convert the buffer to a String, replacing any invalid UTF-8 bytes
    // with U+FFFD instead of failing the whole request.
    let return_file = String::from_utf8_lossy(&file.into_inner()).into_owned();

    Ok(return_file)
}

// Propogates errors up to the wrapping 'delete' function.
fn internal_delete(
    host: String,
    username: String,
    password: String,
    jobs: Vec<String>,
) -> Result<String, Box<dyn Error>> {
    let session_password = if password.len() > 0 {
        password
    } else {
        get_stored_password()?
    };

    let mut ftp_stream = FtpStream::connect(format!("{}:21", host))?;
    ftp_stream.login(username, session_password)?;

    ftp_stream.site("filetype=jes")?;

    // Attempt to delete each file; never throws an error
    for job in jobs {
        let _ = ftp_stream.rm(job.as_str());
    }

    // To keep behavior consistent between the web and desktop versions,
    // we return an updated list at the end of the delete function.
    let files: Vec<String> = ftp_stream.list(None)?;
    let job_list = files.join("\n");

    ftp_stream.quit()?;

    Ok(job_list)
}
