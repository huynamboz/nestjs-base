import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UserService } from '../user/user.service';
import { SepayWebhookDto } from './dto/sepay-webhook.dto';

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(private readonly userService: UserService) {}

  @Post('sepay')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'SePay webhook endpoint' })
  @ApiBody({ type: SepayWebhookDto })
  @ApiResponse({
    status: 200,
    description: 'Webhook processed successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Points added successfully' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async handleSepayWebhook(@Body() webhookData: SepayWebhookDto) {
    this.logger.log(`Received SePay webhook: ${JSON.stringify(webhookData)}`);

    // Chỉ xử lý giao dịch tiền vào
    if (webhookData.transferType !== 'in') {
      this.logger.warn(
        `Ignoring transaction type: ${webhookData.transferType}`,
      );
      return {
        success: true,
        message: 'Transaction ignored (not incoming)',
      };
    }

    // Tìm user dựa vào payment code (6-8 ký tự alphanumeric)
    let paymentCode: string | null = null;
    let userId: string | null = null;

    // Ưu tiên tìm payment code với format PTB + code trong field 'code'
    if (webhookData.code) {
      // Format: PTB + payment code (8 ký tự alphanumeric)
      const ptbCodeRegex = /^PTB([a-z0-9]{8})$/i;
      const match = webhookData.code.match(ptbCodeRegex);
      if (match) {
        paymentCode = match[1].toLowerCase();
        this.logger.log(
          `Found payment code in code field (PTB format): ${paymentCode}`,
        );
      } else {
        // Nếu không phải PTB format, thử payment code trực tiếp (6-8 ký tự)
        const paymentCodeRegex = /^[a-z0-9]{6,8}$/i;
        if (paymentCodeRegex.test(webhookData.code)) {
          paymentCode = webhookData.code.toLowerCase();
          this.logger.log(`Found payment code in code field: ${paymentCode}`);
        } else {
          // Nếu không phải payment code format, có thể là UUID (backward compatibility)
          const uuidRegex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
          if (uuidRegex.test(webhookData.code)) {
            userId = webhookData.code;
            this.logger.log(`Found UUID in code field: ${userId}`);
          }
        }
      }
    }

    // Nếu chưa tìm thấy, thử tìm payment code với format PTB trong content
    if (!paymentCode && !userId && webhookData.content) {
      // Tìm format PTB + payment code (8 ký tự) trong content
      const ptbCodeRegex = /PTB([a-z0-9]{8})/gi;
      const ptbMatches = webhookData.content.match(ptbCodeRegex);
      if (ptbMatches && ptbMatches.length > 0) {
        // Lấy payment code từ match đầu tiên
        const match = ptbMatches[0].match(/PTB([a-z0-9]{8})/i);
        if (match) {
          paymentCode = match[1].toLowerCase();
          this.logger.log(
            `Found payment code in content (PTB format): ${paymentCode}`,
          );
        }
      }

      // Nếu chưa tìm thấy PTB format, thử tìm payment code trực tiếp (6-8 ký tự)
      if (!paymentCode) {
        const paymentCodeRegex = /[a-z0-9]{6,8}/gi;
        const matches = webhookData.content.match(paymentCodeRegex);
        if (matches && matches.length > 0) {
          // Lấy match đầu tiên có độ dài 6-8 ký tự
          for (const match of matches) {
            if (match.length >= 6 && match.length <= 8) {
              paymentCode = match.toLowerCase();
              this.logger.log(`Found payment code in content: ${paymentCode}`);
              break;
            }
          }
        }
      }

      // Nếu vẫn chưa tìm thấy payment code, thử tìm UUID (backward compatibility)
      if (!paymentCode) {
        const uuidRegex =
          /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;
        const uuidMatches = webhookData.content.match(uuidRegex);
        if (uuidMatches && uuidMatches.length > 0) {
          userId = uuidMatches[0];
          this.logger.log(`Found UUID in content: ${userId}`);
        }
      }
    }

    if (!paymentCode && !userId) {
      this.logger.error(
        `Could not find payment code or user ID in webhook data. Code: ${webhookData.code}, Content: ${webhookData.content}`,
      );
      throw new BadRequestException(
        'Payment code or User ID not found in webhook data. Please include payment code (6-8 alphanumeric characters) in code or content field.',
      );
    }

    // Tìm user và cộng points
    try {
      let finalUserId: string;

      if (paymentCode) {
        // Tìm user bằng payment code
        const user = await this.userService.findByPaymentCode(paymentCode);
        if (!user) {
          throw new NotFoundException(
            `User with payment code ${paymentCode} not found`,
          );
        }
        finalUserId = user.id;
        this.logger.log(
          `Found user by payment code ${paymentCode}: ${user.email} (${user.id})`,
        );
      } else if (userId) {
        // Tìm user bằng UUID (backward compatibility)
        const user = await this.userService.findOne(userId);
        finalUserId = userId;
        this.logger.log(`Found user by UUID: ${user.email}`);
      } else {
        throw new BadRequestException('Unable to determine user');
      }

      // Chuyển đổi transferAmount từ VND sang points (1 VND = 1 point)
      // Nếu cần tỷ lệ khác, có thể config
      const pointsToAdd = Math.floor(webhookData.transferAmount);

      // Cộng points vào user (method này sẽ trả về user đã được cập nhật)
      const updatedUser = await this.userService.addPoints(finalUserId, {
        points: pointsToAdd,
      });

      this.logger.log(
        `Added ${pointsToAdd} points to user ${finalUserId} (${updatedUser.email}). New balance: ${updatedUser.points}`,
      );

      return {
        success: true,
        message: 'Points added successfully',
        userId: finalUserId,
        paymentCode: paymentCode || null,
        pointsAdded: pointsToAdd,
        newBalance: updatedUser.points,
        transactionId: webhookData.id,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        const identifier = paymentCode || userId;
        this.logger.error(`User not found: ${identifier}`);
        throw new NotFoundException(
          `User not found with ${paymentCode ? 'payment code' : 'ID'}: ${identifier}`,
        );
      }
      throw error;
    }
  }
}
