export interface CategoryResponse {
    query: {
        categorymembers: CategoryMember[];
    };
}

export interface CategoryMember {
    pageid: number;
    ns: number;
    title: string;
}

const BASE_URL = "https://maplestorywiki.net/api.php";

export const getCategory = async (category: string) => {
    const req: Record<string, string> = {
        action: "query",
        list: "categorymembers",
        cmtitle: `Category:${category}`,
        cmlimit: "500",
        format: "json",
        origin: "*"
    };
    const response = await fetch(`${BASE_URL}?${new URLSearchParams(req).toString()}`);
    const data = await response.json() as CategoryResponse;
    return data.query.categorymembers;
};
