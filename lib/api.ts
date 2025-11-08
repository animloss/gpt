export async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {})
    },
    credentials: "include"
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.mesaj || "Beklenmeyen hata");
  }

  return res.json();
}
