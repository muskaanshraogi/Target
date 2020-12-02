const nodemailer = require("nodemailer");
const dotenv = require('dotenv')
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

dotenv.config()

const mailer = (email, subject, division, username) => {
    const oauth2Client = new OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET, 
        "https://developers.google.com/oauthplayground" 
    );
    
    oauth2Client.setCredentials({
        refresh_token: process.env.REFRESH_TOKEN
    });
    const accessToken = oauth2Client.getAccessToken()
    
    return nodemailer.createTransport({
        service: "gmail",
        auth: {
             type: "OAuth2",
             user: "pict.targetsolutions@gmail.com", 
             clientId: process.env.CLIENT_ID,
             clientSecret: process.env.CLIENT_SECRET,
             refreshToken: process.env.REFRESH_TOKEN,
             accessToken: accessToken
        },
        tls: {
            rejectUnauthorized: false
        }
    }).sendMail({
        from: 'pict.targetsolutions@gmail.com',
        to: email,
        subject: `Regarding submission of ${subject} marklist`,
        text: `Please submit ${subject} marklist for division ${division}`,
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
                  Please submit ${subject} marklist for division ${division} on the <b>Target Solutions<b> portal at the earliest.
                  <br><br>
                  You can access it, by signing in to the web console
                  <a href="#0" target="_blank" rel="noopener noreferrer"
                    style="color: #4285F4; text-decoration: none; background-color: transparent;">here.</a>
                  <br><br>
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
                  Copyright © 2020, Target Solutions
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