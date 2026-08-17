import sanitizeHtml from "sanitize-html";

const cleanText = (value) => {
    if (value === undefined || value === null) {
        return "";
    }

    return sanitizeHtml(String(value), {
        allowedTags: [],
        allowedAttributes: {}
    }).trim();
};


const sanitizeBookInput = (data = {}) => {
    return {
        title: cleanText(data.title),

        author: cleanText(data.author),

        isbn: cleanText(data.isbn),

        category: cleanText(data.category),

        description: cleanText(
            data.description
        ),

        quantity:
            data.quantity === "" ||
            data.quantity === undefined ||
            data.quantity === null
                ? 0
                : Number(data.quantity),

        availableQuantity:
            data.availableQuantity === "" ||
            data.availableQuantity === undefined ||
            data.availableQuantity === null
                ? 0
                : Number(
                    data.availableQuantity
                )
    };
};


export {
    sanitizeBookInput
};