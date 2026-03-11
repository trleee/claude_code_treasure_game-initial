import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { getScores } from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AuthForm {
  username: string;
  password: string;
}

interface ScoreRecord {
  score: number;
  treasureFound: boolean;
  playedAt: string;
}

export default function AuthButton() {
  const { user, isAuthenticated, signin, signup, signout } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [scoresOpen, setScoresOpen] = useState(false);
  const [scores, setScores] = useState<ScoreRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const signinForm = useForm<AuthForm>();
  const signupForm = useForm<AuthForm>();

  const handleSignin = async (data: AuthForm) => {
    console.log('[AuthButton] handleSignin called', data);
    setLoading(true);
    try {
      await signin(data.username, data.password);
      toast.success('登入成功！');
      setDialogOpen(false);
      signinForm.reset();
    } catch (e: any) {
      const msg = e?.message || '登入失敗，請稍後再試';
      console.error('[AuthButton] signin error:', e);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (data: AuthForm) => {
    console.log('[AuthButton] handleSignup called', data);
    setLoading(true);
    try {
      await signup(data.username, data.password);
      toast.success('註冊成功！');
      setDialogOpen(false);
      signupForm.reset();
    } catch (e: any) {
      const msg = e?.message || '註冊失敗，請稍後再試';
      console.error('[AuthButton] signup error:', e);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleViewScores = async () => {
    try {
      const data = await getScores();
      setScores(data);
      setScoresOpen(true);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleSignout = () => {
    signout();
    toast.success('已登出');
  };

  if (isAuthenticated) {
    return (
      <>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: '#78350f', fontWeight: 600, fontSize: '0.875rem' }}>{user}</span>
          <button
            onClick={handleViewScores}
            style={{
              padding: '0.375rem 0.75rem',
              fontSize: '0.8125rem',
              backgroundColor: '#fef3c7',
              border: '1px solid #f59e0b',
              borderRadius: '0.375rem',
              color: '#78350f',
              cursor: 'pointer',
            }}
          >
            分數歷史
          </button>
          <button
            onClick={handleSignout}
            style={{
              padding: '0.375rem 0.75rem',
              fontSize: '0.8125rem',
              backgroundColor: '#fee2e2',
              border: '1px solid #f87171',
              borderRadius: '0.375rem',
              color: '#991b1b',
              cursor: 'pointer',
            }}
          >
            登出
          </button>
        </div>

        <Dialog open={scoresOpen} onOpenChange={setScoresOpen}>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>分數歷史</DialogTitle>
            </DialogHeader>
            {scores.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">尚無遊戲紀錄</p>
            ) : (
              <div className="space-y-2">
                {scores.map((s) => (
                  <div key={s.id} className="flex justify-between items-center p-3 rounded-lg bg-amber-50 border border-amber-200">
                    <div>
                      <span className={`font-bold ${s.score >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${s.score}
                      </span>
                      <span className="ml-2 text-sm">
                        {s.treasureFound ? '找到寶藏' : '未找到寶藏'}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(s.playedAt).toLocaleString('zh-TW')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-amber-100 border-amber-400 text-amber-900 hover:bg-amber-200">
          登入
        </Button>
      </DialogTrigger>
      <DialogContent style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem', gap: '1.5rem' }}>
        <DialogHeader>
          <DialogTitle>登入 / 註冊</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="signin">
          <TabsList className="w-full">
            <TabsTrigger value="signin">登入</TabsTrigger>
            <TabsTrigger value="signup">註冊</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <form onSubmit={signinForm.handleSubmit(handleSignin)} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.25rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                <Label htmlFor="signin-username">使用者名稱</Label>
                <Input
                  id="signin-username"
                  {...signinForm.register('username', { required: '請輸入使用者名稱' })}
                  placeholder="輸入使用者名稱"
                />
                {signinForm.formState.errors.username && (
                  <span style={{ color: '#dc2626', fontSize: '0.875rem' }}>{signinForm.formState.errors.username.message}</span>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                <Label htmlFor="signin-password">密碼</Label>
                <Input
                  id="signin-password"
                  type="password"
                  {...signinForm.register('password', { required: '請輸入密碼' })}
                  placeholder="輸入密碼"
                />
                {signinForm.formState.errors.password && (
                  <span style={{ color: '#dc2626', fontSize: '0.875rem' }}>{signinForm.formState.errors.password.message}</span>
                )}
              </div>
              <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700" disabled={loading}>
                {loading ? '處理中...' : '登入'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={signupForm.handleSubmit(handleSignup)} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.25rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                <Label htmlFor="signup-username">使用者名稱</Label>
                <Input
                  id="signup-username"
                  {...signupForm.register('username', {
                    required: '請輸入使用者名稱',
                    minLength: { value: 3, message: '使用者名稱至少 3 個字元' },
                    maxLength: { value: 20, message: '使用者名稱最多 20 個字元' },
                  })}
                  placeholder="3-20 個字元"
                />
                {signupForm.formState.errors.username && (
                  <span style={{ color: '#dc2626', fontSize: '0.875rem' }}>{signupForm.formState.errors.username.message}</span>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                <Label htmlFor="signup-password">密碼</Label>
                <Input
                  id="signup-password"
                  type="password"
                  {...signupForm.register('password', {
                    required: '請輸入密碼',
                    minLength: { value: 6, message: '密碼至少 6 個字元' },
                  })}
                  placeholder="至少 6 個字元"
                />
                {signupForm.formState.errors.password && (
                  <span style={{ color: '#dc2626', fontSize: '0.875rem' }}>{signupForm.formState.errors.password.message}</span>
                )}
              </div>
              <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700" disabled={loading}>
                {loading ? '處理中...' : '註冊'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
