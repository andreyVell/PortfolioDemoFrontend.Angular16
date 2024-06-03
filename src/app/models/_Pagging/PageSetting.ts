import { ComponentWithPagination } from "./ComponentWithPagination";

export class PageSettings {
    itemsPerPage!: number;
    totalItems!: number;
    curentPage!: number;
    currentFilterString!: string;
    itemsPerPageOptions: Array<number> = [25, 50, 100, 150, 500];

    constructor(
        private component: ComponentWithPagination,
        private defaultSettings: boolean = false
    ) {
        this.currentFilterString = "";
        if (this.defaultSettings) {
            this.itemsPerPage = 25;
            this.curentPage = 0;
        }
    }

    public OnFilterStringChanged(filterString: string) {
        this.currentFilterString = filterString;
    }

    public ItemsPerPageChanged() {
        this.curentPage = 0;
        this.component.Refresh();
    }
    public PreviousPageClick() {
        if (this.IsPreviousPageButtonActive()) {
            this.curentPage -= 1;
            this.component.Refresh();
        }
    }
    public NextPageClick() {
        if (this.IsNextPageButtonActive()) {
            this.curentPage += 1;
            this.component.Refresh();
        }
    }
    public ApplyFilter() {
        this.curentPage = 0;
        this.component.Refresh();
    }

    public ClearFilterAndRefresh() {
        this.curentPage = 0;
        this.currentFilterString = '';
        this.component.Refresh();
    }

    public IsNextPageButtonActive = () => (this.curentPage + 1) * this.itemsPerPage < this.totalItems;
    public IsPreviousPageButtonActive = () => this.curentPage >= 1;

    public CurrentPageMin = () => this.curentPage * this.itemsPerPage + 1;
    public CurrentPageMax = () => (this.curentPage + 1) * this.itemsPerPage > this.totalItems ?
        this.totalItems : (this.curentPage + 1) * this.itemsPerPage;
}