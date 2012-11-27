export module mathy {
    class Engine {
        public getRules: () => rule[];
        constructor (...rules: rule[]);
        public process(): number[];
    }
    interface rule {
        name: string;
        derivation: string;
    }
}
