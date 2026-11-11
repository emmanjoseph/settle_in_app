// Placeholder reels. Swap for your API. `videoUrl` is optional: when present the
// reel plays video, otherwise it shows `image`. `propertyId` links to /property/[id].
export type Reel = {
    id: string;
    propertyId: string;
    videoUrl?: string;
    image: string;
    agent: { handle: string; name: string; role: string; avatar: string };
    title: string;
    priceLabel: string;
    description: string;
    location: string;
    beds: number;
    baths: number;
    likes: number;
    comments: number;
};

const img = (id: string) => `https://images.unsplash.com/${id}?w=1200`;
const AVATAR_A = "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200";
const AVATAR_B = "https://images.unsplash.com/photo-1627161684458-a62da52b51c3?w=200";

export const REELS: Reel[] = [
    {
        id: "r1",
        propertyId: "1",
        image: img("photo-1530411482134-f721bddc703e"),
        agent: { handle: "jamie.realty", name: "Jamie Morrison", role: "Realtor®", avatar: AVATAR_A },
        title: "4-Bed Villa, Beverly Hills",
        priceLabel: "$2,400,000",
        description: "Stunning modern villa with infinity pool, panoramic city views & private cinema. A rare find. 🌴",
        location: "Beverly Hills, CA",
        beds: 4,
        baths: 5,
        likes: 12400,
        comments: 842,
    },
    {
        id: "r2",
        propertyId: "2",
        image: img("photo-1502672260266-1c1ef2d93688"),
        agent: { handle: "nycloft.co", name: "Dana Whitfield", role: "Listing agent", avatar: AVATAR_B },
        title: "Downtown Loft Tour",
        priceLabel: "$850,000",
        description: "Exposed brick, 14-ft ceilings and a skyline view from the bedroom. 🏙️",
        location: "Manhattan, NYC",
        beds: 2,
        baths: 2,
        likes: 8300,
        comments: 410,
    },
    {
        id: "r3",
        propertyId: "3",
        image: img("photo-1512917774080-9991f1c4c750"),
        agent: { handle: "austinhomes", name: "Marcus Reed", role: "Realtor®", avatar: AVATAR_A },
        title: "Family Home with Garden",
        priceLabel: "$620,000",
        description: "Fenced backyard, two-car garage and a quiet street near great schools. 🌳",
        location: "Austin, TX",
        beds: 4,
        baths: 3,
        likes: 5100,
        comments: 233,
    },
    {
        id: "r4",
        propertyId: "4",
        image: img("photo-1613490493576-7fde63acd811"),
        agent: { handle: "miamiluxe", name: "Sofia Alvarez", role: "Luxury specialist", avatar: AVATAR_B },
        title: "Sky Penthouse Suite",
        priceLabel: "$3,100,000",
        description: "A wraparound terrace above the bay. Sunset views start at 6 PM. 🌅",
        location: "Miami Beach, FL",
        beds: 3,
        baths: 3,
        likes: 20100,
        comments: 1200,
    },
    {
        id: "r5",
        propertyId: "5",
        image: img("photo-1582268611958-ebfd161ef9cf"),
        agent: { handle: "brooklynrentals", name: "Chris Park", role: "Rental agent", avatar: AVATAR_A },
        title: "Bright Downtown Apartment",
        priceLabel: "$4,500/mo",
        description: "Sunny 2-bed with in-unit laundry, steps from the subway. Pets welcome. 🐾",
        location: "Brooklyn, NY",
        beds: 2,
        baths: 1,
        likes: 3700,
        comments: 156,
    },
];