import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';
import AuthCard from '../components/auth/AuthCard';
import Input from '../components/ui/Input';
import PasswordInput from '../components/ui/PasswordInput';
import PasswordMeter from '../components/ui/PasswordMeter';
import Button from '../components/ui/Button';
import Stepper from '../components/ui/Stepper';
import { useAuth } from '../store/AuthContext';
import { isUsername } from '../utils/validators';
import styles from './RegisterProfilePage.module.css';

export default function RegisterProfilePage() {
    const navigate = useNavigate();
    const { completeProfile } = useAuth();
    const email = sessionStorage.getItem('nebula_reg_email') || '';

    const [form, setForm] = useState({
        username: '',
        displayName: '',
        password: '',
        confirm: '',
        day: '',
        month: '',
        year: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const masked = email.replace(/^(.{1}).*(@.*)$/, '$1***$2');

    const validate = () => {
        const e = {};
        if (!isUsername(form.username)) e.username = '3–16 символов: латиница, цифры, _';
        if (form.password.length < 8) e.password = 'Минимум 8 символов';
        if (form.password !== form.confirm) e.confirm = 'Пароли не совпадают';
        return e;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const eMap = validate();
        if (Object.keys(eMap).length) return setErrors(eMap);
        setErrors({});
        setLoading(true);
        try {
            await completeProfile({
                username: form.username,
                displayName: form.displayName || form.username,
                password: form.password,
                birthDate: `${form.year}-${form.month}-${form.day}`,
            });
            sessionStorage.removeItem('nebula_reg_email');
            navigate('/app');
        } catch (err) {
            setErrors({ form: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <AuthCard>
                <form className={styles.form} onSubmit={onSubmit}>
                    <h1 className={styles.title}>Расскажите о себе</h1>
                    <p className={styles.subtitle}>Почта {masked} подтверждена. Осталось заполнить профиль.</p>

                    <div className={styles.grid2}>
                        <Input
                            label="username"
                            placeholder="@alina_dev"
                            value={form.username}
                            onChange={(e) => setForm({ ...form, username: e.target.value })}
                            error={errors.username}
                        />
                        <Input
                            label="отображаемое имя"
                            placeholder="Алина"
                            value={form.displayName}
                            onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                        />
                    </div>

                    <div className={styles.grid2}>
                        <div>
                            <PasswordInput
                                label="пароль"
                                placeholder="••••••••"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                error={errors.password}
                            />
                            <PasswordMeter password={form.password} />
                        </div>
                        <PasswordInput
                            label="подтвердите пароль"
                            placeholder="••••••••"
                            value={form.confirm}
                            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                            error={errors.confirm}
                        />
                    </div>

                    <div>
                        <span className={styles.birthLabel}>дата рождения</span>
                        <div className={styles.birth}>
                            <Input placeholder="день" value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })} />
                            <Input placeholder="месяц" value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })} />
                            <Input placeholder="год" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
                        </div>
                    </div>

                    {errors.form && <span className={styles.error}>{errors.form}</span>}

                    <Button type="submit" fullWidth loading={loading}>Зарегистрироваться</Button>

                    <Stepper steps={3} current={3} />

                    <p className={styles.bottom}>После регистрации откроется главная</p>
                </form>
            </AuthCard>
        </AuthLayout>
    );
}