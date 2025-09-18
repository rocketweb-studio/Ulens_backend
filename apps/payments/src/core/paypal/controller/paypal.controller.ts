// import {
//   Controller,
//   Post,
//   Body,
//   Get,
//   Param,
//   Query,
//   HttpCode,
//   HttpStatus,
//   Req,
//   Res,
// } from '@nestjs/common';
// import type { Request, Response } from 'express';
// import { PayPalService } from '../paypal.service';
// import {
//   PayPalOrderDto,
//   PayPalCaptureDto,
//   PayPalRefundDto,
// } from '../dto/paypal-payment.dto';
// import { Public } from 'src/auth/decorator/auth.decorator';

// @Controller('payment-gateway/paypal')
// export class PayPalController {
//   constructor(private readonly paypalService: PayPalService) {}

//   @Post('orders')
//   async createOrder(@Body() orderData: PayPalOrderDto) {
//     const result = await this.paypalService.createOrder(orderData);
//     return {
//       success: true,
//       message: 'PayPal order created successfully',
//       data: result,
//     };
//   }

//   @Post('orders/:id/capture')
//   async captureOrder(@Param('id') orderId: string) {
//     const result = await this.paypalService.captureOrder({ orderId });
//     return {
//       success: true,
//       message: 'PayPal order captured successfully',
//       data: result,
//     };
//   }

//   @Post('orders/:id/authorize')
//   async authorizeOrder(@Param('id') orderId: string) {
//     const result = await this.paypalService.authorizeOrder(orderId);
//     return {
//       success: true,
//       message: 'PayPal order authorized successfully',
//       data: result,
//     };
//   }

//   @Get('orders/:id')
//   async getOrder(@Param('id') orderId: string) {
//     const result = await this.paypalService.getOrder(orderId);
//     return {
//       success: true,
//       message: 'PayPal order retrieved successfully',
//       data: result,
//     };
//   }

//   @Post('captures/:id/refund')
//   async refundCapture(
//     @Param('id') captureId: string,
//     @Body() refundData: Omit<PayPalRefundDto, 'captureId'>
//   ) {
//     const result = await this.paypalService.refundCapture({
//       ...refundData,
//       captureId,
//     });
//     return {
//       success: true,
//       message: 'PayPal refund created successfully',
//       data: result,
//     };
//   }

//   @Get('captures/:id')
//   async getCapture(@Param('id') captureId: string) {
//     const result = await this.paypalService.getCapture(captureId);
//     return {
//       success: true,
//       message: 'PayPal capture retrieved successfully',
//       data: result,
//     };
//   }

//   @Get('refunds/:id')
//   async getRefund(@Param('id') refundId: string) {
//     const result = await this.paypalService.getRefund(refundId);
//     return {
//       success: true,
//       message: 'PayPal refund retrieved successfully',
//       data: result,
//     };
//   }

//   @Get('status')
//   getPaymentStatus() {
//     const result = this.paypalService.getPaymentStatus();
//     return {
//       success: true,
//       message: 'PayPal status retrieved successfully',
//       data: result,
//     };
//   }

//   // Webhook endpoints
//   @Public()
//   @Post('webhook')
//   @HttpCode(HttpStatus.OK)
//   async handleWebhook(@Body() data: any, @Res() res: Response) {
//     try {
//       console.log('PayPal webhook received:', data);

//       // Handle different event types
//       const eventType = data.event_type;
//       const resource = data.resource;

//       switch (eventType) {
//         case 'CHECKOUT.ORDER.APPROVED':
//           // Order was approved by the buyer
//           console.log('PayPal order approved:', resource.id);
//           break;

//         case 'PAYMENT.CAPTURE.COMPLETED':
//           // Payment was captured successfully
//           console.log('PayPal payment captured:', resource.id);
//           // Here you would typically:
//           // 1. Update order status to paid
//           // 2. Update inventory
//           // 3. Send confirmation emails
//           // 4. Trigger any other business logic
//           break;

//         case 'PAYMENT.CAPTURE.DENIED':
//           // Payment was denied
//           console.log('PayPal payment denied:', resource.id);
//           break;

//         case 'PAYMENT.CAPTURE.REFUNDED':
//           // Payment was refunded
//           console.log('PayPal payment refunded:', resource.id);
//           break;

//         default:
//           console.log('Unhandled PayPal event type:', eventType);
//       }

//       return res.status(200).send('OK');
//     } catch (error) {
//       console.error('Error handling PayPal webhook:', error);
//       return res.status(200).send('OK'); // Always return OK to prevent retries
//     }
//   }

//   // Return and Cancel URLs
//   @Public()
//   @Get('return')
//   async handleReturn(@Query() query: any, @Res() res: Response) {
//     try {
//       console.log('PayPal return callback:', query);

//       const { token, PayerID } = query;

//       if (token && PayerID) {
//         // Payment was successful, redirect to success page
//         return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/success?token=${token}&payerId=${PayerID}`);
//       }

//       return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/error`);
//     } catch (error) {
//       console.error('Error in PayPal return handler:', error);
//       return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/error`);
//     }
//   }

//   @Public()
//   @Get('cancel')
//   async handleCancel(@Query() query: any, @Res() res: Response) {
//     console.log('PayPal cancel callback:', query);

//     return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/cancelled?token=${query.token}`);
//   }
// }
