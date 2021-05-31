const generateToken = () => {
  return Math.random().toString(36).substr(2);
};

export const getToken = () => {
  let token = localStorage.getItem('token');
  if (token === undefined) {
    localStorage.setItem('token', generateToken());
    token = localStorage.getItem('token');
  }
  return token;
};
