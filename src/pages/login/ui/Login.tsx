import React, { useState, useEffect } from 'react';
import s from './Login.module.scss';

export const Login = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [titleBlack, setTitle] = useState<string>('Вход в');
    const [titleBlue, setTitleBlue] = useState<string>('Encounterium');
    const [buttonText, setButtonText] = useState<string>('Войти');
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const checkAuth = async () => {
            // Логика проверки авторизации
        };

        checkAuth();
    }, []);

    if (isAuthenticated) {
        // Логика для авторизованного пользователя
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Логика обработки формы
    };

    return (
        <div className={s['main-page']}>
            <div className={s['auth-page']}>
                <div className={s['auth-form']}>
                    <div className={s['auth-form__main']}>
                        <a href="{{urlMain}}" data-url="{{urlMain}}">
                            <img
                                className={s.logo}
                                src="/images/image.png"
                                alt="Logo Image"
                            />
                        </a>
                        <p className={s['auth-form__title']}>
                            {titleBlack} <span>{titleBlue}</span>
                        </p>
                        <form className={s.form} onSubmit={handleSubmit}>
                            <div className={s['form__input']}>
                                <input
                                    name="login"
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Логин"
                                />
                            </div>
                            <div className={s['form__input']}>
                                <input
                                    name="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Пароль"
                                />
                            </div>
                            <button type="submit" className={`${s['form__btn']} ${s['btn-primary']}`}>
                                {buttonText}
                            </button>
                        </form>
                        <div className={s.error}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
