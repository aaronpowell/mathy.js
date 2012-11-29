export module mathy {
    class Engine {
        public getRules: () => rule[];
        constructor (...rules: rule[]);
        public add(rule: rule): void;
        public process(): number[];
    }
    interface rule {
        name: string;
        derivation: string;
        result: Boolean;
    }
}
