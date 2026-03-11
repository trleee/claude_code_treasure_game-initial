// localStorage-based implementation (no backend required)

interface StoredUser {
  username: string;
  passwordHash: string;
}

interface StoredScore {
  username: string;
  score: number;
  treasureFound: boolean;
  playedAt: string;
}

function getCurrentUser(): string | null {
  return localStorage.getItem('current_user');
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function getUsers(): StoredUser[] {
  const raw = localStorage.getItem('users');
  return raw ? JSON.parse(raw) : [];
}

function getGameScores(): StoredScore[] {
  const raw = localStorage.getItem('game_scores');
  return raw ? JSON.parse(raw) : [];
}

export async function signup(username: string, password: string) {
  const users = getUsers();
  if (users.find(u => u.username === username)) {
    throw new Error('此使用者名稱已被使用');
  }
  const passwordHash = await hashPassword(password);
  users.push({ username, passwordHash });
  localStorage.setItem('users', JSON.stringify(users));
  return { token: 'local', username };
}

export async function signin(username: string, password: string) {
  const users = getUsers();
  const passwordHash = await hashPassword(password);
  const user = users.find(u => u.username === username && u.passwordHash === passwordHash);
  if (!user) {
    throw new Error('使用者名稱或密碼錯誤');
  }
  return { token: 'local', username };
}

export async function saveGameScore(score: number, treasureFound: boolean) {
  const username = getCurrentUser();
  if (!username) {
    throw new Error('未登入');
  }
  const scores = getGameScores();
  scores.push({
    username,
    score,
    treasureFound,
    playedAt: new Date().toISOString(),
  });
  localStorage.setItem('game_scores', JSON.stringify(scores));
  return { success: true };
}

export async function getScores() {
  const username = getCurrentUser();
  if (!username) {
    throw new Error('未登入');
  }
  const scores = getGameScores();
  return scores
    .filter(s => s.username === username)
    .sort((a, b) => new Date(b.playedAt).getTime() - new Date(a.playedAt).getTime())
    .slice(0, 50);
}
