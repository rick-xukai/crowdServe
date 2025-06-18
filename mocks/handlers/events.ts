import { rest } from 'msw';

// 模拟事件列表数据
const mockEvents = [
  {
    id: 1,
    name: 'Summer Music Festival 2024',
    organizerName: 'Event Masters',
    image:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&crop=center',
    location: 'Marina Bay, Singapore',
    startTime: '2024-08-15T18:00:00Z',
    endTime: '2024-08-15T23:00:00Z',
    description:
      'Join us for an unforgettable summer music festival featuring top international artists.',
    status: 1,
    slug: 'summer-music-festival-2024-eJoKli9smjh',
    address: 'Marina Bay Sands, Singapore',
    raveSet: true,
    raveStatus: 1,
  },
  {
    id: 2,
    name: 'Tech Conference 2024',
    organizerName: 'Tech Innovators',
    image:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop&crop=center',
    location: 'Suntec City, Singapore',
    startTime: '2024-09-20T09:00:00Z',
    endTime: '2024-09-20T18:00:00Z',
    description:
      'Discover the latest trends in technology and network with industry leaders.',
    status: 1,
    slug: 'tech-conference-2024-mK8pQr3xNvB',
    address: 'Suntec Singapore Convention & Exhibition Centre',
    raveSet: false,
    raveStatus: 0,
  },
  {
    id: 3,
    name: 'Food & Wine Festival',
    organizerName: 'Culinary Society',
    image:
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop&crop=center',
    location: 'Clarke Quay, Singapore',
    startTime: '2024-10-05T16:00:00Z',
    endTime: '2024-10-05T22:00:00Z',
    description: 'Experience the best cuisine and wines from around the world.',
    status: 1,
    slug: 'food-wine-festival-zT5wLm2hYqE',
    address: 'Clarke Quay Central, Singapore',
    raveSet: true,
    raveStatus: 1,
  },
  {
    id: 4,
    name: 'Electronic Dance Night',
    organizerName: 'Neon Beats Productions',
    image:
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&crop=center',
    location: 'Zouk Singapore',
    startTime: '2024-08-30T22:00:00Z',
    endTime: '2024-08-31T04:00:00Z',
    description:
      'An electrifying night of beats and bass with international DJs.',
    status: 1,
    slug: 'electronic-dance-night-pR7nXs4kFgD',
    address: '3C River Valley Rd, Clarke Quay, Singapore',
    raveSet: false,
    raveStatus: 0,
  },
  {
    id: 5,
    name: 'Art & Culture Expo',
    organizerName: 'Singapore Art Council',
    image:
      'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=800&h=600&fit=crop&crop=center',
    location: 'National Gallery Singapore',
    startTime: '2024-09-15T10:00:00Z',
    endTime: '2024-09-15T20:00:00Z',
    description:
      'Explore contemporary art and cultural exhibitions from local and international artists.',
    status: 1,
    slug: 'art-culture-expo-vH9bCj6uMtA',
    address: "1 St Andrew's Rd, Singapore",
    raveSet: false,
    raveStatus: 0,
  },
  {
    id: 6,
    name: 'Gaming Championship 2024',
    organizerName: 'eSports Singapore',
    image:
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop&crop=center',
    location: 'Singapore Expo',
    startTime: '2024-10-12T12:00:00Z',
    endTime: '2024-10-13T20:00:00Z',
    description:
      'Watch top gamers compete in the ultimate gaming championship.',
    status: 1,
    slug: 'gaming-championship-2024-qW3eRt8yLpS',
    address: '1 Expo Dr, Singapore',
    raveSet: false,
    raveStatus: 0,
  },
  {
    id: 7,
    name: 'Startup Pitch Night',
    organizerName: 'Innovation Hub',
    image:
      'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop&crop=center',
    location: 'Marina One, Singapore',
    startTime: '2024-09-25T19:00:00Z',
    endTime: '2024-09-25T22:00:00Z',
    description:
      'Watch innovative startups pitch their ideas to top investors.',
    status: 1,
    slug: 'startup-pitch-night-nM5dGh1oZxK',
    address: '5 Straits View, Marina One, Singapore',
    raveSet: false,
    raveStatus: 0,
  },
  {
    id: 8,
    name: 'Fitness & Wellness Expo',
    organizerName: 'HealthFirst Events',
    image:
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&crop=center',
    location: 'Sports Hub, Singapore',
    startTime: '2024-11-02T08:00:00Z',
    endTime: '2024-11-02T18:00:00Z',
    description:
      'Discover the latest in fitness technology and wellness trends.',
    status: 1,
    slug: 'fitness-wellness-expo-bY7cVf4jPqI',
    address: '1 Stadium Dr, Singapore Sports Hub',
    raveSet: false,
    raveStatus: 0,
  },
  {
    id: 9,
    name: 'Photography Workshop',
    organizerName: 'Lens Masters',
    image:
      'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&h=600&fit=crop&crop=center',
    location: 'Botanic Gardens, Singapore',
    startTime: '2024-10-20T14:00:00Z',
    endTime: '2024-10-20T17:00:00Z',
    description:
      "Learn professional photography techniques in Singapore's beautiful botanic gardens.",
    status: 1,
    slug: 'photography-workshop-kL2aUi9wXrN',
    address: '1 Cluny Rd, Singapore Botanic Gardens',
    raveSet: false,
    raveStatus: 0,
  },
  {
    id: 10,
    name: 'Blockchain Summit 2024',
    organizerName: 'Crypto Singapore',
    image:
      'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop&crop=center',
    location: 'Raffles City, Singapore',
    startTime: '2024-11-15T09:00:00Z',
    endTime: '2024-11-16T18:00:00Z',
    description:
      'Explore the future of blockchain technology and cryptocurrency innovations.',
    status: 1,
    slug: 'blockchain-summit-2024-xP6tJm3sEhQ',
    address: '252 North Bridge Rd, Raffles City Shopping Centre',
    raveSet: false,
    raveStatus: 0,
  },
];

