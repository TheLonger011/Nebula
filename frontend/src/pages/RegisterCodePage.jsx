import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';
import AuthCard from '../components/auth/AuthCard';
import CodeInput from '../components/ui/CodeInput';
import Button from '../components/ui/Button';
import Stepper from '../components/ui/Stepper';
import { authApi } from '../api/authApi';
import styles from './RegisterCodePage.module.css';

export default function RegisterCodePage() {
    const navigate = useNavigate();
    const email = sessionStorage.getItem('nebula_reg_email') || '';
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [attempts, setAttempts] = useState(5);
    const [seconds, setSeconds] = useState(42);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (seconds <= 0) return;
        const t = setInterval(() => setSeconds((s) => s - 1), 1000);
        return () => clearInterval(t);
    }, [seconds]);

    const masked = email.replace(/^(.{1}).*(@.*)$/, '$1***$2');

    const onSubmit = async (e) => {
        e.preventDefault();
        if (code.length !== 6) return setError('Введите 6 цифр');
        setError('');
        setLoading(true);
        try {
            await authApi.verifyEmail({ email, code });
            navigate('/register/profile');
        } catch (err) {
            setError(err.message);
            setAttempts((a) => Math.max(0, a - 1));
        } finally {
            setLoading(false);
        }
    };

    const resend = () => {
        setSeconds(42);
        setError('');
    };

    return (
        <AuthLayout>
            <AuthCard>
                <form className={styles.form} onSubmit={onSubmit}>
                    <h1 className={styles.title}>Подтвердите почту</h1>
                    <p className={styles.subtitle}>
                        Код отправлен на {masked}. Он действует 10 минут.
                    </p>

                    <CodeInput length={6} value={code} onChange={setCode} />

                    {error && <span className={styles.error}>{error}</span>}

                    <span className={styles.attempts}>Осталось попыток: {attempts}</span>

                    {seconds > 0 ? (
                        <span className={styles.timer}>
              Отправить снова через 0:{seconds.toString().padStart(2, '0')}
            </span>
                    ) : (
                        <button type="button" className={styles.resend} onClick={resend}>
                            Отправить код снова
                        </button>
                    )}

                    <Button type="submit" fullWidth loading={loading}>Подтвердить</Button>

                    <Stepper steps={3} current={2} />

                    <p className={styles.bottom}>
                        Уже есть аккаунт? <Link to="/">Войти</Link>
                    </p>
                </form>
            </AuthCard>
        </AuthLayout>
    );
}
