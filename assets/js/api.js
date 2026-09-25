import { API_BASE } from "./config.js";

export class APIClient {
  constructor(baseURL = API_BASE) {
    this.baseURL = baseURL.replace(/\/$/, "");
  }

  async request(path, options = {}) {
    const response = await fetch(`${this.baseURL}${path}`, {
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
      ...options
    });
    const text = await response.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch { data = text; }
    if (!response.ok) {
      const message = data?.message || data?.content || `HTTP ${response.status}`;
      throw new Error(message);
    }
    return data;
  }

  get(path) { return this.request(path); }
  post(path, body) { return this.request(path, { method: "POST", body: JSON.stringify(body) }); }
  put(path, body) { return this.request(path, { method: "PUT", body: JSON.stringify(body) }); }
  delete(path) { return this.request(path, { method: "DELETE" }); }
}

export const api = new APIClient();

export function unwrap(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload?.content && Array.isArray(payload.content)) return payload.content;
  if (payload?.data && Array.isArray(payload.data)) return payload.data;
  if (payload?.result && Array.isArray(payload.result)) return payload.result;
  if (payload?.data) return payload.data;
  if (payload?.result) return payload.result;
  return payload;
}
