import NextAuth from 'next-auth';
import Kakao from 'next-auth/providers/kakao';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Kakao({
      async profile(profile) {
        return { ...profile };
      },
    }),
  ],
});
