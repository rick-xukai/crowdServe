import { rest } from 'msw';

const mockTickets = [
  // Event 1: Summer Music Festival 2024 (id: eJoKli9smjh)
  {
    id: 1,
    eventId: 'eJoKli9smjh', // 对应 mockMyEvents 中的 id
    eventName: 'Summer Music Festival 2024',
    ticketType: 'General Admission',
    price: 150,
    currency: 'SGD',
    purchaseDate: '2024-07-15T10:00:00Z',
    status: 0, // 0: upcoming, 1: used, 2: cancelled, 3: expired
    qrCode: 'TICKET_QR_CODE_1',
    seatNumber: null,
    image:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop&crop=center',
    blockchainUrl: 'https://polygonscan.com/tx/0x123...',
    name: 'Summer Festival GA Ticket',
    saleStatus: 1, // 1: on sale, 2: sold out
    slug: 'summer-festival-ga-ticket-abc123',
    organizerSlug: 'event-masters',
    description: 'General admission ticket to Summer Music Festival 2024',
    animationType: 'fade',
    animationUrl: '',
    transferStatus: 0, // 0: not transferable, 1: transferable
    ticketNo: 'SMF2024-001',
  },
  {
    id: 2,
    eventId: 'eJoKli9smjh', // 对应 mockMyEvents 中的 id
    eventName: 'Summer Music Festival 2024',
    ticketType: 'VIP Pass',
    price: 350,
    currency: 'SGD',
    purchaseDate: '2024-07-15T10:30:00Z',
    status: 0,
    qrCode: 'TICKET_QR_CODE_2',
    seatNumber: 'VIP-A12',
    image:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop&crop=center',
    blockchainUrl: 'https://polygonscan.com/tx/0x124...',
    name: 'Summer Festival VIP Ticket',
    saleStatus: 1,
    slug: 'summer-festival-vip-ticket-def456',
    organizerSlug: 'event-masters',
    description: 'VIP access ticket with exclusive perks',
    animationType: 'glow',
    animationUrl: '',
    transferStatus: 1,
    ticketNo: 'SMF2024-VIP-002',
  },
  // Event 2: Tech Conference 2024 (id: mNpQr8xvWkL)
  {
    id: 3,
    eventId: 'mNpQr8xvWkL', // 对应 mockMyEvents 中的 id
    eventName: 'Tech Conference 2024',
    ticketType: 'Standard Pass',
    price: 200,
    currency: 'SGD',
    purchaseDate: '2024-07-20T15:30:00Z',
    status: 0,
    qrCode: 'TICKET_QR_CODE_3',
    seatNumber: 'B-15',
    image:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop&crop=center',
    blockchainUrl: 'https://polygonscan.com/tx/0x125...',
    name: 'Tech Conference Standard Pass',
    saleStatus: 1,
    slug: 'tech-conference-standard-pass-ghi789',
    organizerSlug: 'tech-innovators',
    description: 'Standard access to all conference sessions',
    animationType: 'pulse',
    animationUrl: '',
    transferStatus: 1,
    ticketNo: 'TC2024-STD-003',
  },
  // Event 3: Food & Wine Festival (id: bHtYu3nMqRs)
  {
    id: 4,
    eventId: 'bHtYu3nMqRs', // 对应 mockMyEvents 中的 id
    eventName: 'Food & Wine Festival',
    ticketType: 'Tasting Pass',
    price: 120,
    currency: 'SGD',
    purchaseDate: '2024-08-01T12:00:00Z',
    status: 0,
    qrCode: 'TICKET_QR_CODE_4',
    seatNumber: null,
    image:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop&crop=center',
    blockchainUrl: 'https://polygonscan.com/tx/0x126...',
    name: 'Food & Wine Tasting Pass',
    saleStatus: 1,
    slug: 'food-wine-tasting-pass-jkl012',
    organizerSlug: 'culinary-arts-society',
    description: 'Access to all food and wine tasting stations',
    animationType: 'bounce',
    animationUrl: '',
    transferStatus: 0,
    ticketNo: 'FWF2024-TASTE-004',
  },
  {
    id: 5,
    eventId: 'bHtYu3nMqRs', // 对应 mockMyEvents 中的 id
    eventName: 'Food & Wine Festival',
    ticketType: 'Premium Experience',
    price: 280,
    currency: 'SGD',
    purchaseDate: '2024-08-01T12:15:00Z',
    status: 0,
    qrCode: 'TICKET_QR_CODE_5',
    seatNumber: 'PREM-C5',
    image:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop&crop=center',
    blockchainUrl: 'https://polygonscan.com/tx/0x127...',
    name: 'Food & Wine Premium Experience',
    saleStatus: 1,
    slug: 'food-wine-premium-experience-mno345',
    organizerSlug: 'culinary-arts-society',
    description: 'Premium experience with chef meet & greet',
    animationType: 'sparkle',
    animationUrl: '',
    transferStatus: 1,
    ticketNo: 'FWF2024-PREM-005',
  },
  // Event 4: Art Exhibition Opening (id: vCxZa7bNmPq)
  {
    id: 6,
    eventId: 'vCxZa7bNmPq', // 对应 mockMyEvents 中的 id
    eventName: 'Art Exhibition Opening',
    ticketType: 'Gallery Access',
    price: 80,
    currency: 'SGD',
    purchaseDate: '2024-08-10T16:00:00Z',
    status: 0,
    qrCode: 'TICKET_QR_CODE_6',
    seatNumber: null,
    image:
      'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=400&h=300&fit=crop&crop=center',
    blockchainUrl: 'https://polygonscan.com/tx/0x128...',
    name: 'Art Exhibition Gallery Access',
    saleStatus: 1,
    slug: 'art-exhibition-gallery-access-pqr678',
    organizerSlug: 'modern-art-gallery',
    description: 'Access to exclusive art exhibition opening',
    animationType: 'fade',
    animationUrl: '',
    transferStatus: 0,
    ticketNo: 'AEO2024-GAL-006',
  },
  // Event 5: Gaming Championship Finals (id: dFgHj5kLmNp)
  {
    id: 7,
    eventId: 'dFgHj5kLmNp', // 对应 mockMyEvents 中的 id
    eventName: 'Gaming Championship Finals',
    ticketType: 'Spectator Pass',
    price: 60,
    currency: 'SGD',
    purchaseDate: '2024-08-15T14:00:00Z',
    status: 0,
    qrCode: 'TICKET_QR_CODE_7',
    seatNumber: 'S-Row12-Seat8',
    image:
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop&crop=center',
    blockchainUrl: 'https://polygonscan.com/tx/0x129...',
    name: 'Gaming Championship Spectator Pass',
    saleStatus: 1,
    slug: 'gaming-championship-spectator-pass-stu901',
    organizerSlug: 'esports-singapore',
    description: 'Spectator access to gaming championship finals',
    animationType: 'neon',
    animationUrl: '',
    transferStatus: 1,
    ticketNo: 'GCF2024-SPEC-007',
  },
  {
    id: 8,
    eventId: 'dFgHj5kLmNp', // 对应 mockMyEvents 中的 id
    eventName: 'Gaming Championship Finals',
    ticketType: 'Premium Seating',
    price: 150,
    currency: 'SGD',
    purchaseDate: '2024-08-15T14:15:00Z',
    status: 0,
    qrCode: 'TICKET_QR_CODE_8',
    seatNumber: 'P-Row3-Seat15',
    image:
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop&crop=center',
    blockchainUrl: 'https://polygonscan.com/tx/0x130...',
    name: 'Gaming Championship Premium Seating',
    saleStatus: 1,
    slug: 'gaming-championship-premium-seating-vwx234',
    organizerSlug: 'esports-singapore',
    description: 'Premium seating with exclusive perks',
    animationType: 'electric',
    animationUrl: '',
    transferStatus: 1,
    ticketNo: 'GCF2024-PREM-008',
  },
];

