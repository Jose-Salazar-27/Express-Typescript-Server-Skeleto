export const IsEmail = (str: string): boolean => {
  const regex = new RegExp('[a-z0-9]+@[a-z]+.[a-z]{2,3}');
  return regex.test(str);
};

export const IsPassword = (str: string): boolean => {
  const regex = new RegExp('^^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$');
  return regex.test(str);
};
