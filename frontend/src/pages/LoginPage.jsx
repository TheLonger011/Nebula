import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';
import AuthCard from '../components/auth/AuthCard';
import Input from '../components/ui/Input';
import PasswordInput from '../components/ui/PasswordInput';
import Button from '../components/ui/Button';
import Logo from '../components/brand/Logo';
import { useAuth } from '../store/AuthContext';
import styles from './LoginPage.module.css';

export default function LoginPage() {
    const { login, loading, error } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(form);
            navigate('/app');
        } catch {}
    };

    return (
        <AuthLayout>
            <AuthCard>
                <div className={styles.grid}>
                    <form className={styles.form} onSubmit={onSubmit}>
                        <h1 className={styles.title}>Авторизация</h1>

                        <Input
                            label="почта/username"
                            placeholder="name@company.com"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            autoComplete="username"
                        />

                        <PasswordInput
                            label="пароль"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            autoComplete="current-password"
                        />

                        <Link to="/forgot-password" className={styles.forgot}>
                            Забыли пароль?
                        </Link>

                        {error && <span className={styles.error}>{error}</span>}

                        <div className={styles.actions}>
                            <Button type="submit" loading={loading}>Вход</Button>
                            <span className={styles.registerHint}>
                Нет учётной записи? <Link to="/register">Зарегистрируйся</Link>
              </span>
                        </div>
                    </form>

                    <div className={styles.brand}>
                        <Logo size={96} />
                    </div>
                </div>
            </AuthCard>
        </AuthLayout>
    );
}