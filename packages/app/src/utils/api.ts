import { Auth } from "@calpoly/mustang";

export function authHeaders(): HeadersInit {
  try {
    const user = Auth.AuthenticatedUser.authenticateFromLocalStorage();
    
    return Auth.headers(user);
  } catch {
    return {};
  }
}

export function apiFetch(
  input: RequestInfo | URL,
  init: RequestInit = {}
): Promise<Response> {
  const hdrs = { ...authHeaders(), ...init.headers };
  return fetch(input, { ...init, headers: hdrs });
}

export function getAuthToken(): string | undefined {
  try {
    const user = Auth.AuthenticatedUser.authenticateFromLocalStorage();
    return user.authenticated ? (user as any).token : undefined;
  } catch {
    return undefined;
  }
}

export function authHeadersAlternative(): HeadersInit {
  try {
    const user = Auth.AuthenticatedUser.authenticateFromLocalStorage();
    if (user.authenticated) {
      const payload = Auth.payload(user);
      const token = localStorage.getItem("mu:auth:jwt");
      return token ? { Authorization: `Bearer ${token}` } : {};
    }
    return {};
  } catch {
    return {};
  }
}