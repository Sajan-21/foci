exports.OTPtemplate = (otp) => {
    try {
        const OTPtemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>One-Time Password (OTP)</title>
    <style>
        /* Base styles for the entire page/email body */
        body {
            font-family: 'Inter', Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f7fa;
            color: #333333;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }

        /* Main container for the email content */
        .container {
            width: 100%;
            max-width: 500px;
            margin: 20px;
            padding: 30px;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            text-align: center;
        }

        /* Header styling */
        .header {
            color: #007bff;
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 20px;
        }

        /* Instructions text */
        .instructions {
            font-size: 16px;
            line-height: 1.5;
            margin-bottom: 30px;
            color: #555555;
        }

        /* OTP Code Box */
        .otp-box {
            background-color: #e9f0ff;
            color: #007bff;
            font-size: 36px;
            font-weight: bold;
            letter-spacing: 10px;
            padding: 15px 20px;
            border-radius: 8px;
            display: inline-block;
            margin-bottom: 30px;
            border: 2px solid #007bff;
        }

        /* Expiration and footer */
        .footer-text {
            font-size: 14px;
            color: #777777;
            margin-top: 10px;
        }

        .warning {
            color: #dc3545;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            OTP verification mail from FOCI
        </div>

        <div class="instructions">
            Please use the following One-Time Password (OTP) to verify your account or reset your password.
            Do not share this code with anyone.
        </div>

        <div class="otp-box">
            ${otp}
        </div>

        <p class="footer-text">
            This code will expire in <span class="warning">3 minutes</span>.
        </p>

        <p class="footer-text">
            If you did not request this, please ignore this email.
        </p>
    </div>
</body>
</html>
`;

        return OTPtemplate;
    } catch (error) {
        console.log("error in OTPtemplate: ", error);
        return error.message || error;
    }
}