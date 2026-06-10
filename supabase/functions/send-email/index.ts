import { Resend } from "npm:resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {
    const {
      to,
      candidateName,
      jobTitle,
      status,
    } = await req.json();

    const { data, error } = await resend.emails.send({
      from: "TalentFlow <onboarding@resend.dev>",
      to: [to],
      subject: `Application Status Updated - ${jobTitle}`,
      html: `
        <h2>Hello ${candidateName},</h2>
        <p>Your application for <strong>${jobTitle}</strong> has been updated.</p>
        <p><strong>New Status:</strong> ${status}</p>
        <br/>
        <p>Thank you for using TalentFlow.</p>
      `,
    });

    if (error) {
      return new Response(JSON.stringify(error), {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        data,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        success: false,
        error: err.message,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});