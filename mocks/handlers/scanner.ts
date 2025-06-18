import { rest } from 'msw';

const mockScannerEvents = [
  {
    id: 1,
    name: "Summer Music Festival 2024",
    organizerName: "Event Masters",
    startTime: "2024-08-15T18:00:00Z",
    endTime: "2024-08-15T23:00:00Z",
    location: "Marina Bay, Singapore",
    ticketsScanned: 245,
    totalTickets: 500,
    status: "active"
  },
  {
    id: 2,
    name: "Tech Conference 2024",
    organizerName: "Tech Innovators",
    startTime: "2024-09-20T09:00:00Z",
    endTime: "2024-09-20T18:00:00Z",
    location: "Suntec City, Singapore",
    ticketsScanned: 89,
    totalTickets: 200,
    status: "active"
  }
];

export const scannerHandlers = [
  // 扫描器登录
  rest.post('*/scanner/session', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        code: 200,
        message: 'Scanner login successful',
        data: {
          token: 'scanner_token_' + Date.now(),
          user: {
            id: 1,
            username: "scanner_user",
            role: "scanner",
            permissions: ["scan", "verify", "redeem"]
          }
        }
      })
    );
  }),

  // 获取扫描器事件列表
  rest.get('*/scanner/event', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        code: 200,
        message: 'Success',
        data: mockScannerEvents
      })
    );
  }),

  // 验证扫描代码
  rest.post('*/scanner/verify', (req, res, ctx) => {
    // 模拟随机验证结果
    const isValid = Math.random() > 0.2; // 80% 成功率
    
    if (isValid) {
      return res(
        ctx.status(200),
        ctx.json({
          code: 200,
          message: 'Ticket verified successfully',
          data: {
            ticketId: "TICKET_12345",
            eventName: "Summer Music Festival 2024",
            ticketType: "General Admission",
            holderName: "John Doe",
            holderEmail: "john@example.com",
            seatNumber: null,
            status: "valid",
            scanTime: new Date().toISOString()
          }
        })
      );
    } else {
      return res(
        ctx.status(400),
        ctx.json({
          code: 400,
          message: 'Invalid or already used ticket',
          data: { 
            valid: false,
            reason: "Ticket has already been scanned"
          }
        })
      );
    }
  }),

  // 兑换扫描代码
  rest.put('*/scanner/redeem/:redeemCode', (req, res, ctx) => {
    const { redeemCode } = req.params;
    
    return res(
      ctx.status(200),
      ctx.json({
        code: 200,
        message: 'Ticket redeemed successfully',
        data: {
          redeemCode: redeemCode,
          eventName: "Summer Music Festival 2024",
          ticketType: "VIP Pass",
          redemptionTime: new Date().toISOString(),
          benefits: [
            "Backstage access",
            "Complimentary drinks",
            "VIP parking"
          ]
        }
      })
    );
  }),

  // 检查事件状态
  rest.get('*/admin/event/:eventId', (req, res, ctx) => {
    const { eventId } = req.params;
    const event = mockScannerEvents.find(e => e.id.toString() === eventId);
    
    return res(
      ctx.status(200),
      ctx.json({
        code: 200,
        message: 'Success',
        data: event || mockScannerEvents[0]
      })
    );
  }),

  // 验证票务（管理员）
  rest.post('*/admin/event/:eventId/verify', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        code: 200,
        message: 'Admin verification successful',
        data: {
          verified: true,
          verificationTime: new Date().toISOString(),
          verifiedBy: "admin_user"
        }
      })
    );
  }),

  // 兑换票务（管理员）
  rest.delete('*/admin/user/ticket/:redeemCode', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        code: 200,
        message: 'Admin redemption successful',
        data: {
          redeemed: true,
          redemptionTime: new Date().toISOString(),
          redeemedBy: "admin_user"
        }
      })
    );
  })
]; 