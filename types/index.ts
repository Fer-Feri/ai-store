export type Product = {
	id: number;
	title: string;
	description: string;
	price: number;
	category: string;
	image: string;
};

export type Filters = {
	maxPrice: number;
	query: string;
};
