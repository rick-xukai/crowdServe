import { rest } from 'msw';

const mockCrowdfunds = [
  {
    id: '1',
    name: 'Indie Music Festival 2024',
    organizer: {
      name: 'Independent Artists Union',
    },
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&h=400&fit=crop&crop=center',
    description: 'Help us bring together the best independent artists for an unforgettable music festival experience.',
    unitPrice: 25,
    goalNumber: 2000, // Goal: 2000 tickets at $25 each = $50,000
    raisedNumber: 1300, // Raised: 1300 tickets = $32,500
    currency: 'SGD',
    backers: 245,
    status: 1, // 1: in progress, 2: succeeded, 3: failed
    startDate: '2024-06-01T00:00:00Z',
    endTime: '2024-07-31T23:59:59Z',
    externalLink: 'https://crowdfund.example.com/indie-music-festival',
    eventId: 1,
    address: 'Marina Bay, Singapore',
    estimatedTime: '2024-08-15T18:00:00Z',
    rewards: [
      {
        id: 1,
        amount: 25,
        title: 'Early Bird Support',
        description: 'Get a digital thank you postcard and festival updates',
        backers: 89,
        estimated_delivery: '2024-08-15',
      },
      {
        id: 2,
        amount: 100,
        title: 'Festival Merchandise',
        description: 'Exclusive t-shirt and tote bag with early access to tickets',
        backers: 67,
        estimated_delivery: '2024-08-10',
      },
      {
        id: 3,
        amount: 500,
        title: 'VIP Experience',
        description: 'VIP tickets, backstage access, and meet-and-greet with artists',
        backers: 12,
        estimated_delivery: '2024-08-15',
      },
    ],
    updates: [
      {
        id: 1,
        title: '65% Funded! New Artist Announcement',
        content: "We're thrilled to announce that we've reached 65% of our goal! Plus, we're excited to reveal our headlining act...",
        date: '2024-07-10T12:00:00Z',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=300&fit=crop&crop=center',
      },
      {
        id: 2,
        title: 'Festival Venue Confirmed',
        content: "We've secured the perfect venue for our indie music festival. Located in the heart of the city...",
        date: '2024-07-05T10:00:00Z',
        image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&h=300&fit=crop&crop=center',
      },
    ],
  },
  {
    id: '2',
    name: 'Community Art Space',
    organizer: {
      name: 'Local Artists Collective',
    },
    image: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=500&h=400&fit=crop&crop=center',
    description: 'Create a dedicated space for local artists to showcase their work and connect with the community.',
    unitPrice: 50,
    goalNumber: 600, // Goal: 600 tickets at $50 each = $30,000
    raisedNumber: 575, // Raised: 575 tickets = $28,750
    currency: 'SGD',
    backers: 156,
    status: 1,
    startDate: '2024-05-15T00:00:00Z',
    endTime: '2024-07-30T23:59:59Z',
    externalLink: 'https://crowdfund.example.com/community-art-space',
    eventId: 5,
    address: 'National Gallery Singapore',
    estimatedTime: '2024-09-01T10:00:00Z',
    rewards: [
      {
        id: 1,
        amount: 50,
        title: 'Community Supporter',
        description: 'Your name on our donor wall and invitation to opening event',
        backers: 45,
        estimated_delivery: '2024-09-01',
      },
      {
        id: 2,
        amount: 200,
        title: 'Art Patron',
        description: 'Limited edition print from featured artist plus community supporter rewards',
        backers: 23,
        estimated_delivery: '2024-09-15',
      },
    ],
    updates: [
      {
        id: 1,
        title: 'Almost There! 95% Funded',
        content: "We're so close to reaching our goal! Just 25 more tickets to secure our community art space...",
        date: '2024-07-20T14:00:00Z',
        image: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=500&h=300&fit=crop&crop=center',
      },
    ],
  },
  {
    id: '3',
    name: 'Tech Innovation Summit',
    organizer: {
      name: 'Tech Innovators',
    },
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=400&fit=crop&crop=center',
    description: 'Fund the ultimate technology conference bringing together industry leaders and innovators.',
    unitPrice: 150,
    goalNumber: 400, // Goal: 400 tickets at $150 each = $60,000
    raisedNumber: 400, // Fully funded!
    currency: 'SGD',
    backers: 320,
    status: 2, // succeeded
    startDate: '2024-04-01T00:00:00Z',
    endTime: '2024-06-30T23:59:59Z',
    externalLink: 'https://crowdfund.example.com/tech-summit',
    eventId: 2,
    address: 'Suntec Singapore Convention Centre',
    estimatedTime: '2024-09-20T09:00:00Z',
    rewards: [
      {
        id: 1,
        amount: 150,
        title: 'Conference Access',
        description: 'Full access to all sessions and networking events',
        backers: 200,
        estimated_delivery: '2024-09-20',
      },
      {
        id: 2,
        amount: 300,
        title: 'Premium Package',
        description: 'Conference access plus exclusive workshops and VIP networking',
        backers: 80,
        estimated_delivery: '2024-09-20',
      },
    ],
    updates: [
      {
        id: 1,
        title: 'Fully Funded! Thank You!',
        content: 'We did it! Thanks to your amazing support, we reached our funding goal. Get ready for an incredible tech summit!',
        date: '2024-06-25T16:00:00Z',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=300&fit=crop&crop=center',
      },
    ],
  },
  {
    id: '4',
    name: 'Gaming Championship Arena',
    organizer: {
      name: 'eSports Singapore',
    },
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&h=400&fit=crop&crop=center',
    description: 'Build the ultimate gaming arena for esports tournaments and community events.',
    unitPrice: 75,
    goalNumber: 800, // Goal: 800 tickets at $75 each = $60,000
    raisedNumber: 200, // Only 200 tickets sold = $15,000
    currency: 'SGD',
    backers: 45,
    status: 3, // failed
    startDate: '2024-03-01T00:00:00Z',
    endTime: '2024-05-31T23:59:59Z',
    externalLink: 'https://crowdfund.example.com/gaming-arena',
    eventId: 6,
    address: 'Singapore Expo',
    estimatedTime: '2024-10-12T12:00:00Z',
    rewards: [
      {
        id: 1,
        amount: 75,
        title: 'Gaming Supporter',
        description: 'Early access to arena events and gaming merchandise',
        backers: 30,
        estimated_delivery: '2024-10-01',
      },
    ],
    updates: [
      {
        id: 1,
        title: 'Campaign Update',
        content: 'Unfortunately, we were unable to reach our funding goal. All contributions will be refunded.',
        date: '2024-06-01T10:00:00Z',
        image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&h=300&fit=crop&crop=center',
      },
    ],
  },
];

