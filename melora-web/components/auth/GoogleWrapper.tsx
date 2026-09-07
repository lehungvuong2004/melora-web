"use client";

import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = "1081435110351-4t3edbcl5pl7jrokshub1pghvkqod35u.apps.googleusercontent.com";

export default function GoogleWrapper({ children }: { children: React.ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      {children}
    </GoogleOAuthProvider>
  );
}
