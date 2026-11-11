// Placeholder conversations. Swap for your API / realtime source.
export type ChatItem =
    | { kind: "date"; id: string; label: string }
    | {
    kind: "msg";
    id: string;
    from: "me" | "them";
    time: string;
    text?: string;
    file?: { name: string; size: string };
    seen?: string; // e.g. "10:42 AM" – shown under the last message I sent
};

export type Conversation = {
    id: string;
    name: string;
    avatar: string;
    online?: boolean;
    phone?: string;
    lastMessage: string;
    time: string;
    unread: number;
    typing?: boolean;
    property?: { id: string; title: string; priceLabel: string; image: string };
    messages: ChatItem[];
};

const av = (id: string) => `https://images.unsplash.com/${id}?w=200`;

/** one-message thread for conversations we only have a preview for */
const stub = (id: string, text: string, time: string): ChatItem[] => [
    { kind: "date", id: `${id}-d`, label: "Today" },
    { kind: "msg", id: `${id}-1`, from: "them", time, text },
];

export const CONVERSATIONS: Conversation[] = [
    {
        id: "sarah-mitchell",
        name: "Sarah Mitchell",
        avatar: av("photo-1573496359142-b8d87734a5a2"),
        online: true,
        lastMessage: "The 3BR on Maple St is still available. Want to schedule a viewing?",
        time: "2 min",
        unread: 3,
        messages: stub("sarah", "The 3BR on Maple St is still available. Want to schedule a viewing?", "9:58 AM"),
    },
    {
        id: "james-donovan",
        name: "James Donovan",
        avatar: av("photo-1507003211169-0a1dd7228f2d"),
        online: true,
        phone: "+12125550182",
        lastMessage: "You: Perfect, thanks! Just confirmed the visit.",
        time: "10 min",
        unread: 0,
        typing: true,
        property: {
            id: "1",
            title: "Modern Penthouse — Manhattan",
            priceLabel: "$4.2M",
            image: av("photo-1545324418-cc1a3fa10c00"),
        },
        messages: [
            { kind: "date", id: "d1", label: "Today" },
            { kind: "msg", id: "m1", from: "them", time: "10:24 AM", text: "Hi Alex! Thanks for your interest in the Manhattan Penthouse. Are you available for a viewing this week?" },
            { kind: "msg", id: "m2", from: "them", time: "10:25 AM", text: "It features floor-to-ceiling windows, a wraparound terrace, and Central Park views 🌆" },
            { kind: "msg", id: "m3", from: "me", time: "10:31 AM", text: "Hi James! Yes, I'd love to see it. Does Wednesday around noon work?" },
            { kind: "msg", id: "m4", from: "me", time: "10:32 AM", text: "Also, is parking included with the unit?" },
            { kind: "msg", id: "m5", from: "them", time: "10:38 AM", text: "Wednesday at 12:00 PM is perfect ✅ Yes, two reserved parking spots are included." },
            { kind: "msg", id: "m6", from: "them", time: "10:39 AM", file: { name: "Property_Brochure.pdf", size: "2.4 MB" } },
            { kind: "msg", id: "m7", from: "me", time: "10:41 AM", text: "Perfect, thanks! Just confirmed the visit. See you Wednesday 🙌", seen: "10:42 AM" },
        ],
    },
    {
        id: "james-carter",
        name: "James Carter",
        avatar: av("photo-1500648767791-00dcc994a43e"),
        lastMessage: "Sounds good — I'll send the contract tonight.",
        time: "14 min",
        unread: 1,
        messages: stub("jc", "Sounds good — I'll send the contract tonight.", "9:46 AM"),
    },
    {
        id: "emily-rodriguez",
        name: "Emily Rodriguez",
        avatar: av("photo-1438761681033-6461ffad8d80"),
        lastMessage: "Thanks for the listing photos, they look amazing!",
        time: "1 hr",
        unread: 0,
        messages: stub("er", "Thanks for the listing photos, they look amazing!", "9:00 AM"),
    },
    {
        id: "michael-chen",
        name: "Michael Chen",
        avatar: av("photo-1507003211169-0a1dd7228f2d"),
        lastMessage: "Can we negotiate the closing date for the condo?",
        time: "3 hr",
        unread: 2,
        messages: stub("mc", "Can we negotiate the closing date for the condo?", "7:12 AM"),
    },
    {
        id: "olivia-bennett",
        name: "Olivia Bennett",
        avatar: av("photo-1544005313-94ddf0286df2"),
        lastMessage: "I've shared the floor plans in your inbox.",
        time: "Yesterday",
        unread: 0,
        messages: stub("ob", "I've shared the floor plans in your inbox.", "4:20 PM"),
    },
    {
        id: "david-park",
        name: "David Park",
        avatar: av("photo-1472099645785-5658abf4ff4e"),
        lastMessage: "Open house this Saturday at 2pm — see you there!",
        time: "2 days",
        unread: 0,
        messages: stub("dp", "Open house this Saturday at 2pm — see you there!", "1:05 PM"),
    },
    {
        id: "sonniey",
        name: "Sonniey Gurl",
        avatar: av("photo-1472099645785-5658abf4ff4e"),
        lastMessage: "Mannu Come butter up my biscuit",
        time: "2 days",
        unread: 0,
        messages: stub("dp", "Mannu Come butter up my biscuit", "1:05 PM"),
    },
];

export const getConversation = (id?: string) => CONVERSATIONS.find((c) => c.id === id);