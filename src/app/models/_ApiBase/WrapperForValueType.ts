export class WrapperForValueType<T> {
    value: T | null = null;

    constructor(defaultValue: T) {
        this.value = defaultValue;
      }
}