// 模拟横幅数据
const mockBanners = [
  {
    image:
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&h=400&fit=crop&crop=center',
    link: '/events/1',
  },
  {
    image:
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&h=400&fit=crop&crop=center',
    link: '/events/2',
  },
];

// 模拟事件详情数据
const mockEventDetails = [
  {
    id: 'eJoKli9smjh',
    name: 'Summer Music Festival 2024',
    organizerName: 'Event Masters',
    image:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1000&h=700&fit=crop&crop=center',
    status: 1,
    location: 'Marina Bay, Singapore',
    startTime: '2024-08-15T18:00:00Z',
    endTime: '2024-08-15T23:00:00Z',
    description:
      "Join us for an unforgettable summer music festival featuring top international artists. This multi-stage event will showcase diverse genres from electronic dance music to indie rock, ensuring there's something for every music lover.",
    crowdfundLink: '',
    slug: 'summer-music-festival-2024-eJoKli9smjh',
    address: 'Marina Bay Sands, Singapore',
    locationCoord: '1.2833,103.8607',
    descriptionImages: [
      {
        id: 1,
        image:
          'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=600&fit=crop&crop=center',
        type: 'image/jpeg',
      },
      {
        id: 2,
        image:
          'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&h=600&fit=crop&crop=center',
        type: 'image/jpeg',
      },
    ],
    refundPolicy: 1,
    descriptionShort: 'Summer music festival with top artists',
    raveSet: true,
    raveStatus: 1,
    contactEmail: 'info@eventmasters.com',
  },
  {
    id: 'mK8pQr3xNvB',
    name: 'Tech Conference 2024',
    organizerName: 'Tech Innovators',
    image:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&h=700&fit=crop&crop=center',
    status: 1,
    location: 'Suntec City, Singapore',
    startTime: '2024-09-20T09:00:00Z',
    endTime: '2024-09-20T18:00:00Z',
    description:
      'Discover the latest trends in technology and network with industry leaders. This comprehensive conference features keynote speakers from major tech companies, hands-on workshops, and networking opportunities with fellow tech enthusiasts.',
    crowdfundLink: '',
    slug: 'tech-conference-2024-mK8pQr3xNvB',
    address: 'Suntec Singapore Convention & Exhibition Centre',
    locationCoord: '1.2966,103.8591',
    descriptionImages: [
      {
        id: 3,
        image:
          'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=600&fit=crop&crop=center',
        type: 'image/jpeg',
      },
      {
        id: 4,
        image:
          'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&h=600&fit=crop&crop=center',
        type: 'image/jpeg',
      },
    ],
    refundPolicy: 1,
    descriptionShort: 'Latest tech trends and networking',
    raveSet: false,
    raveStatus: 0,
    contactEmail: 'info@techinnovators.com',
  },
  {
    id: 'zT5wLm2hYqE',
    name: 'Food & Wine Festival',
    organizerName: 'Culinary Society',
    image:
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1000&h=700&fit=crop&crop=center',
    status: 1,
    location: 'Clarke Quay, Singapore',
    startTime: '2024-10-05T16:00:00Z',
    endTime: '2024-10-05T22:00:00Z',
    description:
      'Experience the best cuisine and wines from around the world. Join renowned chefs and sommeliers for an evening of culinary excellence, wine tastings, and gastronomic adventures that will tantalize your taste buds.',
    crowdfundLink: '',
    slug: 'food-wine-festival-zT5wLm2hYqE',
    address: 'Clarke Quay Central, Singapore',
    locationCoord: '1.2884,103.8467',
    descriptionImages: [
      {
        id: 5,
        image:
          'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop&crop=center',
        type: 'image/jpeg',
      },
      {
        id: 6,
        image:
          'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&h=600&fit=crop&crop=center',
        type: 'image/jpeg',
      },
    ],
    refundPolicy: 1,
    descriptionShort: 'World-class cuisine and wine experience',
    raveSet: true,
    raveStatus: 1,
    contactEmail: 'info@culinarysociety.com',
  },
  {
    id: 'pR7nXs4kFgD',
    name: 'Electronic Dance Night',
    organizerName: 'Neon Beats Productions',
    image:
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1000&h=700&fit=crop&crop=center',
    status: 1,
    location: 'Zouk Singapore',
    startTime: '2024-08-30T22:00:00Z',
    endTime: '2024-08-31T04:00:00Z',
    description:
      'An electrifying night of beats and bass with international DJs. Experience the ultimate electronic dance music event featuring world-renowned DJs, state-of-the-art sound systems, and an unforgettable atmosphere.',
    crowdfundLink: '',
    slug: 'electronic-dance-night-pR7nXs4kFgD',
    address: '3C River Valley Rd, Clarke Quay, Singapore',
    locationCoord: '1.2884,103.8467',
    descriptionImages: [
      {
        id: 7,
        image:
          'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop&crop=center',
        type: 'image/jpeg',
      },
      {
        id: 8,
        image:
          'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop&crop=center',
        type: 'image/jpeg',
      },
    ],
    refundPolicy: 1,
    descriptionShort: 'Electronic dance music extravaganza',
    raveSet: true,
    raveStatus: 1,
    contactEmail: 'info@neonbeats.com',
  },
  {
    id: 'vH9bCj6uMtA',
    name: 'Art & Culture Expo',
    organizerName: 'Singapore Art Council',
    image:
      'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=1000&h=700&fit=crop&crop=center',
    status: 1,
    location: 'National Gallery Singapore',
    startTime: '2024-09-15T10:00:00Z',
    endTime: '2024-09-15T20:00:00Z',
    description:
      'Explore contemporary art and cultural exhibitions from local and international artists. This comprehensive expo showcases diverse art forms, interactive installations, and cultural performances celebrating creativity and artistic expression.',
    crowdfundLink: '',
    slug: 'art-culture-expo-vH9bCj6uMtA',
    address: "1 St Andrew's Rd, Singapore",
    locationCoord: '1.2903,103.8519',
    descriptionImages: [
      {
        id: 9,
        image:
          'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop&crop=center',
        type: 'image/jpeg',
      },
      {
        id: 10,
        image:
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center',
        type: 'image/jpeg',
      },
    ],
    refundPolicy: 1,
    descriptionShort: 'Contemporary art and cultural celebration',
    raveSet: false,
    raveStatus: 0,
    contactEmail: 'info@artcouncil.sg',
  },
  {
    id: 'qW3eRt8yLpS',
    name: 'Gaming Championship 2024',
    organizerName: 'eSports Singapore',
    image:
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1000&h=700&fit=crop&crop=center',
    status: 1,
    location: 'Singapore Expo',
    startTime: '2024-10-12T12:00:00Z',
    endTime: '2024-10-13T20:00:00Z',
    description:
      'Watch top gamers compete in the ultimate gaming championship. Experience intense competitions across multiple gaming titles, meet professional gamers, and witness the future of esports in this action-packed tournament.',
    crowdfundLink: '',
    slug: 'gaming-championship-2024-qW3eRt8yLpS',
    address: '1 Expo Dr, Singapore',
    locationCoord: '1.3347,103.9634',
    descriptionImages: [
      {
        id: 11,
        image:
          'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop&crop=center',
        type: 'image/jpeg',
      },
      {
        id: 12,
        image:
          'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800&h=600&fit=crop&crop=center',
        type: 'image/jpeg',
      },
    ],
    refundPolicy: 1,
    descriptionShort: 'Ultimate gaming championship experience',
    raveSet: true,
    raveStatus: 1,
    contactEmail: 'info@esportssg.com',
  },
  {
    id: 'nM5dGh1oZxK',
    name: 'Startup Pitch Night',
    organizerName: 'Innovation Hub',
    image:
      'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1000&h=700&fit=crop&crop=center',
    status: 1,
    location: 'Marina One, Singapore',
    startTime: '2024-09-25T19:00:00Z',
    endTime: '2024-09-25T22:00:00Z',
    description:
      'Watch innovative startups pitch their ideas to top investors. This exciting evening features emerging entrepreneurs presenting groundbreaking solutions, followed by networking opportunities with investors and industry leaders.',
    crowdfundLink: '',
    slug: 'startup-pitch-night-nM5dGh1oZxK',
    address: '5 Straits View, Marina One, Singapore',
    locationCoord: '1.2792,103.8554',
    descriptionImages: [
      {
        id: 13,
        image:
          'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=600&fit=crop&crop=center',
        type: 'image/jpeg',
      },
      {
        id: 14,
        image:
          'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop&crop=center',
        type: 'image/jpeg',
      },
    ],
    refundPolicy: 1,
    descriptionShort: 'Innovation meets investment',
    raveSet: false,
    raveStatus: 0,
    contactEmail: 'info@innovationhub.sg',
  },
  {
    id: 'bY7cVf4jPqI',
    name: 'Fitness & Wellness Expo',
    organizerName: 'HealthFirst Events',
    image:
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1000&h=700&fit=crop&crop=center',
    status: 1,
    location: 'Sports Hub, Singapore',
    startTime: '2024-11-02T08:00:00Z',
    endTime: '2024-11-02T18:00:00Z',
    description:
      'Discover the latest in fitness technology and wellness trends. Join fitness experts, try cutting-edge equipment, attend wellness workshops, and learn about the newest trends in health and fitness.',
    crowdfundLink: '',
    slug: 'fitness-wellness-expo-bY7cVf4jPqI',
    address: '1 Stadium Dr, Singapore Sports Hub',
    locationCoord: '1.3026,103.8747',
    descriptionImages: [
      {
        id: 15,
        image:
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&crop=center',
        type: 'image/jpeg',
      },
      {
        id: 16,
        image:
          'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop&crop=center',
        type: 'image/jpeg',
      },
    ],
    refundPolicy: 1,
    descriptionShort: 'Latest fitness and wellness innovations',
    raveSet: true,
    raveStatus: 1,
    contactEmail: 'info@healthfirst.sg',
  },
  {
    id: 'kL2aUi9wXrN',
    name: 'Photography Workshop',
    organizerName: 'Lens Masters',
    image:
      'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1000&h=700&fit=crop&crop=center',
    status: 1,
    location: 'Botanic Gardens, Singapore',
    startTime: '2024-10-20T14:00:00Z',
    endTime: '2024-10-20T17:00:00Z',
    description:
      "Learn professional photography techniques in Singapore's beautiful botanic gardens. This hands-on workshop covers composition, lighting, and post-processing techniques while exploring one of Singapore's most scenic locations.",
    crowdfundLink: '',
    slug: 'photography-workshop-kL2aUi9wXrN',
    address: '1 Cluny Rd, Singapore Botanic Gardens',
    locationCoord: '1.3138,103.8159',
    descriptionImages: [
      {
        id: 17,
        image:
          'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&h=600&fit=crop&crop=center',
        type: 'image/jpeg',
      },
      {
        id: 18,
        image:
          'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop&crop=center',
        type: 'image/jpeg',
      },
    ],
    refundPolicy: 1,
    descriptionShort: 'Professional photography in nature',
    raveSet: false,
    raveStatus: 0,
    contactEmail: 'info@lensmasters.sg',
  },
  {
    id: 'xP6tJm3sEhQ',
    name: 'Blockchain Summit 2024',
    organizerName: 'Crypto Singapore',
    image:
      'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1000&h=700&fit=crop&crop=center',
    status: 1,
    location: 'Raffles City, Singapore',
    startTime: '2024-11-15T09:00:00Z',
    endTime: '2024-11-16T18:00:00Z',
    description:
      'Explore the future of blockchain technology and cryptocurrency innovations. This two-day summit features industry leaders, technical workshops, and insights into the latest developments in blockchain and digital assets.',
    crowdfundLink: '',
    slug: 'blockchain-summit-2024-xP6tJm3sEhQ',
    address: '252 North Bridge Rd, Raffles City Shopping Centre',
    locationCoord: '1.2930,103.8558',
    descriptionImages: [
      {
        id: 19,
        image:
          'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop&crop=center',
        type: 'image/jpeg',
      },
      {
        id: 20,
        image:
          'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=600&fit=crop&crop=center',
        type: 'image/jpeg',
      },
    ],
    refundPolicy: 1,
    descriptionShort: 'Future of blockchain and crypto',
    raveSet: true,
    raveStatus: 1,
    contactEmail: 'info@cryptosg.com',
  },
];

