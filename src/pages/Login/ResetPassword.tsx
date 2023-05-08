import { useAppDispatch } from '@/hooks/useRedux';
import { changeLoginStatus } from '@/store/stateSlice';
import styles from './Login.module.css';
import { Input } from '@/components/BasicComponents/Input';
import { Link } from '@/components/BasicComponents/Link';
import { Button } from '@/components/BasicComponents/Button';
import { sendPasswordReset } from '@/db';
import { ChangeEvent, useState } from 'react';

export const ResetPassword = () => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');

  const onEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setEmail(value);
  };

  return (
    <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
      <Input
        type="email"
        label="Email"
        pattern="^(?:[a-z0-9!#$%&'*+/=?^{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_{|}~-]+)|(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\[\x01-\x09\x0b\x0c\x0e-\x7f])_)@(?:(?:a-z0-9?.)+a-z0-9?|[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\[\x01-\x09\x0b\x0c\x0e-\x7f])+)])$"
        onChange={(e) => {
          onEmailChange(e);
        }}
      />
      <Button
        type="submit"
        buttonClass={styles.submitButton}
        text="Send me a password"
        onClick={() => sendPasswordReset(email)}
      />
      <Link
        linkStyle="bold"
        text="Return"
        onClick={() => {
          dispatch(changeLoginStatus({ status: 'sign-in' }));
        }}
      />
    </form>
  );
};
