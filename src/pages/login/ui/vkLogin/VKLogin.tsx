import * as VKID from '@vkid/sdk';
import { LoginRequest, useLazyLoginQuery } from 'pages/login/api';
import { generateCodeChallenge, generateCodeVerifier } from 'pages/login/lib';
import { useEffect, useRef } from 'react';

type VKLoginProps = {
  setErr: (err: string) => void;
  login: ReturnType<typeof useLazyLoginQuery>[0];
};

export const VKLogin: React.FC<VKLoginProps> = ({ setErr, login }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  const codeVerifierRef = useRef('');

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const init = async () => {
      const codeVerifier = generateCodeVerifier();
      codeVerifierRef.current = codeVerifier;

      const codeChallenge = await generateCodeChallenge(codeVerifier);
      const state = crypto.randomUUID();

      VKID.Config.init({
        app: 53436063,
        redirectUrl: 'http://localhost',
        responseMode: VKID.ConfigResponseMode.Callback,
        source: VKID.ConfigSource.LOWCODE,
        scope: 'vkid.profile',
        state: state,
        codeChallenge: codeChallenge,
      });

      const oneTap = new VKID.OneTap();

      oneTap
        .render({
          container: containerRef.current!,
          showAlternativeLogin: true,
          scheme: VKID.Scheme.DARK,
        })
        .on(VKID.WidgetEvents.ERROR, () => {
          setErr('Упс, что-то пошло не так...');
        })
        .on(VKID.OneTapInternalEvents.LOGIN_SUCCESS, (payload: any) => {
          const { code, device_id } = payload;

          const requestBody: LoginRequest = {
            code: code,
            deviceID: device_id,
            state: state,
            codeVerifier: codeVerifierRef.current,
          };

          login(requestBody);
        });
    };

    init();
  }, []);

  return <div ref={containerRef} />;
};
