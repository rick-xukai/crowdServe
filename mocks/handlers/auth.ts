import { rest } from 'msw';

// Mock user data - fixed account for demo
const mockUser = {
  id: 1,
  email: 'demo@crowdserve.com',
  firstName: 'Demo',
  lastName: 'User',
  profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
  phoneNumber: '+6512345678',
  phoneShortCode: '+65',
  genderId: 1,
  birthday: '1990-01-01',
  country: 'Singapore',
  isActivated: true,
  createdAt: '2023-01-01T00:00:00Z',
  status: 1,
  emailVerified: true,
  phoneVerified: true,
};

// Fixed credentials for demo
const DEMO_EMAIL = 'demo@crowdserve.com';
const DEMO_PASSWORD = 'password123';

export const authHandlers = [
  // 用户登录 - 支持邮箱和Google登录
  rest.post('*/api/v1/user/session', async (req, res, ctx) => {
    const body = await req.json();
    const { email, password, externalChannel, externalId } = body;

    // Google登录
    if (externalChannel === 'google' && externalId) {
      return res(
        ctx.status(200),
        ctx.json({
          code: 200,
          message: 'Google login successful',
          data: {
            token: 'mock_jwt_token_google_' + Date.now(),
            user: {
              ...mockUser,
              email: 'demo@crowdserve.com', // 固定使用demo账号
            },
          },
        })
      );
    }

    // 邮箱登录验证
    if (externalChannel === 'email' || !externalChannel) {
      if (!email || !password) {
        return res(
          ctx.status(400),
          ctx.json({
            code: 400,
            message: 'Email and password are required',
            data: null,
          })
        );
      }

      // 验证固定账号
      if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
        return res(
          ctx.status(200),
          ctx.json({
            code: 200,
            message: 'Login successful',
            data: {
              token: 'mock_jwt_token_email_' + Date.now(),
              user: mockUser,
            },
          })
        );
      }

      // 账号不存在的情况 - 需要激活
      // if (email !== DEMO_EMAIL) {
      //   return res(
      //     ctx.status(400),
      //     ctx.json({
      //       code: 1001,
      //       message: 'Account does not exist or needs activation',
      //       data: null,
      //     })
      //   );
      // }

      // 密码错误
      return res(
        ctx.status(400),
        ctx.json({
          code: 401,
          message: 'Invalid email or password',
          data: null,
        })
      );
    }

    return res(
      ctx.status(400),
      ctx.json({
        code: 400,
        message: 'Invalid login method',
        data: null,
      })
    );
  }),

  // 用户注册
  rest.post('*/api/v1/user', async (req, res, ctx) => {
    const body = await req.json();
    const { email, password, code, firstName, lastName, externalChannel, externalId } = body;

    // Google注册
    if (externalChannel === 'google' && externalId) {
      return res(
        ctx.status(200),
        ctx.json({
          code: 200,
          message: 'Google registration successful',
          data: {
            token: 'mock_jwt_token_google_register_' + Date.now(),
            user: {
              ...mockUser,
              firstName: firstName || 'Demo',
              lastName: lastName || 'User',
              email: email || 'demo@crowdserve.com',
            },
          },
        })
      );
    }

    // 邮箱注册
    if (!email) {
      return res(
        ctx.status(400),
        ctx.json({
          code: 400,
          message: 'Email is required',
          data: null,
        })
      );
    }

    // 模拟邮箱已存在
    if (email === DEMO_EMAIL) {
      return res(
        ctx.status(400),
        ctx.json({
          code: 409,
          message: 'Email already exists',
          data: null,
        })
      );
    }

    // 验证码验证
    if (!code || code !== '123456') {
      return res(
        ctx.status(400),
        ctx.json({
          code: 400,
          message: 'Invalid verification code',
          data: null,
        })
      );
    }

    return res(
      ctx.status(200),
      ctx.json({
        code: 200,
        message: 'Registration successful',
        data: {
          token: 'mock_jwt_token_register_' + Date.now(),
          user: {
            ...mockUser,
            email: email,
            firstName: firstName || 'New',
            lastName: lastName || 'User',
          },
        },
      })
    );
  }),

  // 发送验证码
  rest.post('*/api/v1/user/verification', async (req, res, ctx) => {
    const body = await req.json();
    const { email, type } = body;

    if (!email) {
      return res(
        ctx.status(400),
        ctx.json({
          code: 400,
          message: 'Email is required',
          data: null,
        })
      );
    }

    // 模拟发送验证码成功
    return res(
      ctx.status(200),
      ctx.json({
        code: 200,
        message: 'Verification code sent successfully. Use code: 123456',
        data: { 
          success: true,
          // 在开发环境下显示验证码
          ...(process.env.NODE_ENV === 'development' && { code: '123456' })
        },
      })
    );
  }),

  // 验证用户
  rest.post('*/api/v1/user/status/verify', async (req, res, ctx) => {
    const body = await req.json();
    const { email, firstName, lastName } = body;

    if (!email) {
      return res(
        ctx.status(400),
        ctx.json({
          code: 400,
          message: 'Email is required',
          data: null,
        })
      );
    }

    return res(
      ctx.status(200),
      ctx.json({
        code: 200,
        message: 'User verified successfully',
        data: { 
          verified: true,
          user: {
            email,
            firstName: firstName || 'Demo',
            lastName: lastName || 'User',
          }
        },
      })
    );
  }),

  // 忘记密码 - 发送重置链接
  rest.delete('*/api/v1/user/password', async (req, res, ctx) => {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return res(
        ctx.status(400),
        ctx.json({
          code: 400,
          message: 'Email is required',
          data: null,
        })
      );
    }

    // 检查邮箱是否存在
    if (email !== DEMO_EMAIL) {
      return res(
        ctx.status(404),
        ctx.json({
          code: 404,
          message: 'Email not found',
          data: null,
        })
      );
    }

    return res(
      ctx.status(200),
      ctx.json({
        code: 200,
        message: 'Password reset code sent to your email. Use code: 123456',
        data: { 
          success: true,
          // 在开发环境下显示重置码
          ...(process.env.NODE_ENV === 'development' && { resetCode: '123456' })
        },
      })
    );
  }),

  // 重置密码
  rest.put('*/api/v1/user/password', async (req, res, ctx) => {
    const body = await req.json();
    const { email, code, password } = body;

    if (!email || !code || !password) {
      return res(
        ctx.status(400),
        ctx.json({
          code: 400,
          message: 'Email, code, and new password are required',
          data: null,
        })
      );
    }

    // 验证重置码
    if (code !== '123456') {
      return res(
        ctx.status(400),
        ctx.json({
          code: 400,
          message: 'Invalid reset code',
          data: null,
        })
      );
    }

    // 验证邮箱
    if (email !== DEMO_EMAIL) {
      return res(
        ctx.status(404),
        ctx.json({
          code: 404,
          message: 'Email not found',
          data: null,
        })
      );
    }

    return res(
      ctx.status(200),
      ctx.json({
        code: 200,
        message: 'Password updated successfully',
        data: { success: true },
      })
    );
  }),

  // 登出
  rest.delete('*/api/v1/user/session', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        code: 200,
        message: 'Logout successful',
        data: { success: true },
      })
    );
  }),

  // 获取用户性别选项
  rest.get('*/api/v1/user_gender', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        code: 200,
        message: 'Success',
        data: [
          { id: 1, label: 'Male' },
          { id: 2, label: 'Female' },
          { id: 3, label: 'Other' },
          { id: 4, label: 'Prefer not to say' },
        ],
      })
    );
  }),

  // 获取登录用户详情
  rest.get('*/api/v1/user', (req, res, ctx) => {
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res(
        ctx.status(401),
        ctx.json({
          code: 401,
          message: 'Unauthorized',
          data: null,
        })
      );
    }

    return res(
      ctx.status(200),
      ctx.json({
        code: 200,
        message: 'Success',
        data: mockUser,
      })
    );
  }),

  // 更新登录用户详情
  rest.put('*/api/v1/user', async (req, res, ctx) => {
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res(
        ctx.status(401),
        ctx.json({
          code: 401,
          message: 'Unauthorized',
          data: null,
        })
      );
    }

    return res(
      ctx.status(200),
      ctx.json({
        code: 200,
        message: 'Profile updated successfully',
        data: { success: true },
      })
    );
  }),

  // Scanner登录 (管理员/工作人员登录)
  rest.post('*/scanner/session', async (req, res, ctx) => {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return res(
        ctx.status(400),
        ctx.json({
          code: 400,
          message: 'Email and password are required',
          data: null,
        })
      );
    }

    // 验证管理员账号
    if (email === 'admin@crowdserve.com' && password === 'admin123') {
      return res(
        ctx.status(200),
        ctx.json({
          code: 200,
          message: 'Scanner login successful',
          data: {
            token: 'mock_scanner_token_' + Date.now(),
            user: {
              email: 'admin@crowdserve.com',
              id: 'admin_001',
              lastLoginAt: new Date().toISOString(),
              name: 'Admin User',
              organizerId: 1,
              role: 1, // Admin role
              status: 1,
            },
          },
        })
      );
    }

    return res(
      ctx.status(401),
      ctx.json({
        code: 401,
        message: 'Invalid admin credentials',
        data: null,
      })
    );
  }),

  // 维护模式检查
  rest.get('*/maintenance', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        code: 200,
        message: 'Service is available',
        data: { maintenance: false },
      })
    );
  }),
]; 