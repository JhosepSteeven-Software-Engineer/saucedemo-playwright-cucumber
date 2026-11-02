export interface TestUser {
  username: string;
  password: string;
}

export const USERS: Record<string, TestUser> = {
  standard_user: {
    username: 'standard_user',
    password: 'secret_sauce',
  },
  locked_out_user: {
    username: 'locked_out_user',
    password: 'secret_sauce',
  },
};

export function getUser(username: string): TestUser {
  const user = USERS[username];

  if (!user) {
    throw new Error(`Usuario no configurado en los datos de prueba: ${username}`);
  }

  return user;
}
