import { Router } from 'express';

export abstract class BaseRouter {
  protected router: Router;
  protected controller;

  constructor(controller: any) {
    this.router = Router();
    this.controller = new controller();
    this.initRoutes();
  }

  protected abstract initRoutes(): void;

  public getRouter(): Router {
    return this.router;
  }
}
