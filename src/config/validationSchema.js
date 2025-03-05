import * as Yup from "yup";
import formConfig from "./formConfig.json";

const checkDuplicateUsername = async (value) => {
    if (!value) return true;
    try {
        const response = await fetch(
            "https://ss2l.superswan.net/cashmarket/api/public/check-duplicate-info",
            {
                method: "POST",
                body: JSON.stringify({ username: value }),
            }
        );
        const data = await response.json();
        return (
            data.isAvailable || "register:register.messages.error.userexists"
        );
    } catch (err) {
        return "Error checking username availability" + err;
    }
};

const checkAffiliateId = async (value) => {
    if (!value) return true;
    try {
        const response = await fetch(
            "https://ss2l.superswan.net/cashmarket/api/public/validate-affiliate-parameter",
            {
                method: "POST",
                body: JSON.stringify({ affiliateId: value }),
            }
        );
        const data = await response.json();
        if (data.disableMemberBecomeReferal) {
            return "global:global.messages.validate.referralcode.referralNoLongerValid";
        }
        return (
            data.isValid ||
            "global:global.messages.validate.referralcode.invalidId"
        );
    } catch (error) {
        return "Error validating affiliate ID" + error;
    }
};

const validatePhoneFormat = async (value) => {
    if (!value) return true;
    try {
        const response = await fetch(
            "https://ss2l.superswan.net/cashmarket/api/public/validate-phone-format",
            {
                method: "POST",
                body: JSON.stringify({ phone: value }),
            }
        );
        const data = await response.json();
        return data.isValid || "global:global.messages.validate.phone.format";
    } catch (error) {
        return "Error validating phone format" + error;
    }
};

export const generateValidationSchema = (fields) => {
    const schema = {};

    fields.forEach((field) => {
        const fieldConfig = formConfig.fields[field];
        const validation = fieldConfig.validation;
        let fieldSchema = Yup.string();

        if (fieldConfig.type === "checkbox") {
            fieldSchema = Yup.boolean();
        }

        if (validation) {
            if (validation.required) {
                fieldSchema = fieldSchema.required(validation.required.message);
            }

            if (validation.min) {
                fieldSchema = fieldSchema.min(
                    validation.min.value,
                    validation.min.message
                );
            }

            if (validation.max) {
                fieldSchema = fieldSchema.max(
                    validation.max.value,
                    validation.max.message
                );
            }

            if (validation.pattern) {
                fieldSchema = fieldSchema.matches(
                    new RegExp(validation.pattern.regex),
                    validation.pattern.message
                );
            }

            if (validation.oneOf) {
                if (validation.oneOf.ref) {
                    fieldSchema = fieldSchema.oneOf(
                        [Yup.ref(validation.oneOf.ref)],
                        validation.oneOf.message
                    );
                } else if (validation.oneOf.values) {
                    fieldSchema = fieldSchema.oneOf(
                        validation.oneOf.values,
                        validation.oneOf.message
                    );
                }
            }

            if (validation.length) {
                fieldSchema = fieldSchema.test(
                    "length",
                    validation.length.message,
                    (value) =>
                        !value ||
                        (value.length >= validation.length.min &&
                            value.length <= validation.length.max)
                );
            }

            if (validation.checkDuplicate) {
                fieldSchema = fieldSchema.test(
                    "checkDuplicate",
                    "",
                    checkDuplicateUsername
                );
            }

            if (validation.checkAffiliate) {
                fieldSchema = fieldSchema.test(
                    "checkAffiliate",
                    "",
                    checkAffiliateId
                );
            }

            if (validation.phoneFormat) {
                fieldSchema = fieldSchema.test(
                    "phoneFormat",
                    "",
                    validatePhoneFormat
                );
            }
        }

        schema[field] = fieldSchema;
    });

    return Yup.object(schema);
};
