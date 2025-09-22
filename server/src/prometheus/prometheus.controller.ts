import { Controller, Get, Res } from '@nestjs/common';
import * as express from 'express';
import { PrometheusService } from './prometheus.service';

@Controller('metrics')
export class PrometheusController {
  constructor(private readonly prometheusService: PrometheusService) {}

  @Get()
  async findAll(@Res() res: express.Response) {
    const metrics = await this.prometheusService.getMetrics();
    console.log('teste');
    res.setHeader('Content-Type', 'text/plain');
    res.send(metrics);
  }
}
