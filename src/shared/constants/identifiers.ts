const TYPES = {
  UserController: Symbol.for('UserController'),
  UserService: Symbol.for('UserService'),
  UserRepository: Symbol.for('UserRepository'),
  UserRotuer: Symbol.for('UserRouter'),
  Router: Symbol.for('MainRouter'),
  Server: Symbol.for('Server'),
  Authorizer: Symbol.for('Authorizer'),

  Auth: {
    service: Symbol.for('AuthService'),
    controller: Symbol.for('AuthController'),
    router: Symbol.for('AuthRouter'),
  },

  Social_Media: {
    repository: Symbol.for('SocialMediaRepository'),
    service: Symbol.for('SocialMediaService'),
    controller: Symbol.for('SocialMediaController'),
    router: Symbol.for('SocialMediaRouter'),
  },

  client: {
    http: Symbol.for('AxiosInstace'),
    supabase: Symbol.for('SupabaseClient'),
  },

  helpers: {
    email: Symbol.for('EmailTransporter'),
  },
};

export { TYPES };
