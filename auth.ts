import NextAuth, { DefaultSession } from 'next-auth';
import Kakao from 'next-auth/providers/kakao';

type KakaoAccount = {
  profile_nickname_needs_agreement: boolean;
  profile_image_needs_agreement: boolean;
  profile: {
    nickname: string;
    thumbnail_image_url: string;
    profile_image_url: string;
    is_default_image: boolean;
    is_default_nickname: boolean;
  };
};

declare module 'next-auth' {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      nickname: string;
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession['user'];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Kakao({
      clientId: process.env.AUTH_KAKAO_ID,
      clientSecret: process.env.AUTH_KAKAO_SECRET,
      async profile(profile) {
        return { ...profile };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // 아예 맨 처음부터 회원가입 다시 하고 싶을때 주석 해제
      // await fetch('https://kapi.kakao.com/v1/user/unlink', {
      //   method: 'POST',
      //   headers: {
      //     Authorization: `Bearer ${account?.access_token}`,
      //   },
      // });

      return { ...token, ...user };
    },
    async session({ session, token }) {
      if (token.kakao_account) {
        const account = token.kakao_account as KakaoAccount;
        // 닉네임은 필수로 받았다고 가정
        session.user.nickname = account.profile.nickname;
        // 프로필 이미지는 동의 여부 확인
        if (!account.profile_image_needs_agreement) {
          // 동의했을 때만 이미지 URL 사용
          session.user.image = account.profile.profile_image_url;
        } else {
          // 동의하지 않았을 때는 기본 이미지나 null 사용
          session.user.image = '/default_profile_image.png'; // 또는 기본 이미지 URL
        }
      }
      return session;
    },
  },
});
