import { rest } from 'msw';

const mockRaves = [
  {
    id: 1,
    eventId: 1,
    eventName: "Summer Music Festival 2024",
    organizerName: "Event Masters",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=300&fit=crop&crop=center",
    startTime: "2024-08-15T18:00:00Z",
    endTime: "2024-08-15T23:00:00Z",
    location: "Marina Bay, Singapore",
    status: 1, // 1: ongoing, 2: ended, 0: not started
    joinedUsers: 156,
    totalFlames: 1250,
    myFlames: 85,
    joined: true,
    description: "Join us for the ultimate music festival experience! Dance to the beats of top international DJs and artists while earning flames and unlocking exclusive rewards.",
    shareImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&crop=center",
    redeemedUsers: 23,
    user: {
      joined: true,
      flamePoint: 85,
      inviteCode: "SUMMER2024_USER123"
    },
    reward: [
      {
        id: 1,
        name: "Exclusive T-Shirt",
        description: "Limited edition event t-shirt",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop&crop=center",
        requiredFlames: 50,
        stock: 100,
        redeemed: false
      },
      {
        id: 2,
        name: "VIP Upgrade",
        description: "Upgrade your ticket to VIP access",
        image: "https://images.unsplash.com/photo-1465221185621-d8a2806ac2e4?w=300&h=300&fit=crop&crop=center",
        requiredFlames: 150,
        stock: 20,
        redeemed: false
      }
    ],
    quest: [
      {
        name: "Share the Rave",
        description: "Share this rave with your friends",
        flamePoint: 10,
        limitUser: 0, // 0 means unlimited
        getTimes: 0, // how many times already got this reward
        type: 1 // 1 for share type
      },
      {
        name: "Invite Friends",
        description: "Invite 3 friends to join the rave",
        flamePoint: 25,
        limitUser: 3, // can be used by 3 users max
        getTimes: 1, // already used once
        type: 2 // 2 for invite type
      },
      {
        name: "Join the Rave",
        description: "Join this rave to earn flames",
        flamePoint: 15,
        limitUser: 1, // can only join once
        getTimes: 1, // already completed
        type: 0 // 0 for join type
      }
    ]
  },
  {
    id: 2,
    eventId: 3,
    eventName: "Food & Wine Festival",
    organizerName: "Culinary Society",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&h=300&fit=crop&crop=center",
    startTime: "2024-10-05T16:00:00Z",
    endTime: "2024-10-05T22:00:00Z",
    location: "Clarke Quay, Singapore",
    status: 0, // not started yet
    joinedUsers: 89,
    totalFlames: 750,
    myFlames: 45,
    joined: true,
    description: "Experience the finest cuisine and wines while earning flames! Complete food challenges and wine tastings to unlock exclusive culinary rewards.",
    shareImage: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop&crop=center",
    redeemedUsers: 12,
    user: {
      joined: true,
      flamePoint: 45,
      inviteCode: "FOODWINE2024_USER456"
    },
    reward: [
      {
        id: 3,
        name: "Chef's Special Recipe Book",
        description: "Exclusive recipes from festival chefs",
        image: "https://images.unsplash.com/photo-1481931098730-318b6f776db0?w=300&h=300&fit=crop&crop=center",
        requiredFlames: 40,
        stock: 50,
        redeemed: false
      },
      {
        id: 4,
        name: "Wine Tasting Voucher",
        description: "Free wine tasting session",
        image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=300&h=300&fit=crop&crop=center",
        requiredFlames: 80,
        stock: 30,
        redeemed: false
      },
      {
        id: 5,
        name: "VIP Dining Experience",
        description: "Private dining with celebrity chef",
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&h=300&fit=crop&crop=center",
        requiredFlames: 200,
        stock: 5,
        redeemed: false
      }
    ],
    quest: [
      {
        name: "Share Food Photos",
        description: "Share photos of your favorite dishes",
        flamePoint: 8,
        limitUser: 0,
        getTimes: 2,
        type: 1
      },
      {
        name: "Invite Foodies",
        description: "Invite friends who love food",
        flamePoint: 20,
        limitUser: 5,
        getTimes: 1,
        type: 2
      },
      {
        name: "Join the Festival",
        description: "Join this culinary adventure",
        flamePoint: 12,
        limitUser: 1,
        getTimes: 1,
        type: 0
      }
    ]
  },
  {
    id: 3,
    eventId: 4,
    eventName: "Electronic Dance Night",
    organizerName: "Neon Beats Productions",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop&crop=center",
    startTime: "2024-08-30T22:00:00Z",
    endTime: "2024-08-31T04:00:00Z",
    location: "Zouk Singapore",
    status: 1, // ongoing
    joinedUsers: 234,
    totalFlames: 1850,
    myFlames: 120,
    joined: true,
    description: "Get ready for an electrifying night of beats and bass! Dance with international DJs and earn flames through dance challenges and social interactions.",
    shareImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&crop=center",
    redeemedUsers: 45,
    user: {
      joined: true,
      flamePoint: 120,
      inviteCode: "EDMNITE2024_USER789"
    },
    reward: [
      {
        id: 6,
        name: "LED Wristband",
        description: "Sync with the music beats",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop&crop=center",
        requiredFlames: 30,
        stock: 200,
        redeemed: false
      },
      {
        id: 7,
        name: "DJ Meet & Greet",
        description: "Meet your favorite DJ backstage",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center",
        requiredFlames: 100,
        stock: 15,
        redeemed: false
      },
      {
        id: 8,
        name: "VIP Booth Access",
        description: "Exclusive VIP area with premium view",
        image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop&crop=center",
        requiredFlames: 250,
        stock: 8,
        redeemed: false
      }
    ],
    quest: [
      {
        name: "Share Dance Videos",
        description: "Share your best dance moves",
        flamePoint: 15,
        limitUser: 0,
        getTimes: 1,
        type: 1
      },
      {
        name: "Invite Party Friends",
        description: "Bring your party crew",
        flamePoint: 30,
        limitUser: 4,
        getTimes: 2,
        type: 2
      },
      {
        name: "Join the Beat",
        description: "Join this electronic adventure",
        flamePoint: 20,
        limitUser: 1,
        getTimes: 1,
        type: 0
      }
    ]
  },
  {
    id: 4,
    eventId: 6,
    eventName: "Gaming Championship 2024",
    organizerName: "eSports Singapore",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&h=300&fit=crop&crop=center",
    startTime: "2024-10-12T12:00:00Z",
    endTime: "2024-10-13T20:00:00Z",
    location: "Singapore Expo",
    status: 0, // not started
    joinedUsers: 312,
    totalFlames: 2100,
    myFlames: 65,
    joined: false,
    description: "Level up your gaming experience! Watch epic battles, participate in mini-tournaments, and earn flames through gaming challenges and predictions.",
    shareImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop&crop=center",
    redeemedUsers: 78,
    user: {
      joined: false,
      flamePoint: 65,
      inviteCode: "GAMING2024_USER101"
    },
    reward: [
      {
        id: 9,
        name: "Gaming Headset",
        description: "Professional gaming headset",
        image: "https://images.unsplash.com/photo-1599669454699-248893623440?w=300&h=300&fit=crop&crop=center",
        requiredFlames: 60,
        stock: 80,
        redeemed: false
      },
      {
        id: 10,
        name: "Meet Pro Gamers",
        description: "Meet and learn from professional gamers",
        image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&h=300&fit=crop&crop=center",
        requiredFlames: 120,
        stock: 25,
        redeemed: false
      },
      {
        id: 11,
        name: "Gaming Setup Prize",
        description: "Complete gaming setup worth $2000",
        image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=300&h=300&fit=crop&crop=center",
        requiredFlames: 500,
        stock: 1,
        redeemed: false
      }
    ],
    quest: [
      {
        name: "Share Gaming Moments",
        description: "Share epic gaming moments",
        flamePoint: 12,
        limitUser: 0,
        getTimes: 0,
        type: 1
      },
      {
        name: "Invite Gaming Squad",
        description: "Invite your gaming friends",
        flamePoint: 25,
        limitUser: 6,
        getTimes: 0,
        type: 2
      },
      {
        name: "Join the Championship",
        description: "Join this gaming event",
        flamePoint: 18,
        limitUser: 1,
        getTimes: 0,
        type: 0
      }
    ]
  }
];