// 模拟票务类型数据
const mockTicketTypes = [
  {
    id: 1,
    name: 'General Admission',
    description: 'Standard entry ticket with access to all stages',
    price: 150,
    stock: 500,
    purchaseLimit: 4,
    image:
      'https://images.unsplash.com/photo-1556742393-d75f468bfcb0?w=400&h=300&fit=crop&crop=center',
    imageType: 'image/jpeg',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1556742393-d75f468bfcb0?w=200&h=150&fit=crop&crop=center',
    thumbnailType: 'image/jpeg',
    externalLink: '',
    blockchainUrl: '',
    onSale: true,
  },
  {
    id: 2,
    name: 'VIP Pass',
    description:
      'Premium experience with backstage access and complimentary drinks',
    price: 350,
    stock: 100,
    purchaseLimit: 2,
    image:
      'https://images.unsplash.com/photo-1465221185621-d8a2806ac2e4?w=400&h=300&fit=crop&crop=center',
    imageType: 'image/jpeg',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1465221185621-d8a2806ac2e4?w=200&h=150&fit=crop&crop=center',
    thumbnailType: 'image/jpeg',
    externalLink: '',
    blockchainUrl: '',
    onSale: true,
  },
];

export const eventHandlers = [
  // 获取事件列表
  rest.get('*/api/v1/event', (req, res, ctx) => {
    const page = parseInt(req.url.searchParams.get('page') || '1');
    const size = parseInt(req.url.searchParams.get('size') || '10');
    const keyword = req.url.searchParams.get('keyword') || '';

    let filteredEvents = mockEvents;
    if (keyword) {
      filteredEvents = mockEvents.filter(
        (event) =>
          event.name.toLowerCase().includes(keyword.toLowerCase()) ||
          event.organizerName.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;
    const paginatedEvents = filteredEvents.slice(startIndex, endIndex);

    return res(
      ctx.status(200),
      ctx.json({
        code: 200,
        message: 'Success',
        data: paginatedEvents,
      })
    );
  }),

  // 获取事件详情
  rest.get('*/api/v1/event/:eventId', (req, res, ctx) => {
    const { eventId } = req.params;

    const eventDetail = mockEventDetails.find((event) => event.id === eventId);

    if (!eventDetail) {
      // 如果找不到对应的事件，返回第一个事件作为默认值
      return res(
        ctx.status(200),
        ctx.json({
          code: 200,
          message: 'Success',
          data: mockEventDetails[0],
        })
      );
    }

    return res(
      ctx.status(200),
      ctx.json({
        code: 200,
        message: 'Success',
        data: eventDetail,
      })
    );
  }),

  // 获取事件票务类型
  rest.get('*/api/v1/event/:eventId/type', (req, res, ctx) => {
    const { eventId } = req.params;

    // 根据不同的事件提供不同的票务类型
    const getTicketTypesByEventId = (eventId: string) => {
      switch (eventId) {
        case '1': // Summer Music Festival
          return [
            {
              id: 1,
              name: 'General Admission',
              description: 'Standard entry ticket with access to all stages',
              price: 150,
              stock: 500,
              purchaseLimit: 4,
              image:
                'https://images.unsplash.com/photo-1556742393-d75f468bfcb0?w=400&h=300&fit=crop&crop=center',
              imageType: 'image/jpeg',
              thumbnailUrl:
                'https://images.unsplash.com/photo-1556742393-d75f468bfcb0?w=200&h=150&fit=crop&crop=center',
              thumbnailType: 'image/jpeg',
              externalLink: '',
              blockchainUrl: '',
              onSale: true,
            },
            {
              id: 2,
              name: 'VIP Pass',
              description:
                'Premium experience with backstage access and complimentary drinks',
              price: 350,
              stock: 100,
              purchaseLimit: 2,
              image:
                'https://images.unsplash.com/photo-1465221185621-d8a2806ac2e4?w=400&h=300&fit=crop&crop=center',
              imageType: 'image/jpeg',
              thumbnailUrl:
                'https://images.unsplash.com/photo-1465221185621-d8a2806ac2e4?w=200&h=150&fit=crop&crop=center',
              thumbnailType: 'image/jpeg',
              externalLink: '',
              blockchainUrl: '',
              onSale: true,
            },
          ];
        case '2': // Tech Conference
          return [
            {
              id: 3,
              name: 'Standard Pass',
              description:
                'Access to all conference sessions and networking areas',
              price: 200,
              stock: 300,
              purchaseLimit: 2,
              image:
                'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop&crop=center',
              imageType: 'image/jpeg',
              thumbnailUrl:
                'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200&h=150&fit=crop&crop=center',
              thumbnailType: 'image/jpeg',
              externalLink: '',
              blockchainUrl: '',
              onSale: true,
            },
            {
              id: 4,
              name: 'Premium Pass',
              description:
                'Includes workshops, premium seating, and networking dinner',
              price: 450,
              stock: 80,
              purchaseLimit: 1,
              image:
                'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop&crop=center',
              imageType: 'image/jpeg',
              thumbnailUrl:
                'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=200&h=150&fit=crop&crop=center',
              thumbnailType: 'image/jpeg',
              externalLink: '',
              blockchainUrl: '',
              onSale: true,
            },
          ];
        case '3': // Food & Wine Festival
          return [
            {
              id: 5,
              name: 'Tasting Pass',
              description: 'Access to food tastings and wine samples',
              price: 120,
              stock: 400,
              purchaseLimit: 3,
              image:
                'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop&crop=center',
              imageType: 'image/jpeg',
              thumbnailUrl:
                'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&h=150&fit=crop&crop=center',
              thumbnailType: 'image/jpeg',
              externalLink: '',
              blockchainUrl: '',
              onSale: true,
            },
            {
              id: 6,
              name: "Chef's Table Experience",
              description: 'Exclusive dining experience with celebrity chefs',
              price: 300,
              stock: 50,
              purchaseLimit: 2,
              image:
                'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop&crop=center',
              imageType: 'image/jpeg',
              thumbnailUrl:
                'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&h=150&fit=crop&crop=center',
              thumbnailType: 'image/jpeg',
              externalLink: '',
              blockchainUrl: '',
              onSale: true,
            },
          ];
        case '4': // Electronic Dance Night
          return [
            {
              id: 7,
              name: 'Dance Floor Access',
              description: 'General admission to the main dance floor',
              price: 80,
              stock: 800,
              purchaseLimit: 6,
              image:
                'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center',
              imageType: 'image/jpeg',
              thumbnailUrl:
                'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=150&fit=crop&crop=center',
              thumbnailType: 'image/jpeg',
              externalLink: '',
              blockchainUrl: '',
              onSale: true,
            },
            {
              id: 8,
              name: 'VIP Booth',
              description: 'Private booth with bottle service and premium view',
              price: 500,
              stock: 20,
              purchaseLimit: 1,
              image:
                'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop&crop=center',
              imageType: 'image/jpeg',
              thumbnailUrl:
                'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=200&h=150&fit=crop&crop=center',
              thumbnailType: 'image/jpeg',
              externalLink: '',
              blockchainUrl: '',
              onSale: true,
            },
          ];
        case '5': // Art & Culture Expo
          return [
            {
              id: 9,
              name: 'Gallery Pass',
              description: 'Access to all exhibitions and art installations',
              price: 60,
              stock: 200,
              purchaseLimit: 4,
              image:
                'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=400&h=300&fit=crop&crop=center',
              imageType: 'image/jpeg',
              thumbnailUrl:
                'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=200&h=150&fit=crop&crop=center',
              thumbnailType: 'image/jpeg',
              externalLink: '',
              blockchainUrl: '',
              onSale: true,
            },
          ];
        case '6': // Gaming Championship
          return [
            {
              id: 10,
              name: 'Spectator Pass',
              description: 'Watch all tournament matches and meet & greets',
              price: 100,
              stock: 600,
              purchaseLimit: 4,
              image:
                'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop&crop=center',
              imageType: 'image/jpeg',
              thumbnailUrl:
                'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&h=150&fit=crop&crop=center',
              thumbnailType: 'image/jpeg',
              externalLink: '',
              blockchainUrl: '',
              onSale: true,
            },
            {
              id: 11,
              name: 'Player Pass',
              description:
                'Participate in side tournaments and gaming stations',
              price: 180,
              stock: 150,
              purchaseLimit: 2,
              image:
                'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop&crop=center',
              imageType: 'image/jpeg',
              thumbnailUrl:
                'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=200&h=150&fit=crop&crop=center',
              thumbnailType: 'image/jpeg',
              externalLink: '',
              blockchainUrl: '',
              onSale: true,
            },
          ];
        case '7': // Startup Pitch Night
          return [
            {
              id: 12,
              name: 'Networking Pass',
              description:
                'Access to pitch presentations and networking session',
              price: 50,
              stock: 150,
              purchaseLimit: 2,
              image:
                'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop&crop=center',
              imageType: 'image/jpeg',
              thumbnailUrl:
                'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=200&h=150&fit=crop&crop=center',
              thumbnailType: 'image/jpeg',
              externalLink: '',
              blockchainUrl: '',
              onSale: true,
            },
          ];
        case '8': // Fitness & Wellness Expo
          return [
            {
              id: 13,
              name: 'Expo Pass',
              description: 'Access to all fitness demos and wellness workshops',
              price: 40,
              stock: 300,
              purchaseLimit: 3,
              image:
                'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center',
              imageType: 'image/jpeg',
              thumbnailUrl:
                'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=150&fit=crop&crop=center',
              thumbnailType: 'image/jpeg',
              externalLink: '',
              blockchainUrl: '',
              onSale: true,
            },
            {
              id: 14,
              name: 'Premium Wellness Package',
              description:
                'Includes personal training session and nutrition consultation',
              price: 150,
              stock: 50,
              purchaseLimit: 1,
              image:
                'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop&crop=center',
              imageType: 'image/jpeg',
              thumbnailUrl:
                'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=150&fit=crop&crop=center',
              thumbnailType: 'image/jpeg',
              externalLink: '',
              blockchainUrl: '',
              onSale: true,
            },
          ];
        case '9': // Photography Workshop
          return [
            {
              id: 15,
              name: 'Workshop Pass',
              description:
                '3-hour photography workshop with professional guidance',
              price: 120,
              stock: 25,
              purchaseLimit: 1,
              image:
                'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&h=300&fit=crop&crop=center',
              imageType: 'image/jpeg',
              thumbnailUrl:
                'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=200&h=150&fit=crop&crop=center',
              thumbnailType: 'image/jpeg',
              externalLink: '',
              blockchainUrl: '',
              onSale: true,
            },
          ];
        case '10': // Blockchain Summit
          return [
            {
              id: 16,
              name: 'Conference Pass',
              description:
                '2-day access to all blockchain sessions and exhibitions',
              price: 300,
              stock: 200,
              purchaseLimit: 2,
              image:
                'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop&crop=center',
              imageType: 'image/jpeg',
              thumbnailUrl:
                'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=200&h=150&fit=crop&crop=center',
              thumbnailType: 'image/jpeg',
              externalLink: '',
              blockchainUrl: '',
              onSale: true,
            },
            {
              id: 17,
              name: 'VIP Summit Pass',
              description:
                'Includes exclusive investor meetups and premium networking',
              price: 800,
              stock: 30,
              purchaseLimit: 1,
              image:
                'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&h=300&fit=crop&crop=center',
              imageType: 'image/jpeg',
              thumbnailUrl:
                'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=200&h=150&fit=crop&crop=center',
              thumbnailType: 'image/jpeg',
              externalLink: '',
              blockchainUrl: '',
              onSale: true,
            },
          ];
        default:
          return mockTicketTypes;
      }
    };

    return res(
      ctx.status(200),
      ctx.json({
        code: 200,
        message: 'Success',
        data: getTicketTypesByEventId(eventId.toString()),
      })
    );
  }),

  // 获取横幅列表
  rest.get('*/api/v1/banner', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        code: 200,
        message: 'Success',
        data: mockBanners,
      })
    );
  }),

  // 获取事件市场
  rest.get('*/api/v1/market', (req, res, ctx) => {
    const mockMarketData = [
      {
        id: '1',
        name: 'Summer Festival Ticket',
        organizerName: 'Event Masters',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=150&fit=crop&crop=center',
        thumbnailType: 'image/jpeg',
        location: 'Marina Bay, Singapore',
        startTime: '2024-08-15T18:00:00Z',
        endTime: '2024-08-15T23:00:00Z',
        type: 'Secondary Market',
        status: 1,
        userName: 'John Doe',
        currency: 'SGD',
        sellPrice: 180,
        owner: false,
      },
    ];

    return res(
      ctx.status(200),
      ctx.json({
        code: 200,
        message: 'Success',
        data: mockMarketData,
      })
    );
  }),

  // 访问分享链接
  rest.post('*/api/v1/rave/:eventId/shared', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        code: 200,
        message: 'Success',
        data: { success: true },
      })
    );
  }),
];
