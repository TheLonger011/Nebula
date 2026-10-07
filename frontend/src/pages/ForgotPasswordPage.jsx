import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';
import AuthCard from '../components/auth/AuthCard';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Stepper from '../components/ui/Stepper';
import { authApi } from '../api/authApi';
import { isEmail } from '../utils/validators';
import styles from './ForgotPasswordPage.module.css';

export default function ForgotPasswordPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!isEmail(email)) return setError('Некорректный адрес');
        setError('');
        setLoading(true);
        try {
            await authApi.forgotPassword({ email });
            sessionStorage.setItem('nebula_reset_email', email);
            navigate('/forgot-password/verify');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <AuthCard>
                <form className={styles.form} onSubmit={onSubmit}>
                    <h1 className={styles.title}>Восстановление пароля</h1>
                    <p className={styles.subtitle}>
                        Введите почту аккаунта. Пришлём код, затем вы зададите новый пароль.
                    </p>

                    <Input
                        label="почта"
                        placeholder="name@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={error}
                    />

                    <Button type="submit" fullWidth loading={loading}>Получить код</Button>

                    <Stepper steps={3} current={1} />

                    <p className={styles.bottom}>
                        <Link to="/">Вернуться ко входу</Link>
                    </p>
                </form>
            </AuthCard>
        </AuthLayout>
    );
}