export const raveHandlers = [
  // 获取我的Raves列表
  rest.get('*/api/v1/rave', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        code: 200,
        message: 'Success',
        data: mockRaves
      })
    );
  }),

  // 获取特定Rave详情
  rest.get('*/api/v1/rave/:eventId', (req, res, ctx) => {
    const { eventId } = req.params;
    const rave = mockRaves.find(r => r.eventId.toString() === eventId) || mockRaves[0];
    
    // 根据不同的事件提供不同的排行榜数据
    const getLeaderboardByEventId = (eventId: string) => {
      switch (eventId) {
        case '1': // Summer Music Festival
          return [
            {
              rank: 1,
              userName: "FlameKing",
              avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
              flames: 245
            },
            {
              rank: 2,
              userName: "RaveQueen",
              avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5e5?w=100&h=100&fit=crop&crop=face",
              flames: 198
            },
            {
              rank: 3,
              userName: "PartyMaster",
              avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
              flames: 167
            },
            {
              rank: 15,
              userName: "You",
              avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
              flames: 85,
              isCurrentUser: true
            }
          ];
        case '3': // Food & Wine Festival
          return [
            {
              rank: 1,
              userName: "ChefMaster",
              avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face",
              flames: 180
            },
            {
              rank: 2,
              userName: "WineLover",
              avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
              flames: 156
            },
            {
              rank: 3,
              userName: "FoodieKing",
              avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
              flames: 134
            },
            {
              rank: 8,
              userName: "You",
              avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
              flames: 45,
              isCurrentUser: true
            }
          ];
        case '4': // Electronic Dance Night
          return [
            {
              rank: 1,
              userName: "BeatDropper",
              avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop&crop=face",
              flames: 320
            },
            {
              rank: 2,
              userName: "EDMQueen",
              avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
              flames: 285
            },
            {
              rank: 3,
              userName: "DanceFloor",
              avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
              flames: 267
            },
            {
              rank: 12,
              userName: "You",
              avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
              flames: 120,
              isCurrentUser: true
            }
          ];
        case '6': // Gaming Championship
          return [
            {
              rank: 1,
              userName: "ProGamer",
              avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
              flames: 450
            },
            {
              rank: 2,
              userName: "GameMaster",
              avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop&crop=face",
              flames: 398
            },
            {
              rank: 3,
              userName: "eSportsStar",
              avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop&crop=face",
              flames: 367
            },
            {
              rank: 25,
              userName: "You",
              avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
              flames: 65,
              isCurrentUser: true
            }
          ];
        default:
          return [
            {
              rank: 1,
              userName: "TopPlayer",
              avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
              flames: 200
            },
            {
              rank: 10,
              userName: "You",
              avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
              flames: 50,
              isCurrentUser: true
            }
          ];
      }
    };
    
    return res(
      ctx.status(200),
      ctx.json({
        code: 200,
        message: 'Success',
        data: {
          ...rave,
          leaderboard: getLeaderboardByEventId(eventId.toString())
        }
      })
    );
  }),

  // 加入Rave
  rest.post('*/api/v1/rave/:eventId', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        code: 200,
        message: 'Successfully joined the rave!',
        data: {
          joined: true,
          flamePoint: 10, // 加入奖励
          welcomeMessage: "Welcome to the rave! Start sharing to earn more flames!"
        }
      })
    );
  }),

  // 兑换Rave奖励
  rest.post('*/api/v1/rave/:eventId/reward/:rewardId', (req, res, ctx) => {
    const { eventId, rewardId } = req.params;
    
    return res(
      ctx.status(200),
      ctx.json({
        code: 200,
        message: 'Reward redeemed successfully!',
        data: {
          rewardId: typeof rewardId === 'string' ? parseInt(rewardId) : rewardId,
          redeemed: true,
          deliveryInfo: "Your reward will be available for pickup at the event entrance."
        }
      })
    );
  }),

  // 访问分享链接（计算分享奖励）
  rest.post('*/api/v1/rave/:eventId/shared', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        code: 200,
        message: 'Share recorded successfully!',
        data: {
          flamesEarned: 5,
          totalFlames: 90,
          message: "You earned 5 flames for sharing!"
        }
      })
    );
  })
]; 