const mockMyEvents = [
  {
    id: 'eJoKli9smjh',
    name: 'Summer Music Festival 2024',
    description:
      'Join us for an unforgettable summer music experience featuring top artists from around the world.',
    organizerName: 'Event Masters',
    image:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=300&fit=crop&crop=center',
    startTime: '2024-08-15T18:00:00Z',
    endTime: '2024-08-15T23:00:00Z',
    location: 'Marina Bay, Singapore',
    address: 'Marina Bay Sands Event Plaza, 10 Bayfront Ave, Singapore 018956',
    status: 1, // 1: upcoming, 2: ongoing, 3: completed, 4: cancelled
    slug: 'summer-music-festival-2024-eJoKli9smjh',
  },
  {
    id: 'mNpQr8xvWkL',
    name: 'Tech Conference 2024',
    description:
      'Discover the latest innovations in technology with industry leaders and networking opportunities.',
    organizerName: 'Tech Innovators',
    image:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=300&fit=crop&crop=center',
    startTime: '2024-09-20T09:00:00Z',
    endTime: '2024-09-20T18:00:00Z',
    location: 'Suntec City, Singapore',
    address:
      'Suntec Singapore Convention & Exhibition Centre, 1 Raffles Blvd, Singapore 039593',
    status: 1,
    slug: 'tech-conference-2024-mNpQr8xvWkL',
  },
  {
    id: 'bHtYu3nMqRs',
    name: 'Food & Wine Festival',
    description:
      'Savor exquisite cuisines and premium wines from renowned chefs and vintners.',
    organizerName: 'Culinary Arts Society',
    image:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&h=300&fit=crop&crop=center',
    startTime: '2024-10-05T17:00:00Z',
    endTime: '2024-10-05T22:00:00Z',
    location: 'Gardens by the Bay, Singapore',
    address: 'Gardens by the Bay, 18 Marina Gardens Dr, Singapore 018953',
    status: 1,
    slug: 'food-wine-festival-2024-bHtYu3nMqRs',
  },
  {
    id: 'vCxZa7bNmPq',
    name: 'Art Exhibition Opening',
    description:
      'Experience contemporary art from emerging and established artists in an exclusive gallery setting.',
    organizerName: 'Modern Art Gallery',
    image:
      'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=500&h=300&fit=crop&crop=center',
    startTime: '2024-11-12T19:00:00Z',
    endTime: '2024-11-12T22:00:00Z',
    location: 'National Gallery Singapore',
    address: "National Gallery Singapore, 1 St Andrew's Rd, Singapore 178957",
    status: 1,
    slug: 'art-exhibition-opening-2024-vCxZa7bNmPq',
  },
  {
    id: 'dFgHj5kLmNp',
    name: 'Gaming Championship Finals',
    description:
      'Watch the best esports teams compete for the championship title in this thrilling tournament.',
    organizerName: 'eSports Singapore',
    image:
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&h=300&fit=crop&crop=center',
    startTime: '2024-12-08T14:00:00Z',
    endTime: '2024-12-08T20:00:00Z',
    location: 'Singapore Expo',
    address: 'Singapore Expo, 1 Expo Dr, Singapore 486150',
    status: 1,
    slug: 'gaming-championship-finals-2024-dFgHj5kLmNp',
  },
];

