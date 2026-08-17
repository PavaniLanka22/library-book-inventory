import js from "@eslint/js";

export default [
    {
        files: ["**/*.js"],
        ignores: ["node_modules/**"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module"
        },
        rules: {
            ...js.configs.recommended.rules,
            "no-unused-vars": "error",
            "no-console": "off"
        }
    }
];