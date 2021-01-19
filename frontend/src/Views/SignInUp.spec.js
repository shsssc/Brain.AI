

import signin from './SignInUp';

describe('Signin button', () => {

  it('SignIn page renders a button for signin', () => {
  const button = signin.find('Button').first();
  expect(button).toBeDefined();
});

})
