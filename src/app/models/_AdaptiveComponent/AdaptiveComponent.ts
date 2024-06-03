export class AdaptiveComponent{
    public IsSmallScreen(): boolean {
        return window.innerWidth <= 1020
    }

    public IsExtraSmallScreen(): boolean {
        return window.innerWidth < 812
    }
}