import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
    Box,
    Stepper,
    Step,
    StepLabel,
    Button,
    Container,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from "@mui/material";
import AccountDetails from "./AccountDetails";
import formConfig from "../config/formConfig.json";
import { generateValidationSchema } from "../config/validationSchema";

const RegistrationForm = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [selectedRegion, setSelectedRegion] = useState("Malaysia");
    const totalSteps = formConfig.steps.length;
    const isMultiStep = totalSteps > 1;

    const validationSchema = generateValidationSchema(
        formConfig.steps[activeStep].fields
    );

    const initialValues = {};
    formConfig.steps.forEach((step) => {
        step.fields.forEach((field) => {
            initialValues[field] = "";
        });
    });

    const form = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: initialValues,
        mode: "onChange",
    });

    const { trigger } = form;

    const handleNext = async () => {
        const fieldsToValidate = formConfig.steps[activeStep].fields;
        const isStepValid = await trigger(fieldsToValidate);
        if (isStepValid) {
            setActiveStep((prevStep) => prevStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const onSubmit = async (data) => {
        if (activeStep === totalSteps - 1) {
            console.log("Form submitted:", data);
        } else {
            await handleNext();
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ width: "100%", mt: 4, position: "relative" }}>
                <FormControl sx={{ position: "absolute", right: 0, top: 0, width: 150 }}>
                    <InputLabel id="region-select-label">Region</InputLabel>
                    <Select
                        labelId="region-select-label"
                        id="region-select"
                        value={selectedRegion}
                        label="Region"
                        onChange={(e) => setSelectedRegion(e.target.value)}
                    >
                        {Object.entries(formConfig.regions).map(([code, region]) => (
                            <MenuItem key={code} value={code}>
                                {region.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {isMultiStep && (
                    <Stepper activeStep={activeStep}>
                        {formConfig.steps.map(({ label }) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                )}

                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <Box sx={{ mt: isMultiStep ? 4 : 0, mb: 2 }}>
                        <AccountDetails
                            form={form}
                            stepFields={formConfig.steps[activeStep].fields}
                        />
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: isMultiStep
                                ? "space-between"
                                : "flex-end",
                            mb: 4,
                        }}
                    >
                        {isMultiStep && (
                            <Button
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                variant="outlined"
                            >
                                Back
                            </Button>
                        )}
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={form.formState.isSubmitting}
                        >
                            {activeStep === totalSteps - 1 ? "Submit" : "Next"}
                        </Button>
                    </Box>
                </form>
            </Box>
        </Container>
    );
};

export default RegistrationForm;