const mockMyCollectibles = [
  {
    id: '1',
    slug: 'event-masters-collection',
    name: 'Event Masters Collection',
    description: 'Premium collectible tickets from Event Masters events including music festivals and exclusive experiences.',
    banner: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop&crop=center',
    logo: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=200&h=200&fit=crop&crop=center',
    owned: 3,
    tickets: [
      {
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop&crop=center',
        saleStatus: 1, // 1: on sale, 2: sold out
        transferStatus: 0, // 0: not transferable, 1: transferable, 2: pending
      },
      {
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop&crop=center',
        saleStatus: 2,
        transferStatus: 1,
      },
      {
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop&crop=center',
        saleStatus: 1,
        transferStatus: 2,
      },
    ],
  },
  {
    id: '2',
    slug: 'tech-innovators-collection',
    name: 'Tech Innovators Collection',
    description: 'Exclusive tech conference and innovation summit collectible tickets with special privileges.',
    banner: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop&crop=center',
    logo: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=200&h=200&fit=crop&crop=center',
    owned: 2,
    tickets: [
      {
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop&crop=center',
        saleStatus: 1,
        transferStatus: 0,
      },
      {
        image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=300&fit=crop&crop=center',
        saleStatus: 2,
        transferStatus: 1,
      },
    ],
  },
  {
    id: '3',
    slug: 'culinary-arts-collection',
    name: 'Culinary Arts Collection',
    description: 'Gourmet food and wine festival collectible tickets with exclusive chef experiences.',
    banner: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=400&fit=crop&crop=center',
    logo: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=200&h=200&fit=crop&crop=center',
    owned: 4,
    tickets: [
      {
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop&crop=center',
        saleStatus: 1,
        transferStatus: 0,
      },
      {
        image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop&crop=center',
        saleStatus: 2,
        transferStatus: 0,
      },
      {
        image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop&crop=center',
        saleStatus: 1,
        transferStatus: 1,
      },
      {
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop&crop=center',
        saleStatus: 1,
        transferStatus: 2,
      },
    ],
  },
  {
    id: '4',
    slug: 'modern-art-gallery-collection',
    name: 'Modern Art Gallery Collection',
    description: 'Contemporary art exhibition and gallery opening collectible tickets with artist meet & greet access.',
    banner: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=800&h=400&fit=crop&crop=center',
    logo: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=200&h=200&fit=crop&crop=center',
    owned: 1,
    tickets: [
      {
        image: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=400&h=300&fit=crop&crop=center',
        saleStatus: 1,
        transferStatus: 0,
      },
    ],
  },
  {
    id: '5',
    slug: 'esports-singapore-collection',
    name: 'eSports Singapore Collection',
    description: 'Gaming championship and esports tournament collectible tickets with VIP gaming lounge access.',
    banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400&fit=crop&crop=center',
    logo: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=200&h=200&fit=crop&crop=center',
    owned: 5,
    tickets: [
      {
        image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop&crop=center',
        saleStatus: 2,
        transferStatus: 1,
      },
      {
        image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop&crop=center',
        saleStatus: 2,
        transferStatus: 0,
      },
      {
        image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=300&fit=crop&crop=center',
        saleStatus: 2,
        transferStatus: 2,
      },
      {
        image: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=400&h=300&fit=crop&crop=center',
        saleStatus: 2,
        transferStatus: 0,
      },
      {
        image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=300&fit=crop&crop=center',
        saleStatus: 2,
        transferStatus: 1,
      },
    ],
  },
];

