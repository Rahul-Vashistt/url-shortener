import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (
    email: string,
    verificationUrl: string,
) => {
    const { data, error } = await resend.emails.send({
        from: "URL Shortener <onboarding@resend.dev>",
        to: email,
        subject: "Verify your email address",
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Verify your email</title>
            </head>

            <body style="
                margin: 0;
                padding: 0;
                background-color: #f8fafc;
                font-family: Arial, Helvetica, sans-serif;
                color: #111827;
            ">

                <table
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    border="0"
                    style="padding: 40px 16px;"
                >
                    <tr>
                        <td align="center">

                            <!-- Main container -->
                            <table
                                width="100%"
                                cellpadding="0"
                                cellspacing="0"
                                border="0"
                                style="
                                    max-width: 520px;
                                    background-color: #ffffff;
                                    border: 1px solid #e5e7eb;
                                    border-radius: 16px;
                                    overflow: hidden;
                                "
                            >

                                <!-- Header -->
                                <tr>
                                    <td
                                        align="center"
                                        style="
                                            padding: 32px 32px 24px;
                                            background-color: #eef2ff;
                                        "
                                    >
                                        <div style="
                                            width: 56px;
                                            height: 56px;
                                            margin: 0 auto 16px;
                                            border-radius: 50%;
                                            background-color: #4f46e5;
                                            color: #ffffff;
                                            font-size: 26px;
                                            line-height: 56px;
                                            text-align: center;
                                        ">
                                            ✉
                                        </div>

                                        <h1 style="
                                            margin: 0;
                                            font-size: 24px;
                                            line-height: 32px;
                                            color: #111827;
                                        ">
                                            URL Shortener
                                        </h1>
                                    </td>
                                </tr>

                                <!-- Content -->
                                <tr>
                                    <td style="padding: 32px;">

                                        <h2 style="
                                            margin: 0 0 16px;
                                            font-size: 22px;
                                            line-height: 30px;
                                            color: #111827;
                                        ">
                                            Verify your email address
                                        </h2>

                                        <p style="
                                            margin: 0 0 16px;
                                            font-size: 15px;
                                            line-height: 24px;
                                            color: #4b5563;
                                        ">
                                            Thanks for signing up for URL Shortener.
                                            Please verify your email address to activate
                                            your account.
                                        </p>

                                        <!-- Button -->
                                        <table
                                            cellpadding="0"
                                            cellspacing="0"
                                            border="0"
                                            style="margin: 28px auto;"
                                        >
                                            <tr>
                                                <td
                                                    align="center"
                                                    style="
                                                        border-radius: 8px;
                                                        background-color: #4f46e5;
                                                    "
                                                >
                                                    <a
                                                        href="${verificationUrl}"
                                                        style="
                                                            display: inline-block;
                                                            padding: 13px 24px;
                                                            font-size: 15px;
                                                            font-weight: 600;
                                                            color: #ffffff;
                                                            text-decoration: none;
                                                            border-radius: 8px;
                                                        "
                                                    >
                                                        Verify my email
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>

                                        <!-- Expiry notice -->
                                        <div style="
                                            margin: 24px 0;
                                            padding: 14px 16px;
                                            background-color: #f9fafb;
                                            border: 1px solid #e5e7eb;
                                            border-radius: 8px;
                                        ">
                                            <p style="
                                                margin: 0;
                                                font-size: 13px;
                                                line-height: 20px;
                                                color: #6b7280;
                                            ">
                                                ⏱ This verification link will expire
                                                in <strong>15 minutes</strong>.
                                            </p>
                                        </div>

                                        <p style="
                                            margin: 24px 0 8px;
                                            font-size: 13px;
                                            line-height: 20px;
                                            color: #6b7280;
                                        ">
                                            If the button doesn't work, copy and paste
                                            the following link into your browser:
                                        </p>

                                        <p style="
                                            margin: 0;
                                            font-size: 12px;
                                            line-height: 18px;
                                            word-break: break-all;
                                        ">
                                            <a
                                                href="${verificationUrl}"
                                                style="
                                                    color: #4f46e5;
                                                    text-decoration: none;
                                                "
                                            >
                                                ${verificationUrl}
                                            </a>
                                        </p>

                                    </td>
                                </tr>

                                <!-- Footer -->
                                <tr>
                                    <td
                                        align="center"
                                        style="
                                            padding: 20px 32px;
                                            background-color: #f9fafb;
                                            border-top: 1px solid #e5e7eb;
                                        "
                                    >
                                        <p style="
                                            margin: 0;
                                            font-size: 12px;
                                            line-height: 18px;
                                            color: #9ca3af;
                                        ">
                                            If you didn't create an account with
                                            URL Shortener, you can safely ignore
                                            this email.
                                        </p>
                                    </td>
                                </tr>

                            </table>

                        </td>
                    </tr>
                </table>

            </body>
            </html>
        `,
    });

    if (error) {
        throw new Error(error.message);
    }

    return data;
};