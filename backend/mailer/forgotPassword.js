const nodemailer = require("nodemailer");
const dotenv = require('dotenv')
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

dotenv.config()

const mailer = (email, username, token) => {
    const oauth2Client = new OAuth2(
        "899017535404-i7macjals7j8bj95qtgnhqcetbk5h1rd.apps.googleusercontent.com",
        "LcohwztQMS6hxq3-CuZFN063", 
        "https://developers.google.com/oauthplayground" 
    );
    
    oauth2Client.setCredentials({
        refresh_token: "1//042SM2zQvNu_XCgYIARAAGAQSNwF-L9IrTO2Aj5T5aGCgC2HSj6gvdPvkHLqqpgSX82vPh2ye1GSqFLX_aR1xade5jLoB-mpcbRs"
    });
    const accessToken = oauth2Client.getAccessToken()
    
    return nodemailer.createTransport({
        service: "gmail",
        auth: {
             type: "OAuth2",
             user: "pict.targetsolutions@gmail.com", 
             clientId: "899017535404-i7macjals7j8bj95qtgnhqcetbk5h1rd.apps.googleusercontent.com",
             clientSecret: "LcohwztQMS6hxq3-CuZFN063",
             refreshToken: "1//042SM2zQvNu_XCgYIARAAGAQSNwF-L9IrTO2Aj5T5aGCgC2HSj6gvdPvkHLqqpgSX82vPh2ye1GSqFLX_aR1xade5jLoB-mpcbRs",
             accessToken: accessToken
        },
        tls: {
            rejectUnauthorized: false
        }
    }).sendMail({
        from: 'pict.targetsolutions@gmail.com',
        to: email,
        subject: `Password reset request`,
        text: `Click on the link below to reset your password`,
        html: `
        <!DOCTYPE html>
        <html lang="en" style="margin: 0 !important;">
        
        <body style="
          margin: 0 !important;
          font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans',sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji';
          line-height: 1.5;
        ">
          <table cellpadding="10" style="width: 100%; border-collapse: collapse;">
            <thead style="
                  background-color: #343a40; 
                  width: 100%; 
                  display: table-header-group; 
                  vertical-align: middle;
                  justify-content: start;
                ">
            </thead>
            <hr style="border: 2px solid #0F9D58; margin-right: 1%; width: 98%;">
          </table>
          <table style="margin-top:3vh; margin-left: 13%; width: 77%;">
            <thead style="
              display: table-header-group; 
              text-align: left;
              ">
              <tr>
                <th style="font-weight: 400;">
                  <h1 style="font-weight: 500; font-size: 3vh;">
                    Hi ${username},
                  </h1>
                  We have received a password reset request for your Target account.
                  <br><br><br>
                  Follow
                  <a href="http://localhost:3000/reset_password/${token}" target="_blank" rel="noopener noreferrer"
                    style="color: #4285F4; text-decoration: none; background-color: transparent;">this link</a>
                  to reset your password.
                  <br><br><br>
                  This link is valid for 20 minutes.
                  <br>
                  <small style="color: red">
                    Please ignore this email if the request was not made by you.
                  </small>
                  <br>
                </th>
              </tr>
            </thead>
          </table>
          <hr style="border: 2px solid #0F9D58; margin-right: 1%; width: 98%;">
          <br>
          <table style="width: 100%; border-collapse: collapse;">
            <thead style="
                background-color: #161a28; 
                width: 100%; 
              ">
              <th style="
                text-align: start; 
                height: 5vh; color: 
                white; font-weight: 400; 
                font-size: 1.5vh;
                ">
                <p style="text-align: center;">
                  Copyright © 2021, Target Solutions
                </p>
              </th>
            </thead>
          </table>
        </body>
        
        </html>
        `
    })
}

module.exports = { mailer }