export const ticketHandlers = [
  // 获取我的票务列表
  rest.get('*/api/v1/ticket', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        code: 200,
        message: 'Success',
        data: mockTickets,
      })
    );
  }),

  // 获取票务详情
  rest.get('*/api/v1/ticket/:ticketId', (req, res, ctx) => {
    const { ticketId } = req.params;
    const ticket = mockTickets.find((t) => t.id.toString() === ticketId);

    return res(
      ctx.status(200),
      ctx.json({
        code: 200,
        message: 'Success',
        data: ticket || mockTickets[0],
      })
    );
  }),

  // 获取票务二维码
  rest.get('*/api/v1/ticket/:ticketId/code', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        code: 200,
        message: 'Success',
        data: {
          qrCode:
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
          expiresAt: '2024-08-15T23:59:59Z',
        },
      })
    );
  }),

  // 获取我的活动列表
  rest.get('*/api/v1/my/event', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        code: 200,
        message: 'Success',
        data: mockMyEvents,
      })
    );
  }),

  // 获取我的活动票务列表
  rest.get('*/api/v1/my/event/:eventId', (req, res, ctx) => {
    const { eventId: eventIdParam } = req.params;

    console.log('🔍 Debug: eventIdParam:', eventIdParam);

    const eventId = Array.isArray(eventIdParam)
      ? eventIdParam[0]
      : eventIdParam;

    console.log('🔍 Debug: 处理的eventId:', eventId);

    // 查找事件 - 支持通过ID或slug查找
    let targetEvent: typeof mockMyEvents[0] | undefined = undefined;
    
    // 首先尝试通过ID查找
    targetEvent = mockMyEvents.find((e) => e.id === eventId);
    
    // 如果没找到，尝试通过slug查找
    if (!targetEvent) {
      targetEvent = mockMyEvents.find((e) => e.slug === eventId);
    }

    console.log('🔍 Debug: 找到的事件:', targetEvent);

    if (!targetEvent) {
      console.log('🔍 Debug: 事件未找到，返回404');
      return res(
        ctx.status(404),
        ctx.json({
          code: 404,
          message: 'Event not found',
          data: [],
        })
      );
    }

    // 使用事件的ID来查找票务数据
    const eventTickets = mockTickets.filter(
      (t) => t.eventId === targetEvent!.id
    );
    
    console.log('🔍 Debug: 找到的票务数量:', eventTickets.length);
    console.log('🔍 Debug: 票务数据:', eventTickets);

    return res(
      ctx.status(200),
      ctx.json({
        code: 200,
        message: 'Success',
        data: eventTickets,
      })
    );
  }),

  // 获取我的收藏品列表
  rest.get('*/api/v1/my/collectible', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        code: 200,
        message: 'Success',
        data: mockMyCollectibles,
      })
    );
  }),

  // 获取我的收藏品详情
  rest.get('*/api/v1/my/collectible/ticket/:userTicketId', (req, res, ctx) => {
    const { userTicketId } = req.params;

    // 根据userTicketId查找对应的票务和事件信息
    const ticket = mockTickets.find(t => t.id.toString() === userTicketId) || mockTickets[0];
    const event = mockMyEvents.find(e => e.id === ticket.eventId) || mockMyEvents[0];

    // 构建完整的收藏品详情数据
    const collectibleDetail = {
      id: userTicketId,
      name: ticket.name,
      organizerName: event.organizerName,
      description: ticket.description,
      image: ticket.image,
      imageType: 'image/jpeg',
      seat: ticket.seatNumber ? 1 : 0,
      ticketNo: ticket.ticketNo,
      royaltiesFee: 5.0,
      ceilingPrice: ticket.price * 1.5,
      price: ticket.price,
      sharePage: `https://crowdserve.com/collectible/${ticket.slug}`,
      status: ticket.status,
      saleStatus: ticket.saleStatus,
      blockchainUrl: ticket.blockchainUrl,
      event: {
        id: event.id,
        slug: event.slug,
        name: event.name,
        description: event.description,
        descriptionShort: event.description.substring(0, 100) + '...',
        image: event.image,
        location: event.location,
        address: event.address,
        startTime: event.startTime,
        endTime: event.endTime,
        status: event.status,
      },
      market: {
        currency: ticket.currency,
        sellPrice: ticket.price,
        soldAt: ticket.purchaseDate,
        status: 1,
        createdAt: ticket.purchaseDate,
      },
      transferStatus: ticket.transferStatus,
      owner: true,
      transfer: {
        code: '',
        notes: '',
        toUserEmail: '',
      },
    };

    return res(
      ctx.status(200),
      ctx.json({
        code: 200,
        message: 'Success',
        data: collectibleDetail,
      })
    );
  }),

  // 获取收藏品二维码
  rest.get(
    '*/api/v1/my/collectible/ticket/:userTicketUuid/code',
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          code: 200,
          message: 'Success',
          data: {
            qrCode:
              'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
            deepLink: 'crowdservelink://collectible/12345',
          },
        })
      );
    }
  ),

  // 获取价格图表数据
  rest.get(
    '*/api/v1/collectible/ticket/:userTicketUuid/price_chart',
    (req, res, ctx) => {
      const mockPriceData = [];
      const basePrice = 150;
      const now = new Date();

      // 生成30天的价格数据
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const variation = (Math.random() - 0.5) * 0.2; // ±10% variation
        const price = basePrice * (1 + variation);

        mockPriceData.push({
          date: date.toISOString().split('T')[0],
          price: Math.round(price * 100) / 100,
        });
      }

      return res(
        ctx.status(200),
        ctx.json({
          code: 200,
          message: 'Success',
          data: mockPriceData,
        })
      );
    }
  ),

  // 获取关联特权
  rest.get(
    '*/api/v1/collectible/ticket/:userTicketUuid/privilege',
    (req, res, ctx) => {
      // 根据ConnectedEventsResponseType接口构建完整的Connected Events数据
      const mockConnectedEvents = [
        {
          id: '1',
          organizerName: 'Event Masters',
          event: {
            name: 'Future Music Festival 2024',
            description: 'An exclusive music festival featuring top artists from around the world.',
            image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=300&fit=crop&crop=center',
            location: 'Marina Bay, Singapore',
            startTime: '2024-12-15T18:00:00Z',
            endTime: '2024-12-15T23:00:00Z',
            address: 'Marina Bay Sands Event Plaza, 10 Bayfront Ave, Singapore 018956',
            descriptionShort: 'An exclusive music festival featuring top artists.',
          },
          ticketType: {
            name: 'VIP Access Pass',
            image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop&crop=center',
            imageType: 'image/jpeg',
            thumbnailUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=150&fit=crop&crop=center',
            thumbnailType: 'image/jpeg',
            seat: 'VIP-A15',
            ticketNo: 'FMF2024-VIP-001',
            price: 350,
          },
          privilegeType: 0, // 0: event access
          externalLink: '',
          status: 1, // 1: upcoming
        },
        {
          id: '2',
          organizerName: 'Tech Innovators',
          event: {
            name: 'Innovation Summit 2024',
            description: 'Connect with industry leaders and explore cutting-edge technologies.',
            image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=300&fit=crop&crop=center',
            location: 'Suntec City, Singapore',
            startTime: '2024-11-20T09:00:00Z',
            endTime: '2024-11-20T18:00:00Z',
            address: 'Suntec Singapore Convention & Exhibition Centre, 1 Raffles Blvd, Singapore 039593',
            descriptionShort: 'Connect with industry leaders and explore cutting-edge technologies.',
          },
          ticketType: {
            name: 'Premium Conference Pass',
            image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop&crop=center',
            imageType: 'image/jpeg',
            thumbnailUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200&h=150&fit=crop&crop=center',
            thumbnailType: 'image/jpeg',
            seat: 'A-25',
            ticketNo: 'IS2024-PREM-002',
            price: 280,
          },
          privilegeType: 0, // 0: event access
          externalLink: '',
          status: 1, // 1: upcoming
        },
        {
          id: '3',
          organizerName: 'Culinary Arts Society',
          event: {
            name: 'Gourmet Experience 2024',
            description: 'Exclusive dining experience with world-renowned chefs.',
            image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&h=300&fit=crop&crop=center',
            location: 'Gardens by the Bay, Singapore',
            startTime: '2024-10-25T19:00:00Z',
            endTime: '2024-10-25T23:00:00Z',
            address: 'Gardens by the Bay, 18 Marina Gardens Dr, Singapore 018953',
            descriptionShort: 'Exclusive dining experience with world-renowned chefs.',
          },
          ticketType: {
            name: 'Chef\'s Table Experience',
            image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop&crop=center',
            imageType: 'image/jpeg',
            thumbnailUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&h=150&fit=crop&crop=center',
            thumbnailType: 'image/jpeg',
            ticketNo: 'GE2024-CHEF-003',
            price: 450,
          },
          privilegeType: 0, // 0: event access
          externalLink: '',
          status: 1, // 1: upcoming
        },
        {
          id: '4',
          organizerName: 'Event Masters',
          event: {
            name: 'Special Discount Offer',
            description: '10% off on all future Event Masters events.',
            image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=300&fit=crop&crop=center',
            location: 'Online',
            startTime: '2024-08-01T00:00:00Z',
            endTime: '2024-12-31T23:59:59Z',
            address: 'Valid for all Event Masters venues',
            descriptionShort: '10% off on all future Event Masters events.',
          },
          ticketType: {
            name: '10% Discount Voucher',
            image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop&crop=center',
            imageType: 'image/jpeg',
            thumbnailUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=200&h=150&fit=crop&crop=center',
            thumbnailType: 'image/jpeg',
            ticketNo: 'EM2024-DISC-004',
          },
          privilegeType: 1, // 1: discount
          externalLink: '',
          status: 1, // 1: active
        },
      ];

      return res(
        ctx.status(200),
        ctx.json({
          code: 200,
          message: 'Success',
          data: mockConnectedEvents,
        })
      );
    }
  ),

  // 获取我的收藏品组织者列表
  rest.get('*/api/v1/my/collectible/:organizerId', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        code: 200,
        message: 'Success',
        data: mockMyCollectibles,
      })
    );
  }),

  // 获取组织者信息
  rest.get('*/api/v1/organizer/:organizerId', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        code: 200,
        message: 'Success',
        data: {
          id: 1,
          name: 'Event Masters',
          description:
            'Premium event organizer specializing in music festivals and cultural events',
          logo: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=200&h=200&fit=crop&crop=center',
          website: 'https://eventmasters.com',
          email: 'info@eventmasters.com',
          socialMedia: {
            instagram: '@eventmasters',
            twitter: '@eventmasters',
            facebook: 'EventMasters',
          },
        },
      })
    );
  }),

  // 转移详情
  rest.get('*/api/v1/transfer/:code', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        code: 200,
        message: 'Success',
        data: {
          transferCode: req.params.code,
          ticketName: 'Summer Festival Ticket',
          fromUser: 'John Doe',
          toUser: 'Jane Smith',
          status: 'pending',
          expiresAt: '2024-08-01T23:59:59Z',
        },
      })
    );
  }),

  // 领取转移
  rest.post('*/api/v1/transfer/:code/claim', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        code: 200,
        message: 'Transfer claimed successfully',
        data: { success: true },
      })
    );
  }),
];
