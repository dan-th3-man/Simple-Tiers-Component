'use client';

import { PrivyProvider as Provider, User } from '@privy-io/react-auth';
import { PropsWithChildren } from 'react';

export function PrivyProvider({ children }: PropsWithChildren) {

  return (
    <Provider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      onSuccess={(user: User) => {
        console.log(`User ${user.id} logged in!`);
      }}
      config={{
        loginMethods: ['email', 'wallet', 'discord', 'google'],
        appearance: {
          theme: 'dark',
          accentColor: '#9333EA', // Purple-600
          showWalletLoginFirst: false,
        }
      }}
    >
      {children}
    </Provider>
  );
} 