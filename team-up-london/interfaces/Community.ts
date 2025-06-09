export default interface Community {
    id: string;
    name: string;
    creator_id: string;
    description: string;
    primary_location: string;
    primary_location_type: string;
    is_public: boolean;
    sports_ids: string[];
}