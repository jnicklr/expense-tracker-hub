import { Injectable } from '@nestjs/common';
import { Registry, collectDefaultMetrics } from 'prom-client';

@Injectable()
export class PrometheusService {
  private readonly register: Registry;

  constructor() {
    this.register = new Registry();
    this.register.setDefaultLabels({
      app: 'nestjs-prometheus',
    });
    collectDefaultMetrics({ register: this.register });
  }

  getMetrics(): Promise<string> {
    return this.register.metrics();
  }
}
