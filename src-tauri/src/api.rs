use suppaftp::FtpStream;
use std::error::Error;

// These functions handle the FTP requests for the desktop version of the app.
// Rust code never runs in the web version.

// Makes an FTP request to list the available jobs.
// Replaces the /api/list endpoint.
#[tauri::command(async)]
pub fn list(host: String, username: String, password: String) -> Result<String, String> {
    match internal_list(host, username, password) {
        Ok(job_list) => Ok(job_list),
        Err(e) => Err(format!("{}", e)),
    }
}

// Makes an FTP request to retrieve the contents of a specific job.
// Replaces the /api/get endpoint.
#[tauri::command(async)]
pub fn get(host: String, username: String, password: String, job: String) -> Result<String, String> {
    match internal_get(host, username, password, job) {
        Ok(file_contents) => Ok(file_contents),
        Err(e) => Err(format!("{}", e)),
    }
}

// Makes an FTP request to delete one or more jobs.
// Replaces the /api/delete endpoint.
#[tauri::command(async)]
pub fn delete(host: String, username: String, password: String, jobs: Vec<String>) -> Result<String, String> {
    match internal_delete(host, username, password, jobs) {
        Ok(job_list) => Ok(job_list),
        Err(e) => Err(format!("{}", e)),
    }
}

// Propogates errors up to the wrapping 'list' function.
fn internal_list(host: String, username: String, password: String) -> Result<String, Box<dyn Error>> {
    // Connect to host and authenticate, else throw error
    let mut ftp_stream = FtpStream::connect(format!("{}:21", host))?;
    ftp_stream.login(username, password)?;

    ftp_stream.site("filetype=jes")?;

    // Request the job list; we concatenate all the items into a single
    // string in order to keep the function consistent with the web version.
    let files: Vec<String> = ftp_stream.list(None)?;
    let job_list = files.join("\n");

    ftp_stream.quit()?;

    Ok(job_list)
}

// Propogates errors up to the wrapping 'get' function.
fn internal_get(host: String, username: String, password: String, job: String) -> Result<String, Box<dyn Error>> {
    let mut return_file = String::new();

    let mut ftp_stream = FtpStream::connect(format!("{}:21", host))?;
    ftp_stream.login(username, password)?;

    ftp_stream.site("filetype=jes")?;

    // Download file into a buffer
    let file = ftp_stream.retr_as_buffer(&job)?;
    
    ftp_stream.quit()?;

    // Convert the buffer to a String
    return_file.push_str(std::str::from_utf8(&file.into_inner())?);

    Ok(return_file)
}

// Propogates errors up to the wrapping 'delete' function.
fn internal_delete(host: String, username: String, password: String, jobs: Vec<String>) -> Result<String, Box<dyn Error>> {
    let mut ftp_stream = FtpStream::connect(format!("{}:21", host))?;
    ftp_stream.login(username, password)?;

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