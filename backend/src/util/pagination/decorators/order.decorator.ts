import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';

export interface Ordering {
  property: string;
  direction: string;
}

export const OrderingParams = createParamDecorator(
  (validParams, ctx: ExecutionContext): Ordering => {
    const req: Request = ctx.switchToHttp().getRequest();
    const order = req.query.order as string;
    if (!order) return null;

    // check if the valid params sent is an array
    if (typeof validParams != 'object')
      throw new BadRequestException('Invalid order parameter');

    // check the format of the order query param
    const orderPattern = /^([a-zA-Z0-9]+):(asc|desc)$/;
    if (!order.match(orderPattern))
      throw new BadRequestException('Invalid order parameter');

    // extract the property name and direction and check if they are valid
    const [property, direction] = order.split(':');
    if (!validParams.includes(property))
      throw new BadRequestException(`Invalid order property: ${property}`);

    return { property, direction };
  },
);
