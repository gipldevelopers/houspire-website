import { redirect } from 'next/navigation';
import { HOUSPIRE_SIGN_IN_URL } from '@/lib/external-links';

export default function Login() {
  redirect(HOUSPIRE_SIGN_IN_URL);
}
