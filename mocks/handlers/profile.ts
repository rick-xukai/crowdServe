import { rest } from 'msw';

const mockUserProfile = {
  id: 1,
  email: "demo@crowdserve.com",
  firstName: "Demo",
  lastName: "User",
  phone: "+6512345678",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
  birthday: "1990-01-01",
  gender: 1,
  status: 1,
  emailVerified: true,
  phoneVerified: true,
  bio: "Music enthusiast and event lover",
  location: "Singapore",
  joinDate: "2023-01-15T10:00:00Z",
  totalEvents: 15,
  totalTickets: 28,
  favoriteGenres: ["Electronic", "Rock", "Jazz"],
  socialLinks: {
    instagram: "@demouser",
    twitter: "@demouser"
  }
};

export const profileHandlers = [
  // 获取登录用户详情
  rest.get('*/api/v1/user', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        code: 200,
        message: 'Success',
        data: mockUserProfile
      })
    );
  }),

  // 更新登录用户详情
  rest.put('*/api/v1/user', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        code: 200,
        message: 'Profile updated successfully',
        data: {
          ...mockUserProfile,
          // 这里可以包含请求体中的更新数据
          updatedAt: new Date().toISOString()
        }
      })
    );
  }),

  // 页面访问追踪
  rest.post('*/api/v1/page_view', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        code: 200,
        message: 'Page view recorded',
        data: { success: true }
      })
    );
  })
]; 