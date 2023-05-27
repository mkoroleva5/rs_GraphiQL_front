import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './useRedux';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { changeIsUserLogged, changeUserName } from '@/store/userSlice';

export const useAuthListener = () => {
  const isLogged = useAppSelector((state) => state.userState.isUserLogged);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const isUserAuth = useRef(false);
  const isUserWillNavigate = isLogged && location.pathname === '/editor';

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(changeIsUserLogged(true));
        dispatch(changeUserName(user.displayName ?? 'name'));
        return (isUserAuth.current = true);
      }
      if (isUserWillNavigate) {
        navigate('/');
        dispatch(changeIsUserLogged(false));
        dispatch(changeUserName(''));
      }
      return (isUserAuth.current = false);
    });
    return unsubscribe;
  }, [dispatch, isUserWillNavigate, navigate]);

  return isUserAuth.current;
};
