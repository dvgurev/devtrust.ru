// apps/web/src/app/test-session/page.tsx
"use client"

import { useSession } from "next-auth/react"
import { useEffect } from "react"

export default function TestSession() {
    const { data: session, status } = useSession()

    useEffect(() => {
        console.log("Session status:", status)
        console.log("Session data:", session)
        console.log("All cookies:", document.cookie)
    }, [session, status])

    return (
        <div style={{ padding: 50, marginTop: 100 }}>
            <h1>Session Test</h1>
            <p>Status: {status}</p>
            <p>Session: {JSON.stringify(session)}</p>
        </div>
    )
}