// Placeholder data keyed by the same ids used on Home/Explore. Swap for your API.
export type Amenity = "pool" | "parking" | "smart" | "gym" | "garden" | "security";

export type PropertyDetail = {
    id: string;
    title: string;
    listingType: "For Sale" | "For Rent";
    address: string;
    price: number;
    priceLabel: string;
    areaSqft: number;
    beds: number;
    baths: number;
    images: string[];
    description: string;
    yearBuilt: number;
    parking: string;
    listed: string;
    // sale only
    hoa?: string;
    // rent only (price / priceLabel are the monthly rent)
    deposit?: string;
    leaseTerm?: string;
    availableFrom?: string;
    petsAllowed?: boolean;
    furnished?: boolean;
    amenities: Amenity[];
    agent: { name: string; avatar: string; rating: number; reviews: number; phone: string };
    latitude: number;
    longitude: number;
};

const u = (id: string) => `https://images.unsplash.com/${id}?w=1200`;

const AGENT = {
    name: "James Donovan",
    avatar: "https://images.unsplash.com/photo-1627161684458-a62da52b51c3?w=200",
    rating: 4.9,
    reviews: 128,
    phone: "+12125550182",
};

export const PROPERTY_DETAILS: Record<string, PropertyDetail> = {
    "1": {
        id: "1",
        title: "Modern Villa Estate",
        listingType: "For Sale",
        address: "Runda, Nairobi, Kenya",
        price: 85000000,
        priceLabel: "KES 85M",
        areaSqft: 4200,
        beds: 5,
        baths: 4,
        images: [
            u("photo-1568605114967-8130f3a36994"),
            u("photo-1600585154340-be6161a56a0c"),
            u("photo-1605276374104-dee2a0ed3cd6"),
            u("photo-1564013799919-ab600027ffc6"),
            u("photo-1600566753190-17f0baa2a6c3"),
            u("photo-1570129477492-45c003edd2be"),
        ],
        description:
            "Experience refined living in this spacious five-bedroom villa in the prestigious Runda neighbourhood. Featuring elegant interiors, expansive windows, a private garden, modern kitchen and generous outdoor spaces, this home offers comfort, privacy and convenience in one of Nairobi's most desirable residential areas.",
        yearBuilt: 2022,
        parking: "3 spaces",
        hoa: "KES 25,000 / mo",
        listed: "5 days ago",
        amenities: ["pool", "parking", "smart", "garden", "security"],
        agent: AGENT,
        latitude: -1.2156,
        longitude: 36.8073,
    },

    "2": {
        id: "2",
        title: "Westlands Luxury Apartment",
        listingType: "For Sale",
        address: "Westlands, Nairobi, Kenya",
        price: 28500000,
        priceLabel: "KES 28.5M",
        areaSqft: 1500,
        beds: 2,
        baths: 2,
        images: [
            u("photo-1502672260266-1c1ef2d93688"),
            u("photo-1582268611958-ebfd161ef9cf"),
            u("photo-1576941089067-2de3c901e126"),
            u("photo-1613490493576-7fde63acd811"),
        ],
        description:
            "A contemporary two-bedroom apartment in the heart of Westlands. Enjoy spacious interiors, floor-to-ceiling windows, a modern fitted kitchen and access to premium residential facilities. Conveniently located near Sarit Centre, Westgate Mall, restaurants and major business offices.",
        yearBuilt: 2023,
        parking: "2 spaces",
        hoa: "KES 18,000 / mo",
        listed: "12 days ago",
        amenities: ["smart", "gym", "security", "parking"],
        agent: AGENT,
        latitude: -1.2648,
        longitude: 36.8021,
    },

    "3": {
        id: "3",
        title: "Family Home with Garden",
        listingType: "For Sale",
        address: "Syokimau, Machakos County, Kenya",
        price: 18500000,
        priceLabel: "KES 18.5M",
        areaSqft: 2800,
        beds: 4,
        baths: 3,
        images: [
            u("photo-1512917774080-9991f1c4c750"),
            u("photo-1600566753190-17f0baa2a6c3"),
            u("photo-1570129477492-45c003edd2be"),
            u("photo-1564013799919-ab600027ffc6"),
        ],
        description:
            "Discover comfortable family living in this spacious four-bedroom home in Syokimau. The property features bright living spaces, a modern kitchen, a private garden and ample parking. Its location offers convenient access to Nairobi, JKIA, Gateway Mall and the Nairobi Expressway.",
        yearBuilt: 2021,
        parking: "2 spaces",
        hoa: "KES 5,000 / mo",
        listed: "3 weeks ago",
        amenities: ["parking", "garden", "security"],
        agent: AGENT,
        latitude: -1.3612,
        longitude: 36.9464,
    },

    "4": {
        id: "4",
        title: "Luxury Kilimani Penthouse",
        listingType: "For Sale",
        address: "Kilimani, Nairobi, Kenya",
        price: 65000000,
        priceLabel: "KES 65M",
        areaSqft: 3500,
        beds: 3,
        baths: 3,
        images: [
            u("photo-1613490493576-7fde63acd811"),
            u("photo-1600585154340-be6161a56a0c"),
            u("photo-1605276374104-dee2a0ed3cd6"),
            u("photo-1582268611958-ebfd161ef9cf"),
            u("photo-1502672260266-1c1ef2d93688"),
        ],
        description:
            "An exceptional penthouse residence in Kilimani, offering expansive living areas, elegant finishes and a private terrace with impressive city views. The home features a designer kitchen, spacious bedrooms and access to premium facilities, all within easy reach of Yaya Centre, restaurants and business districts.",
        yearBuilt: 2023,
        parking: "2 spaces",
        hoa: "KES 32,000 / mo",
        listed: "12 days ago",
        amenities: ["pool", "parking", "smart", "gym", "security"],
        agent: AGENT,
        latitude: -1.2921,
        longitude: 36.7857,
    },

    "5": {
        id: "5",
        title: "Modern Furnished Apartment",
        listingType: "For Rent",
        address: "Kileleshwa, Nairobi, Kenya",
        price: 120000,
        priceLabel: "KES 120,000 / mo",
        areaSqft: 1100,
        beds: 2,
        baths: 2,
        images: [
            u("photo-1502672260266-1c1ef2d93688"),
            u("photo-1582268611958-ebfd161ef9cf"),
            u("photo-1576941089067-2de3c901e126"),
            u("photo-1613490493576-7fde63acd811"),
        ],
        description:
            "A beautifully finished two-bedroom apartment in the peaceful Kileleshwa neighbourhood. Featuring spacious interiors, a modern kitchen, large windows and quality fittings, this home offers comfortable urban living with convenient access to Lavington, Kilimani and Westlands.",
        yearBuilt: 2022,
        parking: "1 space",
        listed: "2 days ago",
        deposit: "KES 120,000",
        leaseTerm: "12 months",
        availableFrom: "December 1, 2026",
        petsAllowed: true,
        furnished: true,
        amenities: ["gym", "security", "smart", "parking"],
        agent: AGENT,
        latitude: -1.2757,
        longitude: 36.7836,
    },

    "6": {
        id: "6",
        title: "Garden Townhouse",
        listingType: "For Rent",
        address: "Karen, Nairobi, Kenya",
        price: 250000,
        priceLabel: "KES 250,000 / mo",
        areaSqft: 1800,
        beds: 3,
        baths: 2,
        images: [
            u("photo-1570129477492-45c003edd2be"),
            u("photo-1512917774080-9991f1c4c750"),
            u("photo-1600566753190-17f0baa2a6c3"),
            u("photo-1564013799919-ab600027ffc6"),
        ],
        description:
            "Enjoy relaxed suburban living in this charming three-bedroom townhouse in Karen. The home features generous living spaces, a private garden, modern kitchen and secure parking. Conveniently located near The Hub Karen, international schools, shopping centres and recreational facilities.",
        yearBuilt: 2020,
        parking: "2 spaces",
        listed: "1 week ago",
        deposit: "KES 250,000",
        leaseTerm: "12 months",
        availableFrom: "January 1, 2027",
        petsAllowed: true,
        furnished: false,
        amenities: ["parking", "garden", "security"],
        agent: AGENT,
        latitude: -1.3197,
        longitude: 36.7073,
    },
};

export const getPropertyDetail = (id?: string): PropertyDetail =>
    (id && PROPERTY_DETAILS[id]) || PROPERTY_DETAILS["1"];

//-1.3405813873097057, 36.70599588989559