import { NextResponse } from "next/server"

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  if (!process.env.RESEND_API_KEY) {
    console.log("Email (mock):", { to, subject, html })
    return { id: "mock" }
  }

  const { Resend } = await import("resend")
  const resend = new Resend(process.env.RESEND_API_KEY)

  return resend.emails.send({
    from: "DevTrust <noreply@devtrust.ru>",
    to,
    subject,
    html,
  })
}

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${process.env.AUTH_URL}/verify?token=${token}`
  
  await sendEmail({
    to: email,
    subject: "Подтверждение регистрации",
    html: `
      <h1>Подтверждение регистрации</h1>
      <p>Для подтверждения email перейдите по ссылке:</p>
      <a href="${verifyUrl}">Подтвердить email</a>
    `,
  })
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.AUTH_URL}/reset-password?token=${token}`
  
  await sendEmail({
    to: email,
    subject: "Восстановление пароля",
    html: `
      <h1>Восстановление пароля</h1>
      <p>Для создания нового пароля перейдите по ссылке:</p>
      <a href="${resetUrl}">Сбросить пароль</a>
      <p>Ссылка действительна 1 час.</p>
    `,
  })
}