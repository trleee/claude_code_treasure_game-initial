const API_BASE = 'http://localhost:3001/api';

function getToken(): string | null {
  return localStorage.getItem('auth_token');
}

async function fetchAPI(path: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || '發生錯誤');
  }
  return data;
}

export async function signup(username: string, password: string) {
  return fetchAPI('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export async function signin(username: string, password: string) {
  return fetchAPI('/auth/signin', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export async function saveGameScore(score: number, treasureFound: boolean) {
  return fetchAPI('/scores', {
    method: 'POST',
    body: JSON.stringify({ score, treasureFound }),
  });
}

export async function getScores() {
  return fetchAPI('/scores');
}