export const crowdfundHandlers = [
  // 获取众筹列表
  rest.get('*/api/v1/crowdfund', (req, res, ctx) => {
    const page = parseInt(req.url.searchParams.get('page') || '1');
    const size = parseInt(req.url.searchParams.get('size') || '10');
    const status = req.url.searchParams.get('status');

    let filteredCrowdfunds = mockCrowdfunds;
    if (status) {
      filteredCrowdfunds = mockCrowdfunds.filter(
        (cf) => cf.status.toString() === status
      );
    }

    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;
    const paginatedCrowdfunds = filteredCrowdfunds.slice(startIndex, endIndex);

    return res(
      ctx.status(200),
      ctx.json({
        code: 200,
        message: 'Success',
        data: paginatedCrowdfunds,
      })
    );
  }),

  // 获取众筹详情
  rest.get('*/api/v1/crowdfund/:id', (req, res, ctx) => {
    const { id } = req.params;
    const crowdfund =
      mockCrowdfunds.find((cf) => cf.id.toString() === id) || mockCrowdfunds[0];

    return res(
      ctx.status(200),
      ctx.json({
        code: 200,
        message: 'Success',
        data: {
          ...crowdfund,
          // 添加额外的详细信息
          fullDescription: `${crowdfund.description}\n\nThis crowdfunding campaign aims to create something truly special for our community. With your support, we can make this vision a reality and bring people together through the power of creativity and shared experiences.`,
          faqs: [
            {
              question: 'When will the project be completed?',
              answer: 'We expect to complete the project within 2-3 months after successful funding.',
            },
            {
              question: "What happens if the goal isn't reached?",
              answer: "If we don't reach our funding goal, all contributions will be refunded to backers.",
            },
            {
              question: 'Can I change my contribution amount?',
              answer: 'Yes, you can modify your contribution amount until the campaign ends.',
            },
          ],
          risks: [
            'Weather conditions may affect outdoor events',
            'Permits and licenses may cause minor delays',
            'Artist availability may require schedule adjustments',
          ],
        },
      })
    );
  }),
]; 