import { $Enums } from '@prisma/client';
import NextAuth, { DefaultSession } from 'next-auth';
import Kakao from 'next-auth/providers/kakao';
import prisma from './lib/prisma';

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
      role: $Enums.Role;
      image: string | null;
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession['user'];
  }

  interface Profile {
    connected_at: string;
    properties: {
      nickname: string;
      profile_image?: string;
      thumbnail_image?: string;
    };
    kakao_account: {
      profile_nickname_needs_agreement?: boolean;
      profile_image_needs_agreement?: boolean;
      profile?: {
        nickname: string;
        thumbnail_image_url?: string;
        profile_image_url?: string;
        is_default_image?: boolean;
        is_default_nickname?: boolean;
      };
      email?: string;
      email_needs_agreement?: boolean;
    };
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
    async signIn({ account, profile }) {
      if (account?.provider === 'kakao' && profile) {
        try {
          await prisma.user.upsert({
            where: {
              nickname: profile.properties.nickname,
            },
            update: {
              image: profile.properties.profile_image || null,
            },
            create: {
              nickname: profile.properties.nickname,
              image: profile.properties.profile_image || null,
              email: profile.kakao_account?.email,
              role: 'UNKNOWN',
            },
          });
          return true;
        } catch (error) {
          console.error('Error in signIn callback:', error);
          return false;
        }
      }
      return false;
    },
    async jwt({ token, user }) {
      try {
        if (token.kakao_account && !token.role) {
          // role이 없을 때만 API 호출
          const nickname = (token.kakao_account as KakaoAccount).profile
            .nickname;

          const response = await fetch(
            `${process.env.AUTH_URL}/api/user?nickname=${encodeURIComponent(
              nickname
            )}`
          );

          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }

          const userData = await response.json();
          token.role = userData.role; // token에 role 저장
        }
      } catch (error) {
        console.error('Error in jwt callback:', error);
        throw error;
      }

      return { ...token, ...user };
    },
    async session({ session, token }) {
      if (token.kakao_account) {
        const account = token.kakao_account as KakaoAccount;
        session.user.nickname = account.profile.nickname;

        if (!account.profile_image_needs_agreement) {
          session.user.image = account.profile.profile_image_url;
        } else {
          session.user.image = null;
        }

        // token에 저장된 role 사용
        session.user.role = token.role as $Enums.Role;
      }

      return session;
    },
  },
});
