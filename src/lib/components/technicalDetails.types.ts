export type TechnicalDetail<T> = {
	label: string;
	accessor: (item: T) => string | number | null | undefined;
};
