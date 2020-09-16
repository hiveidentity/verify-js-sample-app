import React, { useEffect, useRef } from "react";
import { Verify } from "@hiveid/verify-js";

const applicationKey = "hWsqWCs7fS4nfKW1cYevw7fxVGKTN766";
const customerId = "6ff92788-43be-413a-b1da-d7ebce2af91a";
const baseUrl = "express base url";

async function createCheck(payload) {
  await fetch(`${baseUrl}/checks`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "content-type": "application/json",
    },
  });
}

async function createSession(payload) {
  const res = await fetch(`${baseUrl}/sessions`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "content-type": "application/json",
    },
  });

  const data = await res.json();
  return data.session_token;
}

Verify.configure(applicationKey, {
  language: "en", // supported de, en, es, fr,
  languageSelector: true, // default true
  mode: "modal", // modal | inline, default modal
});

export function App() {
  const containerRef = useRef(null);

  useEffect(() => {
    const verificationCompletedUnsubscribe = Verify.on(
      "completed",
      handleVerificationCompleted
    );
    const verificationCanceledUnsubscribe = Verify.on(
      "canceled",
      handleVerificationCanceled
    );

    return () => {
      verificationCompletedUnsubscribe();
      verificationCanceledUnsubscribe();
    };
  }, []);

  const handleVerificationStarted = async () => {
    if (!containerRef.current) {
      return;
    }

    const sessionToken = await createSession({
      customerId,
      applicationKey,
    });

    Verify.mount(containerRef.current, sessionToken);
  };
  const handleVerificationCompleted = (payload) => {
    createCheck({ sessionId: payload.sessionId });
  };
  const handleVerificationCanceled = () => {
    console.log("Verification canceled");
  };

  return (
    <div>
      <button onClick={handleVerificationStarted}>Start verification</button>
      <div ref={containerRef} />
    </div>
  );
}
